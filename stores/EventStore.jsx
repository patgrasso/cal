import {ReduceStore} from 'flux/utils';
import Dispatcher from './dispatchers';
import {EventActionTypes} from './ActionTypes';

const events = [
  {
    calendarId: 1,
    title: 'Dinner',
    start: new Date( 2017, 2, 14, 19 ),
    end:   new Date( 2017, 2, 14, 20, 30 )
  },
  {
    calendarId: 2,
    title: 'Meeting',
    start: new Date( 2017, 2, 13, 16 ),
    end:   new Date( 2017, 2, 13, 17 )
  }
];

class EventStore extends ReduceStore {

  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return events;
  }

  // TODO: hook up with google calendar
  reduce(state, action) {
    switch (action.type) {
      case EventActionTypes.CREATE_EVENT:
        // TODO: Error check
        return state.concat(action.details);

      case EventActionTypes.REMOVE_CALENDAR:
        return state.filter((cal) => cal.id !== action.id);

      case EventActionTypes.SET_NAME:
        let calendar = state.find((cal) => cal.id === action.id);

        if (calendar == null) {
          throw new ReferenceError(
            `Cannot find calendar with id: ${action.id}`);
        }
        calendar.name = action.name;
        return state;

      default:
        return state;
    }
  }

}

export default new EventStore();
