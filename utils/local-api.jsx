
export const getCalendarList = () =>
  localStorage.getItem('calendars');

export const getEvents = (calendarId, timeFrom, timeTo) =>
  new Promise((resolve, reject) => resolve(
    Object.values(JSON.parse(localStorage.getItem('events')))));

export const syncEvents = (events) => {
  //let existing = JSON.parse(localStorage.getItem('events'));
  //Object.assign(existing, events);
  localStorage.setItem('events', JSON.stringify(events));
  return events;
};

export const createEvent = (details) => {
  throw new Error('Nope');
};

