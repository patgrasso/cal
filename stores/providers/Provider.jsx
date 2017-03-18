
class Provider {

  getCalendarList() {
    throw new Error('Not implemented');
  }

  getEvents(calendarId, timeMin, timeMax) {
    throw new Error('Not implemented');
  }

  createEvent(details) {
    throw new Error('Not implemented');
  }

}

export default Provider;