/*global gapi*/

const beginningOfWeek = () => {
  let d = new Date();
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0);
  d.setMinutes(0);
  return d.toISOString();
};

const endOfWeek = () => {
  let d = new Date();
  d.setDate(d.getDate() - d.getDay() + 7);
  d.setHours(0);
  d.setMinutes(0);
  return d.toISOString();
};

const sameDayThisWeek = (date) => {
  let d = new Date(date);
  let now = new Date();
  d.setDate(now.getDate() - now.getDay() + d.getDay());
  d.setFullYear(now.getFullYear());
  d.setMonth(now.getMonth());
  return d;
};

export const getCalendarList = () => {
  return new Promise((resolve, reject) => {
    gapi.client.calendar.calendarList.list().then(
      ({result}) => resolve(result.items.map((item) => ({
        id: item.id,
        name: item.summary,
        visible: true,
        accessRole: item.accessRole,
        color: item.backgroundColor
      }))),
      (error) => reject(error)
    );
  });
};

export const getEvents = (calendarId) => {
  return new Promise((resolve, reject) => {
    gapi.client.calendar.events
        .list({
          calendarId,
          timeMin: beginningOfWeek(),
          timeMax: endOfWeek(),
          maxResults: 2500
        })
        .then(
          ({result}) => resolve(result.items.map((item) => {
            let startTime = new Date(item.start.dateTime || item.start.date);
            let endTime = new Date(item.end.dateTime || item.end.date);

            if (item.recurrence && item.recurrence[0].includes('FREQ=WEEKLY')) {
              startTime = sameDayThisWeek(startTime);
              endTime = sameDayThisWeek(endTime);
            }

            return {
              calendarId,
              id: item.id,
              title: item.summary,
              start: startTime,
              end: endTime
            };
          })),
          (error) => reject(error)
        );
  });
};
