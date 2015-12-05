/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 11:38
 */


define(function (require, exports, module) {
    'use strict';

    var Mvvm = require('../../src/mvvm/index.js');

    Mvvm.directive('class', require('../../src/mvvm/directives/class.js'));

    var data = window.data = {
        big: true
    };

    new Mvvm(document.getElementById('demo'), data);

    setInterval(function () {
        data.big = !data.big;
    }, 1000);
});