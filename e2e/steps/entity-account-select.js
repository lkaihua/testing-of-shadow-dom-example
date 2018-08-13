const { defineSupportCode } = require('cucumber');
const { InitiatePage } = require('../pages/initiate-page');
const { expect } = require('chai');
const { Common } = require('../utils/helpers/Common');

require('selenium-webdriver');

defineSupportCode(function ({
  Given, When, Then, Before,
}) {
  let initPage, common;

  Before(() => {
    initPage = new InitiatePage(browser);
    common = new Common(browser);
  });

  function refreshPage() {
    browser.refresh();
    initPage.waitTilInitialized();
  }

  Given(/^I have no quote request remembered$/, () => {
    expect(initPage.navigateTo()).to.be.equal(true, 'The transfer swap page times out');
    browser.executeAsync((done) => {
      axios.put(`/cpa/api/v1/me/preferences`, {
        preferenceList: [{
          application: 'CMF',
          type: 'QUOTE_REQUEST',
          value: "DEFAULT",
          action: 'U'
        }]
      }).then(done);
    });
    refreshPage();
  });


  Given('I am on the transfer swap page', () => {
    expect(initPage.navigateTo()).to.be.equal(true, 'The transfer swap page times out');
  });

  Given('I refresh the page', () => {
    refreshPage();
  });

  Given(/^I switch (off|on) the swap mode/, (mode) => {
    initPage.switchSwapModeOn(mode === 'on');
  });

  Then(/^Entity should be (dis|en)abled$/, (disabled) => {
    expect(initPage.isEntityDisabled()).to.be.equal(disabled === 'dis');
  });

  Then(/^Account (\d+) should be (dis|en)abled$/, (accountNumber, disabled) => {
    expect(initPage.isAccountDisabled(accountNumber)).to.be.equal(disabled === 'dis');
  });

  Then('Entity should display as empty', () => {
    expect(!initPage.getEntity()).to.be.equal(true);
  });

  Then('Entity should display as "{string}"', (value) => {
    common.waitUntil(() => initPage.getEntity() === value);
    expect(initPage.getEntity()).to.be.equal(value);
  });

  When('I select Entity as "{string}"', (entity) => {
    initPage.setEntity(entity);
  });

  Then('Account {string} should display as empty', (number) => {
    expect(!initPage.getAccount(number)).to.be.equal(true);
  });

  Then('Account {string} should be set value as "{string}"', (number, value) => {
    common.waitUntil(() => initPage.getAccount(number) === value);
    expect(initPage.getAccount(number)).to.be.equal(value);
  });

  Then('Account {string} should contain following accounts', (number, expectedData) => {
    const accountOptions = initPage.getAccountOptions(number);
    expectedData.raw().forEach((field, index) =>
      expect(accountOptions[index]).to.be.equal(field[0]));
  });

  When('I select Account {string} as "{string}"', function (number, value) {
    initPage.setAccount(number, value);
  });
});
