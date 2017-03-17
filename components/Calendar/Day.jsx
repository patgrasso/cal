import React from 'react';
import CalEvent from './CalEvent';
import { hourCellHeight } from './CalendarConstants';
import utils from '../../utils';

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

  render() {
    let {events, date} = this.props;
    let clazz = 'calendar-day' + (!this.props.timeSinceToday ? ' today' : '');

    let evs = utils.events.reconcile(events
      .filter(({start}) => start.toDateString() === date.toDateString())
      .filter(({allDay}) => !allDay));

    let calEvents = utils.events.reconcile(events
      .filter(({start}) => start.toDateString() === date.toDateString())
      .filter(({allDay}) => !allDay))
      .map(({event, left, size}, i) => (

        <CalEvent
          {...event}
          left={left}
          size={size}
          key={i}
          onClick={this.props.openModal}
        />

      ));

    return (
      <div className={clazz}>
        {calEvents}
        {this.props.timeSinceToday ? '' :
          <div
            className="current-time-marker"
            style={{ top: hourCellHeight * this.state.time }}
          ></div>
        }
      </div>
    );
  }

}

export default Day;
