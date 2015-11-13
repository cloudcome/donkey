/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-13 15:46
 */


define(function (require, exports, module) {
    /**
     * @module parent/todolist
     */

    'use strict';

    var $ = window.jQuery;
    var Avalon = window.Avalon;
    var Vue = window.Vue;
    var avalon = window.avalon;

    var data = window.data = {
        todo: '',
        list: [{
            text: 'demo',
            done: false
        }]
    };

    window.vm = avalon.define($.extend(data, {
        $id: 'todoList1',
        add: function (eve) {
            if (eve.which === 13) {
                vm.list.push({
                    text: data.todo,
                    done: false
                });
                data.todo = '';
            }
        },
        check: function (index, item) {
            item.done = !item.done;
        }
    }));
    avalon.scan();

    //window.av = new Avalon({
    //    el: 'todoList2',
    //    data: data,
    //    methods: {
    //        add: function (eve) {
    //            if (eve.which === 13) {
    //                data.list.push({
    //                    text: av.todo,
    //                    done: false
    //                });
    //                data.todo = '';
    //            }
    //        },
    //        check: function (index, item) {
    //            item.done = !item.done;
    //        }
    //    }
    //});

    //window.vue = new Vue({
    //    el: '#todoList3',
    //    data: data,
    //    methods: {
    //        add: function (eve) {
    //            if (eve.which === 13) {
    //                data.list.push({
    //                    text: data.todo,
    //                    done: false
    //                });
    //                data.todo = '';
    //            }
    //        },
    //        check: function (index, item) {
    //            item.done = !item.done;
    //        }
    //    }
    //});
});