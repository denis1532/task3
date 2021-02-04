/**
 * The class for initializing a modal.
 */
class Modal {
  /**
   * @param {HTMLElement} modal - element with .modal class
   */
  constructor(modal) {
    this.modal = modal;

    this.modal.addEventListener('click', (event) => {
      if (
        event.target.closest('.modal__close-element') ||
        event.target.classList.contains('modal_with-close-area')
      ) {
        this.modal.classList.toggle('modal_hidden', true);
      }
    });

    this.modal.addEventListener('show-modal', (event) => {
      this.modal.classList.toggle('modal_hidden', false);
    });

    this.modal.addEventListener('hide-modal', (event) => {
      this.modal.classList.toggle('modal_hidden', true);
    });
  }
}

/**
 * @param {Map<String, Object>} options
 */
Modal.showModal = (modalId, options = new Map()) => {
  let modal = document.getElementById(modalId);
  if (modal.classList.contains('modal')) {
    modal.dispatchEvent(new CustomEvent('show-modal'));

    if (options.get('callback')) {
      options.get('callback')(modal);
    }
  }
}

/**
 * @param {Map<String, Object>} options
 */
Modal.hideModal = (modalId, options = new Map()) => {
  let modal = document.getElementById(modalId);
  if (modal.classList.contains('modal')) {
    modal.dispatchEvent(new CustomEvent('hide-modal'));

    if (options.get('callback')) {
      options.get('callback')(modal);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let modals = document.getElementsByClassName('modal');
  for (let modal of modals) {
    new Modal(modal);
  }
});
