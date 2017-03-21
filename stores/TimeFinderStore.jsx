import TimeFinderActionTypes from './actions/TimeFinderActionTypes';
import Dispatcher from './actions/Dispatcher';
import providers from './providers';

import { Map, fromJS, List } from 'immutable';
import { ReduceStore } from 'flux/utils';

const LOCAL_STORAGE_KEY = 'timeFinder';

const DEFAULT_SUMMARY = 'Homework';
const DEFAULT_HOURS = 2;

class TimeFinderStore extends ReduceStore {

  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    let stored = fromJS(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)));
    return Map({
      isOpen: false,
      isSearching: false,
      summary: DEFAULT_SUMMARY,
      hours: DEFAULT_HOURS,
      timeMin: null,
      timeMax: null
    }).mergeDeep(stored);
  }

  reduce(state, action) {
    let event, events, exceptions;
    switch (action.type) {
      case TimeFinderActionTypes.OPEN_TIME_FINDER:
        return state.set('isOpen', true)
                    .set('isSearching', false);

      case TimeFinderActionTypes.CLOSE_TIME_FINDER:
        return state.set('isOpen', false)
                    .set('isSearching', false);

      case TimeFinderActionTypes.TIME_FINDER_SEARCH:
        return state.set('isOpen', false)
                    .set('isSearching', true)
                    .set('hours', action.hours)
                    .set('timeMin', action.timeMin)
                    .set('timeMax', action.timeMax)
                    .set('summary', action.summary);

      default:
        return state;
    }
  }

}

export default new TimeFinderStore();
