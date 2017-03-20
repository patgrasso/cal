import React from 'react';
import EventActions from '../../stores/actions/EventActions';
import { hourCellHeight } from './CalendarConstants';
import utils from '../../utils';

import './CalEvent.styl';

class CalEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { resizing: false, temporaryEnd: null };
  }

  calculateDateFromMousePosition(e) {
    let date = new Date(this.props.event.get('start'));
    let { getMousePosition }= this.props;
    let position = getMousePosition(e);
    let hour = position / hourCellHeight;

    return new Date(
      date.getFullYear(), date.getMonth(), date.getDate(),
      hour, (hour % 1) * 60);
  }

  onClick(e) {
    e.stopPropagation();
    EventActions.startEditing(this.props.event.get('id'));
  }

  onDragStart(e) {
    let startDate = this.calculateDateFromMousePosition(e);
    this.props.onDragStart(this.props.event, startDate);
  }

  onResizeStart(e) {
    //e.dataTransfer.setDragImage(document.querySelector('#blank'), 0, 0);
    e.stopPropagation();
  }

  onResize(e) {
    let tempEnd = this.calculateDateFromMousePosition(e);
    let minutes = tempEnd.getMinutes();

    tempEnd.setMinutes(Math.round(minutes / 30) * 30);
    this.setState({ temporaryEnd: tempEnd });
  }

  onResizeEnd(e) {
    let tempEnd = this.calculateDateFromMousePosition(e);
    let minutes = tempEnd.getMinutes();

    tempEnd.setMinutes(Math.round(minutes / 30) * 30);
    EventActions.update(
      this.props.event
          .set('end', tempEnd)
          .toJSON());
    this.setState({ temporaryEnd: null, resizing: false });
  }

  render() {
    let { start, end, summary, color, location } = this.props.event.toJSON();
    let { left, size } = this.props;
    let timeStart = utils.timeInHours(start);
    let timeEnd = utils.timeInHours(this.state.temporaryEnd || end);
    let pxFromTop = timeStart * hourCellHeight - 1;
    let pxHeight = (timeEnd - timeStart) * hourCellHeight - 4;
    let clazz = 'calendar-event' + (new Date(end) < Date.now() ? ' past' : '');
    let allSyncedUp = this.props.event.get('synced').every((synced) => synced);

    end = this.state.temporaryEnd || end;
    pxHeight = Math.max(hourCellHeight / 2 - 4, pxHeight);

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
        draggable="true"
        ref="self"
        onDragStart={this.onDragStart.bind(this)}
      >
        <strong>{utils.formatTime(start)} - {utils.formatTime(end)}</strong>
        <i className="synced fa fa-check" hidden={allSyncedUp ? false : true}></i>
        <i className="synced fa fa-refresh" hidden={allSyncedUp ? true : false}></i>
        <p className="summary">{summary}</p>
        <p className="location">{location}</p>
        <div
          draggable="true"
          className="resize-handle"
          onDragStart={this.onResizeStart.bind(this)}
          onDrag={this.onResize.bind(this)}
          onDragEnd={this.onResizeEnd.bind(this)}
        ></div>
      </div>
    );
  }

}

export default CalEvent;
