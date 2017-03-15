import {CalendarActionTypes, EventActionTypes} from './ActionTypes';
import Dispatcher from './dispatchers';

export const CalendarActions = {
  create(name, color='green') {
    Dispatcher.dispatch({
      type: CalendarActionTypes.CREATE_CALENDAR,
      details: {
        name,
        color,
        accessRole: 'owner',
        show: true
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
  }
};

export const EventActions = {
  create(title, color='green') {
    Dispatcher.dispatch({
      type: EventActionTypes.CREATE_EVENT,
      details: {
        name,
        color,
        accessRole: 'owner',
        show: true
      }
    });
  },

  remove(id) {
    Dispatcher.dispatch({
      type: EventActionTypes.REMOVE_EVENT,
      id
    });
  }
};
