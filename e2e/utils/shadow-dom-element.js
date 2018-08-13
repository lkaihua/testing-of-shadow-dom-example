/**
 **
 ** This module is to locate element(s) in shadow Dom.
 *
 * @origin https://gist.github.com/ChadKillingsworth/d4cb3d30b9d7fbc3fd0af93c2a133a53
 *
 */

/**
 * This function runs in the browser context
 * @param {string|Array<string>} selectors
 * @return {?Element}
 */
function findInShadowDom(selectors) {
  let _selectors = !Array.isArray(selectors) ? [selectors] : selectors;

  if (!(document.body.createShadowRoot || document.body.attachShadow)) {
    _selectors = [_selectors.join(' ')];
  }

  /**
   * This function is a handy query tool to select elements.
   *
   * @param root
   * @param selector
   * @return element to locate
   * @example
   *
   *    query(document, 'ing-uic-select[2]') --> querySelectorAll then return element with index
   *    query(document, 'ing-app-cmf')       --> querySelector
   *
   */
  function query(root, selector) {
    if (!root || typeof root.querySelector !== 'function') {
      console.error('Error: root element can not call querySelector');
      return null;
    }

    const match = selector.match(/([^[]+)\[([\d]+)]$/);
    if (match) {
      return root.querySelectorAll(match[1])[match[2]];
    }
    return root.querySelector(selector);
  }

  let currentElement = document;
  let tempElement = null;
  for (let i = 0; i < _selectors.length; i += 1) {
    // First, locating the element(s) in light dom (outside shadow dom).
    if (currentElement) {
      tempElement = query(currentElement, _selectors[i]);
    }
    // Second, locating the elements(s) in shadow dom.
    // Hypothesis: it's rarely needed to locate them both in and out of shadow root.
    if (tempElement === null) {
      if (i > 0) {
        currentElement = currentElement.shadowRoot;
      }
      tempElement = query(currentElement, _selectors[i]);
    }

    currentElement = tempElement;

    if (!currentElement) {
      break;
    }
  }
  return currentElement;
}

/**
 * Add a command to return an element within a shadow dom.
 * The command takes an array of selectors. Each subsequent
 * array member is within the preceding element's shadow dom.
 *
 * @Example:
 *
 *   const elem = browser.shadowDomElement(['foo-bar', 'bar-baz', 'baz-foo']);
 *   const elem = browser.$s(['foo-bar', 'bar-baz', 'baz-foo']);
 *
 * Browsers which do not have native ShadowDOM support assume each selector is a direct
 * descendant of the parent.
 */
browser.addCommand('shadowDomElement', function (selector) {
  return this.execute(findInShadowDom, selector);
});

browser.addCommand('$s', function (selector) {
  return this.execute(findInShadowDom, selector);
});

/*****************************************************
 * This `waitForShadowDomElement` does not work.
 * As a replace method, `helpers/Common/waitUntil` is introduced.
 *****************************************************
 *
 * We are now turning on sync mode in `wdio.conf.js` `sync: true`/
 * `this.waitUntil` uses `Promise` and thus will always be skipped.
 * (Correct me if I am wrong, and feel free to explore an elegant way)
 */
/**
 * Provides the equivalent functionality as the above shadowDomElement command, but
 * adds a timeout. Will wait until the selectors match an element or the timeout
 * expires.
 *
 * Example:
 *
 *   const elem = browser.waitForShadowDomElement(['foo-bar', 'bar-baz', 'baz-foo'], 2000);
 */
// browser.addCommand('waitForShadowDomElement', function async(selector, timeout, timeoutMsg, interval) {
//   return this.waitUntil(() => {
//     const elem = this.execute(findInShadowDom, selector);
//     return elem && elem.value;
//   }, timeout, timeoutMsg, interval)
//     .then(() => this.execute(findInShadowDom, selector));
// });
