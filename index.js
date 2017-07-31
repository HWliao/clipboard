/**
 * 调用win32 clipboard api 实现 指定类型数据 读写
 * Created by lenovo on 2017/6/27.
 */
var debug = require('debug')('clipboard:clipboard');
var platform = require('./lib/' + process.platform);
var ref = require('ref');
var iconv = require('iconv-lite');
debug('init clipboar');

// 支持的类型
var types = {
  "Files": true,
  "text/plain": true,
  "text/html": true
};
debug('the formats:%o', types);

// 常量
var constants = {
  SUCCESS: 1,
  FAIL: 0
};
var TYPE_TEXT = 'text/plain';
var TYPE_HTML = 'text/html';
var TYPE_FILES = 'Files';

debug('the constants:%o', constants);

module.exports = {
  constants: constants,
  types: types,
  read: read,
  readAll: readAll,
  getAllValidFormats: getAllValidFormats,
  write: write,
  clear: clear
};
// ==== 私有属性 ====
// 剪贴板格式处理方法 读
var CFReadHandle = {};
CFReadHandle[TYPE_TEXT] = textReadHandle;
CFReadHandle[TYPE_HTML] = htmlReadHandle;
CFReadHandle[TYPE_FILES] = filesReadHandle;

// 剪贴板格式处理方法 写
var CFWriteHandle = {};
CFWriteHandle[TYPE_TEXT] = textWriteHandle;
CFWriteHandle[TYPE_HTML] = htmlWriteHandle;
CFWriteHandle[TYPE_FILES] = filesWriteHandle;

// 写入参数校验
var verifyParamForWrite = {};
verifyParamForWrite[TYPE_TEXT] = isText;
verifyParamForWrite[TYPE_HTML] = isText;
verifyParamForWrite[TYPE_FILES] = isFiles;

// ==== 导出方法 ====
function read(type) {
  var result;
  if (!types[type]) return;
  if (!openClipboard()) return;
  result = CFReadHandle[type]();
  closeClipboard();
  return result;
}

function readAll() {
  if (!openClipboard())return;
  var result = [];
  var iterator = getNextFormatInfo();
  while (iterator = iterator.next()) {
    var type = cfToType(iterator.format);
    if (type) {
      var typeR = CFReadHandle[type]();
      if (typeR) {
        result.push({
          type: type,
          format: iterator.format,
          formatName: iterator.formatName,
          data: typeR.data
        });
        debug('read all %d %o', result.length - 1, result[result.length - 1]);
      } else {
        debug('read all %s result is null', type);
      }
    }
  }
  closeClipboard();
  debug('read all result:%o', result);
  return result;
}

function getAllValidFormats() {
  if (!openClipboard()) return;
  var result = [];
  var iterator = getNextFormatInfo();
  while (iterator = iterator.next()) {
    if (cfToType(iterator.format))
      result.push({format: iterator.format, formatName: iterator.formatName, type: cfToType(iterator.format)});
  }
  closeClipboard();
  debug('all valid formats is %o', result);
  return result;
}
/**
 * 根据类型往clipboard中写入数据
 * @param type 类型
 * @param data 数据
 * @returns {number}
 */
function write(type, data) {
  if (!types[type]) {
    debug('the type %s is not in types %o', type, types);
    return constants.FAIL;
  }

  if (type === TYPE_TEXT && !isText(data)) {
    debug('the type %s \'s data %o is not a string', type, data);
    return constants.FAIL;
  }
  if (type === TYPE_FILES && !isFiles(data)) {
    debug('the type %s \'s data %o is not Files');
    return constants.FAIL;
  }
  if (type === TYPE_HTML && !(data && isText(data.html))) {
    debug('the type %s \'s data %o is not right', type, data);
    return constants.FAIL;
  }
  if (!openClipboard()) return constants.FAIL;

  var empty = platform.user32.EmptyClipboard();
  debug('do empty %d', empty);
  var isWrite = CFWriteHandle[type](data);
  debug('writ type %s data %o isWrite %s', type, data, isWrite);

  closeClipboard();
  return isWrite ? constants.SUCCESS : constants.FAIL;
}

function clear() {
  if (!openClipboard()) return;
  var empty = platform.user32.EmptyClipboard();
  debug('empty %d', empty);
  closeClipboard();
  return empty;
}

// ==== 私有方法 =====

/**
 * 获取一个format的迭代器
 * @returns {{format: number, formatName: string, next: next}}
 */
