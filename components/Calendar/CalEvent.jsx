import React from 'react';
import { hourCellHeight } from './CalendarConstants';
import utils from '../../utils';

import './CalEvent.styl';

class CalEvent extends React.Component {

  render() {
    let {start, end, title, color} = this.props;
    let timeStart = start.getHours() + start.getMinutes() / 60;
    let timeEnd = end.getHours() + end.getMinutes() / 60;
    let pxFromTop = timeStart * hourCellHeight - 1;
    let pxHeight = (timeEnd - timeStart) * hourCellHeight - 4;

    console.log(title, utils.formatTime(start), start);
    return (
      <div
        className="calendar-event"
        style={{backgroundColor: color,
                top: pxFromTop,
                height: pxHeight}}>
        <strong>
          {utils.formatTime(start)}
          -
          {utils.formatTime(end)}
        </strong>
        <p>{title}</p>
      </div>
    );
  }

}

export default CalEvent;
