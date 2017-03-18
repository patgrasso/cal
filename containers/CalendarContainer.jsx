import React from 'react';
import {Container} from 'flux/utils';
import EventActions from '../stores/actions/EventActions';
import CalendarActions from '../stores/actions/CalendarActions';
import CalendarStore from '../stores/CalendarStore2';
import EventStore from '../stores/EventStore2';
import Calendar from '../components/Calendar/Calendar';

class CalendarContainer extends React.Component {

  static getStores() {
    return [CalendarStore, EventStore];
  }

  static calculateState(prevState) {
    return {
      calendars: CalendarStore.getState().get('calendarList'),
      primaryCal: CalendarStore.getState().get('primaryCal'),
      events: EventStore.getState().get('events'),
      currentlyEditing: EventStore.getState().get('editing'),
      createEvent: EventActions.create,
      removeEvent: EventActions.remove
    };
  }

  render() {
    return (
      <Calendar {...this.state} />
    );
  }

}

export default Container.create(CalendarContainer);
