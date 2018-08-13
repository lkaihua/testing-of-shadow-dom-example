/**
 * A wdio utility function to test `ing-uic-select`.
 * supports clicking very long list by `scrollIntoView`.
 *
 * @requires:
 * - this.browser.$s
 * - this.browser.pause
 * - this.browser.execute
 */
const { Common } = require('./Common');

class Select {
  constructor(_browser) {
    this.browser = _browser;
    this.common = new Common(this.browser);
    this.animationTime = 1000;
    this.listTagName = 'ing-uic-select';
    this.itemTagName = 'ing-uic-item';
  }

  /**
   * A helper to write a proper path to`ing-uic-select` component
   * @param Array{String} selector
   */
  _getUicSelect(selector) {
    if (selector[selector.length - 1] === this.listTagName) {
      // path is complete OR is of native `ing-uic-select`
      return selector;
    }

    // path is of customized component, by default it's `ing-uic-dumb-select`.
    return [...selector, this.listTagName];
  }

  /**
   * get options of the select
   *
   * @param selector
   * @return Array{String}
   */
  getOptions(selector) {
    const list = this.browser.$s(this._getUicSelect(selector));
    const items = list.$$(this.itemTagName);

    // KNOWN ISSUES: text node has to be visible otherwise `getText` will return an empty string
    // https://github.com/webdriverio/webdriverio/issues/726

    // before open
    const beforeClick = items.map(item => item.getText());

    // click to open the dropdown list
    this.common.click(selector);
    this.browser.pause(this.animationTime);

    // get text
    const afterClick = items.map(item => item.getText());

    // close the dropdown list
    this.browser.execute(_ele => _ele && _ele.value && _ele.value.close(), list);
    this.browser.pause(this.animationTime);

    // Remove repeated elements in the rear end of two arrays.
    // Firefox: the polyfill will include element(s) inside the shadow tree,
    // which in this case is the select option that we would like to avoid.
    const diff = afterClick.reduce((acc, element, index) => {
      if (element !== beforeClick[index]) {
        acc.push(element);
      }
      return acc;
    }, []);

    if (diff.length === 0) {
      // if they are completely same, then return either
      return afterClick;
    }
    return diff;
  }

  /**
   * getter
   * @param selector
   * @returns {*}
   */
  get(selector) {
    return this.common.get(selector);
  }

  /**
   * setter
   * @param selector
   * @param value
   * @returns Boolean Whether the set action is successful
   */
  set(selector, value) {
    let setSuccess = false;
    const ele = this.browser.$s(selector);

    if (ele.value === null) {
      console.error('Select can not be found with selector:', selector.toString());
      return setSuccess;
    }

    const items = this.browser
      .$s(this._getUicSelect(selector))
      .$$(this.itemTagName);

    // scroll to the element, click to open the dropdown list
    this.common.click(selector);
    this.browser.pause(this.animationTime);

    items.find((item) => {
      if (item.getText() === value) {
        this.common.click(item);
        setSuccess = true;
        return true; // break `items.find`
      }
      return false;
    });

    this.browser.pause(this.animationTime);
    return setSuccess;
  }
}

exports.Select = Select;
