import React from 'react';
import utils from '../../utils';

import './HourColumn.styl';

const hourNames = [].concat(
  '12am',
  utils.range(1, 12).map((i) => i + 'am'),
  '12pm',
  utils.range(1, 12).map((i) => i + 'pm'));

class HourColumn extends React.Component {

  render() {
    let hourCells = hourNames.map((hour, i) => (
      <div className="calendar-hour-cell" key={i}> {hour} </div>
    ));

    return (
      <div className="calendar-hour-column">
        {hourCells}
      </div>
    );
  }

}

export default HourColumn;
