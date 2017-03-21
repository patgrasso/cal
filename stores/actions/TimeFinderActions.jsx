import TimeFinderActionTypes from './TimeFinderActionTypes';
import Dispatcher from './Dispatcher';
import utils from '../../utils';
import { Map, fromJS } from 'immutable';

const DEFAULT_SUMMARY = 'Homework';

const EventActions = {
  open() {
    Dispatcher.dispatch({ type: TimeFinderActionTypes.OPEN_TIME_FINDER });
  },

  close() {
    Dispatcher.dispatch({ type: TimeFinderActionTypes.CLOSE_TIME_FINDER });
  },

  search(hours, timeMin, timeMax, summary) {
    summary = summary || DEFAULT_SUMMARY;
    Dispatcher.dispatch({
      type: TimeFinderActionTypes.TIME_FINDER_SEARCH,
      hours,
      timeMin,
      timeMax,
      summary
    });
  }

};

export default EventActions;
