/**
 * The class for initializing a select.
 */
class Select {
  /**
   * @param {HTMLElement} select - element with .select class
   */
  constructor(select) {
    this.select = select;
    this.select.tabIndex = -1;

    // false if isn't selecting a new option
    this.isActive = false;

    this.selectedOption = this.select.querySelector('.select__selected-option');

    this.option = this.select.querySelector('.select__option_selected');

    let content = this.option.querySelector('.select__option-content');
    this.selectedOption.append(content.cloneNode(true));

    this.select.addEventListener('click', (event) => {
      if (event.target.closest('.select__option')) {
        let option = event.target.closest('.select__option');

        this.option.classList.toggle('select__option_selected', false);
        this.option = option;
        this.option.classList.toggle('select__option_selected', true);
        
        let selectEvent = new CustomEvent('select-option', {
          bubbles: true,
          detail: { selectedValue: this.option.dataset.value },
        });
        option.dispatchEvent(selectEvent);

        let content = this.option.querySelector('.select__option-content');
        this.selectedOption.innerHTML = '';
        this.selectedOption.append(content.cloneNode(true));

        this.select.blur();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let selects = document.getElementsByClassName('select');
  for (let select of selects) {
    new Select(select);
  }
});
