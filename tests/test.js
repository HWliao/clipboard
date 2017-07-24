var describe = require("mocha").describe;
var it = require("mocha").it;
var before = require('mocha').before;
var beforeEach = require('mocha').beforeEach;

var expect = require('chai').expect;

var _ = require('lodash');

var clipboar = require('../index');
var win32 = require('../lib/win32');

describe('clipboard', function () {

  describe('formats', function () {
    it('the formats must contains the formats', function () {
      var targetFormats = {
        'Files': true,
        'text/plain': true,
        'text/html': true
      };
      var formats = clipboar.formats;
      expect(formats).to.have.all.keys(targetFormats);
    });
  });

  describe('contants', function () {
    it('the contants must contains the contants', function () {
      var targetContants = {
        SUCCESS: 1,
        FAIL: 0
      };
      var contants = clipboar.constants;
      _.map(targetContants, function (value, key) {
        expect(contants).to.have.property(key, value);
      })
    });
  });

  describe('read', function () {
    it('the format is not in the formats', function () {
      var invalidFormat = 'mustnotin';
      var result = clipboar.read(invalidFormat);
      expect(result).is.equal(undefined);
    });

    it('text/plain data', function () {
      var format = 'text/plain';
      var result = clipboar.read(format);
      expect(result).to.be.a('string');
    });

    it('empty data', function () {
      clipboar.clear();
      var result = clipboar.read('text/plain');
      expect(result).is.equal(undefined);
    });

  });

  describe('write', function () {
  });

  describe('clear', function () {
    it('clear the native clipboard', function () {
      var result = clipboar.clear();
      expect(result).to.be.a('number').that.does.not.equal(0);
    });
  });

  describe('win32',function () {
    it('test',function () {
      win32.getAllValidFormats();
    });
  });

});
