import React from 'react';
import utils from '../../utils';
import moment from 'moment-timezone';
import TimePicker from './TimePicker';
import DatePicker from './DatePicker';

import './DateTimePicker.styl';

const OPEN_MODE = {
  TIME: 'time',
  DATE: 'date',
  NONE: null
};

class DateTimePicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: OPEN_MODE.NONE };
  }

  openTimePicker() {
    this.setState({ open: OPEN_MODE.TIME });
  }

  openDatePicker() {
    this.setState({ open: OPEN_MODE.DATE });
  }

  closePicker() {
    this.setState({ open: OPEN_MODE.NONE });
  }

  onChangeDate(newDate) {
    this.props.onChange(newDate);
    this.setState({ open: OPEN_MODE.NONE });
  }

  render() {
    let { date } = this.props;
    let { open } = this.state;

    date = moment(date);

    return (
      <div className="dt-picker">
        <div className="dt-picker-date">
          <button onClick={this.openDatePicker.bind(this)}>
            <i className="fa fa-calendar"></i>
          </button>
          <span className="value" onClick={this.openDatePicker.bind(this)}>
            {date.format('MM/DD/YYYY')}
          </span>

          {open === OPEN_MODE.DATE ?
            <DatePicker
              date={date}
              onSave={this.onChangeDate.bind(this)}
              onCancel={this.closePicker.bind(this)} />
           : null}
        </div>

        <div className="dt-picker-time">
          <button onClick={this.openTimePicker.bind(this)}>
            <i className="fa fa-clock-o"></i>
          </button>
          <span className="value" onClick={this.openTimePicker.bind(this)}>
            {date.format('hh:mm a')}
          </span>

          {open === OPEN_MODE.TIME ?
            <TimePicker
              date={date}
              onSave={this.onChangeDate.bind(this)}
              onCancel={this.closePicker.bind(this)} />
           : null}
        </div>
      </div>
    );
  }

}

export default DateTimePicker;
