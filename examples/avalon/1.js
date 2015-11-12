/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-09 13:01
 */


define(function (require, exports, module) {
    'use strict';

    var dato = require('../../src/utils/dato.js');
    var avalon = window.avalon;

    var div1 = avalon.define('div1', function (vm) {
        vm.name = 'cloudcome';
        vm.age = 20;
    });

    var div2 = avalon.define('div2', function (vm) {
        dato.extend(vm, {
            name: 'yundanran',
            addAge: function () {
                div1.age++;
            },
            delAge: function (num) {
                div1.age -= num;
            }
        });
    });

    avalon.define({
        $id: 'div3',
        name: '<h2>呵呵</h2>'
    });

    avalon.scan();
});