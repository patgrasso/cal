// TODO: use es6 imports

const time = require('./time.jsx');
const Map = require('immutable').Map;
const List = require('immutable').List;
const moment = require('moment-timezone');

const conflicts = (n) => (othn) =>
  (othn.start <= n.start && n.start < othn.end) ||
  (othn.start < n.end && n.end < othn.end) ||
  (othn.end - othn.start < 1/2 && othn.start <= n.start &&
   n.start < othn.end + 1/2);
const groupSize = (n) => (n == null)
  ? 0
  : n.size = Math.max(n.left, ...n.children.map(groupSize));

function reconcile(events) {
  if (events.size <= 0) {
    return events;
  }
  events = events.sort((a, b) => a.get('end') < b.get('end'));
  events = events.sort((a, b) => a.get('start') > b.get('start'));

  let nodes = events.map((event) => ({
    event,
    start: time.timeInHours(event.get('start')),
    end: time.timeInHours(event.get('end')),
    left: 0,
    children: []
  })).toJSON();

  let root = null;
  let placed = [];
  let used = [];

  while (nodes.length > 0) {
    for (let n of nodes) {
      if (!used.some(conflicts(n))) {
        let parents = placed.filter(conflicts(n));
        let maxLeft = Math.max(0, ...parents.map(({left}) => left));

        parents.forEach((p) => p.children.push(n));
        n.left = maxLeft + 1;
        used.push(n);
      }
    }
    nodes = nodes.filter((othn) => !used.includes(othn));
    placed = used.concat(placed);
    if (!root) {
      root = placed;
    }
    used = [];
  }

  root.map(groupSize);
  placed.forEach((n) => delete n.children);
  return placed;
}


const RECUR_INCREMENTS = {
  WEEKLY: { weeks: 1 },
  MONTHLY: { months: 1 },
  DAILY: { days: 1 }
};

/**
 * For recurring events, create fake ones that represent each instance of the
 * event. They will be placed into the map with the original event's id appended
 * with a sub-identifier ({id}-1, {id}-2, etc.).
 */
function createPseudoEvents(events) {
  let newEvents = Map();

  events.forEach((event, id) => {
    let currStartDate = moment(event.get('start'));
    let currEndDate = moment(event.get('end'));
    let recurrence = event.get('recurrence');
    let exceptions = event.getIn(['recurrence', 'exceptions']) || List();
    let recurEndDate, freq, i;

    if (recurrence) {
      freq = recurrence.get('freq');
      recurEndDate = moment(recurrence.get('until'));

      currStartDate.add(RECUR_INCREMENTS[freq]);
      currEndDate.add(RECUR_INCREMENTS[freq]);

      for (i = 0; currStartDate < recurEndDate; i += 1) {
        if (!exceptions.includes(currStartDate.toISOString())) {
          newEvents = newEvents.set(
            id + `:R${i}`, event.set('id', id + `:R${i}`)
                                .set('start', currStartDate.toISOString())
                                .set('end', currEndDate.toISOString())
                                .set('originalEvent', id))
        }

        currStartDate.add(RECUR_INCREMENTS[freq]);
        currEndDate.add(RECUR_INCREMENTS[freq]);
      }
    }
    newEvents = newEvents.set(id, event);
  });

  return newEvents;
}


function findTime(events, hours, timeMin, timeMax) {
  let startTimes = []
    , i, start, end, withinHours, afterTimeMin, beforeTimeMax;

  if (hours == null || events.size <= 0) {
    return List();
  }

  timeMin = (timeMin == null) ? null : moment(timeMin);
  timeMax = (timeMax == null) ? null : moment(timeMax);
  hours = moment.duration({
    hours: Math.floor(hours),
    minutes: (hours % 1) * 60
  });
  events = events.sort((a, b) =>
    moment(a.get('start')) > moment(b.get('start'))
  ).map((ev) => ev.update('start', (s) => moment(s))
                  .update('end', (e) => moment(e)));

  let midnight = moment(events.get(0).get('start'))
    .hours(0).minutes(0).seconds(0).milliseconds(0);

  // How about before the first event?
  end = events.getIn([0, 'start'])
  start = moment(end - hours);
  if (end - midnight > hours && (timeMin == null || start > timeMin)) {
    startTimes.push(moment(events.getIn([0, 'start']) - hours).toISOString());
  }

  // Check each pair of adjacent events to see if there's space between them
  for (i = 1; i < events.size; i += 1) {
    end = events.getIn([i, 'start']);
    start = events.slice(0, i).maxBy((e) => e.get('end')).get('end');

    withinHours = end - start > hours - (1/60);
    afterTimeMin = (timeMin == null) || (start >= timeMin);
    beforeTimeMax = (timeMax == null) || (start < timeMax);

    if (withinHours && afterTimeMin && beforeTimeMax) {
      startTimes.push(start.toISOString());
    }
  }

  return List(startTimes);
}

module.exports.reconcile = reconcile;
module.exports.findTime = findTime;
module.exports.createPseudoEvents = createPseudoEvents;
