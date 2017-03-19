import ProviderActionTypes from './actions/ProviderActionTypes';
import EventActionTypes from './actions/EventActionTypes';
import Dispatcher from './actions/Dispatcher';
import providers from './providers';

import { Map, fromJS } from 'immutable';
import { ReduceStore } from 'flux/utils';

const EVENTS  = 'events';
const EDITING = 'editing';

class EventStore extends ReduceStore {

  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Map({ events: Map(), editing: null });
  }

  reduce(state, action) {
    let event, events;
    switch (action.type) {

      // provider actions
      case ProviderActionTypes.UPDATE_EVENTS:
        // create immutable
        events = Map(fromJS(action.events.map((event) =>
          [event.id, event])));

        // set 'synced' for provider
        events = events.map((event) =>
          event.setIn(['synced', action.provider], true));

        return state.mergeIn([EVENTS], events);

      case ProviderActionTypes.CREATE_EVENT:
        // create immutable
        event = Map(fromJS([[ action.event.id, action.event ]]));

        // set 'synced' for provider
        event = event.setIn([action.event.id, 'synced', action.provider], true);

        return state.mergeIn([EVENTS], event);

      case ProviderActionTypes.REMOVE_EVENT:
        return state.deleteIn([EVENTS, action.id]);


      // user actions
      case EventActionTypes.CREATE_EVENT:
        // create immutable
        event = Map(fromJS(action.event));

        // for each provider in 'synced', set the value for that provider
        // to false (not synced yet)
        event = event.update('synced', (synced) => synced.map(() => false));

        return state.mergeIn([EVENTS, action.event.id], event);

      case EventActionTypes.REMOVE_EVENT:
        return state.deleteIn([EVENTS, action.id]);


      // editing an event
      case EventActionTypes.START_EDITING:
        return state.set(EDITING, action.id);

      case EventActionTypes.UPDATE_EVENT:
        // create immutable
        event = Map(fromJS(action.event));

        // for each provider in 'synced', set the value for that provider
        // to false (not synced yet)
        event = event.update('synced', (synced) => synced.map(() => false));

        return state.mergeIn([EVENTS, action.event.id], event);

      case EventActionTypes.STOP_EDITING:
        return state.set(EDITING, null);

      default:
        return state;
    }
  }

}

export default new EventStore();
