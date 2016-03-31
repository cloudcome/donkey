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
    var random = require('../../src/utils/random.js');
    var msgEl = document.getElementById('msg');
    var hrEl = document.getElementById('hr');
    var copyEl = document.getElementById('copy');

    var copy = new Copy('.copy', {
        text: function (e) {
            console.log(e);
            return random.string(random.number(5, 20));
        }
    });

    setTimeout(function () {
        copyEl.remove();
        append();
    }, 10);


    var msg = function (text) {
        msgEl.innerHTML = text;
    };

    copy.on('ready', function (e) {
        console.log('copy ready ', e);
        msg('ready');
    });

    copy.on('copy', function (e) {
        console.log('copy... ', e);
        //copy.setText('呵呵匹配' + Math.random());
    });

    copy.on('copied', function (e) {
        console.log('copied ', e);
        msg('copied: ' + e.data['text/plain']);
    });

    copy.on('error', function (err) {
        alert(err.message);
    });

    var append = function () {
        var aEl = document.createElement('a');

        aEl.innerHTML = '复制我';
        copy.unclip('.copy');
        copy.clip(aEl);
        document.body.insertBefore(aEl, hrEl);
    };

    document.getElementById('add').onclick = append;

    window.cp = copy;
});