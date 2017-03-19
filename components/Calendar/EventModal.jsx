import React from 'react';
import utils from '../../utils';
import Select from 'react-select';
import DateTimePicker from '../DateTimePicker';

import EventActions from '../../stores/actions/EventActions';

import './EventModal.styl';
import 'style-loader!css-loader!react-select/dist/react-select.css';

class EventModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = { event: props.event };
  }

  componentDidMount() {
    this.refs.eventTitle.focus();
  }

  onClick(e) {
    e.stopPropagation();
  }

  onEventNameChange({target}) {
    let {event} = this.state;
    this.setState({event: event.set('summary', target.value)});
  }

  onEventStartChange(date) {
    let {event} = this.state;
    this.setState({event: event.set('start', date)});
  }

  onEventEndChange(date) {
    let {event} = this.state;
    this.setState({event: event.set('end', date)});
  }

  onEventLocationChange({target}) {
    let {event} = this.state;
    this.setState({event: event.set('location', target.value)});
  }

  onEventCalendarChange(e) {
    let {event} = this.state;
    let color = this.props.calendars.getIn([e.value, 'color']);
    this.setState({event: event.set('calendarId', e.value)
                               .set('color', color)});
  }

  onKeyPress(e) {
    switch (e.key) {
      case 'Enter':
        return this.save();

    }
  }

  save() {
    this.props.dismiss(this.state.event.toJSON());
  }

  cancel() {
    this.props.dismiss();
  }

  remove() {
    EventActions.remove(this.state.event.toJSON());
    this.props.dismiss();
  }

  render() {
    let {calendars} = this.props;
    let {event} = this.state;
    let {color, summary, start, end, location} = this.state.event.toJSON();
    let synced = this.state.event.get('synced');
    let calendarOptions = calendars.toList().map((cal) => ({
      value: cal.get('id'),
      label: cal.get('name')
    })).toJSON();

    return (
      <div className="event-modal" onClick={this.cancel.bind(this)}>
        <div
          className="event-modal-body"
          style={{backgroundColor: color}}
          onClick={this.onClick.bind(this)}
          onKeyDown={this.onKeyPress.bind(this)}
          ref="self"
        >
          <div className="event-detail">
            <input
              type="text"
              className="event-title"
              onChange={this.onEventNameChange.bind(this)}
              onKeyPress={this.onKeyPress.bind(this)}
              ref="eventTitle"
              value={summary}
            />
          </div>
          <div className="event-detail">
            <label>Start:</label>
            <DateTimePicker
              date={new Date(start)}
              onChange={this.onEventStartChange.bind(this)} />
          </div>
          <div className="event-detail">
            <label>End:</label>
            <DateTimePicker
              date={new Date(end)}
              onChange={this.onEventEndChange.bind(this)} />
          </div>
          <div className="event-detail">
            <label>Location:</label>
            <input
              type="text"
              className="event-location"
              onChange={this.onEventLocationChange.bind(this)}
              onKeyPress={this.onKeyPress.bind(this)}
              value={location}
            />
          </div>
          <div className="event-detail">
            <label>Calendar:</label>
            <Select
              value={event.get('calendarId')}
              options={calendarOptions}
              onChange={this.onEventCalendarChange.bind(this)}
            />
          </div>
          <div className="event-detail">
            <label>Synced:</label>
            {synced.map((_, provider, i) => <p key={i}>{provider}</p>)
                   .toList().toJSON()}
          </div>
          <div className="event-action-container">
            <button
              className="event-action save"
              onClick={this.save.bind(this)}
            >Save</button>
            <button
              className="event-action cancel"
              onClick={this.save.bind(this)}
            >Cancel</button>
            <button
              className="event-action cancel"
              onClick={this.remove.bind(this)}
            >Delete</button>
          </div>
        </div>
      </div>
    );
  }

}

export default EventModal;
