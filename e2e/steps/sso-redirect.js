const { defineSupportCode } = require('cucumber');
const { SsoRedirectPage } = require('../pages/sso-redirect-page');
const chai = require('chai');
chai.use(require('chai-string'));

const { expect } = chai;

require('selenium-webdriver');

defineSupportCode(function ({
  Given, Before, Then,
}) {
  const redirectUrlPrefix = 'https://ingtest.uat.fx.com';
  let ssoRedirectPage;

  Before(() => {
    ssoRedirectPage = new SsoRedirectPage(browser);
  });

  Given('I am on the SSO redirect page', () => {
    expect(ssoRedirectPage.navigateTo()).to.be.equal(true, 'The page times out');
  });

  Then('Redirect to IngTrade is occurred', () => {
    expect(ssoRedirectPage.getUrl()).to.startsWith(redirectUrlPrefix);
  });

  Then('Redirect to IngTrade is not occurred', () => {
    expect(ssoRedirectPage.getUrl()).to.not.startsWith(redirectUrlPrefix);
  });

  Then('Text should be "{string}"', (text) => {
    expect(ssoRedirectPage.getText()).to.be.equal(text);
  });

  Then('Description should be "{string}"', (description) => {
    expect(ssoRedirectPage.getDescription()).to.be.equal(description);
  });
});
