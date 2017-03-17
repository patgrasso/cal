import React from 'react';
import utils from '../../utils';
import {EventActions} from '../../stores/Actions';

import './EventModal.styl';

class EventModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = props;
  }

  componentDidMount() {
    this.refs.self.focus();
  }

  onClick(e) {
    e.stopPropagation();
  }

  onEventNameChange({target}) {
    let event = this.props.event;
    EventActions.update(Object.assign(
      {}, event, { title: target.value }));
  }

  onEventLocationChange({target}) {
    let event = this.props.event;
    EventActions.update(Object.assign(
      {}, event, { location: target.location }));
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.dismiss();
    }
  }

  render() {
    let {color, title, start, end, location} = this.props.event;
    return (
      <div
        tabIndex="0"
        className="event-modal"
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
            value={title}
          />
        </div>
        <div className="event-detail">
          <label>Start:</label>
          <span>{start.toLocaleString()}</span>
        </div>
        <div className="event-detail">
          <label>End:</label>
          <span>{end.toLocaleString()}</span>
        </div>
        <div className="event-detail">
          <label>Location:</label>
          <input
            type="text"
            className="event-location"
            onChange={this.onEventLocationChange.bind(this)}
            value={location}
          />
        </div>
      </div>
    );
  }

}

export default EventModal;
