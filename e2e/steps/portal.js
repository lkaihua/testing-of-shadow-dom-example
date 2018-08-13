const { defineSupportCode } = require('cucumber');
const { Common } = require('cbportal-integration-test-common');

require('selenium-webdriver');

defineSupportCode(function ({
  When,
}) {
  When('I am logged in CPA as "{string}"', (xssoUsername) => {
    this.browser.lastResult = {};
    this.browser.reload();

    const common = new Common(browser);
    common.xsso.login(xssoUsername, xssoUsername);
  });
});
