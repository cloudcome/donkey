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
    var hrEl = document.getElementById('hr');

    var copy = new Copy('.copy', {
        text: function (e) {
            console.log(e);
            return Math.random() + '' + Date.now();
        }
    });

    copy.on('ready', function (e) {
        console.log('copy ready ', e);
    });

    copy.on('copy', function (e) {
        console.log('copy... ', e);
        //copy.setText('呵呵匹配' + Math.random());
    });

    copy.on('copied', function (e) {
        console.log('copied ', e);
    });

    document.getElementById('add').onclick = function () {
        var aEl = document.createElement('a');

        aEl.innerHTML = '复制我';
        copy.unclip('.copy');
        copy.clip(aEl);
        document.body.insertBefore(aEl, hrEl);
    };

    window.cp = copy;
});