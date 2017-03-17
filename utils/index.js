
module.exports.range = (start, end) => {
  if (end == null) {
    end = start;
    start = 0;
  }
  if (start >= end) {
    return [];
  }
  return Array(end - start).join(' ').split(' ').map((_, i) => i + start);
};

module.exports.join = (items) => {
  return [].concat.apply([], items);
};

module.exports.capitalize = (str) => {
  return str
    .split(' ')
    .map((substr) => substr[0].toUpperCase() + substr.slice(1))
    .join(' ');
};

module.exports.events = require('./events.jsx');
Object.assign(module.exports, require('./time.jsx'));

