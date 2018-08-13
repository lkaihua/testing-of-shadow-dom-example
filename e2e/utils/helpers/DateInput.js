/**
 * A wdio utility function to test `ing-uic-date-input`.
 *
 * @requires:
 * - this.browser.$s
 * - Common
 */

const { Common } = require('./Common');

class DateInput {
  constructor(_browser) {
    this.browser = _browser;
    this.common = new Common(this.browser);
  }

  get(selector) {
    return this.common.get(selector);
  }

  set(selector, date) {
    return this.common.set(selector, date);
  }

}

exports.DateInput = DateInput;

