/**
 * The class for initializing an events block.
 */
class EventsBlock {
  /**
   * @param {HTMLElement} eventsBlock - element with .events-block class
   * @param {Date} date - date of events; can be initialized, if necessary, by other components
   */
  constructor(eventsBlock, date = null) {
    this.eventsBlock = eventsBlock;
    this.eventsBlock.date = date;
    this.elementFactory = new EventsBlockElementFactory();

    this.initEventsBlock();

    this.eventsBlock.addEventListener('init', (event) => {
      this.resetEventsBlock();
      this.initEventsBlock();
    });
    
    this.eventsBlock.addEventListener('click', (event) => {
      if (event.target.closest('.events-block__list-element-info-delete-btn')) {
        let btn = event.target.closest('.events-block__list-element-info-delete-btn');

        let parentModal = this.eventsBlock.closest('.modal');
        let callback = (modal) => {
          modal.addEventListener('click', function cb(event) {
            if (event.target.closest('.confirm-block__buttons-ok')) {
              btn.dispatchEvent(new CustomEvent('delete-element', { bubbles: true }));

              modal.removeEventListener('click', cb);
            } else if (event.target.closest('.confirm-block__buttons-cancel')) {
              modal.removeEventListener('click', cb);
            }
          });
        };

        let options = new Map([
          [ 'callback', callback ],
          [ 'zIndex', parentModal?.style.zIndex || null ],
        ]);
        Modal.showModal('confirm-modal', options);
      } else if (event.target.closest('.events-block__buttons-add')) {
        let callback = (modal) => {
          let inputs = modal.getElementsByClassName('add-event-block__form-field-input');
          for (let input of inputs) {
            if (input.name == 'event-date') {
              input.setAttribute('value', (this.eventsBlock.date).toLocaleDateString('fr-CH'));
              
              let eventDateField = input.closest('.add-event-block__form-field');
              eventDateField.classList.toggle('add-event-block__form-field_hidden', true);

              break;
            }
          }
        }

        let options = new Map([
          [ 'callback', callback ],
        ]);
        Modal.showModal('add-event-block-modal', options);
      } else if (event.target.closest('.events-block__buttons-prev')) {
        this.resetEventsBlock();

        this.toPrevDay();

        this.initEventsBlock();
      } else if (event.target.closest('.events-block__buttons-next')) {
        this.resetEventsBlock();

        this.toNextDay();

        this.initEventsBlock();
      }
    });

    let listElements = this.eventsBlock.getElementsByClassName('events-block__list-element');
    for (let listElement of listElements) {
      listElement.addEventListener('delete-element', (event) => {
        let [ hours, minutes ] = listElement.getAttribute('data-time').split(':');
        
        let date = new Date(this.eventsBlock.date);
        date.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0);
        
        let e = new EventEntity(date, listElement.getAttribute('data-name'));
        StorageService.removeEvent(e)
        
        listElement.remove();
      });
    }
  }

  initEventsBlock() {
    if (this.eventsBlock.date == null) return;

    let events = StorageService.getEventsByDate(this.eventsBlock.date);
    let listElements = [];
    for (let event of events) {
      let listElement = this.elementFactory.getEventsBlockListElement(
        event.name,
        event.datetime.toLocaleTimeString('fr-CH').substr(0, 5)
      );
      listElement.addEventListener('delete-element', (event) => {
        let [ hours, minutes ] = listElement.getAttribute('data-time').split(':');
        
        let datetime = new Date(this.eventsBlock.date);
        datetime.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0);
        
        let e = new EventEntity(datetime, listElement.getAttribute('data-name'));
        StorageService.removeEvent(e)
        
        listElement.remove();
      });
      listElements.push(listElement);
    }

    let lists = this.eventsBlock.getElementsByClassName('events-block__list');
    for (let list of lists) {
      list.append(...listElements);
    }
  }
  
  resetEventsBlock() {
    let elements = this.eventsBlock.getElementsByClassName('events-block__list-element');
    for (let i = elements.length - 1; i >= 0; i--) {
      elements[i].remove();
    }
  }

  toPrevDay() {
    this.eventsBlock.date.setDate(this.eventsBlock.date.getDate() - 1);
  }

  toNextDay() {
    this.eventsBlock.date.setDate(this.eventsBlock.date.getDate() + 1);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let eventsBlocks = document.getElementsByClassName('events-block');
  for (let eventsBlock of eventsBlocks) {
    new EventsBlock(eventsBlock);
  }
});
