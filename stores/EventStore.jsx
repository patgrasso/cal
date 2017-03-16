import {ReduceStore} from 'flux/utils';
import Dispatcher from './dispatchers';
import {EventActionTypes} from './ActionTypes';

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

      case EventActionTypes.UPDATE_EVENTS:
        let ids = action.events.map(({id}) => id);
        console.log(state
          .filter(({id}) => !ids.includes(id))
          .concat(action.events));
        return state
          .filter(({id}) => !ids.includes(id))
          .concat(action.events);


      default:
        return state;
    }
  }

}

export default new EventStore();
