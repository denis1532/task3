document.addEventListener('DOMContentLoaded', () => {

  // THEME SECTION

  setAppTheme(ConfigService.getConfig().theme);

  document.addEventListener('app-theme-changing', (event) => {
    let config = ConfigService.getConfig();

    removeAppTheme(config.theme);

    ConfigService.removeConfig();
    config.theme = event.detail.theme;
    ConfigService.saveConfig(config);

    setAppTheme(event.detail.theme);
  });

  function setAppTheme(theme) {
    let calendarSection = document.querySelector('.calendar-section');
    calendarSection.classList.toggle(`calendar-section_${theme}`, true);

    let modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
      modal.classList.toggle(`modal_${theme}`, true);
    }
  }

  function removeAppTheme(theme) {
    let calendarSection = document.querySelector('.calendar-section');
    calendarSection.classList.toggle(`calendar-section_${theme}`, false);

    let modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
      modal.classList.toggle(`modal_${theme}`, false);
    }
  }

  // FORWARD / BACKWARD FEATURES

  let router = new Router();

  window.addEventListener('popstate', (event) => {
    // close all the modals
    Modal.hideModal('add-event-block-modal');
    Modal.hideModal('events-block-modal');
    Modal.hideModal('confirm-modal');
    
    event.state && router.render(event.state.path);
  });
});