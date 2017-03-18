import DayView from './DayView';
import WeekView from './WeekView';

const CalendarViewTypes = {
  WEEK: {
    View: WeekView,
    delta: 7
  },
  DAY: {
    View: DayView,
    delta: 1
  }
};

export default CalendarViewTypes;
