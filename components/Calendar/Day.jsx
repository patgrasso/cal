import React from 'react';
import CalEvent from './CalEvent';
import TimeBlock from './TimeBlock';
import utils from '../../utils';
import EventActions from '../../stores/actions/EventActions';
import moment from 'moment-timezone';
import { Map } from 'immutable';
import { hourCellHeight } from './CalendarConstants';

const TIME_MARKER_UPDATE_MS = 60000;

import './Day.styl';

class Day extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      time: utils.timeInHours(),
      mouseDownStart: null,
      mouseDownCurr: null
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => {
        if (this.props.date.isSame(moment(), 'day')) {
          this.setState({ time: utils.timeInHours() })
        }
      },
      TIME_MARKER_UPDATE_MS
    );
  }

  calculateDateFromMousePosition(e, roundFn=Math.round) {
    let { date, getMousePosition } = this.props;
    let position = getMousePosition(e);
    let hour = roundFn(position / hourCellHeight * 2) / 2;
    let minutes = roundFn((hour % 1) * 60);

    return moment(date).hour(hour).minutes(minutes).seconds(0).milliseconds(0);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  onMouseDown(e) {
    let dateAtMouse = this.calculateDateFromMousePosition(e, Math.floor);
    this.setState({
      mouseDownStart: dateAtMouse,
      mouseDownCurr: moment(dateAtMouse).add(1, 'hour')
    });
  }

  onMouseMove(e) {
    if (this.state.mouseDownStart != null) {
      let dateAtMouse = this.calculateDateFromMousePosition(e);
      let start = this.state.mouseDownStart;

      if (Math.abs(dateAtMouse - start) >= moment.duration(30, 'minutes')) {
        this.setState({ mouseDownCurr: dateAtMouse });
      } else {
        this.setState({ mouseDownCurr: moment(start).add(30, 'minutes') });
      }
    }
  }

  onMouseUp(e) {
    let { mouseDownStart, mouseDownCurr } = this.state;
    let newId = utils.uuid();
    let start = moment(Math.min(mouseDownStart, mouseDownCurr));
    let end = moment(Math.max(mouseDownStart, mouseDownCurr));

    this.setState({ mouseDownStart: null, mouseDownCurr: null });

    EventActions.create({
      calendarId: this.props.primaryCal,
      id: newId,
      summary: '',
      start: start,
      end: end,
      synced: { google: false },
      location: ''
    });
    EventActions.startEditing(newId);
  }

  onDrop(e) {
    let { date, getMousePosition } = this.props;
    let position = getMousePosition(e);

    let startHour = position / hourCellHeight;
    let startDate = moment(date).hours(startHour).minutes((startHour % 1) * 60)
                                .seconds(0).milliseconds(0);
    this.props.onDrop(startDate);
  }

  // Render all existing events
  renderEvents(events) {
    return utils.events
      .reconcile(events)
      .map(({event, left, size}, i) => (

        <CalEvent
          event={event}
          left={left}
          size={size}
          key={i}
          onDragStart={this.props.onDragStart}
          getMousePosition={this.props.getMousePosition} />

      ));
  }

  // Render all available time blocks if the timefinder is active
  renderTimeFinderBlocks(events) {
    let timeFinder = this.props.timeFinder;

    if (this.props.timeFinder.get('isSearching')) {
      return utils.events.findTime(
        events, timeFinder.get('hours'),
        timeFinder.get('timeMin'), timeFinder.get('timeMax')
      ).toJSON().map((time, i) => (

        <TimeBlock
          start={time}
          end={moment(time).add(timeFinder.get('hours'), 'hours')}
          summary={timeFinder.get('summary')}
          primaryCal={this.props.primaryCal}
          key={i} />

      ));
    }
    return [];
  }

  // If the user's mouse is down on the day (and nothing else), render a fake
  // event to represent where the new event will go once the user releases
  // the mouse
  renderNewEvent() {
    if (this.state.mouseDownStart == null) {
      return '';
    }
    let start = this.state.mouseDownStart;
    let end = this.state.mouseDownCurr;
    let event = Map({
      start: moment(Math.min(start, end)),
      end: moment(Math.max(start, end))
    });
    return (
      <CalEvent
        event={event}
        noDrag={true}
      />
    )
  }

  render() {
    let { events, date } = this.props;
    let today = date.isSame(moment(), 'day');
    let clazz = 'calendar-day' + (today ? ' today' : '');

    let eventsForToday = events
      .toList()
      .filter((event) => moment(event.get('start')).isSame(date, 'day'))
      .filter((event) => !event.get('allDay'));

    let calEvents = this.renderEvents(eventsForToday);
    let potentialEvents = this.renderTimeFinderBlocks(eventsForToday);
    let newEvent = this.renderNewEvent();

    return (
      <div
        ref="self"
        className={clazz}
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseMove={this.onMouseMove.bind(this)}
        onMouseUp={this.onMouseUp.bind(this)}
        onDrop={this.onDrop.bind(this)}
        onDragOver={(e) => e.preventDefault()}
      >
        {calEvents}
        {potentialEvents}
        {newEvent}
        {today ?
          <div
            className="current-time-marker"
            style={{ top: hourCellHeight * this.state.time }}
          ></div> : null}
      </div>
    );
  }

}

export default Day;
