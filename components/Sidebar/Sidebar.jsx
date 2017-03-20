import React from 'react';
import CalendarList from './CalendarList';
import GoogleAuth from './GoogleAuth';
import EventActions from '../../stores/actions/EventActions';
import utils from '../../utils';

import './Sidebar.styl';

class Sidebar extends React.Component {

  onFindTimeClick() {
    EventActions.setTimeFinder(parseFloat(this.refs.time.value));
  }

  render() {
    return (
      <section className="sidebar-container">
        <div className="sidebar-widget">
          <button onClick={this.onFindTimeClick.bind(this)}>Find Time</button>
          <input ref="time" type="number" />
          <span>hours</span>
        </div>
        <CalendarList {...this.props} />
        <GoogleAuth />
      </section>
    );
  }

}

export default Sidebar;
