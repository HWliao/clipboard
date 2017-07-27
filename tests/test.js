var describe = require("mocha").describe;
var it = require("mocha").it;
var before = require('mocha').before;
var beforeEach = require('mocha').beforeEach;

var expect = require('chai').expect;

var _ = require('lodash');

var clipboard = require('../index');
var win32 = require('../lib/win32');

var ref = require('ref');

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
    it.skip('all may be none', function () {
      var result = clipboard.readAll();
      expect(result).to.satisfy(function (data) {
        return Array.isArray(data);
      });
    });
  });
  describe('getAllValidFormats', function () {
    it.skip('get all formats is array or is undefined', function () {
      var result = clipboard.getAllValidFormats();
      expect(result).to.satisfy(function (t) {
        return !!(Array.isArray(t) || t === undefined);
      });
    });

  });

  describe('write', function () {

    it.skip('type is not in types', function () {
      var type = 'xxxx';
      var isWrite = clipboard.write(type, 'xxxx');
      expect(isWrite).is.equal(clipboard.constants.FAIL);
    });

    it.skip('text/plain need string', function () {
      var type = 'text/plain', data = 123;
      var isWrite = clipboard.write(type, data);
      expect(isWrite).is.equal(clipboard.constants.FAIL);
    });

    it.skip('text/html need string', function () {
      var type = 'text/html', data = 123;
      var isWrite = clipboard.write(type, data);
      expect(isWrite).is.equal(clipboard.constants.FAIL);
    });

    it.skip('Files need a like-array', function () {
      var type = 'Files', data = {};
      var isWrite = clipboard.write(type, data);
      expect(isWrite).is.equal(clipboard.constants.FAIL);
    });

    it('text to clipboard', function () {
//      var type = 'text/plain', data = '中文';
//      var isWrite = clipboard.write(type, data);
//      clipboard.getAllValidFormats();
//      var tt = clipboard.read(type);
//      console.log('%o', tt);
//      expect(isWrite).is.equal(clipboard.constants.SUCCESS);
//      var tmp = ref.allocCString('你说什么', 'utf8');
//      console.log(tmp.toString());
//      var pointer = ref.alloc('pointer');
//      ref.writeCString(pointer, 0, '啥啥啥', 'utf8');
//      var r = ref.reinterpretUntilZeros(pointer, 1, 0);
//      console.log(r.toString());
//      var buf = new Buffer('hello world');
//      console.log(buf.length);
//      var pointer = ref.ref(buf);
//
//      var buf2 = ref.readPointer(pointer, 0, buf.length);
//      console.log(buf2.toString());
//
//
//      console.log(buf2.address());
//      console.log(buf.address());

//      var someBuffer = new Buffer('whatever');
//      var buf = ref.alloc('pointer');
//      ref.writePointer(buf, 0, someBuffer);
//
//      var tmp = ref.readPointer(buf, 0, someBuffer.length);
//      console.log(tmp.toString());

      var buf = new Buffer(4);
      buf.writeInt32LE(12345, 0);

      console.log(buf.address());  // ← 140362165284824

      buf.type = ref.types.int;

      console.log(buf.deref());  // ← 12345


      var one = buf.ref();

      console.log(one.deref().deref());  // ← 12345
    });

  });

  describe('clear', function () {
    it.skip('empty success', function () {
      var clear = clipboard.clear();
      expect(clear).to.be.equal(1);
    });
  });

});
