class ConfigService {}

/**
 * @param {ConfigEntity} config 
 */
ConfigService.saveConfig = (config) => {
  localStorage.setItem('app-config', JSON.stringify(config));
}

ConfigService.removeConfig = () => {
  localStorage.removeItem('app-config');
}

/**
 * @returns {ConfigEntity}
 */
ConfigService.getConfig = () => {
  let JSONConfig = localStorage.getItem('app-config');

  return JSONConfig ? JSON.parse(JSONConfig) : new ConfigEntity('theme-1');
}