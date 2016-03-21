/**
 * 文件描述
 * @author ydr.me
 * @create 2016-03-21 10:11
 */


define(function (require, exports, module) {
    /**
     * @module parent/copy
     */

    'use strict';

    var Copy = require('../../src/ui/copy/index.js');

    var copy = new Copy('#copy', {
        text: Date.now()
    });

    copy.on('ready', function (e) {
        console.log('copy ready ', e);
    });

    copy.on('copy', function (e) {
        console.log('copy... ', e);
        copy.setText('呵呵匹配' + Math.random());
    });

    copy.on('copied', function (e) {
        console.log('copy ', e);
    });

    window.cp = copy;
});