/*global gapi*/

import React from 'react';
import {CalendarActions, EventActions} from '../../stores/Actions';
import {getCalendarList, getEvents} from '../../utils/google-api';

const googleConfig = require('../../client_id.json');
const scopes = 'https://www.googleapis.com/auth/calendar.readonly';
const discoveryDocs = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
];

class GoogleAuth extends React.Component {

  constructor(props) {
    super(props);
    window.onGoogleAuthLoad = () => {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          discoveryDocs: discoveryDocs,
          clientId: googleConfig.web.client_id,
          scope: scopes
        }).then(() => {
          gapi.auth2.getAuthInstance().isSignedIn
              .listen(this.updateSigninStatus.bind(this));
          this.updateSigninStatus(
            gapi.auth2.getAuthInstance().isSignedIn.get());
          this.updateCalendar();
        });
      });
    }
    this.state = { isSignedIn: false };
  }

  handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
  }

  handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
  }

  updateSigninStatus(isSignedIn) {
    this.setState({ isSignedIn });
    if (!isSignedIn) {
      EventActions.wipe();
      CalendarActions.wipe();
    } else {
      this.updateCalendar();
    }
  }

  updateCalendar() {
    getCalendarList().then((cals) => {
      CalendarActions.update(cals);
      cals.forEach(({id}) => getEvents(id).then(EventActions.updateAll));
    });
  }

  render() {
    return (
      <div className="google-auth sidebar-widget">
        <h2 className="sidebar-widget-name">Google</h2>
        <button
          id="google-authorize"
          className="success"
          onClick={this.handleAuthClick}
          disabled={this.state.isSignedIn}
        >Sign In</button>
        <button
          id="google-signout"
          className="error"
          onClick={this.handleSignoutClick}
          disabled={!this.state.isSignedIn}
        >Sign Out</button>
      </div>
    );
  }

}

export default GoogleAuth;
