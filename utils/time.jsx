// TODO: redo with moment.js
// TODO: es6 exports

const moment = require('moment-timezone');

const ONE_DAY   = +moment.duration(1, 'day');
const TZ_OFFSET = moment().utcOffset() * 60000;

module.exports.timeInHours = (date, wrt) => {
  date = (date == null) ? new Date() : new Date(date);
  wrt = (wrt == null) ? date : new Date(wrt);
  let dayDiff = Math.ceil((wrt - date) / ONE_DAY);
  return date.getHours() + date.getMinutes() / 60 + dayDiff;
};

window.timeInHours = module.exports.timeInHours;
window.moment = moment;

module.exports.compareDates = (dateA, dateB) => {
  dateA = new Date(dateA);
  dateB = new Date(dateB);
  let timeZoneOffset = dateB.getTimezoneOffset() * 60000;
  return Math.floor((+dateA - timeZoneOffset) / ONE_DAY) -
         Math.floor((+dateB - timeZoneOffset) / ONE_DAY);
};

module.exports.formatTime = (date, truncate=true, usePeriod=true) => {
  date = new Date(date);

  let suffix = (date.getHours() < 12) ? 'a' : 'p';
  let minutes = date.getMinutes();

  if (minutes === 0 && truncate === true) {
    minutes = '';
  } else if (minutes < 10) {
    minutes = ':0' + minutes;
  } else {
    minutes = ':' + minutes;
  }
  return `${(date.getHours() % 12) || 12}${minutes}${usePeriod ? suffix : ''}`;
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

module.exports.days = (days) => ONE_DAY * days;

module.exports.startOfNextInterval = (minutes=60) => {
  let now = moment();
  return now.add(minutes - (now.minutes() % minutes), 'minutes')
            .seconds(0).milliseconds(0);
}

module.exports.makeCalendar = (month) => {
  month = moment(month).startOf('month');

  let end = moment(month).endOf('month');
  let incr = moment(month).startOf('week');
  let calendar = [];
  var week = 0;

  for (calendar[0] = []; incr < end || week < 6; calendar[week += 1] = []) {
    while (incr.day() < 6) {
      calendar[week].push({
        month: incr.month(), date: incr.date(), year: incr.year()
      });
      incr.add(1, 'day');
    }
    calendar[week].push({
      month: incr.month(), date: incr.date(), year: incr.year()
    });
    incr.add(1, 'day');
  }

  return calendar.slice(0, -1);
};

