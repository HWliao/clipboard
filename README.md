clipboard
========

基于node-ffi调用win32 clipboard api读取/写入系统剪贴板.

**WARNING**: windows 系统剪贴板中数据格式多种多样,目前只支持读取和写入 普通文本 html 文件列表
有可能存在编码问题!!!

用法
-------

``` js
// 返回null 0 undefined 表示失败
var clipboard = require('clipboard');
// 粘贴 读取剪贴板
// 文本类型 text/plain 对应CF_TEXT
var textData = clipboard.read('text/plain'); // {type: type, format: cf, data: text}
// html text/html 对应HTML Format
var htmlData = clipboard.read('text/plain'); // {type: type, format: cf, data: html}
// 文件列表 Files 对应CF_HROP
var fileData = clipboard.read('text/plain'); // {type: type, format: cf, data: files} 文件路径数组
// 读取以上 3种类型
var data = clipboard.readAll();
// 获取所有有效类型
var formats = clipboard.getAllValidFormats();
// 复制 写入剪贴板
clipboard.write('text/plain','test');
clipboard.write('text/html','<span>test</span>');
clipboard.write('Files',['/test']);
// 清空剪贴板
clipboard.clear();

```

依赖
------------

 * node-ffi

安装
------------

``` bash
$ npm install clipboard
```

构建
------------

``` bash
$ git clone git@github.com:HWliao/clipboard.git
$ cd cliopboard
$ npm install
```

License
-------

MIT License. See the `LICENSE` file.