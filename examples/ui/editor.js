/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-24 11:52
 */


define(function (require, exports, module) {
    /**
     * @module parent/editor
     */

    'use strict';

    var Editor = require('../../src/ui/editor/index.js');

    var ed1 = window.ed1 = new Editor('#textarea1');
    var ed2 = window.ed2 = new Editor('#textarea2');

    ed1.on('upload', function (eve, file, done) {
        setTimeout(function () {
            done('http://p18.qhimg.com/t0144d6a0802f22be4f.jpg');
        });
    });
});