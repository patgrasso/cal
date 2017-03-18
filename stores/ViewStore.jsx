import {ReduceStore} from 'flux/utils';
import {ViewActionTypes} from './ActionTypes';
import {Map} from 'immutable';
import Dispatcher from './dispatchers';

class ViewStore extends ReduceStore {

  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Map();
  }

  reduce(state, action) {
    switch (action.type) {
      case ViewActionTypes.OPEN_EVENT_MODAL:
        return state.set('modalEventId', action.id);

      case ViewActionTypes.CLOSE_EVENT_MODAL:
        return state.set('modalEventId', null);

      default:
        return state;
    }
  }

}

export default new ViewStore();
