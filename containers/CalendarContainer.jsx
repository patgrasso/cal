import React from 'react';
import {Container} from 'flux/utils';
import {EventActions, CalendarActions} from '../stores/Actions';
import CalendarStore from '../stores/CalendarStore';
import EventStore from '../stores/EventStore';
import Calendar from '../components/Calendar/Calendar';

class CalendarContainer extends React.Component {

  static getStores() {
    return [CalendarStore, EventStore];
  }

  static calculateState(prevState) {
    return {
      calendars: CalendarStore.getState(),
      events: EventStore.getState(),
      createEvent: EventActions.create,
      removeEvent: EventActions.remove
    };
  }

  render() {
    return (
      <Calendar
        calendars={this.state.calendars}
        events={this.state.events}
        onCreateEvent={this.state.createEvent}
        onRemoveEvent={this.state.removeEvent}
      />
    );
  }

}

export default Container.create(CalendarContainer);
