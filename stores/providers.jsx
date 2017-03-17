import CalendarStore from './CalendarStore';
import {EventActions} from './Actions';

const providers = {
  google: require('../utils/google-api')
};


const fetch = (around, delta, provider='google') => {
  let timeFrom = new Date(around);
  let timeTo = new Date(around);
  let calendarIds = CalendarStore.getState().map(({id}) => id);

  timeFrom.setDate(around.getDate() - delta);
  timeTo.setDate(around.getDate() + delta);

  calendarIds.forEach((id) => providers[provider]
    .getEvents(id, timeFrom.toISOString(), timeTo.toISOString())
    .then((events) => EventActions.updateAll(events)));
};

export default {fetch};
