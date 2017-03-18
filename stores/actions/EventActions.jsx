import EventActionTypes from './EventActionTypes';
import Dispatcher from './Dispatcher';
import uuid from 'uuid';

const EventActions = {
  create(event) {
    details.id = details.id || uuid();
    Dispatcher.dispatch({
      type: EventActionTypes.CREATE_EVENT,
      event: event
    });
  },

  remove(id) {
    Dispatcher.dispatch({
      type: EventActionTypes.REMOVE_EVENT,
      id
    });
  }
};

export default EventActions;
