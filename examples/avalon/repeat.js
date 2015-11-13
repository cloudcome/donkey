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

    var Avalon = window.Avalon;
    Avalon.filter('add', function (val, val2) {
        return val + val2;
    });
    var vm = new Avalon({
        el: 'repeat',
        data: {
            list1: ['<h1>abc</h1>', 'def', 'xyz'],
            list2: {
                abc: 'ABC',
                def: 'DEF',
                xyz: 'XYZ'
            }
        },
        methods: {
            addSuffix: function (index) {
                vm.list1.set(index, vm.list1[index] + '0');
            },
            remove: function (index) {
                vm.list1.splice(index, 1);
            },
            push: function () {
                vm.list1.push(Date.now());
            }
        }
    });

    window.vm = vm;
});