import React from 'react';
import Checkbox from '../Checkbox';

import './CalendarList.styl';

class CalendarList extends React.Component {

  render() {
    let calendars = this.props.calendars.toList().toJSON().map((cal, i) => (
      <Checkbox
        color={cal.bgColor}
        visible={cal.visible}
        id={cal.id}
        onChange={this.props.toggleCalendar}
        key={i}
      >{cal.name}</Checkbox>
    ));

    return (
      <div className="sidebar-widget">
        <h2 className="sidebar-widget-name">Calendars</h2>
        <ul className="sidebar-widget calendar-list">
          {calendars.length > 0 ? calendars : 'You don\'t have any calendars!'}
        </ul>
      </div>
    );
  }

}

export default CalendarList
