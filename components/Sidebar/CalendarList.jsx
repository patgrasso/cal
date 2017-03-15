import React from 'react';
import CalendarCheckbox from './CalendarCheckbox';

import './CalendarList.styl';

class CalendarList extends React.Component {

  render() {
    let calendars = this.props.calendars.map((cal, i) => (
      <CalendarCheckbox
        {...cal}
        onChanged={this.props.onToggleCalendar}
        key={i}
      />
    ));

    return (
      <div className="sidebar-widget">
        <p className="sidebar-widget-name">{this.props.name} Calendars</p>
        <ul className="sidebar-widget calendar-list">
          {calendars}
        </ul>
      </div>
    );
  }

}

export default CalendarList
