import React from 'react';
import EventActions from '../../stores/actions/EventActions';
import TimeFinderActions from '../../stores/actions/TimeFinderActions';
import { hourCellHeight } from '../constants.json';
import utils from '../../utils';

import './TimeBlock.styl';

class TimeBlock extends React.Component {

  onClick(e) {
    let newId = utils.uuid();

    e.stopPropagation();

    EventActions.create({
      calendarId: this.props.primaryCal,
      id: newId,
      summary: this.props.summary,
      start: this.props.start,
      end: this.props.end,
      synced: { google: false },
      location: ''
    });
    EventActions.startEditing(newId);
    TimeFinderActions.close();
  }

  render() {
    let { start, end, summary } = this.props;
    let timeStart = utils.timeInHours(start);
    let timeEnd = utils.timeInHours(end);
    let pxFromTop = timeStart * hourCellHeight - 1;
    let pxHeight = (timeEnd - timeStart) * hourCellHeight - 4;

    pxHeight = Math.max(hourCellHeight / 2 - 4, pxHeight);

    return (
      <div
        className="time-block"
        style={{top: pxFromTop,
                height: pxHeight}}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onClick={this.onClick.bind(this)}
      >
        <strong>{utils.formatTime(start)} - {utils.formatTime(end)}</strong>
        <p className="summary">{summary}</p>
      </div>
    );
  }

}

export default TimeBlock;
