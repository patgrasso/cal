import ProviderActionTypes from './actions/ProviderActionTypes';
import CalendarActionTypes from './actions/CalendarActionTypes';
import Dispatcher from './actions/Dispatcher';
import providers from './providers';

import { Map, fromJS } from 'immutable';
import { ReduceStore } from 'flux/utils';

const CALENDAR_LIST = 'calendarList';
const PRIMARY_CAL   = 'primaryCal';

class CalendarStore extends ReduceStore {

  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Map({ primaryCal: null, calendarList: Map() });
  }

  reduce(state, action) {
    let cal;
    switch (action.type) {

      // provider actions
      case ProviderActionTypes.UPDATE_CALENDAR_LIST:
        // create immutable
        let calendarList = Map(fromJS(action.calendarList.map((cal) =>
          [cal.id, cal])));

        // find calendar with 'primary' == true, if any
        let primaryCal = calendarList.find((cal) => cal.get('primary'));

        // set 'synced' for provider
        calendarList = calendarList.map((cal) =>
          cal.setIn(['synced', action.provider], true));

        return state.mergeIn([CALENDAR_LIST], calendarList)
                    .set(PRIMARY_CAL, primaryCal && primaryCal.get('id'));
        return state;

      case ProviderActionTypes.CREATE_CALENDAR:
        // create immutable
        cal = Map(fromJS([ action.calendar.id, action.calendar ]));

        // set 'synced' for provider
        cal = cal.setIn([action.calendar.id, 'synced', action.provider], true);

        return state.mergeIn([CALENDAR_LIST], cal);


      // user actions
      case CalendarActionTypes.CREATE_CALENDAR:
        // create immutable
        cal = Map(fromJS([action.calendar.id, action.calendar]));

        // for each provider in 'synced', create the calendar
        // and set the value for that provider to false (not synced yet)
        cal = cal.update('synced', (synced) => synced.map(() => false));

        return state.mergeIn([CALENDAR_LIST], calendar);

      case CalendarActionTypes.TOGGLE_VISIBILITY:
        let visible = state.getIn([CALENDAR_LIST, action.id, 'visible']);
        return state.setIn([CALENDAR_LIST, action.id, 'visible'], !visible);


      default:
        return state;
    }
  }

}

export default new CalendarStore();
