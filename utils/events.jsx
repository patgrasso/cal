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


function findTime(events, hours) {
  let startTimes = [];

  if (hours == null) {
    return List();
  }

  hours = moment.duration(hours, 'hours');

  events.forEach((event, key) => {
    let start = moment(event.get('start'));

    if (!events.delete(key).some((ev) => ev.get('start') - start < hours)) {
      startTimes.push(start.toISOString());
    }
  });

  return List(startTimes);
}

module.exports.reconcile = reconcile;
module.exports.findTime = findTime;
module.exports.createPseudoEvents = createPseudoEvents;
