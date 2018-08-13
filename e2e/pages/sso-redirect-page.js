'use strict';

const { Common } = require('../utils/helpers/Common');
require('selenium-webdriver');

const rootSelector = [
  'ing-app-cmf-fx-transactions',
  'ing-uic-router',
  'ingtrade-springboard-page',
  'paper-card',
];

class SsoRedirectPage {
  constructor(_browser) {
    this.browser = _browser;
    this.common = new Common(this.browser);
    this.timeout = 10 * 1000;
  }

  navigateTo() {
    const url = this.browser.options.testPath.index + this.browser.options.testPath.ssoRedirect;
    this.browser.url(url);
    return this.common.waitForShadowDomReady(rootSelector, this.timeout);
  }

  getText() {
    const textPath = [...rootSelector, '.tst-message'];
    this.common.waitForShadowDomReady(textPath, this.timeout);
    const text = this.browser.$s(textPath).getText();
    return text;
  }

  getDescription() {
    const descriptionPath = [...rootSelector, '.tst-description'];
    this.common.waitForShadowDomReady(descriptionPath, this.timeout);
    const description = this.browser.$s(descriptionPath).getText();
    return description;
  }

  getUrl() {
    return this.browser.getUrl();
  }
}

exports.SsoRedirectPage = SsoRedirectPage;
