import React from 'react';

import './Modal.styl';

class Modal extends React.Component {

  onClick(e) {
    e.stopPropagation();
  }

  onKeyPress(e) {
    switch (e.key) {
      case 'Enter':
        return this.props.onConfirm && this.props.onConfirm();
    }
  }

  render() {
    let { fgColor, bgColor, className, width } = this.props;

    className = 'modal' + (className ? ' ' + className : '');

    return (
      <div className={className} onClick={this.props.onCancel}>
        <div
          className="modal-body"
          style={{backgroundColor: bgColor,
                  color: fgColor,
                  width}}
          onClick={this.onClick.bind(this)}
          onKeyDown={this.onKeyPress.bind(this)}
        >{this.props.children}</div>
      </div>
    );
  }

}

export default Modal;
