import Provider from './Provider';
import ProviderActions from '../actions/ProviderActions';
import { Map } from 'immutable';

const CALENDARS_KEY = 'calendars';
const EVENTS_KEY    = 'events';
const PROVIDER_NAME = 'local';

class LocalStorageProvider extends Provider {

  getCalendarList() {
    let calendars = JSON.parse(localStorage.getItem(CALENDARS_KEY));

    ProviderActions.updateCalendars(PROVIDER_NAME, calendars);
  }

  createCalendar(calendar) {
    let calendars = Map(fromJS(JSON.parse(localStorage.getItem(
      CALENDARS_KEY))));

    calendars = calendars.merge(Map(calendar.get('id'), calendar));
    localStorage.setItem(CALENDARS_KEY, JSON.stringify(calendars.toJSON));

    ProviderActions.createCalendar(PROVIDER_NAME, calendar);
  }

  getEvents(calendarId, timeMin, timeMax) {
    let events = Map(fromJS(JSON.parse(localStorage.getItem(EVENTS_KEY))));

    events = events.filter(
      (ev) => new Date(ev.get('start')) >= timeMin &&
              new Date(ev.get('end')) < timeMax &&
              ev.get('calendarId') === calendarId).toJSON();

    ProviderActions.updateEvents(PROVIDER_NAME, events);
  }

  createEvent(details) {
    let events = Map(fromJS(JSON.parse(localStorage.getItem(EVENTS_KEY))));

    details = fromJS(details);
    events = events.set(details.get('id'), details);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events.toJSON()));

    ProviderActions.createEvent(PROVIDER_NAME, details);
  }

  removeEvent(id) {
    let events = Map(fromJS(JSON.parse(localStorage.getItem(EVENTS_KEY))));

    events = events.delete(id);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events.toJSON()));

    ProviderActions.removeEvent(PROVIDER_NAME, id);
  }

}

export default new LocalStorageProvider();
