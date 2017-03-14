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

const getDateForDay = (i) => {
  let date = new Date();
  date.setDate(date.getDate() - date.getDay() + i);
  return date;
};

const filterEventsByDate = (events, date) => {
  return events.filter(({start}) => start.toDateString() === date.toDateString);
}

class WeekView extends React.Component {

  render() {
    let now = new Date();
    let dayColumns = utils.range(7).map((i) => (
      <Day
        date={getDateForDay(i)}
        today={i === now.getDay()}
        events={this.props.events}
        key={i}
      />
    ));
    let dayHeaders = dayNames.map((name, i) => {
      let date = getDateForDay(i);
      return (
        <div className="calendar-day-header" key={i}>
          {name} {date.getMonth()}/{date.getDate()}
        </div>
      );
    });

    return (
      <div className="calendar-weekview">
        <header>{dayHeaders}</header>
        <div className="calendar-body">
          <HourColumn />
          {dayColumns}
        </div>
      </div>
    );
  }

}

export default WeekView;
