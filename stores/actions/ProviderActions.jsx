import ProviderActionTypes from './ProviderActionTypes';
import Dispatcher from './Dispatcher';

const ProviderActions = {
  updateCalendarList(provider, calendarList) {
    Dispatcher.dispatch({
      type: ProviderActionTypes.UPDATE_CALENDAR_LIST,
      provider,
      calendarList
    });
  },

  createCalendar(provider, calendar) {
    Dispatcher.dispatch({
      type: ProviderActionTypes.CREATE_CALENDAR,
      provider,
      calendar
    });
  },

  updateEvents(provider, events) {
    Dispatcher.dispatch({
      type: ProviderActionTypes.UPDATE_EVENTS,
      provider,
      events
    });
  },

  createEvent(provider, event) {
    Dispatcher.dispatch({
      type: ProviderActionTypes.CREATE_EVENT,
      provider,
      event
    });
  },

  removeEvent(provider, id) {
    Dispatcher.dispatch({
      type: ProviderActionTypes.REMOVE_EVENT,
      provider,
      id
    });
  }
};

export default ProviderActions;
