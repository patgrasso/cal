import {ReduceStore} from 'flux/utils';
import {EventActionTypes} from './ActionTypes';
import {Map} from 'immutable';
import Dispatcher from './dispatchers';
import providers from './providers';

class EventStore extends ReduceStore {

  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Map();
  }

  reduce(state, action) {
    switch (action.type) {
      case EventActionTypes.CREATE_EVENT:
        return state.set(action.details.id, Map(action.details));

      case EventActionTypes.REMOVE_EVENT:
        return state.delete(action.id);

      case EventActionTypes.SET_SUMMARY:
        return state.update(
          action.id, (item) => item.set('summary', action.summary));

      case EventActionTypes.UPDATE_EVENTS:
        return action.events.reduce(
          (state, event) => state.update(
            event.id, (existing) => (existing || Map()).merge(event)),
          state);

      case EventActionTypes.WIPE_EVENTS:
        return state.clear();

      default:
        return state;
    }
  }

}

const eventStore = new EventStore();

eventStore.addListener(() => {
  let events = eventStore.getState();
  providers.providers.forEach(
    (provider) => providers.sync(
      events.filter((event) => event.get('sync').includes(provider))
            .toJSON(),
      provider));
});

export default eventStore;
