let EBENTS_BLOCK_IS_OPEN = false;

class Router {
  render(path) {
    const partOfPath = path.split('/');
    
    // there is only one element of partOfPath: partOfPath[0] == 'calendar'
    if (partOfPath.length == 1) return;
    
    switch (partOfPath[1]) {
      case 'date': {
        this._renderEventsBlock(partOfPath[2]);
        break;
      }
    
      case 'add-event': {
        this._renderAddEventBlock(partOfPath[2]);
        break;
      }
    }
  }

  _renderEventsBlock(dateStr) {
    let date = new Date(Number.parseInt(dateStr));

    let callback = (modal) => {
      let eventsBlock = modal.querySelector('.events-block');
      eventsBlock.date = date;
      
      eventsBlock.dispatchEvent(new CustomEvent('init'));
    }

    let options = new Map([
      [ 'callback', callback ],
    ]);

    Modal.showModal('events-block-modal', options);
  }

  _renderAddEventBlock(dateStr) {
    if (dateStr) {
      let date = new Date(Number.parseInt(dateStr));

      let initializeForm = (modal) => {
        let input = modal.querySelector('.add-event-block__form-field-input[name="event-date"]');
        input.setAttribute('value', date.toLocaleDateString('fr-CH'));
            
        let eventDateField = input.closest('.add-event-block__form-field');
        eventDateField.classList.toggle('add-event-block__form-field_hidden', true);
      }

      Modal.showModal('add-event-block-modal', new Map([
        [ 'callback', initializeForm ],
      ]));
    } else {
      Modal.showModal('add-event-block-modal');
    }
  }
}