import React from 'react';
import ViewTypes from './CalendarViewTypes';

import './CalendarHeader.styl';

class CalendarHeader extends React.Component {

  onChangeViewType(viewType) {
    this.props.onChangeViewType(viewType);
  }

  render() {
    return (
      <header className="calendar-header">
        <button
          className="move-backward"
          onClick={this.props.moveBackward}
        ><i className="fa fa-arrow-left"></i></button>
        <button
          className="move-forward"
          onClick={this.props.moveForward}
        ><i className="fa fa-arrow-right"></i></button>

        <div className="view-type-list">
          <button
            className="move-forward"
            onClick={this.onChangeViewType.bind(this, ViewTypes.DAY)}
          >Day</button>
          <button
            className="move-forward"
            onClick={this.onChangeViewType.bind(this, ViewTypes.WEEK)}
          >Week</button>
          <button
            className="move-forward"
            onClick={this.onChangeViewType.bind(this, ViewTypes.MONTH)}
          >Month</button>
        </div>
      </header>
    );
  }

}

export default CalendarHeader;
