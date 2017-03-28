import DayView from './DayView';
import WeekView from './WeekView';

const CalendarViewTypes = {
  WEEK: {
    View: WeekView,
    name: 'week'
  },
  DAY: {
    View: DayView,
    name: 'day'
  }
};

export default CalendarViewTypes;
