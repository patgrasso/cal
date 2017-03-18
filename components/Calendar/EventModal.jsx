import React from 'react';
import utils from '../../utils';
import Select from 'react-select';
import {EventActions} from '../../stores/Actions';

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
    if (e.key === 'Enter') {
      this.save();
    }
  }

  save() {
    EventActions.update(this.state.event.toJSON());
    this.props.dismiss();
  }

  remove() {
    EventActions.remove(this.state.event.get('id'));
    this.props.dismiss();
  }

  render() {
    let {calendars} = this.props;
    let {event} = this.state;
    let {color, summary, start, end, location} = this.state.event.toJSON();
    let calendarOptions = calendars.toList().map((cal) => ({
      value: cal.get('id'),
      label: cal.get('name')
    })).toJSON();

    return (
      <div className="event-modal" onClick={this.props.dismiss}>
        <div
          tabIndex="0"
          className="event-modal-body"
          style={{backgroundColor: color}}
          onClick={this.onClick.bind(this)}
          onKeyPress={this.onKeyPress.bind(this)}
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
            <span>{start.toLocaleString()}</span>
          </div>
          <div className="event-detail">
            <label>End:</label>
            <span>{end}</span>
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
