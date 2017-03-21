import React from 'react';
import utils from '../../utils';
import Select from 'react-select';
import DateTimePicker from '../DateTimePicker';
import Checkbox from '../Checkbox';
import providers from '../../stores/providers';
import Modal from '../Modal';
import { fromJS } from 'immutable';

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

  onEventSummaryChange({target}) {
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

  onEventSyncedChanged(provider, checked) {
    let {event} = this.state;
    if (checked) {
      this.setState({event: event.setIn(['synced', provider], true)});
    } else {
      this.setState({event: event.deleteIn(['synced', provider])});
    }
  }

  save() {
    let {event} = this.state;
    this.props.dismiss(event.update('synced', (synced) =>
      synced.map(() => false)).toJSON());
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
    let synced = this.state.event.get('synced').map(() => true);
    let numSynced = synced.size;
    let unsynced = fromJS(providers).map(() => false);
    let calendarOptions = calendars.toList().map((cal) => ({
      value: cal.get('id'),
      label: cal.get('name')
    })).toJSON();

    synced = unsynced.merge(synced);

    return (
      <Modal
        color={color}
        className="event-modal"
        onConfirm={this.save.bind(this)}
        onCancel={this.cancel.bind(this)}
      >
        <div className="event-detail">
          <input
            type="text"
            className="event-title"
            onChange={this.onEventSummaryChange.bind(this)}
            ref="eventTitle"
            value={summary}
          />
        </div>

        <div className="event-detail">
          <label>Start</label>
          <DateTimePicker
            date={new Date(start)}
            onChange={this.onEventStartChange.bind(this)} />
        </div>

        <div className="event-detail">
          <label>End</label>
          <DateTimePicker
            date={new Date(end)}
            onChange={this.onEventEndChange.bind(this)} />
        </div>

        <div className="event-detail">
          <label>Location</label>
          <input
            type="text"
            className="event-location"
            onChange={this.onEventLocationChange.bind(this)}
            value={location}
          />
        </div>

        <div className="event-detail">
          <label>Calendar</label>
          <Select
            value={event.get('calendarId')}
            options={calendarOptions}
            onChange={this.onEventCalendarChange.bind(this)}
          />
        </div>

        <div className="event-detail">
          <label>Synced</label>
          <ul>
            {synced.map((visible, provider) => (
              <Checkbox
                key={provider}
                color="#2196f3"
                name={provider}
                onChange={this.onEventSyncedChanged.bind(this)}
                visible={visible}
              />
              )).toList().toJSON()}
          </ul>
        </div>

        <div className="event-detail">
          <label>Description:</label>
          <textarea rows="3" onKeyDown={(e) => e.stopPropagation()}></textarea>
        </div>

        <div className="modal-actions">
          <button
            className="modal-action save"
            onClick={this.save.bind(this)}
          >Save</button>
          <button
            className="modal-action cancel"
            onClick={this.cancel.bind(this)}
          >Cancel</button>
          <button
            className="modal-action cancel"
            onClick={this.remove.bind(this)}
          >Delete</button>
        </div>
      </Modal>
    );
  }

}

export default EventModal;
