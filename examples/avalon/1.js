/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-09 13:01
 */


define(function (require, exports, module) {
    'use strict';

    var dato = require('../../src/utils/dato.js');
    var avalon = window.avalon;

    window.div1 = avalon.define('div1', function (vm) {
        vm.name = 'cloudcome';
        vm.age = 20;
    });

    window.div2 = avalon.define('div2', function (vm) {
        dato.extend(vm, {
            name: 'yundanran',
            age: 20,
            addAge: function () {
                div2.age++;
            },
            delAge: function (num) {
                div2.age -= num;
            }
        });
    });
});