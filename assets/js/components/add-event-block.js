/**
 * The class for initializing an add event block.
 */
class AddEventBlock {
  /**
   * @param {HTMLElement} addEventBlock - element with .add-event-block class
   */
  constructor(addEventBlock) {
    this.addEventBlock = addEventBlock;

    this.addEventBlock.addEventListener('set-default', (event) => {
      this.setDefaultState();
    });

    this.addEventBlock.addEventListener('click', (event) => {
      if (event.target.closest('.add-event-block__form-buttons-ok')) {
        let fields = this.addEventBlock.getElementsByClassName('add-event-block__form-field');
        for (let field of fields) {
          field.classList.toggle('add-event-block__form-field_invalid', false);
        }
      }
      if (event.target.closest('.add-event-block__form-buttons-cancel')) {
        let form = event.target.closest('.add-event-block__form');
        
        // this will be found if the form is opened from .events-block
        let input = form.querySelector(`
          .add-event-block__form-field_hidden
          .add-event-block__form-field-input[name="event-date"]
        `);

        if (input) {
          let [ yearStr, monthStr, dayStr ] = this._changeDateFormat(input.value).split('-');
          let date = new Date(
            Number.parseInt(yearStr),
            Number.parseInt(monthStr) - 1,
            Number.parseInt(dayStr),
            0, 0, 0, 0
          );

          Modal.showModal('events-block-modal');

          history.pushState({ path: `calendar/date/${date.getTime()}` }, '');
        } else {
          history.pushState({ path: 'calendar' }, '');
        }
        
        form.reset();

        this.setDefaultState();
      }
    });

    let inputs = this.addEventBlock.getElementsByClassName('add-event-block__form-field-input');
    for (let input of inputs) {
      input.addEventListener('invalid', (event) => {
        event.preventDefault();

        let field = event.target.closest('.add-event-block__form-field');
        field.classList.toggle('add-event-block__form-field_invalid', true);
      });
    }
    
    this.addEventBlock.addEventListener('submit', (event) => {
      event.preventDefault();
      
      let form = event.target;

      let eventDateStr = form.elements['event-date'].value;
      let isCorrectDate = this._checkEventDateStr(eventDateStr);

      let eventTimeStr = form.elements['event-time'].value;
      let isCorrectTime = this._checkEventTimeStr(eventTimeStr);

      let eventName = form.elements['event-name'].value;

      if (isCorrectDate && isCorrectTime) {
        let [ yearStr, monthStr, dayStr ] = this._changeDateFormat(eventDateStr).split('-');
        let [ hoursStr, minutesStr ] = eventTimeStr.split(':');
        
        let eventDatetime = new Date();
        eventDatetime.setFullYear(Number.parseInt(yearStr));
        eventDatetime.setMonth(Number.parseInt(monthStr) - 1, Number.parseInt(dayStr));
        eventDatetime.setHours(Number.parseInt(hoursStr), Number.parseInt(minutesStr), 0, 0);

        EventService.saveEvent(new EventEntity(eventDatetime, eventName));

        let form = event.target.closest('.add-event-block__form');
        
        // this will be found if the form is opened from .events-block
        let input = form.querySelector(`
          .add-event-block__form-field_hidden
          .add-event-block__form-field-input[name="event-date"]
        `);

        if (input) {
          let date = new Date(eventDatetime);
          date.setHours(0, 0, 0, 0);

          let initializeEventsBlock = (modal) => {
            let eventsBlock = modal.querySelector('.events-block');
            eventsBlock.dispatchEvent(new CustomEvent('init'));
          }

          Modal.showModal('events-block-modal', new Map([
            [ 'callback', initializeEventsBlock ]
          ]));

          history.pushState({ path: `calendar/date/${date.getTime()}` }, '');
        } else {
          history.pushState({ path: 'calendar' }, '');
        }

        form.reset();

        this.setDefaultState();

        Modal.hideModal('add-event-block-modal');
      } else {
        if (isCorrectDate == false) {
          let input = event.target.querySelector('.add-event-block__form-field-input[name="event-date"]');
          let field = input.closest('.add-event-block__form-field');
          field.classList.toggle('add-event-block__form-field_invalid', true);
        }
        if (isCorrectTime == false) {
          let input = event.target.querySelector('.add-event-block__form-field-input[name="event-time"]');
          let field = input.closest('.add-event-block__form-field');
          field.classList.toggle('add-event-block__form-field_invalid', true);
        }
      }
    });

    let fieldInputs = this.addEventBlock.getElementsByClassName('add-event-block__form-field-input');
    for (let fieldInput of fieldInputs) {
      fieldInput.addEventListener('focus', (event) => {
        let field = event.target.closest('.add-event-block__form-field');
        field.classList.toggle('add-event-block__form-field_active', true);
      });

      fieldInput.addEventListener('blur', (event) => {
        if (event.target.value != '') return;

        let field = event.target.closest('.add-event-block__form-field_active');
        field.classList.toggle('add-event-block__form-field_active', false);
      });
    }
  }

  setDefaultState() {
    let fields = this.addEventBlock.getElementsByClassName('add-event-block__form-field');
    for (let field of fields) {
      field.classList.toggle('add-event-block__form-field_hidden', false);
      field.classList.toggle('add-event-block__form-field_active', false);
      field.classList.toggle('add-event-block__form-field_invalid', false);
    }
    
    let fieldInputs = this.addEventBlock.getElementsByClassName('add-event-block__form-field-input');
    for (let fieldInput of fieldInputs) {
      if (fieldInput.name == 'event-date') {
        fieldInput.setAttribute('value', '');
        break;
      }
    }
  }

  /**
   * The function change the DD.MM.YYYY format to the YYYY-MM-DD.
   * 
   * @param {string} dateStr - date in the DD.MM.YYYY format
   */
  _changeDateFormat(dateStr) {
    let parts = dateStr.split('.');
    return `${parts[2]}-${parts[1]}-${parts[0]}`; 
  }

  _checkEventDateStr(eventDateStr) {
    if (/^\d{1,2}.\d{1,2}.\d{1,4}$/.test(eventDateStr)) {
      let [ dayStr, monthStr, yearStr ] = eventDateStr.split('.');

      let year = Number.parseInt(yearStr);
      let month = Number.parseInt(monthStr);
      let day = Number.parseInt(dayStr);

      let date = new Date();
      date.setFullYear(year);
      date.setMonth(month - 1);
      date.setDate(day);

      return date.getFullYear() == year && date.getMonth() == month - 1 && date.getDate() == day;
    }
    return false;
  }

  _checkEventTimeStr(eventTimeStr) {
    if (/^[0-2]\d:[0-5]\d$/.test(eventTimeStr)) {
      let [ hours ] = eventTimeStr.split(':');
      return Number.parseInt(hours) < 24;
    }
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AddEventBlock(document.querySelector('.add-event-block'));

  let addEventBlockModal = document.getElementById('add-event-block-modal');
  addEventBlockModal.addEventListener('hide-modal', (event) => {
    let addEventBlock = addEventBlockModal.querySelector('.add-event-block');
    addEventBlock.dispatchEvent(new CustomEvent('set-default'));
  });
});
