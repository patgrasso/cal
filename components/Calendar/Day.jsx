import React from 'react';
import CalEvent from './CalEvent';
import utils from '../../utils';
import uuid from 'uuid';
import EventActions from '../../stores/actions/EventActions';
import {hourCellHeight} from './CalendarConstants';

const TIME_MARKER_UPDATE_MS = 60000;

import './Day.styl';

class Day extends React.Component {

  constructor(props) {
    super(props);
    this.state = { time: utils.timeInHours() };
  }

  componentDidMount() {
    if (this.props.today) {
      this.timerID = setInterval(
        () => this.setState({ time: utils.timeInHours() }),
        TIME_MARKER_UPDATE_MS
      );
    }
  }

  componentWillUnmount() {
    if (this.props.today) {
      clearInterval(this.timerID);
    }
  }

  onClick(e) {
    let {date, getMousePosition} = this.props;
    let position = getMousePosition(e);

    let startHour = Math.floor(position / hourCellHeight * 2) / 2;
    let startDate = new Date(
      date.getFullYear(), date.getMonth(), date.getDate(),
      startHour, (startHour % 1) * 60);
    let endDate = new Date(
      date.getFullYear(), date.getMonth(), date.getDate(),
      startHour + 1, ((startHour + 1) % 1) * 60);
    let newId = uuid();

    EventActions.create({
      calendarId: this.props.primaryCal,
      id: newId,
      summary: '',
      start: startDate,
      end: endDate,
      synced: { local: false },
      location: ''
    });
    EventActions.startEditing(newId);
  }

  render() {
    let {events, date} = this.props;
    let today = !utils.compareDates(date, new Date());
    let clazz = 'calendar-day' + (today ? ' today' : '');

    let calEvents = utils.events.reconcile(events
      .toList()
      .filter((event) => !utils.compareDates(event.get('start'), date))
      .filter((event) => !event.get('allDay')))
      .map(({event, left, size}, i) => (

        <CalEvent
          {...event.toJSON()}
          left={left}
          size={size}
          key={i}
          onClick={this.props.openModal}
        />

      ));

    return (
      <div className={clazz} onClick={this.onClick.bind(this)} ref="self">
        {calEvents}
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