function getNextFormatInfo() {
  var format = 0, formatNameSize = 512;
  return {format: format, formatName: '', next: next};

  function next() {
    format = platform.user32.EnumClipboardFormats(format);
    if (format) {
      var r = {format: format};
      var tmp = Buffer.alloc(formatNameSize);
      tmp.type = ref.types.CString;
      platform.user32.GetClipboardFormatNameA(format, tmp, formatNameSize);
      if (ref.isNull(tmp)) {
        r.formatName = '';
      } else {
        r.formatName = tmp.readCString();
      }
      r.next = next;
      debug('the format %d,the format name %s', r.format, r.formatName);
      return r;
    } else {
      return false;
    }
  }
}

function openClipboard() {
  var open = platform.user32.OpenClipboard(0);
  debug('open clipboard %d', open);
  return open;
}

function closeClipboard() {
  var close = platform.user32.CloseClipboard();
  debug('close clipboard %d', close);
  return close;
}

function typeToCF(type) {
  if (!types[type]) return;
  if (type === TYPE_FILES) return platform.CF.HDROP;
  if (type === TYPE_TEXT) return platform.CF.TEXT;
  if (type === TYPE_HTML) return platform.CF.HTML;
}

function cfToType(cf) {
  if (cf === platform.CF.HDROP) return TYPE_FILES;
  if (cf === platform.CF.TEXT) return TYPE_TEXT;
  if (cf === platform.CF.HTML) return TYPE_HTML;
}

/**
 * 读取text/plain数据
 */
function textReadHandle(t, encoding) {
  var type = t || TYPE_TEXT;
  var cf = typeToCF(type);
  // 判断是否在单前剪贴板中有效
  var isvalid = platform.user32.IsClipboardFormatAvailable(cf);
  debug('type %s is avlid %d', type, isvalid);
  if (!isvalid) return;
  // 从剪贴板中获取数据句柄
  var handle = platform.user32.GetClipboardData(cf);
  debug('type %s read clipboard handle %d', type, handle);
  var reuslt;
  // 由数据句柄获取数据指针
  // 返回的指针直接指向 字符串数组的第一个字节位置
  var gRef = platform.kernel32.GlobalLock(handle);
  if (ref.isNull(gRef)) {
    debug('read the data pointer is NULL');
  } else {
    var buf = ref.reinterpretUntilZeros(gRef, 1, 0);
    var text = iconv.decode(buf, encoding || 'GBK');
    debug('type %s read text %s', type, text);
    reuslt = {type: type, format: cf, data: text};
  }
  platform.kernel32.GlobalUnlock(handle);
  return reuslt;
}
/**
 * 读取html,除了类型不同,处理方法和text/plain类型一致
 * @returns {{type, format, data}}
 */
function htmlReadHandle() {
  return textReadHandle(TYPE_HTML, 'utf8');
}

/**
 * 文件列表读取处理方法
 */
function filesReadHandle() {
  var type = TYPE_FILES;
  var cf = typeToCF(type);
  // 判断是否在单前剪贴板中有效
  var isvalid = platform.user32.IsClipboardFormatAvailable(cf);
  debug('type %s is avlid %d', type, isvalid);
  if (!isvalid) return;

  // 文件列表的复制粘贴这里需要读取2种类型来确定具体的行为, 这里默认当做复制
  var handle = platform.user32.GetClipboardData(cf);
  var result;
  // 读取内存中数据
  // HDROP中存储的文件列表数据由结构体和文件列表字符创组成
  // 这里借助win32 提供api进行解析
  var gRef = platform.kernel32.GlobalLock(handle);
  if (ref.isNull(gRef)) {
    debug('read the data pointer is NULL');
  } else {
    var data = [];

    var tmp = Buffer.alloc(512);
    tmp.type = ref.types.CString;
    // 获取文件列表长度
    var fileLength = platform.shell32.DragQueryFileA(gRef, 0xFFFFFFFF, tmp, 512);
    for (var i = 0; i < fileLength; i++) {
      // 获取单个文件字符长度
      var charNum = platform.shell32.DragQueryFileA(gRef, i, ref.NULL_POINTER, 0);
      // 获取单个文件的文件路径
      var fileName = Buffer.alloc(charNum + 1);
      fileName.type = ref.types.CString;
      platform.shell32.DragQueryFileA(gRef, i, fileName, charNum + 1);
      data.push(iconv.decode(ref.reinterpretUntilZeros(fileName, 1, 0), 'GBK'));
      debug('type %s read the %d file\'s name: %s', type, i, data[data.length - 1]);
    }
    result = {type: type, format: cf, data: data};
  }
  platform.kernel32.GlobalUnlock(handle);
  return result;
}

/**
 * 判断是否为文本
 * @param text
 * @returns {boolean}
 */
function isText(text) {
  return typeof text === 'string';
}

/**
 * 判断文件
 * @param files
 * @returns {boolean}
 */
