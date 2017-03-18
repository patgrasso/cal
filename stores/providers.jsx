import CalendarStore from './CalendarStore';
import {EventActions} from './Actions';

const providers = {
  google: require('../utils/google-api'),
  local: require('../utils/local-api')
};


const fetch = (around, delta, provs=Object.keys(providers)) => {
  let timeFrom = new Date(around);
  let timeTo = new Date(around);
  let calendarIds = CalendarStore
    .getState()
    .get('calendars')
    .map((cal) => cal.get('id'));

  timeFrom.setDate(around.getDate() - delta);
  timeTo.setDate(around.getDate() + delta);

  providers.local.getEvents().then(EventActions.updateAll);
  calendarIds.forEach((id) => provs.forEach((provider) => providers[provider]
    .getEvents(id, timeFrom.toISOString(), timeTo.toISOString())
    .then((events) => EventActions.updateAll(events, provider))));
};

const sync = (events, provider='google') => {
  providers[provider].syncEvents(events);
};

export default {fetch, sync, providers: Object.keys(providers)};
