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
        big: true,
        text: '默认',
        name: '呵呵'
    };

    new Mvvm(document.getElementById('demo'), data);

    setInterval(function () {
        data.big = !data.big;
        data.text = Date.now();
        data.name = Date.now();
    }, 1000);
});