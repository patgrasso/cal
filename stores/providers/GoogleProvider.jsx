import Provider from './Provider';
import ProviderActions from '../actions/ProviderActions';
import time from '../../utils/time';
import { Map } from 'immutable';

const PROVIDER_NAME = 'google';

class GoogleProvider extends Provider {

  getCalendarList() {
    gapi.client.calendar.calendarList.list().then(
      ({result}) => ProviderActions.updateCalendars(
        PROVIDER_NAME,
        result.items.map((item) => ({
          id: item.id,
          name: item.summary,
          visible: true,
          primary: item.primary,
          accessRole: item.accessRole,
          color: item.backgroundColor
        }))
      ),
      (error) => console.error(error)
    );
  }

  createCalendar(calendar) {
    throw new Error('Not implemented');
  }

  // TODO: clean this up / rewrite
  getEvents(calendarId, timeMin, timeMax) {
    gapi.client.calendar.events
        .list({
          calendarId,
          timeMin: timeFrom || time.beginningOfWeek(),
          timeMax: timeTo || time.endOfWeek(),
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

          ProviderActions.updateEvents(PROVIDER_NAME, strippedItems);
        }, (error) => console.error(error));
  }

  createEvent(details) {
    throw new Error('Not implemented');
  }

  removeEvent(id) {
    throw new Error('Not implemented');
  }

}

export default new GoogleProvider();
