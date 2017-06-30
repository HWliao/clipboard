clipboard
========

基于node-ffi调用win32 clipboard api读取/写入系统剪贴板.

**WARNING**: windows 系统剪贴板中数据格式多种多样,目前只支持读取和写入文件列表.
对应clipboard format:HDROP 15

用法
-------

``` js
var x = 1;
```

依赖
------------

 * node-ffi

安装
------------

``` bash
$ npm install ffi
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