class EventEntity {
  /**
   * @param {Date} datetime - event date
   * @param {String} name - event name
   */
  constructor(datetime, name) {
    this.datetime = datetime;
    this.name = name;
  }
}

/**
 * @param {EventEntity} event1
 * @param {EventEntity} event2
 */
EventEntity.compareTo = (event1, event2) => {
  return (
    event1.datetime.getTime() - event2.datetime.getTime() ||
    event1.name.localeCompare(event2.name)
  );
}
