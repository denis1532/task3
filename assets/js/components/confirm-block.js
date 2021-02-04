/**
 * The class for initializing a confirm block.
 */
class ConfirmBlock {
  /**
   * @param {HTMLElement} confirmBlock - element with .confirm-block class
   */
  constructor(confirmBlock) {
    this.confirmBlock = confirmBlock;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ConfirmBlock(document.getElementsByClassName('confirm-block'));
});
