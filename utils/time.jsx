
const ONE_DAY   = 86400000;
const TZ_OFFSET = new Date().getTimezoneOffset() * 60000;

module.exports.timeInHours = (date) => {
  date = new Date(date || Date.now());
  return date.getHours() + date.getMinutes() / 60;
};

module.exports.compareDates = (dateA, dateB) => {
  dateA = new Date(dateA);
  dateB = new Date(dateB);
  return Math.floor((dateA - TZ_OFFSET) / ONE_DAY) -
         Math.floor((dateB - TZ_OFFSET) / ONE_DAY);
};

module.exports.formatTime = (date) => {
  date = new Date(date);

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

module.exports.sameDayForWeek = (date, focusDate) => {
  let d = new Date(date);
  focusDate = new Date(focusDate || Date.now());
  d.setDate(focusDate.getDate() - focusDate.getDay() + d.getDay());
  d.setFullYear(focusDate.getFullYear());
  d.setMonth(focusDate.getMonth());
  return d;
};

module.exports.beginningOfWeek = () => {
  let d = new Date();
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0);
  d.setMinutes(0);
  return d.toISOString();
};

module.exports.endOfWeek = () => {
  let d = new Date();
  d.setDate(d.getDate() - d.getDay() + 7);
  d.setHours(0);
  d.setMinutes(0);
  return d.toISOString();
};
