/**
 * clipboard 只实现了对文件列表的读取和写入
 * Created by lenovo on 2017/6/27.
 */
var debug = require('debug')('clipboard:clipboard');
var platform = require('./lib/' + process.platform);
debug('init clipboar');

// 支持的获取格式
var formats = {
  "Files": true
};
debug('the formats:%o', formats);
// 常量
var constants = {
  WRITE_SUCCESS: 1,
  WRITE_FAIL: 0
};
debug('the constants:%o', constants);
/**
 * 根据所给format读取clipboard
 * @param format
 */
function read(format) {
  if (!formats[format])return;

}

/**
 * 往format中写入data
 * @param format
 * @param data
 * @returns {number} 成功 WRITE_SUCCESS 失败 WRITE_FAIL
 */
function write(format, data) {
  return constants.WRITE_SUCCESS;
}

/**
 * 清除剪贴板中数据
 */
function clear() {
  platform.clear();
}
module.exports = {
  constants: constants,
  formats: formats,
  read: read,
  write: write,
  clear: clear
};