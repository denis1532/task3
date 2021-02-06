/**
 * The class for initializing a calendar section.
 */
class CalendarSection {
  /**
   * @param {HTMLElement} calendarSection - element with .calendar-section class
   */
  constructor(calendarSection) {
    this.calendarSection = calendarSection;

    let config = ConfigService.getConfig();

    let themeSelect = this.calendarSection.querySelector('.calendar-section__theme-select');

    let option = themeSelect.querySelector(`.select__option[data-value="${config.theme}"]`);
    option.classList.toggle('select__option_selected', true);

    let selectedOption = themeSelect.querySelector('.select__selected-option');
    selectedOption.setAttribute('data-value', config.theme);
    
    themeSelect.addEventListener('select-option', (event) => {
      selectedOption.setAttribute('data-value', event.detail.selectedValue);

      let appThemeChangeEvent = new CustomEvent('app-theme-changing', {
        bubbles: true,
        detail: { theme: event.detail.selectedValue },
      });
      themeSelect.dispatchEvent(appThemeChangeEvent);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CalendarSection(document.querySelector('.calendar-section'));
});
