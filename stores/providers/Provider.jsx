import EventStore from '../EventStore2';
import CalendarStore from '../CalendarStore2';
import Dispatcher from '../actions/Dispatcher';
import EventActionTypes from '../actions/EventActionTypes';
import CalendarActionTypes from '../actions/CalendarActionTypes';

class Provider {

  constructor(providerName) {
    Dispatcher.register((action) => {

      // wait for the stores to finish processing
      Dispatcher.waitFor([
        EventStore.getDispatchToken(),
        CalendarStore.getDispatchToken()
      ]);

      // if this provider isn't specified, quit
      if (!(action.providers && action.providers.includes(providerName))) {
        return;
      }

      // call a provider function based on what was dispatched
      setTimeout(() => {
        switch (action.type) {
          case CalendarActionTypes.CREATE_CALENDAR:
            return this.createCalendar(action.calendar);

          case EventActionTypes.UPDATE_EVENT:
          case EventActionTypes.CREATE_EVENT:
            return this.createEvent(action.event);

          case EventActionTypes.REMOVE_EVENT:
            return this.removeEvent(action.id);
        }
      }, 0);

    });
  }

  getCalendarList() {
    throw new Error('Not implemented');
  }

  createCalendar(calendar) {
    throw new Error('Not implemented');
  }

  getEvents(timeMin, timeMax) {
    throw new Error('Not implemented');
  }

  createEvent(details) {
    throw new Error('Not implemented');
  }

  removeEvent(id) {
    throw new Error('Not implemented');
  }

}

export default Provider;
