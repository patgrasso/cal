import React from 'react';
import Day from './Day';
import HourColumn from './HourColumn';
import moment from 'moment-timezone';
import utils from '../../utils';

import './WeekView.styl';

const filterEventsByDate = (events, date) => {
  return events.filter(({start}) => start.toDateString() === date.toDateString);
}

class WeekView extends React.Component {

  componentDidMount() {
    let {body} = this.refs;
    body.scrollTop = (body.scrollHeight - body.clientHeight) / 2;
  }

  getMousePosition(e) {
    let viewTop = this.refs.body.getBoundingClientRect().top;
    let scrollTop = this.refs.body.scrollTop;
    let clientY = (e.clientY === 0)
                ? document.__dragMousePosition.clientY
                : e.clientY;

    return clientY - viewTop + scrollTop;
  }

  render() {
    let { focusDate, primaryCal, events } = this.props;
    let dayHeaders = utils.range(7).map((i) => {
      let date = moment(focusDate).days(i);
      return (
        <div className="calendar-day-header" key={i}>
          {moment.weekdays(i)} {date.month() + 1}/{date.date()}
        </div>
      );
    });

    let dayColumns = utils.range(7).map((i) => (
      <Day
        date={moment(focusDate).days(i)}
        primaryCal={primaryCal}
        events={events}
        timeFinder={this.props.timeFinder}

        onDragStart={this.props.onDragStart}
        onDrop={this.props.onDrop}

        getMousePosition={this.getMousePosition.bind(this)}
        key={i}
      />
    ));


    return (
      <div className="calendar-weekview">
        <header>{dayHeaders}</header>
        <div ref="body" className="calendar-body">
          <HourColumn />
          {dayColumns}
        </div>
      </div>
    );
  }

}

export default WeekView;
