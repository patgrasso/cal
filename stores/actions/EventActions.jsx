import EventActionTypes from './EventActionTypes';
import Dispatcher from './Dispatcher';
import uuid from 'uuid';

const EventActions = {
  create(event) {
    event.id = event.id || uuid();
    Dispatcher.dispatch({
      type: EventActionTypes.CREATE_EVENT,
      event,
      providers: Object.keys(event.synced)
    });
  },

  remove(event) {
    Dispatcher.dispatch({
      type: EventActionTypes.REMOVE_EVENT,
      id: event.id,
      providers: Object.keys(event.synced)
    });
  },

  startEditing(id) {
    Dispatcher.dispatch({ type: EventActionTypes.START_EDITING, id });
  },

  finishEditing(event) {
    Dispatcher.dispatch({ type: EventActionTypes.STOP_EDITING });
    if (event) {
      Dispatcher.dispatch({
        type: EventActionTypes.CREATE_EVENT,
        event,
        providers: Object.keys(event.synced)
      });
    }
  }
};

export default EventActions;
