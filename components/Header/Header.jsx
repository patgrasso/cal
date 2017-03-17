import React from 'react';

import './Header.styl';

class Header extends React.Component {

  render() {
    return (
      <header className="header">
        <i className="fa fa-calendar-check-o" aria-hidden="true"></i>
        <a className="header-app-name">Cal</a>
      </header>
    );
  }

}

export default Header;
