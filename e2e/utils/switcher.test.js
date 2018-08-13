/**
 * Test for switcher.js
 *
 */

const { switcher } = require('./switcher');
const { expect } = require('chai');

const hi1 = { one: 'yi', two: 'er', three: 'san' };
const hi2 = {
  one: 'yi', two: 'er', three: 'san', default: 'chinese',
};

expect(switcher(hi1).case('one')).to.be.equal(hi1.one);
expect(switcher(hi1).case('two')).to.be.equal(hi1.two);
expect(switcher(hi1).default()).to.be.equal(hi1.one);
expect(switcher(hi1).case('five')).to.be.equal(hi1.one);

expect(switcher(hi2).case('one')).to.be.equal(hi2.one);
expect(switcher(hi2).case('five')).to.be.equal(hi2.default);
expect(switcher(hi2).default()).to.be.equal(hi2.default);
