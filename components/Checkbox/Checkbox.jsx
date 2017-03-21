import React from 'react';

import './Checkbox.styl';

class Checkbox extends React.Component {

  onChange(e) {
    this.props.onChange(this.props.id || this.props.text, !this.props.visible);
  }

  render() {
    let { color, visible } = this.props;
    return (
      <li className="checkbox" onClick={this.onChange.bind(this)}>
        <div
          className="checkbox-input"
          style={{backgroundColor: visible ? color : '',
                  borderColor: visible ? color : ''}}
        />
        <span>{this.props.children}</span>
      </li>
    );
  }

}

export default Checkbox;
