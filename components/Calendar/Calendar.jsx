import React from 'react';
import ViewTypes from './CalendarViewTypes';
import EventModal from './EventModal';
import providers from '../../stores/providers';

import './Calendar.styl';

class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      viewType: ViewTypes.WEEK,
      modalEventId: null,
      focusDate: new Date()
    };
  }

  openModal(modalEventId) {
    this.setState({ modalEventId });
  }

  dismissModal() {
    this.setState({ modalEventId: null });
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

  render() {
    let {View} = this.state.viewType;
    let colors = {};
    let visibleCals = this
      .props.calendars
      .filter((cal) => cal.visible)
      .map(({id, color}) => (colors[id] = color) && id);

    // Filter out events on hidden calendars
    let events = this
      .props.events
      .filter((event) => visibleCals.includes(event.calendarId))
      .map((event) => Object.assign(
        {}, { color: colors[event.calendarId] }, event));

    // Construct the event modal if need be
    let {modalEventId} = this.state;
    let modalEvent = events.find(({id}) => id === modalEventId);

    return (
      <section
        className="calendar-container"
        onClick={this.dismissModal.bind(this)}
      >
        <header className="calendar-header">
          <button
            className="move-backward"
            onClick={this.moveBackward.bind(this)}
          ><i className="fa fa-arrow-left"></i></button>
          <button
            className="move-forward"
            onClick={this.moveForward.bind(this)}
          ><i className="fa fa-arrow-right"></i></button>
        </header>
        <View
          events={events}
          calendars={this.props.calendars}
          focusDate={this.state.focusDate}
          openModal={this.openModal.bind(this)}
          style={{'background-color': 'red'}}
        />
        {modalEvent ?
         <EventModal
           event={modalEvent}
           dismiss={this.dismissModal.bind(this)}
         /> : null}
      </section>
    );
  }

}

export default Calendar;
