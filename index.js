/**
 * clipboard 只实现了对文件列表的读取和写入
 * Created by lenovo on 2017/6/27.
 */
var debug = require('debug')('clipboard:index');
var platform = require('./lib/' + process.platform);
debug('i am index');

module.exports = {};