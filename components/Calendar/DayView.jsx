import React from 'react';
import Day from './Day';
import HourColumn from './HourColumn';
import utils from '../../utils';
import moment from 'moment-timezone';

import './WeekView.styl';

class DayView extends React.Component {

  componentDidMount() {
    let { body } = this.refs;
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
    let name = moment.weekdays(focusDate.days());

    return (
      <div className="calendar-dayview">
        <header>
          <div className="calendar-day-header">
            {name} {focusDate.month() + 1}/{focusDate.date()}
          </div>
        </header>
        <div ref="body" className="calendar-body">
          <HourColumn />
          <Day
            date={focusDate}
            primaryCal={primaryCal}
            events={events}
            timeFinder={this.props.timeFinder}

            onDragStart={this.props.onDragStart}
            onDrop={this.props.onDrop}

            getMousePosition={this.getMousePosition.bind(this)}
          />
        </div>
      </div>
    );
  }

}

export default DayView;