function isFiles(files) {
  return files && files.length >= 0;
}

/**
 * 写入文本到剪贴板中
 * @param text 需要写入的文本
 * @param t 类型,默认text
 * @param encoding 编码 默认 bgk
 */
function textWriteHandle(text, t, encoding) {
  var type = t || TYPE_TEXT, cf = typeToCF(type);
  debug('text %s write to clipboard', text);
  var textBuf = iconv.encode(text, encoding || 'GBK');
  var size = textBuf.length + 1;

  debug('text %s to Buffer.and szie %d', text, size);
  // 分配一块可移动,固定大小的内存
  var handle = platform.kernel32.GlobalAlloc(platform.GMEM.MOVEABLE, size);
  debug('GlobalAlloc handle %d', handle);
  if (!handle) return;
  var gRef = platform.kernel32.GlobalLock(handle);
  if (ref.isNull(gRef)) {
    debug('the global lock poiter is null');
    return;
  }
  // 往分配的内存中写入数据
  debug('copy data to handle %d', handle);
  var sizeRef = ref.reinterpret(gRef, size, 0);
  for (var i = 0; i < size; i++) {
    if (i < textBuf.length) {
      var tmpdata = textBuf.readUInt8(i);
      sizeRef.writeUInt8(tmpdata, i)
    } else {
      sizeRef.writeUInt8(0, i);
    }
  }

  platform.kernel32.GlobalUnlock(handle);

  // 将handle写入到clipboard中
  var set = platform.user32.SetClipboardData(cf, handle);
  debug('set clip board %d', set);
  return set;
}

/**
 * 写入html format数据
 * @param data
 */
function htmlWriteHandle(data) {
  if (!data || !data.html) return;
  // 先设置一个text/plain类型
  var text = data.text || '';
  textWriteHandle(text);

  var url = data.url || 'about:blank';
  // 获取标准的html format的格式
  var formatHtml = getForamtHtml(data.html, url);
  return textWriteHandle(formatHtml, TYPE_HTML, 'utf8');
}

/**
 * 写入文件列表
 * @param data
 */
function filesWriteHandle(data) {
  var endianness = ref.endianness;
  // 1.设置剪贴板中 Preferred DropEffect 为 DROPEFFECT_COPY
  // DWORD 对应32位无符号整数
  var uintsize32 = ref.types.uint32.size;
  var pdhGblEffect = platform.kernel32.GlobalAlloc(platform.GMEM.MOVEABLE, uintsize32);
  if (!pdhGblEffect) {
    debug('the format %s GlobalAlloc handle %d', platform.CF.PD, pdhGblEffect);
    return;
  }
  var pDWDropEffect = platform.kernel32.GlobalLock(pdhGblEffect);
  if (ref.isNull(pDWDropEffect)) {
    debug('the format %s GlobalLock handle is NULL pointer');
    return;
  }
  var pDWDropEffectTo = ref.reinterpret(pDWDropEffect, uintsize32, 0);
  pDWDropEffectTo['writeUInt32' + endianness](platform.PD.DROPEFFECT_COPY, 0);
  debug('Preferred DropEffect format write DROPEFFECT_COPY %o', ref.reinterpret(pDWDropEffect, uintsize32, 0));
  platform.kernel32.GlobalUnlock(pdhGblEffect);
  // 2.设置剪贴板中 HDROP 中数据

  // 2.1 构造结构体
  // 2.2 构造文件列表
  // 2.3 写入内存
  // 2.4 将handle写入剪贴板

}

/**
 * 依据标准的html format格式生成对应格式字符串
 * @param html
 * @param url
 * @returns {string}
 */
function getForamtHtml(html, url) {
  var version = 'Version:1.0\n';
  var startHtml = 'StartHTML:0000000000\n';
  var endHtml = 'EndHTML:0000000000\n';
  var startFragment = 'StartFragment:0000000000\n';
  var endFragment = 'EndFragment:0000000000\n';
  var sourceURL = 'SourceURL:' + url + '\n';
  var s = '<html>';

  var e = '</body></html>';

  var start, end;
  var tmp = version + startHtml + endHtml + startFragment + endFragment + sourceURL + s;
  start = iconv.decode(tmp, 'utf8').length;
  tmp += '<body>' + html + e;
  end = iconv.decode(tmp, 'utf8').length;

  return [version,
    startHtml.replace('0000000000', pad(start, 10)),
    endHtml.replace('0000000000', pad(end, 10)),
    startFragment.replace('0000000000', pad(start, 10)),
    endFragment.replace('0000000000', pad(end, 10)),
    sourceURL,
    s,
    '<body>' + html,
    e].join('');
}

function pad(num, n) {
  var len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}