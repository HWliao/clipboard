var describe = require("mocha").describe;
var it = require("mocha").it;
var before = require('mocha').before;
var beforeEach = require('mocha').beforeEach;

var expect = require('chai').expect;

var _ = require('lodash');

var clipboar = require('../index');

describe('clipboard', function () {

  describe('formats', function () {
    it('the formats must contains the formats', function () {
      var targetFormats = {Files: true};
      var formats = clipboar.formats;
      expect(formats).to.have.all.keys(targetFormats);
    });
  });

  describe('contants', function () {
    it('the contants must contains the contants', function () {
      var targetContants = {
        WRITE_SUCCESS: 1,
        WRITE_FAIL: 0
      };
      var contants = clipboar.constants;
      _.map(targetContants, function (value, key) {
        expect(contants).to.have.property(key, value);
      })
    });
  });

  describe('read', function () {

    it('the format is not in the formats', function () {
      var invalidFormat = 'qwrqwrsasfegqrtsdf';

    });

  });

  describe('write', function () {
  });

  describe('clear', function () {

  });
});
