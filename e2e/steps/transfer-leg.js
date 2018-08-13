const { defineSupportCode } = require('cucumber');
const { InitiatePage } = require('../pages/initiate-page');
const { expect } = require('chai');
const { Common } = require('../utils/helpers/Common');

require('selenium-webdriver');

defineSupportCode(function ({
  When, Then, Before,
}) {
  let initPage, common;

  Before(() => {
    initPage = new InitiatePage(browser);
    common = new Common(browser);
  });

  When('I select the "{string}" leg currency as "{string}"', (leg, currency) => {
    initPage.setCurrency(leg, currency);
  });

  When('I select the "{string}" leg buy-or-sell as "{string}"', (leg, currency) => {
    initPage.setBuyOrSell(leg, currency);
  });

  When('I input the "{string}" leg amount as "{string}"', (leg, amount) => {
    initPage.setAmount(leg, amount);
  });

  When('I select the "{string}" leg date as "{string}"', (leg, value) => {
    initPage.setDate(leg, value);
  });

  When('I input the "{string}" leg other date as "{string}"', (leg, amount) => {
    initPage.setOtherDate(leg, amount);
  });

  When('I click the "{string}" button', (text) => {
    initPage.clickButton(text);
  });


  Then('the "{string}" leg currency options should contain following rows', (leg, expectedData) => {
    const currencyOptions = initPage.getCurrencyOptions(leg);
    expectedData.raw().forEach((field, index) =>
      expect(currencyOptions[index]).to.be.equal(field[0]));
  });

  Then('the "{string}" leg currency should display as "{string}"', (leg, currency) => {
    common.waitUntil(() => initPage.getCurrency(leg) === currency);
    expect(initPage.getCurrency(leg)).to.be.equal(currency);
  });

  Then('the "{string}" leg buy-or-sell should display as "{string}"', (leg, value) => {
    common.waitUntil(() => initPage.getBuyOrSell(leg) === value.toUpperCase());
    // backend expects upper-cased string
    expect(initPage.getBuyOrSell(leg)).to.be.equal(value.toUpperCase());
  });

  Then('the "{string}" leg amount should display as "{string}"', (leg, amount) => {
    common.waitUntil(() => initPage.getAmount(leg) === +amount);
    expect(initPage.getAmount(leg)).to.be.equal(+amount);
  });

  Then('the "{string}" leg amount should be empty', (leg) => {
    expect(!initPage.getAmount(leg)).to.be.equal(true);
  });

  Then('the "{string}" leg other date should display as "{string}"', (leg, date) => {
    common.waitUntil(() => initPage.getOtherDate(leg) === date);
    expect(initPage.getOtherDate(leg)).to.be.equal(date);
  });

  Then('the "{string}" leg date options should contain following rows', (leg, expectedData) => {
    const dateOptions = initPage.getDateOptions(leg);
    expectedData.raw().forEach((field, index) =>
      expect(dateOptions[index]).to.be.equal(field[0]));
  });

  Then('the "{string}" leg date should be empty', (leg) => {
    expect(!initPage.getDate(leg)).to.be.equal(true);
  });

  Then(/^the "([^"]*)" leg other date should be (dis|en)abled$/, (leg, expected) => {
    let disabled;
    try {
      disabled = initPage.isOtherDateDisabled(leg);
    } catch (e) {
      // empty element of `#otherDate` is taken as `disabled` too
      disabled = true;
    }
    expect(disabled).to.be.equal(expected === 'dis');
  });

  Then(/^the "([^"]*)" button should be (in|)visible$/, (text, disabled) => {
    expect(initPage.isButtonVisible(text)).to.be.equal(disabled === '', `The ${text} button was expected to be ${disabled} but failed.`);
  });

  Then('the quote success message should be visible', () => {
    expect(initPage.isQuoteMessageVisible()).to.be.equal(true);
  });

  Then('there will be at least one invalid component', () => {
    expect(initPage.isAnyInvalid()).to.be.equal(true);
  });
});
