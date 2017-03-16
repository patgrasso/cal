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
    let calEvents = events
      .filter(({start}) => start.toDateString() === date.toDateString())
      .map((event, i) => <CalEvent {...event} key={i} />);
    let currentTimeMarker = (
      <div
        className="current-time-marker"
        style={{ top: hourCellHeight * this.state.time }}
      />
    );
    let className = 'calendar-day' + (this.props.today ? ' today' : '');

    return (
      <div className={className}>
        {calEvents}
        {this.props.today ? currentTimeMarker : null}
      </div>
    );
  }

}

export default Day;
