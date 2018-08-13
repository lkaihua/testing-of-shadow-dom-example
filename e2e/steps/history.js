const { defineSupportCode } = require('cucumber');
const { HistoryPage } = require('../pages/history-page');
const { expect } = require('chai');

require('selenium-webdriver');

defineSupportCode(function ({
  Given, When, Then, Before
}) {
  let historyPage;
  let checkPagination = false;

  Before(() => {
    historyPage = new HistoryPage(browser);
  });

  Given('I am on the fx history page', () => {
    expect(historyPage.navigateTo()).to.be.equal(true, 'The page times out');
  });

  Then('I see the history table should contain following rows', (expectedTable) => {
    const seenTable = historyPage.getTable();
    expectedTable.rows().forEach((field, index) => {
      expect(seenTable[index]).to.deep.equal(field);
    });
  });

  Given('I see the history table contains at least "{string}" lines', (lines) => {
    checkPagination = historyPage.getCount() >= lines;
  });

  Then('there should be clickable pagination buttons to go to next pages', () => {
    expect(historyPage.isPaginationVisible()).to.be.equal(checkPagination);
  });

  When('I wait "{string}" seconds', (seconds) => {
    browser.pause(+seconds);
  });

  When('I click on the next pagination button', () => {
    historyPage.clickPaginationNext();
  });

  When('I click on the previous pagination button', () => {
    historyPage.clickPaginationPrev();
  });

});
