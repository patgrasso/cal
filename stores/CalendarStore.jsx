import {ReduceStore} from 'flux/utils';
import Dispatcher from './dispatchers';
import {CalendarActionTypes} from './ActionTypes';

const calendars = [
  {
    id: 1,
    name: 'Patrick Grasso',
    visible: true,
    accessRole: 'owner',
    color: 'green'
  },
  {
    id: 2,
    name: 'Reslife',
    visible: false,
    accessRole: 'owner',
    color: 'cyan'
  },
  {
    id: 3,
    name: 'Alpha Sigma Phi',
    visible: true,
    accessRole: 'writer',
    color: 'red'
  }
];

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
    return calendars;
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
