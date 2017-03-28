
const uuid = require('uuid');

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

module.exports.uuid = () => uuid().replace(/-/g, '');

module.exports.hexToRGB = (hex) => ([
  parseInt(hex.replace('#', '').slice(0, 2), 16),
  parseInt(hex.replace('#', '').slice(2, 4), 16),
  parseInt(hex.replace('#', '').slice(4, 6), 16)
]);

module.exports.leftPad = (stuff, len, char=' ') =>
  Array(len - (''+stuff).length + 1).join(char) + stuff;
