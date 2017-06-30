var it = require("mocha").it;
var describe = require("mocha").describe;
var expect = require('chai').expect;

var debug = require('debug')('test:test1');
debug('test');
describe('Test mocha', function () {
  it('test lhw', function () {
    debug('test');
    expect('abc').to.be.a('string');
  });
});
