import React from 'react';
import CalendarList from './CalendarList';
import GoogleAuth from './GoogleAuth';
import utils from '../../utils';

import './Sidebar.styl';

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
        <GoogleAuth />
      </section>
    );
  }

}

export default Sidebar;
