class CalendarElementFactory {
  getBodyWeekDayElement(day = '', isCurrentDay = false) {
    let div = document.createElement('div');
    div.classList.add('calendar__body-week-day');

    isCurrentDay && div.classList.add('calendar__body-week-day_current');

    div.innerHTML = day;

    return div;
  }
  
  getBodyWeekElement() {
    let div = document.createElement('div');
    div.classList.add('calendar__body-week');

    return div;
  }

  getBodyWeekElementsForSelectedMonth(month, year) {
    let day = new Date(year, month);
    let calendarBodyWeeks = [];

    this._createEmptyBodyWeekDayElementsForLastMonth(day, calendarBodyWeeks);

    this._createBodyWeekDayElementsForCurrentMonth(day, month, calendarBodyWeeks);
    
    this._createEmptyBodyWeekDayElementsForNextMonth(day, calendarBodyWeeks);
  
    return calendarBodyWeeks;
  }

  _createEmptyBodyWeekDayElementsForLastMonth(day, calendarBodyWeeks) {
    calendarBodyWeeks.push(this.getBodyWeekElement());
    for (let i = 0; i < this._getDay(day); i++) {
      calendarBodyWeeks[0].append(this.getBodyWeekDayElement());
    }
  }

  _createBodyWeekDayElementsForCurrentMonth(firstDayOfMonth, month, calendarBodyWeeks) {
    let day = firstDayOfMonth;
    while (day.getMonth() == month) {
      if (this._isEqual(day, new Date())) {
        calendarBodyWeeks[calendarBodyWeeks.length - 1].append(
          this.getBodyWeekDayElement(day.getDate(), true)
        );
      } else {
        calendarBodyWeeks[calendarBodyWeeks.length - 1].append(
          this.getBodyWeekDayElement(day.getDate())
        );
      }
  
      if (this._getDay(day) % 7 == 6) {
        calendarBodyWeeks.push(this.getBodyWeekElement());
      }
  
      day.setDate(day.getDate() + 1);
    }
  }

  _createEmptyBodyWeekDayElementsForNextMonth(day, calendarBodyWeeks) {
    if (this._getDay(day) != 0) {
      for (let i = this._getDay(day); i < 7; i++) {
        calendarBodyWeeks[calendarBodyWeeks.length - 1].append(
          this.getBodyWeekDayElement()
        );
      }
    } else {
      calendarBodyWeeks.pop();
    }
  }

  /**
   * Function changes weekday numbers to the date.getDay() function:
   * - Monday = 0
   * - Tuesday = 1
   * - Wednesday = 2
   * - Thursday = 3
   * - Friday = 4
   * - Saturday = 5
   * - Sunday = 6
   * 
   * @param {Date} date - date to get a weekday number
   */
  _getDay(date) {
    let day = date.getDay();
    if (day == 0) day = 7;
    return day - 1;
  }

  _isEqual(date1, date2) {
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    );
  }
}