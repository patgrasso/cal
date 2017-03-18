import ProviderActionTypes from './actions/ProviderActionTypes';
import EventActionTypes from './actions/EventActionTypes';
import Dispatcher from './actions/dispatcher';
import providers from './providers';

import { Map, fromJS } from 'immutable';
import { ReduceStore } from 'flux/utils';

const EVENTS = 'events';

class EventStore extends ReduceStore {

  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Map({ events: Map() });
  }

  reduce(state, action) {
    switch (action.type) {

      // provider actions
      case ProviderActionTypes.UPDATE_EVENTS:
        // create immutable
        let events = Map(fromJS(action.events.map((event) =>
          [event.id, event])));

        // set 'synced' for provider
        events = events.map((event) =>
          event.setIn(['synced', action.provider], true));

        return state.mergeIn(EVENTS, events);

      case ProviderActionTypes.CREATE_EVENT:
        // create immutable
        let event = Map(fromJS([ action.event.id, action.event ]));

        // set 'synced' for provider
        event = event.setIn([action.event.id, 'synced', action.provider], true);

        return state.mergeIn(EVENTS, event);

      case ProviderActionTypes.REMOVE_EVENT:
        return state.deleteIn([EVENTS, action.id]);


      // user actions
      case EventActionTypes.CREATE_EVENT:
        // create immutable
        let event = Map(fromJS(action.event));

        // for each provider in 'synced', create the event
        // and set the value for that provider to false (not synced yet)
        event = event.update('synced', (synced) => {
          synced.forEach((_, provider) =>
            providers[provider].createEvent(action.event));
          return synced.map(() => false);
        });

        return state.mergeIn(EVENTS, event);

      case EventActionTypes.REMOVE_EVENT:
        // for each provider in 'synced', remove the event
        state.getIn([EVENTS, action.id, 'synced']).forEach((_, provider) =>
          providers[provider].removeEvent(action.id);

        return state.deleteIn(EVENTS, action.id);

      default:
        return state;
    }
  }

}

export default new EventStore();
