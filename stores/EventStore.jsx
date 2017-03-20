import ProviderActionTypes from './actions/ProviderActionTypes';
import EventActionTypes from './actions/EventActionTypes';
import Dispatcher from './actions/Dispatcher';
import providers from './providers';

import { Map, fromJS, List } from 'immutable';
import { ReduceStore } from 'flux/utils';

const EVENTS  = 'events';
const EDITING = 'editing';
const TIME_FINDER_HOURS = 'timeFinderHours';

class EventStore extends ReduceStore {

  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Map({ events: Map(), editing: null });
  }

  reduce(state, action) {
    let event, events, exceptions;
    switch (action.type) {

      // provider actions
      case ProviderActionTypes.UPDATE_EVENTS:
        // create immutable
        events = Map(fromJS(action.events.map((event) =>
          [event.id, event])));

        // set 'synced' for provider
        events = events.map((event) =>
          event.setIn(['synced', action.provider], true));

        return state.mergeDeepIn([EVENTS], events);

      case ProviderActionTypes.CREATE_EVENT:
        // create immutable
        event = Map(fromJS([[ action.event.id, action.event ]]));

        // set 'synced' for provider
        event = event.setIn([action.event.id, 'synced', action.provider], true);

        return state.mergeIn([EVENTS], event);

      case ProviderActionTypes.REMOVE_EVENT:
        return state.deleteIn([EVENTS, action.event.id]);


      // user actions
      case EventActionTypes.UPDATE_EVENT:
      case EventActionTypes.CREATE_EVENT:
        // create immutable
        event = Map(fromJS(action.event));

        // for each provider in 'synced', set the value for that provider
        // to false (not synced yet)
        if (event.get('synced')) {
          event = event.update('synced', (synced) => synced.map(() => false));
        }

        // merge recurrences
        if (event.getIn(['recurrence', 'exceptions'])) {
          exceptions = (state.getIn(
            [EVENTS, action.event.id, 'recurrence', 'exceptions']
          ) || List()).concat(event.getIn(['recurrence', 'exceptions']));
          event.setIn(['recurrence', 'exceptions'], exceptions);
        }

        return state.mergeDeepIn([EVENTS, action.event.id], event);

      case EventActionTypes.REMOVE_EVENT:
        return state.deleteIn([EVENTS, action.event.id]);


      // editing an event
      case EventActionTypes.START_EDITING:
        return state.set(EDITING, action.id);

      case EventActionTypes.STOP_EDITING:
        return state.set(EDITING, null);


      // time finder
      case EventActionTypes.SET_TIME_FINDER:
        return state.set(TIME_FINDER_HOURS, action.hours);

      case EventActionTypes.CLEAR_TIME_FINDER:
        return state.set(TIME_FINDER_HOURS, null);

      default:
        return state;
    }
  }

}

export default new EventStore();
