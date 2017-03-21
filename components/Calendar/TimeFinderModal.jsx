import React from 'react';
import Modal from '../Modal';
import TimeFinderActions from '../../stores/actions/TimeFinderActions';
import Select from 'react-select';
import moment from 'moment-timezone';
import { Map, List } from 'immutable';

import './TimeFinderModal.styl';

class TimeFinderModal extends React.Component {

  constructor(props) {
    super(props);
    let { hours, minutes, timeMin, timeMax, summary } = props;

    this.state = { timeMin, timeMax, summary };
    this.state.hours = Math.floor(hours);
    this.state.minutes = (hours % 1) * 60;
  }

  componentDidMount() {
    this.refs.summary.focus();
  }

  onChangeSummary(e) {
    this.setState({ summary: e.target.value });
  }

  onChangeHours(e) {
    this.setState({ hours: parseInt(e.target.value) || 0 });
  }

  onChangeMinutes(e) {
    this.setState({ minutes: Math.min(parseInt(e.target.value), 60) || 0 });
  }

  onChangeTimeMin(e) {
    this.setState({ timeMin: e.target.value });
  }

  onChangeTimeMax(e) {
    this.setState({ timeMax: e.target.value });
  }

  search() {
    let { hours, minutes, timeMin, timeMax, summary } = this.state;
    let duration = hours + minutes / 60;

    timeMin = timeMin || moment().toISOString();
    TimeFinderActions.search(duration, timeMin, timeMax, summary);
  }

  render() {
    let { cache } = this.props;

    cache = cache || List();

    return (
      <Modal
        color="#f5f5f5"
        className="time-finder-modal"
        onConfirm={this.search.bind(this)}
        width="20%"
        height="20%"
      >
        <h2>Find time for...</h2>

        <div className="tf-detail">
          <label>Name</label>
          <input
            ref="summary"
            type="text"
            value={this.state.summary}
            onChange={this.onChangeSummary.bind(this)} />
        </div>
        <div className="tf-detail">
          <label>Duration</label>
          <input
            className="time-input"
            type="text"
            value={this.state.hours}
            onChange={this.onChangeHours.bind(this)} />
          :
          <input
            className="time-input"
            type="text"
            value={this.state.minutes}
            onChange={this.onChangeMinutes.bind(this)} />
        </div>

        <div className="modal-actions">
          <button
            className="modal-action search"
            onClick={this.search.bind(this)}
          >Search</button>
          <button
            className="modal-action cancel"
            onClick={TimeFinderActions.close}
          >Cancel</button>
        </div>
      </Modal>
    );
  }

}

export default TimeFinderModal;
