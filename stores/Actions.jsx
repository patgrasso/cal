import {CalendarActionTypes,
        EventActionTypes,
        ViewActionTypes} from './ActionTypes';
import Dispatcher from './dispatchers';
import uuid from 'uuid';
import providers from './providers';

export const CalendarActions = {
  update(calendars) {
    Dispatcher.dispatch({
      type: CalendarActionTypes.UPDATE_CALENDARS,
      calendars
    });
  },

  create(name, color='green') {
    Dispatcher.dispatch({
      type: CalendarActionTypes.CREATE_CALENDAR,
      details: {
        summary,
        color,
        accessRole: 'owner',
        visible: true
      }
    });
  },

  remove(id) {
    Dispatcher.dispatch({
      type: CalendarActionTypes.REMOVE_CALENDAR,
      id
    });
  },

  toggle(id) {
    Dispatcher.dispatch({
      type: CalendarActionTypes.TOGGLE_VISIBILITY,
      id
    });
  },

  wipe() {
    Dispatcher.dispatch({ type: CalendarActionTypes.WIPE_CALENDARS })
  },

  setPrimary(id) {
    Dispatcher.dispatch({ type: CalendarActionTypes.SET_PRIMARY_CAL, id });
  }
};

export const EventActions = {
  updateAll(events) {
    Dispatcher.dispatch({
      type: EventActionTypes.UPDATE_EVENTS,
      events
    });
  },

  update(event) {
    EventActions.updateAll([event]);
  },

  create(details) {
    details.id = details.id || uuid();
    Dispatcher.dispatch({
      type: EventActionTypes.CREATE_EVENT,
      details: details
    });
  },

  remove(id) {
    Dispatcher.dispatch({
      type: EventActionTypes.REMOVE_EVENT,
      id
    });
  },

  wipe() {
    Dispatcher.dispatch({ type: EventActionTypes.WIPE_EVENTS });
  }
};

export const ViewActions = {
  openEventModal(id) {
    Dispatcher.dispatch({ type: ViewActionTypes.OPEN_EVENT_MODAL, id });
  },

  closeEventModal() {
    Dispatcher.dispatch({ type: ViewActionTypes.CLOSE_EVENT_MODAL });
  }
};
