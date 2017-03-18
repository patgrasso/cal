import Provider from './Provider';
import ProviderActions from '../actions/ProviderActions';
import time from '../../utils/time';
import { Map } from 'immutable';

const CALENDAR_LIST = 'calendarList';
const PROVIDER_NAME = 'google';

class GoogleProvider extends Provider {

  constructor() {
    super(PROVIDER_NAME);
  }

  getCalendarList() {
    return new Promise((resolve, reject) => {
      gapi.client.calendar.calendarList.list().then(
        ({result}) => {
          let calendarList = result.items.map((item) => ({
            id: item.id,
            name: item.summary,
            visible: true,
            primary: item.primary,
            accessRole: item.accessRole,
            color: item.backgroundColor
          }));
          ProviderActions.updateCalendarList(PROVIDER_NAME, calendarList);
          resolve(calendarList);
        },
        (error) => reject(error)
      );
    });
  }

  createCalendar(calendar) {
    throw new Error('Not implemented');
  }

  // TODO: clean this up / rewrite
  getEvents(calendarId, timeMin, timeMax) {
    return new Promise((resolve, reject) => {
      gapi.client.calendar.events
          .list({
            calendarId,
            timeMin: timeMin || time.beginningOfWeek(),
            timeMax: timeMax || time.endOfWeek(),
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
                synced: { google: true }
              };
            });

            ProviderActions.updateEvents(PROVIDER_NAME, strippedItems);
            resolve(strippedItems);
          }, (error) => reject(error));
    });
  }

  createEvent(details) {
    throw new Error('Not implemented');
  }

  removeEvent(id) {
    throw new Error('Not implemented');
  }

}

export default new GoogleProvider();