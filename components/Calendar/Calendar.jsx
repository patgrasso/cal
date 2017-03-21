import React from 'react';
import ViewTypes from './CalendarViewTypes';
import EventModal from './EventModal';
import TimeFinderModal from './TimeFinderModal';
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
      focusDate: moment(),
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

  setFocusDate(date) {
    let { viewType } = this.state;
    let timeMin = moment(moment(date) - time.days(viewType.delta));
    let timeMax = moment(moment(date) + time.days(viewType.delta));
    this.setState({ focusDate: date });
    providers.google.getEvents(timeMin.toISOString(), timeMax.toISOString());
  }

  onChangeViewType(viewType) {
    this.setState({ viewType });
  }

  onDragStart(event, startDate) {
    let start = moment(event.get('start'));
    this.setState({ dragging: event, dragOffset: startDate - start });
  }

  onDrop(newStartDate) {
    let event = this.state.dragging;
    if (!event) {
      return;
    }
    let startDate = moment(event.get('start'));
    let endDate = moment(event.get('end'));
    let eventLength = endDate - startDate;
    let minutes = startDate.minutes();

    newStartDate = moment(newStartDate - this.state.dragOffset);
    let roundMins = Math.round((newStartDate.minutes() - minutes) / 30) * 30;
    newStartDate.minutes(minutes + roundMins);
    let newEndDate = moment(newStartDate + eventLength);


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
    let { colors } = this.props;
    let visibleCals = this
      .props.calendars
      .filter((cal) => cal.get('visible'));

    // Filter out events on hidden calendars and set default colors
    let events = this
      .props.events
      .filter((event) => visibleCals.has(event.get('calendarId')))
      .map((event) => event
        .set('defaultFgColor', visibleCals.getIn(
          [event.get('calendarId'), 'fgColor']))
        .set('defaultBgColor', visibleCals.getIn(
          [event.get('calendarId'), 'bgColor']))
        .set('bgColor', colors.getIn(
          [event.get('colorId'), 'background']))
        .set('fgColor', colors.getIn(
          [event.get('colorId'), 'foreground'])));

    // Create fake instance for recurring events
    events = utils.events.createPseudoEvents(events);

    // Construct the event modal if need be
    let modalEvent = events.get(this.props.currentlyEditing);
    let eventModal = modalEvent
                   ? <EventModal
                       event={modalEvent}
                       calendars={this.props.calendars}
                       colors={colors}
                       dismiss={this.dismissModal.bind(this)} />
                   : null;
    let timeFinderModal = this.props.timeFinder.get('isOpen')
                        ? <TimeFinderModal {...this.props.timeFinder.toJSON()} />
                        : null;

    // Modal order of importance
    let modal =  timeFinderModal || eventModal;

    return (
      <section className="calendar-container">
        <CalendarHeader
          currentViewType={this.state.viewType}
          currentFocusDate={this.state.focusDate}
          setFocusDate={this.setFocusDate.bind(this)}
          onChangeViewType={this.onChangeViewType.bind(this)}
          timeFinder={this.props.timeFinder}
        />
        <View
          events={events}
          calendars={this.props.calendars}
          primaryCal={this.props.primaryCal}
          focusDate={this.state.focusDate}
          timeFinder={this.props.timeFinder}

          onDragStart={this.onDragStart.bind(this)}
          onDrop={this.onDrop.bind(this)}

          style={{'background-color': 'red'}}
        />
        { modal ? modal : '' }
      </section>
    );
  }

}

export default Calendar;
