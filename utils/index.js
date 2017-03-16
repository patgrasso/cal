
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

module.exports.timeInHours = () => {
  let now = new Date();
  return now.getHours() + now.getMinutes() / 60;
};

module.exports.capitalize = (str) => {
  return str
    .split(' ')
    .map((substr) => substr[0].toUpperCase() + substr.slice(1))
    .join(' ');
};

module.exports.categorize = (things, property) => {
  let categories = {};

  things.forEach((thing) => {
    if (!(thing[property] in categories)) {
      categories[thing[property]] = [];
    }
    categories[thing[property]].push(thing);
  });

  return categories;
};

module.exports.formatTime = (date) => {
  let suffix = (date.getHours() < 12) ? 'a' : 'p';
  let minutes = date.getMinutes();

  if (minutes === 0) {
    minutes = '';
  } else if (minutes < 10) {
    minutes = ':0' + minutes;
  } else {
    minutes = ':' + minutes;
  }
  return `${(date.getHours() % 12) || 12}${minutes}${suffix}`;
};

