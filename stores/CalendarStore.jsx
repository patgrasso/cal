import {ReduceStore} from 'flux/utils';
import Dispatcher from './dispatchers';
import {CalendarActionTypes} from './ActionTypes';

const findCalendar = (id, state) => {
  let calendar = state.find((cal) => cal.id === id);

  if (calendar == null) {
    throw new ReferenceError(
      `Cannot find calendar with id: ${id}`);
  }
  return calendar;
}

class CalendarStore extends ReduceStore {

  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return [];
  }

  // TODO: hook up with google calendar
  reduce(state, action) {
    switch (action.type) {
      case CalendarActionTypes.CREATE_CALENDAR:
        // TODO: Error check
        return state.concat(action.details);

      case CalendarActionTypes.REMOVE_CALENDAR:
        return state.filter((cal) => cal.id !== action.id);

      case CalendarActionTypes.SET_NAME:
        findCalendar(action.id, state).name = action.name;
        return state.slice();

      case CalendarActionTypes.UPDATE_CALENDARS:
        let ids = action.calendars.map(({id}) => id);
        return state
          .filter(({id}) => !ids.includes(id))
          .concat(action.calendars);

      case CalendarActionTypes.TOGGLE_VISIBILITY:
        let calendar = findCalendar(action.id, state);
        calendar.visible = !calendar.visible;
        console.log(calendar);
        return state.slice();

      default:
        return state;
    }
  }

}

export default new CalendarStore();
