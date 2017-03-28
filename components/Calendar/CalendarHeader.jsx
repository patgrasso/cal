import React from 'react';
import ViewTypes from './CalendarViewTypes';
import TimeFinderActions from '../../stores/actions/TimeFinderActions';
import time from '../../utils/time';
import moment from 'moment-timezone';

import './CalendarHeader.styl';

const TF_STATES = {
  false: {
    action: TimeFinderActions.open,
    className: 'success',
    text: 'Find Time'
  },
  true: {
    action: TimeFinderActions.close,
    className: 'error',
    text: 'Cancel'
  }
};

class CalendarHeader extends React.Component {

  onChangeViewType(viewType) {
    this.props.onChangeViewType(viewType);
  }

  moveForward() {
    let { currentViewType: viewType,
          currentFocusDate: focusDate } = this.props;
    let newFocusDate = moment(focusDate).add(1, viewType.name);
    this.props.setFocusDate(newFocusDate);
  }

  moveBackward() {
    let { currentViewType: viewType,
          currentFocusDate: focusDate } = this.props;
    let newFocusDate = moment(focusDate).subtract(1, viewType.name);
    this.props.setFocusDate(newFocusDate);
  }

  render() {
    let { currentViewType: viewType } = this.props;
    let timeFinderState = TF_STATES[
      this.props.timeFinder.get('isSearching')] || TF_STATES[true];

    return (
      <header className="calendar-header">
        <div className="action-menu">
          <button
            className={timeFinderState.className}
            onClick={timeFinderState.action}
          >{timeFinderState.text}</button>
        </div>

        <div className="movement-buttons">
          <button
            className="move-backward"
            onClick={this.moveBackward.bind(this)}
          ><i className="fa fa-arrow-left"></i></button>
          <button
            className="move-forward"
            onClick={this.moveForward.bind(this)}
          ><i className="fa fa-arrow-right"></i></button>
        </div>

        <div className="view-type-list">
          <button
            className={viewType === ViewTypes.DAY ? 'active' : ''}
            onClick={this.onChangeViewType.bind(this, ViewTypes.DAY)}
          >Day</button>
          <button
            className={viewType === ViewTypes.WEEK ? 'active' : ''}
            onClick={this.onChangeViewType.bind(this, ViewTypes.WEEK)}
          >Week</button>
        </div>
      </header>
    );
  }

}

export default CalendarHeader;
