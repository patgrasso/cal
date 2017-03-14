
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

