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
  let confirmBlocks = document.getElementsByClassName('confirm-block');
  for (let confirmBlock of confirmBlocks) {
    new ConfirmBlock(confirmBlock);
  }
});
