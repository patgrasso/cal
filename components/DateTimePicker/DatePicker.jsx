import React from 'react';
import moment from 'moment-timezone';
import utils from '../../utils';

import './DatePicker.styl';

class DatePicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = { date: moment(props.date), focusDate: moment(props.date) };
  }

  onChangeDate({ month: newMonth, date: newDate, year: newYear }) {
    let { date } = this.state;
    date = date.month(newMonth).date(newDate).year(newYear);
    this.setState({ date, focusDate: moment(date) });
  }

  nextMonth() {
    this.setState({ focusDate: this.state.focusDate.add(1, 'month') });
  }

  prevMonth() {
    this.setState({ focusDate: this.state.focusDate.subtract(1, 'month') });
  }

  render() {
    let { date, focusDate } = this.state;
    let calDates = utils.makeCalendar(focusDate);
    let now = moment();

    console.log(date.toString(), focusDate.toString());

    return (
      <div className="dt-date-picker">
        <header>
          <time className="year">{date.year()}</time>
          <time className="date active">{date.format('ddd, MMM DD')}</time>
        </header>

        <content>
          <div className="mini-calendar-header">
            <button onClick={this.prevMonth.bind(this)}>
              <i className="fa fa-arrow-left"></i>
            </button>
            <span className="month-name">{focusDate.format('MMMM YYYY')}</span>
            <button onClick={this.nextMonth.bind(this)}>
              <i className="fa fa-arrow-right"></i>
            </button>
          </div>
          <table className="mini-calendar">
            <tbody>
              {calDates.map((week, i) => (
                <tr key={i}>
                  {week.map((day, j) => (
                    <td
                      key={j}
                      className={
                        (day.month !== focusDate.month() ? 'not-month' : '') +
                        (day.month === now.month() && day.date === now.date()
                          ? ' today' : '') +
                        (day.month === date.month() && day.date === date.date()
                          ? ' selected' : '')}
                      onClick={this.onChangeDate.bind(this, day)}
                    >{day.date}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </content>

        <footer>
          <button
            onClick={() => this.props.onCancel(this.state.date)}
          >Cancel</button>
          <button
            onClick={() => this.props.onSave(this.state.date)}
          >OK</button>
        </footer>
      </div>
    );
  }

}

export default DatePicker;
