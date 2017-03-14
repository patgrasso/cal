import React from 'react';
import { hourCellHeight } from './CalendarConstants';

import './CalEvent.styl';

class CalEvent extends React.Component {

  render() {
    let {start, end} = this.props;
    let timeStart = start.getHours() + start.getMinutes() / 60;
    let timeEnd = end.getHours() + end.getMinutes() / 60;
    let pxFromTop = timeStart * hourCellHeight;
    let pxHeight = (timeEnd - timeStart) * hourCellHeight;

    return (
      <div
        className="calendar-event"
        style={{color: this.props.color,
                top: pxFromTop,
                height: pxHeight}}>
        something
      </div>
    );
  }

}

export default CalEvent;
