import React from 'react';

class DateTimePicker extends React.Component {

  onChangeTime(e) {
    let d = new Date(this.props.date);
    let [hours, minutes] = e.target.value.split(':');

    d.setHours(hours);
    d.setMinutes(minutes);
    this.props.onChange(d);
  }

  render() {
    let { date } = this.props;

    return (
      <div className="dt-picker">
        <div className="dt-picker-time">
          <input
            type="time"
            defaultValue={date.toTimeString().split(' ')[0]}
            onChange={this.onChangeTime.bind(this)}
          ></input>
        </div>
      </div>
    );
  }

}

export default DateTimePicker;
