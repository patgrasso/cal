import React from 'react';
import CalendarActions from '../stores/actions/CalendarActions';
import CalendarStore from '../stores/CalendarStore2';
import Sidebar from '../components/Sidebar/Sidebar';

import { Container } from 'flux/utils';

class SidebarContainer extends React.Component {

  static getStores() {
    return [CalendarStore];
  }

  static calculateState(prevState) {
    return {
      calendars: CalendarStore.getState().get('calendarList'),
      createCalendar: CalendarActions.create,
      removeCalendar: CalendarActions.remove,
      toggleCalendar: CalendarActions.toggleVisible,
    };
  }

  render() {
    return (
      <Sidebar {...this.state} />
    );
  }

}

export default Container.create(SidebarContainer);
