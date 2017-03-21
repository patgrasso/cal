import Provider from './Provider';
import ProviderActions from '../actions/ProviderActions';
import time from '../../utils/time';
import utils from '../../utils';
import moment from 'moment-timezone';
import { colors } from '../../components/Calendar/CalendarConstants';
import { Map, fromJS } from 'immutable';

const CALENDAR_LIST = 'calendarList';
const PROVIDER_NAME = 'google';

const RECUR_QUALIFIERS = {
  WEEKLY: 'weeks',
  MONTHLY: 'months',
  DAILY: 'days'
};

const parseRecurrence = (recurrence, start) => {
  if (recurrence == null) {
    return null;
  }
  recurrence = recurrence.reduce((rules, curr) => {
    let type = curr.match(/^(\w+)?/)[1];
    let _, tz, dates, freq, endDate, count;

    switch (type) {
      case 'EXDATE':
        [_, tz, dates] = curr.match(/TZID=(.*?):(.*?)$/);
        dates = dates.split(',').map((date) => moment(date).tz(tz).toDate());
        return rules.set('exceptions', fromJS(dates));

      case 'RRULE':
        if (/FREQ=(.*?);UNTIL=(.*?);/.test(curr)) {
          [_, freq, endDate] = curr.match(/FREQ=(.*?);UNTIL=(.*?);/);
        }
        if (/FREQ=(.*?);COUNT=(\d*?)/.test(curr)) {
          [_, freq, count] = curr.match(/FREQ=(.*?);COUNT=(\d*?)/);
          endDate = moment(start).add(parseInt(count), RECUR_QUALIFIERS[freq]);
        }
        return rules.set('freq', freq).set('until', moment(endDate).toDate());

      default:
        return rules;
    }
  }, Map());

  return recurrence;
}

class GoogleProvider extends Provider {

  constructor() {
    super(PROVIDER_NAME);
    this._cachedCalendarList = null;
  }

  getColors() {
    return new Promise((resolve, reject) => {
      gapi.client.calendar.colors.get().then(({result}) => {
        ProviderActions.setColors(PROVIDER_NAME, result.event);
        resolve(result.event);
      }, (error) => reject(error));
    });
  }

  _getCachedCalendarList() {
    if (this._cachedCalendarList) {
      return Promise.resolve(this._cachedCalendarList);
    }
    return this.getCalendarList().then((list) =>
      this._cachedCalendarList = list);
  }

  getCalendarList() {
    return new Promise((resolve, reject) => {
      gapi.client.calendar.calendarList.list().then(({result}) => {
        let calendarList = result.items.map((item) => ({
          id: item.id,
          name: item.summary,
          visible: true,
          primary: item.primary,
          accessRole: item.accessRole,
          bgColor: item.backgroundColor,
          fgColor: item.foregroundColor
        }));
        ProviderActions.updateCalendarList(PROVIDER_NAME, calendarList);
        resolve(calendarList);
      }, (error) => reject(error));
    });
  }

  createCalendar(calendar) {
    throw new Error('Not implemented');
  }

  _getEventsForCalendar(calendarId, timeMin, timeMax) {
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
              let recurrence = parseRecurrence(item.recurrence, startTime);

              return {
                calendarId,
                id: item.id,
                summary: item.summary,
                start: startTime,
                allDay: item.start.dateTime == null,
                end: endTime,
                location: item.location,
                recurrence,
                synced: { google: true },
                colorId: item.colorId
              };
            });

            resolve(strippedItems);
          }, (error) => reject(error));
    });
  }

  // TODO: clean this up / rewrite
  getEvents(timeMin, timeMax) {
    return this._getCachedCalendarList()
               .then((calendars) => Promise.all(calendars.map((cal) =>
                 this._getEventsForCalendar(cal.id, timeMin, timeMax))))
               .then((events) => {
                 events = utils.join(events);
                 ProviderActions.updateEvents(PROVIDER_NAME, events);
                 return events;
               });
  }

  createEvent(event) {
    let start = event.allDay ? {date: event.start} : {dateTime: event.start};
    let end = event.allDay ? {date: event.end} : {dateTime: event.end};

    return new Promise((resolve, reject) => {
      gapi.client.calendar.events.insert({
        calendarId: event.calendarId,
        id: event.id,
        start,
        end,
        summary: event.summary,
        location: event.location
      }).then((response) => {
        ProviderActions.createEvent(PROVIDER_NAME, event);
        resolve(event);
      }, (error) => reject(error));
    });
  }

  updateEvent(event) {
    let start = event.allDay ? {date: event.start} : {dateTime: event.start};
    let end = event.allDay ? {date: event.end} : {dateTime: event.end};

    return new Promise((resolve, reject) => {
      gapi.client.calendar.events.patch({
        calendarId: event.calendarId,
        eventId: event.id,
        start,
        end,
        summary: event.summary,
        location: event.location,
        colorId: event.colorId
      }).then((response) => {
        ProviderActions.createEvent(PROVIDER_NAME, event);
        resolve(event);
      }, (error) => {
        if (error.status === 404) {
          return resolve(this.createEvent(event));
        }
        return reject(error);
      });
    });
  }

  removeEvent(event) {
    return new Promise((resolve, reject) => {
      gapi.client.calendar.events.delete({
        calendarId: event.calendarId,
        eventId: event.id
      }).then((result) => {
        ProviderActions.removeEvent(PROVIDER_NAME, event);
        resolve(event);
      }, (error) => reject(event));
    });
  }

}

export default new GoogleProvider();
