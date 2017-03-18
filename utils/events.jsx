
const time = require('./time.jsx');

const conflicts = (n) => (othn) =>
  (othn.start <= n.start && n.start < othn.end) ||
  (othn.start < n.end && n.end < othn.end);
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

module.exports.reconcile = reconcile;
