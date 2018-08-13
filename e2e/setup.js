const { defineSupportCode } = require('cucumber');
// Set DEBUG MODE to true in order to user `this.browser.debug()`;
const DEBUG = false;
const timeout = DEBUG ? 3600 : 20;
/**
 * Setup configuration for e2e test.
 */
defineSupportCode(({ Before, setDefaultTimeout }) => {
  Before(() => {
    browser.timeouts('implicit', timeout * 1000);
    setDefaultTimeout(timeout * 1000);
  });
});
