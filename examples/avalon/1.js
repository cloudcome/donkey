/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-09 13:01
 */


define(function (require, exports, module) {
    'use strict';

    var avalon = window.avalon;

    avalon.define('div', function (vm) {
        vm.name = 'cloudcome';
        vm.age = 20;
        vm.fullAge = {
            get: function () {
                return this.age + '岁';
            },
            set: function (age) {
                this.age = age;
            }
        };
    });
});