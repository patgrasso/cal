import EventActionTypes from './EventActionTypes';
import Dispatcher from './Dispatcher';
import utils from '../../utils';
import { Map, fromJS } from 'immutable';

const EventActions = {
  create(event) {
    event.id = event.id || utils.uuid();
    Dispatcher.dispatch({
      type: EventActionTypes.CREATE_EVENT,
      event,
      providers: Object.keys(event.synced)
    });
  },

  update(event) {
    // If this is an instance of a recurring event, make it a unique event
    // and add an exception to the rrule for the original event
    if (event.originalEvent) {
      Dispatcher.dispatch({
        type: EventActionTypes.UPDATE_EVENT,
        event: Map({ id: event.originalEvent })
          .setIn(['recurrence', 'exceptions'], [event.start])
          .toJSON(),
        providers: Object.keys(event.synced)
      });

      // Sever ties with the original event and make this instance its own event
      event = fromJS(event)
        .delete('originalEvent')
        .delete('recurrence')
        .set('id', utils.uuid())
        .toJSON();
    }

    Dispatcher.dispatch({
      type: EventActionTypes.UPDATE_EVENT,
      event,
      providers: Object.keys(event.synced)
    });
  },

  remove(event) {
    Dispatcher.dispatch({
      type: EventActionTypes.REMOVE_EVENT,
      event,
      providers: Object.keys(event.synced)
    });
  },

  startEditing(id) {
    Dispatcher.dispatch({ type: EventActionTypes.START_EDITING, id });
  },

  finishEditing(event) {
    Dispatcher.dispatch({ type: EventActionTypes.STOP_EDITING });
    if (event) {
      this.update(event);
    }
  },

  setTimeFinder(hours) {
    Dispatcher.dispatch({ type: EventActionTypes.SET_TIME_FINDER, hours });
  },

  clearTimeFinder(hours) {
    Dispatcher.dispatch({ type: EventActionTypes.SET_TIME_FINDER, hours });
  }
};

export default EventActions;
