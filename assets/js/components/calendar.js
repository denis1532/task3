const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const calendarTypeByWeeksAmountMap = new Map([
  [ 4 , 'calendar__body_four-weaks' ],
  [ 5 , 'calendar__body_five-weaks' ],
  [ 6 , 'calendar__body_six-weaks' ],
]);

/**
 * The class for initializing a calendar. Here the body of the calendar is initialized and
 * new events are added to handle clicks.
 */
class Calendar {
  /**
   * @param {HTMLElement} calendar - element with .calendar class
   */
  constructor(calendar) {
    this.calendar = calendar;
    this.elementFactory = new CalendarElementFactory();

    // default selected month is current month
    this.firstDayOfSelectedMonth = new Date();
    this.firstDayOfSelectedMonth.setDate(1);
    this.firstDayOfSelectedMonth.setHours(0, 0, 0, 0);

    this.initCalendar();

    this.calendar.addEventListener('click', (event) => {
      if (event.target.closest('.calendar__head-month-selection-prev')) {
        this.resetCalendar();

        this.toPrevMonth();

        this.initCalendar();
      } else if (event.target.closest('.calendar__head-month-selection-next')) {
        this.resetCalendar();

        this.toNextMonth();

        this.initCalendar();
      } else if (event.target.closest('.calendar__body-week-day')) {
        let day = event.target.closest('.calendar__body-week-day');
        if (day.textContent != '') {
          let callback = (modal) => {
            let eventsBlocks = modal.getElementsByClassName('events-block');
            for (let eventsBlock of eventsBlocks) {
              eventsBlock.date = new Date(this.firstDayOfSelectedMonth);
              eventsBlock.date.setDate(Number.parseInt(day.textContent));
              
              eventsBlock.dispatchEvent(new CustomEvent('init'));
            }
          }
          let options = new Map([
            [ 'callback', callback ],
          ]);
          Modal.showModal('events-block-modal', options);
        }
      } else if (event.target.closest('.calendar__foot-add-btn')) {
        Modal.showModal('add-event-block-modal');
      }
    });
  }

  initCalendar() {
    let selectedMonthElements = this.calendar.getElementsByClassName('calendar__head-month-selection-selected');
    for (let selectedMonthElement of selectedMonthElements) {
      selectedMonthElement.innerHTML =
        `${MONTH_NAMES[this.firstDayOfSelectedMonth.getMonth()]} ${this.firstDayOfSelectedMonth.getFullYear()}`;
    }

    let bodyElements = this.calendar.getElementsByClassName('calendar__body');
    for (let i = 0; i < bodyElements.length; i++) {
      let weeks = this.elementFactory.getBodyWeekElementsForSelectedMonth(
        this.firstDayOfSelectedMonth.getMonth(),
        this.firstDayOfSelectedMonth.getFullYear()
      );
      bodyElements[i].classList.add(calendarTypeByWeeksAmountMap.get(weeks.length));
      bodyElements[i].append(...weeks);
    }
  }
  
  resetCalendar() {
    let selectedMonthElements = this.calendar.getElementsByClassName('calendar__head-month-selection-selected');
    for (let i = 0; i < selectedMonthElements.length; i++) {
      selectedMonthElements[i].innerHTML = '';
    }
  
    let bodyElements = this.calendar.getElementsByClassName('calendar__body');
    for (let i = 0; i < bodyElements.length; i++) {
      bodyElements[i].className = 'calendar__body';
    }
  
    let weeks = this.calendar.getElementsByClassName('calendar__body-week');
    for (let i = weeks.length - 1; i >= 0; i--) {
      weeks[i].remove();
    }
  }

  toPrevMonth() {
    this.firstDayOfSelectedMonth.setMonth(this.firstDayOfSelectedMonth.getMonth() - 1);
  }

  toNextMonth() {
    this.firstDayOfSelectedMonth.setMonth(this.firstDayOfSelectedMonth.getMonth() + 1);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let calendars = document.getElementsByClassName('calendar');
  for (let calendar of calendars) {
    new Calendar(calendar);
  }
});
