import React from 'react';
import { render } from 'react-dom';
import CalendarContainer from './CalendarContainer';
import SidebarContainer from './SidebarContainer';
import Header from '../components/Header/Header';

import './App.styl';

class App extends React.Component {

  render() {
    return (
      <main>
        <Header />
        <content>
          <SidebarContainer />
          <CalendarContainer />
        </content>
      </main>
    );
  }

}

render(<App/>, document.getElementById('app'));

let dragPosition = document.__dragMousePosition = {
  clientX: 0,
  clientY: 0
};

document.addEventListener('dragover', (e) => {
  dragPosition.clientX = e.clientX;
  dragPosition.clientY = e.clientY;
});
document.addEventListener('mousedown', (e) => {
  dragPosition.clientX = e.clientX;
  dragPosition.clientY = e.clientY;
});
