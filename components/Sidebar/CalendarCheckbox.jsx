import React from 'react';

import './CalendarCheckbox.styl';

class CalendarCheckbox extends React.Component {

  onChanged(e) {
    this.props.onChanged(this.props.id);
  }

  render() {
    let {color, name, visible} = this.props;
    return (
      <li className="calendar-checkbox" onClick={this.onChanged.bind(this)}>
        <div
          className="checkbox"
          style={{backgroundColor: visible ? color : ''}}
        />
        <span>{name}</span>
      </li>
    );
  }

}

export default CalendarCheckbox;
