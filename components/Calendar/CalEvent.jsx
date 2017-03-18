import React from 'react';
import { hourCellHeight } from './CalendarConstants';
import utils from '../../utils';

import './CalEvent.styl';

class CalEvent extends React.Component {

  onClick(e) {
    e.stopPropagation();
    this.props.onClick(this.props.id);
  }

  render() {
    let {start, end, summary, color, size, left} = this.props;
    let timeStart = utils.timeInHours(start);
    let timeEnd = utils.timeInHours(end);
    let pxFromTop = timeStart * hourCellHeight - 1;
    let pxHeight = (timeEnd - timeStart) * hourCellHeight - 4;

    let clazz = 'calendar-event' + (new Date(end) < Date.now() ? ' past' : '');

    return (
      <div
        className={clazz}
        style={{backgroundColor: color,
                top: pxFromTop,
                height: pxHeight,
                left: (100 / size * (left - 1)) + '%',
                width: (100 / ((size - 1) || 1)) + '%',
                zIndex: left}}
        onClick={this.onClick.bind(this)}
      >
        <strong>{utils.formatTime(start)} - {utils.formatTime(end)}</strong>
        <p>{summary}</p>
      </div>
    );
  }

}

export default CalEvent;
