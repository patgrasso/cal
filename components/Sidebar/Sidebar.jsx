import React from 'react';
import CalendarList from './CalendarList';
import utils from '../../utils';

class Sidebar extends React.Component {

  render() {
    return (
      <section className="sidebar-container">
        <CalendarList
          calendars={this.props.calendars}
          onCreateCalendar={this.props.onCreateCalendar}
          onRemoveCalendar={this.props.onRemoveCalendar}
          onToggleCalendar={this.props.onToggleCalendar}
        />
      </section>
    );
  }

}

export default Sidebar;
