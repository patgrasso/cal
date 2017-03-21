import React from 'react';
import CalEvent from './CalEvent';
import TimeBlock from './TimeBlock';
import utils from '../../utils';
import EventActions from '../../stores/actions/EventActions';
import moment from 'moment-timezone';
import { hourCellHeight } from './CalendarConstants';

const TIME_MARKER_UPDATE_MS = 60000;

import './Day.styl';

class Day extends React.Component {

  constructor(props) {
    super(props);
    this.state = { time: utils.timeInHours() };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => {
        if (!utils.compareDates(this.props.date, new Date())) {
          this.setState({ time: utils.timeInHours() })
        }
      },
      TIME_MARKER_UPDATE_MS
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  onClick(e) {
    let { date, getMousePosition } = this.props;
    let position = getMousePosition(e);

    let startHour = Math.floor(position / hourCellHeight * 2) / 2;
    let startDate = new Date(
      date.getFullYear(), date.getMonth(), date.getDate(),
      startHour, (startHour % 1) * 60);
    let endDate = new Date(
      date.getFullYear(), date.getMonth(), date.getDate(),
      startHour + 1, ((startHour + 1) % 1) * 60);
    let newId = utils.uuid();

    EventActions.create({
      calendarId: this.props.primaryCal,
      id: newId,
      summary: '',
      start: startDate,
      end: endDate,
      synced: { google: false },
      location: ''
    });
    EventActions.startEditing(newId);
  }

  onDrop(e) {
    let { date, getMousePosition } = this.props;
    let position = getMousePosition(e);

    let startHour = position / hourCellHeight;
    let startDate = new Date(
      date.getFullYear(), date.getMonth(), date.getDate(),
      startHour, (startHour % 1) * 60);

    this.props.onDrop(startDate);
  }

  render() {
    let { events, date, timeFinder } = this.props;
    let today = !utils.compareDates(date, new Date());
    let clazz = 'calendar-day' + (today ? ' today' : '');

    let eventsForToday = events
      .toList()
      .filter((event) => !utils.compareDates(event.get('start'), date))
      .filter((event) => !event.get('allDay'));

    let calEvents = utils.events
      .reconcile(eventsForToday)
      .map(({event, left, size}, i) => (

        <CalEvent
          event={event}
          left={left}
          size={size}
          key={i}
          onDragStart={this.props.onDragStart}
          getMousePosition={this.props.getMousePosition} />

      ));

    let potentialEvents = [];

    if (this.props.timeFinder.get('isSearching')) {
      potentialEvents = utils.events.findTime(
        eventsForToday, timeFinder.get('hours'),
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

    return (
      <div
        className={clazz}
        onClick={this.onClick.bind(this)} ref="self"
        onDrop={this.onDrop.bind(this)}
        onDragOver={(e) => e.preventDefault()}
      >
        {calEvents}
        {potentialEvents}
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
