import React from 'react';
import ViewTypes from './CalendarViewTypes';
import EventModal from './EventModal';
import providers from '../../stores/providers';
import CalendarHeader from './CalendarHeader';
import EventActions from '../../stores/actions/EventActions';
import time from '../../utils/time';
import utils from '../../utils';
import moment from 'moment-timezone';
import { Map } from 'immutable';

class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      viewType: ViewTypes.WEEK,
      focusDate: new Date(),
      dragging: null,
      dragOffset: null
    };
  }

  componentDidMount() {
    providers.local.getEvents();
  }

  dismissModal(event) {
    if (event && event.originalEvent) {
      event.id = event.originalEvent;
      delete event.originalEvent;
    }
    EventActions.finishEditing(event);
  }

  moveForward() {
    let {focusDate, viewType} = this.state;
    let newFocusDate = new Date(+focusDate + time.days(viewType.delta));
    let timeMax = new Date(+focusDate + 2*time.days(viewType.delta));

    this.setState({ focusDate: newFocusDate });
    providers.google.getEvents(focusDate.toISOString(), timeMax.toISOString());
  }

  moveBackward() {
    let { focusDate, viewType } = this.state;
    let newFocusDate = new Date(+focusDate - time.days(viewType.delta));
    let timeMin = new Date(+focusDate - 2*time.days(viewType.delta));

    this.setState({ focusDate: newFocusDate });
    providers.google.getEvents(timeMin.toISOString(), focusDate.toISOString());
  }

  onChangeViewType(viewType) {
    this.setState({ viewType });
  }

  onDragStart(event, startDate) {
    let start = new Date(event.get('start'));
    this.setState({ dragging: event, dragOffset: startDate - start });
  }

  // TODO: convert to moment()
  onDrop(newStartDate) {
    let event = this.state.dragging;
    if (!event) {
      return;
    }
    let startDate = new Date(event.get('start'));
    let endDate = new Date(event.get('end'));
    let eventLength = endDate - startDate;
    let minutes = startDate.getMinutes();

    newStartDate = new Date(newStartDate - this.state.dragOffset);
    let roundMins = Math.round((newStartDate.getMinutes() - minutes) / 30) * 30;
    newStartDate.setMinutes(minutes + roundMins);
    let newEndDate = new Date(+newStartDate + eventLength);

    let originalEvent = this.props.events.get(event.get('originalEvent'));
    if (originalEvent != null) {
      newStartDate = moment(originalEvent.get('start')).add(
        newStartDate - startDate);
      newEndDate = moment(originalEvent.get('end')).add(
        newEndDate - endDate);
      event = originalEvent;
    }

    EventActions.update(event.set('start', newStartDate)
                             .set('end', newEndDate)
                             .toJSON());
    this.setState({ dragging: null });
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

    // Create fake instance for recurring events
    events = utils.events.createPseudoEvents(events);

    // Construct the event modal if need be
    let modalEvent = events.get(this.props.currentlyEditing);

    return (
      <section className="calendar-container">
        <CalendarHeader
          currentViewType={this.state.viewType}
          moveForward={this.moveForward.bind(this)}
          moveBackward={this.moveBackward.bind(this)}
          onChangeViewType={this.onChangeViewType.bind(this)}
        />
        <View
          events={events}
          calendars={this.props.calendars}
          primaryCal={this.props.primaryCal}
          focusDate={this.state.focusDate}
          timeFinderHours={this.props.timeFinderHours}

          onDragStart={this.onDragStart.bind(this)}
          onDrop={this.onDrop.bind(this)}

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
