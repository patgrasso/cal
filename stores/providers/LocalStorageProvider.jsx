import Provider from './Provider';
import ProviderActions from '../actions/ProviderActions';
import { Map, fromJS } from 'immutable';

const CALENDARS_KEY = 'calendars';
const EVENTS_KEY    = 'events';
const PROVIDER_NAME = 'local';

class LocalStorageProvider extends Provider {

  constructor() {
    super(PROVIDER_NAME);
  }

  getCalendarList() {
    let calendars = JSON.parse(localStorage.getItem(CALENDARS_KEY));

    ProviderActions.updateCalendars(PROVIDER_NAME, calendars.toJSON());
    return Promise.resolve(calendars.toJSON());
  }

  createCalendar(calendar) {
    let calendars = Map(fromJS(JSON.parse(localStorage.getItem(
      CALENDARS_KEY))));

    calendars = calendars.merge(Map(calendar.get('id'), calendar));
    localStorage.setItem(CALENDARS_KEY, JSON.stringify(calendars.toJSON));

    ProviderActions.createCalendar(PROVIDER_NAME, calendar.toJSON());
    return Promise.resolve(calendar.toJSON());
  }

  getEvents(timeMin, timeMax) {
    let events = fromJS(JSON.parse(localStorage.getItem(EVENTS_KEY))).toList();

    if (timeMin != null) {
      events = events.filter((ev) => new Date(ev.get('start')) >= timeMin);
    }
    if (timeMax != null) {
      events = events.filter((ev) => new Date(ev.get('end')) >= timeMax);
    }

    ProviderActions.updateEvents(PROVIDER_NAME, events.toJSON());
    return Promise.resolve(events.toJSON());
  }

  createEvent(event) {
    let events = Map(fromJS(JSON.parse(localStorage.getItem(EVENTS_KEY))));

    event = fromJS(event);
    events = events.set(event.get('id'), event);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events.toJSON()));

    ProviderActions.createEvent(PROVIDER_NAME, event.toJSON());
    return Promise.resolve(event.toJSON());
  }

  updateEvent(event) {
    let events = Map(fromJS(JSON.parse(localStorage.getItem(EVENTS_KEY))));
    let oldEvent = events.get(event.id);

    if (oldEvent == null) {
      return Promise.reject({ error: `Event ${event.id} not found ` });
    }

    event = oldEvent.mergeDeep(fromJS(event));
    events = events.set(event.get('id'), event);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events.toJSON()));

    ProviderActions.createEvent(PROVIDER_NAME, event.toJSON());
    return Promise.resolve(event.toJSON());
  }

  removeEvent(event) {
    console.log(event);
    let events = Map(fromJS(JSON.parse(localStorage.getItem(EVENTS_KEY))));

    events = events.delete(event.id);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events.toJSON()));

    ProviderActions.removeEvent(PROVIDER_NAME, event);
    return Promise.resolve(event);
  }

}

if (localStorage.getItem(EVENTS_KEY) == null) {
  localStorage.setItem(EVENTS_KEY, '{}');
}
if (localStorage.getItem(CALENDARS_KEY) == null) {
  localStorage.setItem(CALENDARS_KEY, '{}');
}

export default new LocalStorageProvider();
