/**
 * A wdio utility to test `ing-uic-amount-input`.
 *
 * @requires:
 * - Common
 */

const { Common } = require('./Common');

class AmountInput {
  constructor(_browser) {
    this.browser = _browser;
    this.common = new Common(this.browser);
  }

  get(selector) {
    return this.common.get(selector);
  }

  set(selector, value) {
    return this.common.set(selector, value);
  }

  // RISKY WAY: internal structure of component could be changed

  // set(selector, value) {
  //   const ingUicAmountInput = [
  //     'ing-uic-input',
  //     'ing-uic-input-container',
  //     'ing-uic-native-input',
  //     'input',
  //   ];
  //   const ele = this.browser.shadowDomElement([...selector, ...ingUicAmountInput]);
  //   ele.setValue(value);
  // }

  // getError(selector) {
  //   const legAmountError = [
  //     'ing-uic-input',
  //     'ing-uic-input-container',
  //     'ing-uic-input-error',
  //   ];
  //   return this.browser.$s([...selector, ...legAmountError]).getText();
  // }
}

exports.AmountInput = AmountInput;
