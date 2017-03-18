import ProviderActionTypes from './actions/ProviderActionTypes';
import CalendarActionTypes from './actions/CalendarActionTypes';
import Dispatcher from './dispatchers';
import providers from './providers';

import { Map } from 'immutable';
import { ReduceStore } from 'flux/utils';

const CALENDAR_LIST = 'calendarList';
const PRIMARY_CAL   = 'primaryCal';

class CalendarStore extends ReduceStore {

  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Map({ primaryCal: null, calendars: Map() });
  }

  reduce(state, action) {
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

        return state.mergeIn(CALENDAR_LIST, calendarList)
                    .set(PRIMARY_CAL, primaryCal && primaryCal.get('id'));

      case ProviderActionTypes.CREATE_CALENDAR:
        // create immutable
        let cal = Map(fromJS([ action.calendar.id, action.calendar ]));

        // set 'synced' for provider
        cal = cal.setIn([action.calendar.id, 'synced', action.provider], true);

        return state.mergeIn(CALENDAR_LIST, cal);


      // user actions
      case CalendarActionTypes.CREATE_CALENDAR:
        // create immutable
        let calendar = Map(fromJS([action.calendar.id, action.calendar]));

        // for each provider in 'synced', create the calendar
        // and set the value for that provider to false (not synced yet)
        calendar = calendar.update('synced', (synced) => {
          synced.forEach((_, provider) =>
            providers[provider].createCalendar(action.calendar));
          return synced.map(() => false);
        });

        return state.mergeIn(CALENDAR_LIST, calendar);


      default:
        return state;
    }
  }

}

export default new CalendarStore();
