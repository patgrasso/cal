import React from 'react';
import ViewTypes from './CalendarViewTypes';

class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = { viewType: ViewTypes.WEEK };
  }

  render() {
    let View = this.state.viewType;
    let colors = {};
    let visibleCals = this
      .props.calendars
      .filter((cal) => cal.visible)
      .map(({id, color}) => (colors[id] = color) && id);

    // Filter out events on hidden calendars
    let events = this
      .props.events
      .filter((event) => visibleCals.includes(event.calendarId))
      .map((event) => Object.assign(
        {}, { color: colors[event.calendarId] }, event));

    return (
      <section className="calendar-container">
        <View
          events={events}
          calendars={this.props.calendars}
          style={{'background-color': 'red'}}/>
      </section>
    );
  }

}

export default Calendar;
