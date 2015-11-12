/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-12 15:01
 */


define(function (require, exports, module) {
    /**
     * @module parent/repeat
     */

    'use strict';

    var avalon = window.avalon;

    avalon.define('repeat', function (vm) {
        vm.list1 = ['abc', 'def', 'xyz'];
        vm.list2 = {
            abc: 'ABC',
            def: 'DEF',
            xyz: 'XYZ'
        };
        vm.addSuffix = function (index) {
            vm.list1.set(index, vm.list1[index] + '0');
        };
        vm.push = function (vm) {
            vm.list1.push(Date.now());
        };
    });

    var vm = avalon.define({
        $id: 'repeat',
        list1: ['abc', 'def', 'xyz'],
        list2: {
            abc: 'ABC',
            def: 'DEF',
            xyz: 'XYZ'
        },
        addSuffix: function (index) {
            vm.list1.set(index, vm.list1[index] + '0');
        },
        push: function () {
            vm.list1.push(Date.now());
        }
    });
});