/**
 * This class contains common functions for generic components.
 *
 * @requires:
 * - browser.$s
 * - browser.execute
 * - browser.pause
 * - browser.elementIdDisplayed
 * - browser.elementIdClick
 */
/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
class Common {
  constructor(_browser) {
    this.browser = _browser;
    this.ONE_SECOND = 1000;
    this.MAX_TIME = 15 * this.ONE_SECOND;
  }

  /**
   * returns wdio object when given a string or a path array
   * @param {string|Array<string>|WebElement} selector
   * @returns {WebElement}
   */
  _s(selector) {
    return (Array.isArray(selector) || typeof selector === 'string') ?
      this.browser.$s(selector) : selector;
  }

  /**
   * getter
   * @param selector
   * @param {String} attributeKey By default we are assigning to the value of the element.
   * @returns {*}
   */
  get(selector, attributeKey = 'value') {
    const ele = this._s(selector);
    return this.browser
      .execute((_ele, _attr) => _ele && _ele.value && _ele.value[_attr], ele, attributeKey)
      .value;
  }

  /**
   * setter
   * @param selector
   * @param {*} attributeValue The value of attribute.
   * @param {String} attributeKey By default we are assigning to the value of the element.
   * @returns {Boolean} Whether it has been set with given value successfully.
   */
  set(selector, attributeValue, attributeKey = 'value') {
    const ele = this._s(selector);
    const isSet = this.browser.execute((_ele, _val, _attr) => {
      if (_ele && _ele.value) {
        try {
          /* eslint-disable no-param-reassign */
          _ele.value[_attr] = _val;
          return true;
        } catch (e) {}
      }
      return false;
    }, ele, attributeValue, attributeKey);
    this.browser.pause(this.ONE_SECOND / 2);
    return isSet;
  }

  /**
   * Returns the disabled status of target.
   *
   * @param {string|Array<string>} selector
   * @param {...*} disabledValues
   * @returns {Boolean}
   * @description
   * By default these three values are considered to be `disable=true`
   * - true
   * - 'true'
   * - ''
   * And these can be customized according to the components.
   */
  isDisabled(selector, ...disabledValues) {
    const LEGAL_DISABLED_VALUES = [true, 'true', ''];
    const values = disabledValues.length === 0 ? LEGAL_DISABLED_VALUES : disabledValues;
    const ele = this._s(selector);
    let attr;
    try {
      attr = ele.getAttribute('disabled');
    } catch (e) {
      throw new Error('[Common.isDisabled] unable to get disabled attribute of element.');
    }
    return values.some(item => item === attr);
  }

  /**
   * isVisible
   * @param {string|Array<string>} selector
   * @param {Boolean} scrollPage Whether trying to scroll it into the view.
   * @returns {Boolean} Whether a shadow dom element is visible.
   * @description When the selector does not point to any element, return `false`.
   *              By default will scroll the page to locate target element.
   * @see: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
   */
  isVisible(selector, scrollPage = true) {
    return this.waitUntil(() => {
      let result = false;
      const ele = this._s(selector);
      try {
        if (scrollPage) {
          this.browser.execute(_ele => _ele.scrollIntoView(false), ele.value);
        }
        result = this.browser.elementIdDisplayed(ele.value.ELEMENT).value;
        if (!result && scrollPage) {
          this.browser.execute(_ele => _ele.scrollIntoView(true), ele.value);
          result = this.browser.elementIdDisplayed(ele.value.ELEMENT).value;
        }
      } catch (e) {}
      return result;
    }, 3 * this.ONE_SECOND, false);
  }

  /**
   * waitForShadowDomReady
   * Wait for the selector shadow dom element to be ready.
   *
   * @param {string|Array<string>} selector
   * @param {number=} time
   * @returns {Boolean} Whether the target is ready within the timeout.
   * @example
   *  // after opening a new page, wait the submit button to be visible
   *  // before the function test runs.
   *  const submitButton = ['icon-page', 'ing-uic-card', '#submit'];
   *  this.common.waitForShadowDomReady(submitButton);
   *  this.common.click(submitButton);
   */
  waitForShadowDomReady(selector, time = this.MAX_TIME) {
    return this.waitUntil(() => {
      const ele = this._s(selector);
      return ele && ele.value;
    }, time);
  }

