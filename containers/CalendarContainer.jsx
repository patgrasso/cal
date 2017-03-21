import React from 'react';
import {Container} from 'flux/utils';
import EventActions from '../stores/actions/EventActions';
import CalendarActions from '../stores/actions/CalendarActions';
import TimeFinderStore from '../stores/TimeFinderStore';
import CalendarStore from '../stores/CalendarStore';
import EventStore from '../stores/EventStore';
import Calendar from '../components/Calendar/Calendar';

class CalendarContainer extends React.Component {

  static getStores() {
    return [CalendarStore, EventStore, TimeFinderStore];
  }

  static calculateState(prevState) {
    return {
      calendars: CalendarStore.getState().get('calendarList'),
      primaryCal: CalendarStore.getState().get('primaryCal'),
      events: EventStore.getState().get('events'),
      timeFinder: TimeFinderStore.getState(),
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
