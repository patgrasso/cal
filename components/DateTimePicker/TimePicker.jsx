import React from 'react';
import moment from 'moment-timezone';
import utils from '../../utils';
import { clockRadius, clockX, clockY } from '../constants.json';

import './TimePicker.styl';

const MODES = {
  HOUR: 'hour',
  MINUTE: 'minute'
};

const MARKER_TOSTRING = {
  hour: (i) => i,
  minute: (i) => (''+(i*5 % 60)).length < 2 ? '0' + (i*5 % 60) : i*5 % 60
};

class TimePicker extends React.Component {

  constructor(props) {
    super(props);
    this._onMouseMove = this.onMouseMove.bind(this);
    this._onMouseUp = this.onMouseUp.bind(this);
    this.state = {
      date: moment(props.date),
      mode: MODES.HOUR,
      dragging: false,
      dragRelX: null,
      dragRelY: null
    };
  }

  setTime(position) {
    let { mode, date } = this.state;
    let period = date.hours() >= 12;

    position = position % 12;

    if (mode === MODES.HOUR) {
      this.setState({
        date: this.state.date.hours(position + period*12),
        mode: MODES.MINUTE
      });
    } else {
      this.setState({ date: this.state.date.minutes(position * 5) });
    }
  }

  setPeriod(afternoon) {
    let hours = this.state.date.hours();
    let period = hours >= 12;
    let diff = afternoon - period;
    this.setState({ date: this.state.date.hours(hours + diff * 12) });
  }

  onMouseDown(e) {
    let mode = this.state.mode;
    let hours = this.state.date.hours();
    let minutes = this.state.date.minutes();
    let handTheta = (mode === MODES.HOUR)
                  ? hours * (Math.PI / 6) - Math.PI / 2
                  : minutes * (Math.PI / 30) - Math.PI / 2;
    let dragRelX = e.clientX - Math.cos(handTheta) * clockRadius * 0.85;
    let dragRelY = e.clientY - Math.sin(handTheta) * clockRadius * 0.85;

    this.setState({ dragRelX, dragRelY, dragging: true });
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);
    document.body.classList.add('grabbing');
  }

  onMouseMove(e) {
    let { dragRelX, dragRelY, mode, date } = this.state;
    let newT = Math.atan2(e.clientY - dragRelY, e.clientX - dragRelX);
    let position = (newT + Math.PI / 2 + 2*Math.PI) % (2*Math.PI);
    let period = date.hours() >= 12;

    if (mode === MODES.HOUR) {
      this.setState({
        date: date.hours((Math.round(position * 6 / Math.PI) % 12) + period*12)
      });
    } else {
      this.setState({
        date: date.minutes((Math.round(position * 30 / Math.PI)) % 60)
      });
    }
  }

  onMouseUp(e) {
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
    document.body.classList.remove('grabbing');
    this.setState({
      dragRelX: null,
      dragRelX: null,
      dragging: false,
      mode: MODES.MINUTE
    });
  }

  render() {
    let { date, mode, dragging } = this.state;
    let hours = (date.hours() % 12) || 12;
    let minutes = '' + date.minutes();
    let period = date.hours() >= 12;
    let thetas = utils.range(1, 13).map((i) => i * (Math.PI / 6) - Math.PI / 2);

    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }

    let handTheta = (mode === MODES.HOUR)
                  ? hours * (Math.PI / 6) - Math.PI / 2
                  : minutes * (Math.PI / 30) - Math.PI / 2;

    return (
      <div className="dt-time-picker">
        <header>
          <time
            className={'hours' + (mode === MODES.HOUR ? ' active' : '')}
            onClick={() => this.setState({ mode: MODES.HOUR })}
          >{hours}</time>
          <time
            className={'minutes' + (mode === MODES.MINUTE ? ' active' : '')}
            onClick={() => this.setState({ mode: MODES.MINUTE })}
          >{':' + minutes}</time>
          <div className="period">
            <span
              className={!period ? 'active' : null}
              onClick={this.setPeriod.bind(this, 0)}
            >AM</span>
            <span
              className={period ? 'active' : null}
              onClick={this.setPeriod.bind(this, 1)}
            >PM</span>
          </div>
        </header>

        <svg className="clock">
          <circle className="clock-face" />
          <circle className="clock-center" />

          {thetas.map((t, i) => (
            <g key={i} className="marker">
              <circle
                cx={Math.cos(t) * clockRadius * 0.85 + clockX}
                cy={Math.sin(t) * clockRadius * 0.85 + clockY}
                onClick={this.setTime.bind(this, i+1)} />
              <text
                x={Math.cos(t) * clockRadius * 0.85 + clockX}
                y={Math.sin(t) * clockRadius * 0.85 + clockY + 5}
                onClick={this.setTime.bind(this, i+1)}
              >{MARKER_TOSTRING[mode](i + 1)}</text>
            </g>
          ))}

          <line className="hand" x1={clockX} y1={clockY}
            x2={Math.cos(handTheta) * clockRadius * 0.73 + clockX}
            y2={Math.sin(handTheta) * clockRadius * 0.73 + clockY} />
          <circle className={'hand-end' + (dragging ? ' active' : '')}
            cx={Math.cos(handTheta) * clockRadius * 0.85 + clockX}
            cy={Math.sin(handTheta) * clockRadius * 0.85 + clockY}
            onMouseDown={this.onMouseDown.bind(this)} />
        </svg>

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

export default TimePicker;
