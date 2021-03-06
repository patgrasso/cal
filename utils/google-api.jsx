/*global gapi*/

const time = require('./time');
const { beginningOfWeek, endOfWeek } = time;

export const getCalendarList = () => {
  return new Promise((resolve, reject) => {
    gapi.client.calendar.calendarList.list().then(
      ({result}) => resolve(result.items.map((item) => ({
        id: item.id,
        name: item.summary,
        visible: true,
        primary: item.primary,
        accessRole: item.accessRole,
        color: item.backgroundColor
      }))),
      (error) => reject(error)
    );
  });
};

export const getEvents = (calendarId, timeFrom, timeTo) => {
  return new Promise((resolve, reject) => {
    gapi.client.calendar.events
        .list({
          calendarId,
          timeMin: timeFrom || beginningOfWeek(),
          timeMax: timeTo || endOfWeek(),
          maxResults: 2500
        })
        .then(({result}) => {
          // Filter out recurring events for which there is an exception
          let uniqueItems = result.items.filter(
            (item) => !result.items.find(
              (other) => other.id === item.recurringEventId));

          // Strip out unneeded information
          let strippedItems = uniqueItems.map((item) => {
            let startTime = new Date(item.start.dateTime || item.start.date);
            let endTime = new Date(item.end.dateTime || item.end.date);
            let recurrence = item.recurrence && item.recurrence.map(
              (r) => (/FREQ=(.+?);/).test(r) && r.match(/FREQ=(.+?);/)[1]
            )[0];

            return {
              calendarId,
              id: item.id,
              summary: item.summary,
              start: startTime,
              allDay: item.start.dateTime == null,
              end: endTime,
              location: item.location,
              recurrence,
              sync: ['google']
            };
          });

          resolve(strippedItems);
        }, (error) => reject(error));
  });
};

export const createEvent = (details) => {
  return new Promise((resolve, reject) => {
    gapi.client.calendar.events.insert({
      calendarId : details.calendarId,
      id         : details.id,
      start      : { dateTime: start },
      end        : { dateTime: end },
      summary    : title,
      location   : details.location
    }).then((result) => {
      console.log(result);
      resolve(result);
    }, (error) => reject(error));
  });
};

export const syncEvents = (events) => {
  return events;
};
