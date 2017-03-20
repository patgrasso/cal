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

class DayView extends React.Component {

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
    let {focusDate, primaryCal} = this.props;
    let name = dayNames[focusDate.getDay()];
    let {events} = this.props;

    return (
      <div className="calendar-dayview">
        <header>
          <div className="calendar-day-header">
            {name} {focusDate.getMonth() + 1}/{focusDate.getDate()}
          </div>
        </header>
        <div ref="body" className="calendar-body">
          <HourColumn />
          <Day
            date={focusDate}
            primaryCal={primaryCal}

            onDragStart={this.props.onDragStart}
            onDrop={this.props.onDrop}

            events={events}
            openModal={this.props.openModal}
            getMousePosition={this.getMousePosition.bind(this)}
          />
        </div>
      </div>
    );
  }

}

export default DayView;
