import React from 'react';
import { render } from 'react-dom';
import Calendar from '../components/Calendar/Calendar';
import Sidebar from '../components/Sidebar/Sidebar';

import './App.styl';

class App extends React.Component {

  render() {
    return (
      <main>
        <content>
          <Sidebar />
          <Calendar />
        </content>
      </main>
    );
  }

}

render(<App/>, document.getElementById('app'));