  /**
   * click
   * This function will overcome a variety of exceptions/errors:
   * - `unknown error: Element is not clickable at point (x, y)`
   * - `Error: An element command could not be completed because
   *    the element is not visible on the page.`: element is out of the view
   * - Another element receives the click with an exception thrown: element is covered
   * by scrolling the view, checking the visibility, and retry clicking within the timeout.
   *
   * @param {string|Array<string>|WebElement} selector
   * @param {number=} time
   */
  click(selector, time = this.MAX_TIME) {
    return this.waitUntil(() => {
      const ele = this._s(selector);
      let isClickSuccessful = false;
      if (ele && ele.value) {
        /**
         * Plan A: use webdriverIO API to manipulate elements.
         *
         * `window.scrollTo` is not an elegant solution for portal
         * since there is a global `div.ib-nav-primary` as the navigation bar.
         * We have to add or minus the height in different scenarios
         * otherwise the element will be covered by the bar and can not be clicked.
         * Also the height of navigation bar should be pre-defined, making this
         * solution less elegant. Horizontal scrolling should be taken into account
         * when the left navigation bar covers part of the view as well.
         *
         * `element.scrollIntoView` provides much more reliability.
         * Either scroll bottom of the element to align bottom of the view area,
         * or scroll top of the element to align top of the view area.
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
         */
        /**
         * ========================== SCROLL-TO SOLUTION =============================
         */
        /**
         * @see: http://webdriver.io/api/utility/scroll.html
         * @see: https://w3c.github.io/webdriver/#get-element-rect
         *
         * The reason for `try/catch` is that, if the chromedriver
         * does not agree with corresponding protocal which selenium
         * supports, there is no way to know a possible `unknown command`
         * exception until execution.
         */
        //   const _id = ele.value.ELEMENT;
        //   let position;
        //   try {
        //     position = this.browser.elementIdRect(_id);
        //   } catch (e) {
        //     position = this.browser.elementIdLocation(_id);
        //   }
        //   if (position && position.value) {
        //     this.browser
        //       .execute((_x, _y) => window.scrollTo(_x, _y), position.value.x, position.value.y)
        //     this.browser.pause(this.ONE_SECOND / 2);
        //     this.browser.elementIdClick(_id);
        //     isClickSuccessful = true;
        //   }
        /**
         * ========================== SCROLL-TO SOLUTION =============================
         */

        try {
          // Plan B: use browser context execute to manipulate elements.
          isClickSuccessful = this.scrollAndClick(ele) || this.scrollAndClick(ele, true);
          // console.log(
          //   '[Common.click] scrollAndClick returns', isClickSuccessful,
          //   'for', selector,
          // );
        } catch (ex) {
          console.warn('[Common.click] exceptions', ex, 'for', selector);
        }
      }
      return isClickSuccessful;
    }, time);
  }

  /**
   * scrollAndClick
   * @param {WebElement} ele
   * @param {Boolean} scrollIntoViewTop
   * @returns {Boolean} If the click executed without error, return true
   * @see: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
   */
  scrollAndClick(ele, scrollIntoViewTop = false) {
    return ele && ele.value && this.browser.execute((_ele) => {
      try { _ele.scrollIntoView(scrollIntoViewTop); } catch (e) {}
      try { setTimeout(() => _ele.click(), 500); } catch (e) { return false; }
      return true;
    }, ele.value).value;
  }

  /**
   * waitUntil
   * Wait until the condition function returns true.
   *
   * @param {Function} conditionWorker function to execute, expect `true` to stop waiting.
   * @param {number=} time timeout
   * @param {Boolean} verbose log mode
   */
  waitUntil(conditionWorker, time = this.MAX_TIME, verbose = true) {
    let flag = time;
    const interval = this.ONE_SECOND;
    const log = verbose ? console.warn : () => {};
    while (flag > 0) {
      try {
        if (conditionWorker()) {
          return true;
        }
      } catch (ex) {
        log('[Common.waitUntil] exception when execute condition worker', ex);
      } finally {
        flag -= interval;
        this.browser.pause(interval);
      }
    }
    log(`[Common.waitUntil] timed out after ${time / this.ONE_SECOND} seconds in`, (new Error()).stack);
    return false;
  }
}

exports.Common = Common;
