import React from 'react';
import EventActions from '../../stores/actions/EventActions';
import utils from '../../utils';
import moment from 'moment-timezone';
import { hourCellHeight, maxEventWidth } from './CalendarConstants';

import './CalEvent.styl';


class CalEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { temporaryEnd: null };
  }

  calculateDateFromMousePosition(e) {
    let date = moment(this.props.event.get('start'));
    let { getMousePosition } = this.props;
    let position = getMousePosition(e);
    let hour = position / hourCellHeight;

    return moment(date).hours(hour).minutes((hour % 1) * 60)
                       .seconds(0).milliseconds(0);
  }

  onClick(e) {
    e.stopPropagation();
    EventActions.startEditing(this.props.event.get('id'));
  }

  onDragStart(e) {
    let startDate = this.calculateDateFromMousePosition(e);
    e.dataTransfer.setData('text', '');
    this.props.onDragStart(this.props.event, startDate);
  }

  onResizeStart(e) {
    e.stopPropagation();
    e.dataTransfer.setData('text', '');
    this.onResize(e);
  }

  onResize(e) {
    let tempEnd = this.calculateDateFromMousePosition(e);
    let minutes = tempEnd.minutes();

    tempEnd.minutes(Math.round(minutes / 30) * 30);
    this.setState({ temporaryEnd: tempEnd });
  }

  onResizeEnd(e) {
    let tempEnd = this.calculateDateFromMousePosition(e);
    let minutes = tempEnd.minutes();

    tempEnd.minutes(Math.round(minutes / 30) * 30);
    EventActions.update(
      this.props.event
          .set('end', tempEnd)
          .toJSON());
    this.setState({ temporaryEnd: null });
  }

  render() {
    let { event } = this.props;
    let { start, end, summary, location } = event.toJSON();
    let { defaultBgColor, defaultFgColor, bgColor, fgColor } = event.toJSON();
    let { left, size } = this.props;

    end = this.state.temporaryEnd || end;
    console.log(end, utils.timeInHours(end));

    let timeStart = utils.timeInHours(start);
    let timeEnd = utils.timeInHours(end);
    let pxFromTop = timeStart * hourCellHeight - 1;
    let pxHeight = (timeEnd - timeStart) * hourCellHeight - 4;
    let pxWidth = 100 / ((size - 0.7) || 1);
    let pxLeft = 100 / size * (left - 1);
    let clazz = 'calendar-event' + (moment(end) < moment.now() ? ' past' : '');
    let noDrag = this.props.noDrag;
    let allSyncedUp = false;

    bgColor = bgColor || defaultBgColor;
    fgColor = fgColor || defaultFgColor;

    if (this.props.event.has('synced')) {
      allSyncedUp = this.props.event.get('synced').every((synced) => synced);
    }

    pxHeight = Math.max(hourCellHeight / 2 - 4, pxHeight);
    if (pxWidth + pxLeft > maxEventWidth) {
      pxWidth = maxEventWidth - pxLeft;
    }

    let borderColor = (bgColor !== defaultBgColor) &&
                      utils.hexToRGB(defaultBgColor).concat(1);

    return (
      <div
        className={clazz}
        style={{backgroundColor: bgColor,
                color: fgColor,
                borderColor: borderColor && `rgba(${borderColor.join(',')})`,
                top: pxFromTop,
                height: pxHeight,
                left: pxLeft + '%',
                width: pxWidth + '%',
                zIndex: left}}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={noDrag ? null : (e) => e.stopPropagation()}
        onClick={this.onClick.bind(this)}
        draggable={!noDrag}
        ref="self"
        onDragStart={this.onDragStart.bind(this)}
      >
        <strong>{utils.formatTime(start)} - {utils.formatTime(end)}</strong>
        <i className="synced fa fa-check" hidden={allSyncedUp ? false : true}></i>
        <i className="synced fa fa-refresh" hidden={allSyncedUp ? true : false}></i>
        <p className="summary">{summary}</p>
        <p className="location">{location}</p>
        {noDrag ? '' :
         <div
           draggable="true"
           className="resize-handle"
           onDragStart={this.onResizeStart.bind(this)}
           onDrag={this.onResize.bind(this)}
           onDragEnd={this.onResizeEnd.bind(this)}
         ></div>}
      </div>
    );
  }

}

export default CalEvent;
