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

  getMousePosition(e) {
    let viewTop = this.refs.body.getBoundingClientRect().top;
    let scrollTop = this.refs.body.scrollTop;
    return e.pageY - viewTop + scrollTop;
  }

  render() {
    let {focusDate, events, primaryCal} = this.props;
    let dayHeaders = dayNames.map((name, i) => {
      let date = getDateForDay(i, focusDate);
      return (
        <div className="calendar-day-header" key={i}>
          {name} {date.getMonth() + 1}/{date.getDate()}
        </div>
      );
    });

    // Make recurring events appear this week
    events = events.map(
      (event) => event.get('recurrence') === 'WEEKLY'
             ? event.update('start', (s) => utils.sameDayForWeek(s, focusDate))
                    .update('end', (e) => utils.sameDayForWeek(e, focusDate))
             : event);

    let dayColumns = utils.range(7).map((i) => (
      <Day
        date={getDateForDay(i, focusDate)}
        primaryCal={primaryCal}
        events={events}

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
