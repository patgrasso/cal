
module.exports.timeInHours = (date) => {
  date = date || new Date();
  return date.getHours() + date.getMinutes() / 60;
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

