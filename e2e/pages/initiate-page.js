'use strict';

const { switcher } = require('../utils/switcher');
const { Select } = require('../utils/helpers/Select');
const { Common } = require('../utils/helpers/Common');
const { AmountInput } = require('../utils/helpers/AmountInput');
const { DateInput } = require('../utils/helpers/DateInput');
require('selenium-webdriver');

const rootSelector = ['ing-app-cmf-fx-transactions', 'initiate-page', 'ing-uic-card'];

const swapButtonSelector = ['#swapModeToggler'];
const entitySelector = ['#entitySelect'];
const accountOneSelector = ['#account1Select'];
const accountTwoSelector = ['#account2Select'];
const accountSelectors = {
  1: accountOneSelector,
  2: accountTwoSelector,
};

const nearLegSelector = ['#nearLeg'];
const farLegSelector = ['#farLeg'];
const legSelectors = {
  near: nearLegSelector,
  far: farLegSelector,
};

const legBuyOrSell = ['#side'];
const legAmount = ['#amount'];
const legCurrency = ['#currency'];
const legDate = ['#date'];
const legOtherDate = ['#otherDate'];

const buttons = {
  'New Rate': '#requestBtn',
  'Reject Rate': '#rejectBtn',
  'Accept Rate': '#acceptBtn',
};

class InitiatePage {
  constructor(_browser) {
    this.browser = _browser;
    this.select = new Select(this.browser);
    this.common = new Common(this.browser);
    this.amountInput = new AmountInput(this.browser);
    this.dateInput = new DateInput(this.browser);
  }

  navigateTo() {
    this.browser.url(this.browser.options.testPath.index + this.browser.options.testPath.initiate);
    return this.waitTilInitialized();
  }

  waitTilInitialized() {
    return this.common.waitForShadowDomReady(rootSelector);
  }

  switchSwapModeOn(value) {
    const button = [...rootSelector, ...swapButtonSelector];
    this.common.waitForShadowDomReady(button);
    if (this.common.get(button, 'checked') !== value) {
      this.common.click(button);
    }
  }

  /**
   * A selector switcher
   *
   * @param selectors
   * @param type
   * @returns {[String]}
   */
  _path(selectors, type) {
    return [
      ...rootSelector,
      ...(switcher(selectors).case(type)),
    ];
  }

  /**
   ******************** entity getter and setter *******************
   */
  getEntity() {
    return this.select.get([...rootSelector, ...entitySelector]);
  }

  setEntity(value) {
    return this.select.set([...rootSelector, ...entitySelector], value);
  }

  isEntityDisabled() {
    return this.common.isDisabled([...rootSelector, ...entitySelector]);
  }

  /**
   ******************** account getter and setter *******************
   */
  getAccount(accountNumber) {
    return this.select.get(this._path(accountSelectors, accountNumber));
  }

  setAccount(accountNumber, value) {
    return this.select.set(this._path(accountSelectors, accountNumber), value);
  }

  getAccountOptions(accountNumber) {
    return this.select.getOptions(this._path(accountSelectors, accountNumber));
  }

  isAccountDisabled(accountNumber) {
    return this.common.isDisabled(this._path(accountSelectors, accountNumber));
  }


  /**
   ******************** transfer-leg getter and setter *******************
   */
  getCurrencyOptions(leg) {
    return this.select.getOptions([...this._path(legSelectors, leg), ...legCurrency]);
  }

  getCurrency(leg) {
    return this.select.get([...this._path(legSelectors, leg), ...legCurrency]);
  }

  setCurrency(leg, value) {
    return this.select.set([...this._path(legSelectors, leg), ...legCurrency], value);
  }

  getBuyOrSell(leg) {
    return this.select.get([...this._path(legSelectors, leg), ...legBuyOrSell]);
  }

  setBuyOrSell(leg, value) {
    return this.select.set([...this._path(legSelectors, leg), ...legBuyOrSell], value);
  }

  getAmount(leg) {
    return this.amountInput.get([...this._path(legSelectors, leg), ...legAmount]);
  }

  setAmount(leg, value) {
    return this.amountInput.set([...this._path(legSelectors, leg), ...legAmount], value);
  }

  isOtherDateDisabled(leg) {
    return this.common.isDisabled([...this._path(legSelectors, leg), ...legOtherDate]);
  }

  setDate(leg, value) {
    return this.select.set([...this._path(legSelectors, leg), ...legDate], value);
  }

  getDate(leg) {
    return this.select.get([...this._path(legSelectors, leg), ...legDate]);
  }

  getDateOptions(leg) {
    return this.select.getOptions([...this._path(legSelectors, leg), ...legDate]);
  }

  setOtherDate(leg, value) {
    return this.dateInput.set([...this._path(legSelectors, leg), ...legOtherDate], value);
  }

  getOtherDate(leg) {
    return this.dateInput.get([...this._path(legSelectors, leg), ...legOtherDate]);
  }

  /**
   ******************** buttons *******************
   */
  clickButton(text) {
    this.common.click([...rootSelector, buttons[text]]);
    this.browser.pause(1000);
  }

  isButtonVisible(text) {
    return this.common.isVisible([...rootSelector, buttons[text]]);
  }

  isQuoteMessageVisible() {
    return this.common.isVisible([...rootSelector, '.success-msg[0]']);
  }

  isAnyInvalid() {
    const uicSelector = 'ing-uic-select';
    const isFarlegVisible = this.common.isVisible([...rootSelector, ...farLegSelector]);
    const isNearlegOtherDateVisible = this.common.isVisible([
      ...rootSelector, ...nearLegSelector, ...legOtherDate]);
    const isFarlegOtherDateVisible = this.common.isVisible([
      ...rootSelector, ...farLegSelector, ...legOtherDate]);

    const allComponents = [
      [...entitySelector, uicSelector],
      [...accountOneSelector, uicSelector],
      [...accountTwoSelector, uicSelector],
      [...nearLegSelector, ...legBuyOrSell, uicSelector],
      [...nearLegSelector, ...legAmount],
      [...nearLegSelector, ...legCurrency, uicSelector],
      [...nearLegSelector, ...legDate, uicSelector],
      isNearlegOtherDateVisible ? [...nearLegSelector, ...legOtherDate] : null,
      isFarlegVisible ? [...farLegSelector, ...legBuyOrSell, uicSelector] : null,
      isFarlegVisible ? [...farLegSelector, ...legAmount] : null,
      isFarlegVisible ? [...farLegSelector, ...legCurrency, uicSelector] : null,
      isFarlegVisible ? [...farLegSelector, ...legDate, uicSelector] : null,
      isFarlegOtherDateVisible ? [...farLegSelector, ...legOtherDate] : null,
    ];

    const anyInvalid = allComponents.reduce((accu, curr) => {
      if (accu === true || curr === null) {
        return accu;
      }
      return this.common.get([...rootSelector, ...curr], 'invalid');
    }, false);

    return anyInvalid;
  }
}

exports.InitiatePage = InitiatePage;
