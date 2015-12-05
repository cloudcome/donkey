/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 11:38
 */


define(function (require, exports, module) {
    'use strict';

    var Mvvm = require('../../src/mvvm/index.js');

    Mvvm.directive('class', require('../../src/mvvm/directives/class.js'));
    Mvvm.directive('text', require('../../src/mvvm/directives/text.js'));

    var data = window.data = {
        big: false,
        text: '默认',
        name: '呵呵',
        html: '<s>html</s>'
    };

    new Mvvm(document.getElementById('demo'), data);

    setTimeout(function () {
        data.big = !data.big;
        data.text = Math.random();
        data.name = Math.random();
        data.html = '<s>' + Math.random() + '</s>';
    }, 3000);
});