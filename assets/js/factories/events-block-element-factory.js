class EventsBlockElementFactory {
  /**
   * @param {String} eventName - event name
   * @param {String} eventTime - the string that mutch to the HH:MM format
   */
  getEventsBlockListElement (eventName, eventTime) {
    let elementTime = document.createElement('div');
    elementTime.classList.add('events-block__list-element-time');
    elementTime.append(document.createTextNode(eventTime));

    let elementInfo = document.createElement('div');
    elementInfo.classList.add('events-block__list-element-info');

    let elementInfoEventName = document.createElement('div');
    elementInfoEventName.classList.add('events-block__list-element-info-event-name');
    elementInfoEventName.append(document.createTextNode(eventName));

    let elementInfoDeleteBtn = document.createElement('button');
    elementInfoDeleteBtn.classList.add('events-block__list-element-info-delete-btn');
    elementInfoDeleteBtn.innerHTML = '<span class="icon-cross"></span>';

    elementInfo.append(elementInfoEventName);
    elementInfo.append(elementInfoDeleteBtn);
    
    let element = document.createElement('div');
    element.classList.add('events-block__list-element');
    element.setAttribute('data-time', eventTime);
    element.setAttribute('data-name', eventName);
    element.append(elementTime);
    element.append(elementInfo);

    return element;
  }
}