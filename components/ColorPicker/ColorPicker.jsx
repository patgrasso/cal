import React from 'react';

import './ColorPicker.styl';

class ColorPicker extends React.Component {

  render() {
    let { color, colors, onChange } = this.props;

    return (
      <div className="color-picker">
        {colors.map((c, i) => (
           <div
             className={'color-picker-swatch' + (c === color ? ' active' : '')}
             style={{backgroundColor: c}}
             onClick={() => onChange(c)}
             key={i}
           ></div>
         ))}
      </div>
    );
  }

}

export default ColorPicker;
