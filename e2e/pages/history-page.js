'use strict';

const { Common } = require('../utils/helpers/Common');
require('selenium-webdriver');

const rootSelector = [
  'ing-app-cmf-fx-transactions',
  'ing-uic-router',
  'history-page',
  'ing-uic-loader-overlay',
  'ing-uic-card',
];

class HistoryPage {
  constructor(_browser) {
    this.browser = _browser;
    this.common = new Common(this.browser);
    this.timeout = 10 * 1000;
  }

  navigateTo() {
    this.browser.url(this.browser.options.testPath.index + this.browser.options.testPath.history);
    return this.common.waitForShadowDomReady(rootSelector, this.timeout);
  }

  getTable() {
    const tablePath = [...rootSelector, '.table', '.tbody'];
    this.common.waitForShadowDomReady(tablePath, this.timeout);
    const rows = this.browser.$s(tablePath).$$('.tr');
    const matrix = [];
    rows.forEach((row) => {
      matrix.push(row.getText().split('\n'));
    });
    return matrix;
  }

  getCount() {
    return this.getTable().length;
  }

  isPaginationVisible() {
    return this.common.isVisible([...rootSelector, '#paginator']);
  }

  clickPaginationPrev() {
    this.browser.$s([...rootSelector, '#paginator', '.pagination-button-previous']).click();
  }

  clickPaginationNext() {
    this.browser.$s([...rootSelector, '#paginator', '.pagination-button-next']).click();
  }
}

exports.HistoryPage = HistoryPage;
