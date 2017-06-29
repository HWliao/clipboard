var it = require("mocha").it;
var describe = require("mocha").describe;
var expect = require('chai').expect;
var winston = require('winston');
winston.log('info', 'Hello distributed log files!');
winston.info('Hello again distributed logs');

winston.level = 'debug';
winston.log('debug', 'Now my debug messages are written to console!');

describe('Test mocha', function () {
  it('test lhw', function () {
    expect('abc').to.be.a('string');
  });
});
