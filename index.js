/**
 * clipboardset DEBUG=*,-not_this
 * Created by lenovo on 2017/6/27.
 */
var debug = require('debug');
debug.log = console.info.bind(console);
var log = debug('clipboard:index');
log('init.');
log('%o', {a: 1});
setInterval(function () {
  log('2');
}, 1000);

module.exports = {};