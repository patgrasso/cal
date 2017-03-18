import CalendarActionTypes from './CalendarActionTypes';
import Dispatcher from './Dispatcher';
import uuid from 'uuid';

const CalendarActions = {
  create(calendar) {
    calendar.id = calendar.id || uuid();
    Dispatcher.dispatch({
      type: CalendarActionTypes.CREATE_CALENDAR,
      calendar
    });
  },

  remove(id) {
    Dispatcher.dispatch({
      type: CalendarActionTypes.REMOVE_CALENDAR,
      id
    });
  },

  toggleVisible(id) {
    Dispatcher.dispatch({
      type: CalendarActionTypes.TOGGLE_VISIBILITY,
      id
    });
  }
};

export default CalendarActions;
