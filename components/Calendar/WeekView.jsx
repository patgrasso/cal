import React from 'react';
import Day from './Day';
import HourColumn from './HourColumn';
import utils from '../../utils';

import './WeekView.styl';

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const getDateForDay = (i, focusDate) => {
  let date = new Date(focusDate);
  date.setDate(date.getDate() - date.getDay() + i);
  return date;
};

const filterEventsByDate = (events, date) => {
  return events.filter(({start}) => start.toDateString() === date.toDateString);
}

class WeekView extends React.Component {

  componentDidMount() {
    let {body} = this.refs;
    body.scrollTop = (body.scrollHeight - body.clientHeight) / 2;
  }

  render() {
    let {focusDate} = this.props;
    let dayColumns = utils.range(7).map((i) => (
      <Day
        date={getDateForDay(i, focusDate)}
        timeSinceToday={i - focusDate.getDay()}
        events={this.props.events}
        openModal={this.props.openModal}
        key={i}
      />
    ));
    let dayHeaders = dayNames.map((name, i) => {
      let date = getDateForDay(i, focusDate);
      return (
        <div className="calendar-day-header" key={i}>
          {name} {date.getMonth() + 1}/{date.getDate()}
        </div>
      );
    });

    // Make recurring events appear this week
    let {events} = this.props;
    events.forEach((event) => {
      if (event.recurrence === 'WEEKLY') {
        event.start = utils.sameDayForWeek(event.start, focusDate);
        event.end = utils.sameDayForWeek(event.end, focusDate);
      }
    });

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
