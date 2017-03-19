import React from 'react';

import './Checkbox.styl';

class Checkbox extends React.Component {

  onChanged(e) {
    this.props.onChanged(this.props.id);
  }

  render() {
    let {color, name, visible} = this.props;
    return (
      <li className="checkbox" onClick={this.onChanged.bind(this)}>
        <div
          className="checkbox-input"
          style={{backgroundColor: visible ? color : '',
                  borderColor: visible ? color : ''}}
        />
        <span>{name}</span>
      </li>
    );
  }

}

export default Checkbox;
