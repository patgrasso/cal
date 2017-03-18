import React from 'react';
import ViewTypes from './CalendarViewTypes';
import EventModal from './EventModal';
import providers from '../../stores/providers';
import CalendarHeader from './CalendarHeader';
import EventActions from '../../stores/actions/EventActions';
import { Map } from 'immutable';

class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      viewType: ViewTypes.WEEK,
      focusDate: new Date()
    };
  }

  componentDidMount() {
    providers.local.getEvents();
  }

  openModal(modalEventId) {
    EventActions.startEditing(modalEventId);
  }

  dismissModal(event) {
    EventActions.finishEditing(event);
  }

  moveForward() {
    let {focusDate, viewType} = this.state;
    let d = new Date(focusDate);

    d.setDate(d.getDate() + viewType.delta);
    this.setState({ focusDate: d });
    providers.fetch(d, viewType.delta);
  }

  moveBackward() {
    let {focusDate, viewType} = this.state;
    let d = new Date(focusDate);

    d.setDate(d.getDate() - viewType.delta);
    this.setState({ focusDate: d });
    providers.fetch(d, viewType.delta);
  }

  onChangeViewType(viewType) {
    this.setState({ viewType });
  }

  render() {
    let { View } = this.state.viewType;
    let visibleCals = this
      .props.calendars
      .filter((cal) => cal.get('visible'));

    // Filter out events on hidden calendars
    let events = this
      .props.events
      .filter((event) => visibleCals.has(event.get('calendarId')))
      .map((event) => event.set(
        'color', visibleCals.getIn([event.get('calendarId'), 'color'])));

    // Construct the event modal if need be
    let modalEvent = events.get(this.props.currentlyEditing);

    return (
      <section className="calendar-container">
        <CalendarHeader
          moveForward={this.moveForward.bind(this)}
          moveBackward={this.moveBackward.bind(this)}
          onChangeViewType={this.onChangeViewType.bind(this)}
        />
        <View
          events={events}
          calendars={this.props.calendars}
          primaryCal={this.props.primaryCal}
          focusDate={this.state.focusDate}
          openModal={this.openModal.bind(this)}
          style={{'background-color': 'red'}}
        />
        {modalEvent ?
         <EventModal
           event={modalEvent}
           calendars={this.props.calendars}
           dismiss={this.dismissModal.bind(this)}
         /> : null}
      </section>
    );
  }

}

export default Calendar;
