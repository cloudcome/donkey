/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-09 13:01
 */


define(function (require, exports, module) {
    'use strict';

    var dato = require('../../src/utils/dato.js');
    var avalon = window.avalon;

    avalon.define('radio', function (vm) {
        vm.radio = '1';
        vm.radio2 = false;
    });

    avalon.define('checkbox', function (vm) {
        vm.checkbox = ['1'];
    });

    avalon.define('select', function (vm) {
        vm.select1 = '1';
        vm.select2 = ['1'];
    });

    avalon.scan();
});