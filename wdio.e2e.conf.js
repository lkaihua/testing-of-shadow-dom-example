const merge = require('deepmerge');
const masterConf = require('./wdio.conf');
const dontMerge = (destination, source) => source;
const maxInstances = 5;

exports.config = merge(masterConf.config, {
  maxInstances: maxInstances,
  capabilities: [{
    // maxInstances can get overwritten per capability. So if you have an in-house
    // Selenium grid with only 5 firefox instances available you can make sure that
    // not more than 5 instances get started at a time.
    maxInstances: maxInstances,
    browserName: 'chrome',
  }],
  // Set a base URL in order to shorten url command calls. If your url parameter
  // starts with "/", then the base url gets prepended.
  baseUrl: 'http://localhost:7665',
  // Not a standard wdio config. Added to specify test paths which will appended to baseUrl.
  testPath: {
    index: '/components/cmf-fx-transactions/index.html',
    initiate: '#/initiate',
    history: '#/history',
    ssoRedirect: '#/ingtrade',
  },
  specs: [
    './e2e/features/entity-account-select.feature',
    './e2e/features/swap-off-transfer-leg.feature',
    './e2e/features/swap-on-transfer-leg.feature',
    './e2e/features/history.feature',
  ],
}, { arrayMerge: dontMerge });
