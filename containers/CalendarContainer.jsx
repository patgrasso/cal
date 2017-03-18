import React from 'react';
import {Container} from 'flux/utils';
import {EventActions, CalendarActions} from '../stores/Actions';
import CalendarStore from '../stores/CalendarStore';
import EventStore from '../stores/EventStore';
import ViewStore from '../stores/ViewStore';
import Calendar from '../components/Calendar/Calendar';

class CalendarContainer extends React.Component {

  static getStores() {
    return [CalendarStore, EventStore, ViewStore];
  }

  static calculateState(prevState) {
    return {
      calendars: CalendarStore.getState().get('calendars'),
      primaryCal: CalendarStore.getState().get('primaryCal'),
      events: EventStore.getState(),
      viewProps: ViewStore.getState(),
      createEvent: EventActions.create,
      removeEvent: EventActions.remove
    };
  }

  render() {
    return (
      <Calendar
        calendars={this.state.calendars}
        primaryCal={this.state.primaryCal}
        events={this.state.events}
        {...this.state.viewProps.toJSON()}
        onCreateEvent={this.state.createEvent}
        onRemoveEvent={this.state.removeEvent}
      />
    );
  }

}

export default Container.create(CalendarContainer);
