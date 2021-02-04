class EventService {}

/**
 * @param {EventEntity} event 
 */
EventService.saveEvent = (event) => {
  let events = EventService.getEventsByDate(event.datetime.toLocaleDateString('fr-CH'));
  events.push(event);
  events.sort(EventEntity.compareTo);
  
  localStorage.setItem(event.datetime.toLocaleDateString('fr-CH'), JSON.stringify(events));
}

/**
 * @param {EventEntity} removedEvent 
 */
EventService.removeEvent = (removedEvent) => {
  let events = EventService.getEventsByDate(removedEvent.datetime.toLocaleDateString('fr-CH'));
  let index = events.findIndex(event => EventEntity.compareTo(event, removedEvent) == 0);

  if (index == -1) return;
  
  events.splice(index, 1);
  localStorage.setItem(removedEvent.datetime.toLocaleDateString('fr-CH'), JSON.stringify(events));
}

/**
 * @param {String | Date} date - string that matches to the DD.MM.YYYY format or Date object
 * 
 * @returns {EventEntity[]}
 */
EventService.getEventsByDate = (date) => {
  let JSONListOfEvents = date instanceof Date
    ? localStorage.getItem(date.toLocaleDateString('fr-CH'))
    : localStorage.getItem(date)
    ;
  
  let reviver = (key, value) => {
    return key == 'datetime' ? new Date(value) : value;
  };

  return JSONListOfEvents ? JSON.parse(JSONListOfEvents, reviver) : [];
}