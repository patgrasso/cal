
import Provider from './Provider';
import ProviderActions from '../ProviderActions';
import { Map } from 'immutable';

const CALENDARS_KEY = 'calendars';
const EVENTS_KEY    = 'events';

class LocalStorageProvider extends Provider {

  getCalendarList() {
    let calendars = JSON.parse(localStorage.getItem(CALENDARS_KEY));

    ProviderActions.updateCalendars(calendars);
  }

  getEvents(calendarId, timeMin, timeMax) {
    let events = Map(JSON.parse(localStorage.getItem(EVENTS_KEY)));

    events = events.filter(
      (ev) => new Date(ev.get('start')) >= timeMin &&
              new Date(ev.get('end')) < timeMax &&
              ev.get('calendarId') === calendarId).toJSON();

    ProviderActions.updateEvents(events);
  }

  createEvent(details) {
    let events = Map(JSON.parse(localStorage.getItem(EVENTS_KEY)));

    details = Map(details);
    events = events.set(details.id, details);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events.toJSON()));

    ProviderActions.confirmEventAdded(details);
  }

}
