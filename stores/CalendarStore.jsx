import {ReduceStore} from 'flux/utils';
import Dispatcher from './dispatchers';
import {CalendarActionTypes} from './ActionTypes';
import {Map} from 'immutable';

class CalendarStore extends ReduceStore {

  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Map({ primaryCal: null, calendars: Map() });
  }

  // TODO: hook up with google calendar
  reduce(state, action) {
    switch (action.type) {
      case CalendarActionTypes.CREATE_CALENDAR:
        if (action.id == null) {
          action.id = uuid();
        }
        return state.setIn(['calendars', action.id], action.details);

      case CalendarActionTypes.REMOVE_CALENDAR:
        return state.deleteIn(['calendars', action.id]);

      case CalendarActionTypes.SET_CAL_SUMMARY:
        return state.setIn(['calendars', action.id, 'summary'], action.summary);

      case CalendarActionTypes.UPDATE_CALENDARS:
        return action.calendars.reduce(
          (state, calendar) => state.updateIn(
            ['calendars', calendar.id],
            (existing) => (existing || Map()).merge(calendar)),
          state);

      case CalendarActionTypes.TOGGLE_VISIBILITY:
        return state.updateIn(['calendars', action.id, 'visible'],
                              (visible) => !visible);

      case CalendarActionTypes.WIPE_CALENDARS:
        return this.getInitialState();

      case CalendarActionTypes.SET_PRIMARY_CAL:
        return state.set('primaryCal', action.id);

      default:
        return state;
    }
  }

}

export default new CalendarStore();
