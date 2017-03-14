import React from 'react';
import CalEvent from './CalEvent';
import { hourCellHeight } from './CalendarConstants';
import utils from '../../utils';

console.log(utils);

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
        60000
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

    return (
      <div className="calendar-day">
        {calEvents}
        {this.props.today ? currentTimeMarker : null}
      </div>
    );

  }

}

export default Day;
