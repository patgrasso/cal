import React from 'react';
import CalendarList from './CalendarList';

class Sidebar extends React.Component {

  render() {
    return (
      <section className="sidebar-container">
        <CalendarList calendars={this.props.calendars} />
      </section>
    );
  }

}

export default Sidebar;
