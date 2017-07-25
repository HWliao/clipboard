var describe = require("mocha").describe;
var it = require("mocha").it;
var before = require('mocha').before;
var beforeEach = require('mocha').beforeEach;

var expect = require('chai').expect;

var _ = require('lodash');

var clipboard = require('../index');
var win32 = require('../lib/win32');

describe('clipboard', function () {

  describe('types', function () {
    it.skip('must contains the types', function () {
      var targetTypes = {
        'Files': true,
        'text/plain': true,
        'text/html': true
      };
      var types = clipboard.types;
      expect(types).to.have.all.keys(targetTypes);
    });
  });

  describe('contants', function () {
    it.skip('must contains the contants', function () {
      var targetContants = {
        SUCCESS: 1,
        FAIL: 0
      };
      var contants = clipboard.constants;
      _.map(targetContants, function (value, key) {
        expect(contants).to.have.property(key, value);
      })
    });
  });

  describe('read', function () {

    it.skip('type is not in types', function () {
      var type = 'xxxxxxxxx';
      var result = clipboard.read(type);
      expect(result).to.be.equal(undefined);
    });

    it.skip('invalid type', function () {
      var type = 'text/plain';
      clipboard.clear();
      var result = clipboard.read(type);
      expect(result).to.be.equal(undefined);
    });

    it.skip('text/plain', function () {
      var type = 'text/plain';
      var result = clipboard.read(type);
      expect(result).is.not.equal(undefined);
      expect(result.type).is.equal(type);
      expect(result.data).to.be.a('string');
    });

    it.skip('text/html', function () {
      var type = 'text/html';
      var result = clipboard.read(type);
      expect(result).is.not.equal(undefined);
      expect(result.type).is.equal(type);
      expect(result.data).to.be.a('string');
    });

    it.skip('Files', function () {
      var type = 'Files';
      var result = clipboard.read(type);
      expect(result).is.not.equal(undefined);
      expect(result.type).is.equal(type);
      expect(result.data).to.satisfy(function (data) {
        return Array.isArray(data);
      });
    });
  });
  describe('readAll', function () {
    it('all may be none', function () {
      var result = clipboard.readAll();
      expect(result).to.satisfy(function (data) {
        return Array.isArray(data);
      });
    });
  });
  describe('getAllValidFormats', function () {
    it('get all formats is array or is undefined', function () {
      var result = clipboard.getAllValidFormats();
      expect(result).to.satisfy(function (t) {
        return !!(Array.isArray(t) || t === undefined);
      });
    });

  });

  describe('write', function () {
  });

  describe('clear', function () {
    it.skip('empty success', function () {
      var clear = clipboard.clear();
      expect(clear).to.be.equal(1);
    });
  });

});
