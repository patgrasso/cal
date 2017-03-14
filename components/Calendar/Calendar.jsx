import React from 'react';
import ViewTypes from './CalendarViewTypes';

class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      viewType: ViewTypes.WEEK,
      events: [{ start: new Date( 2017, 2, 14, 17 ),
                 end:   new Date( 2017, 2, 14, 18, 30 )  }]
    };
  }

  render() {
    let View = this.state.viewType;

    return (
      <section className="calendar-container">
        <View events={this.state.events} style={{'background-color': 'red'}}/>
      </section>
    );
  }

}

export default Calendar;
