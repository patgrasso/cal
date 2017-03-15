import React from 'react';
import {Container} from 'flux/utils';
import {CalendarActions} from '../stores/Actions';
import CalendarStore from '../stores/CalendarStore';
import Sidebar from '../components/Sidebar/Sidebar';

class SidebarContainer extends React.Component {

  static getStores() {
    return [CalendarStore];
  }

  static calculateState(prevState) {
    return {
      calendars: CalendarStore.getState(),
      createCalendar: CalendarActions.create,
      removeCalendar: CalendarActions.remove,
      toggleCalendar: CalendarActions.toggle,
    };
  }

  render() {
    return (
      <Sidebar
        calendars={this.state.calendars}
        onCreateCalendar={this.state.createCalendar}
        onRemoveCalendar={this.state.removeCalendar}
        onToggleCalendar={this.state.toggleCalendar}
      />
    );
  }

}

export default Container.create(SidebarContainer);
