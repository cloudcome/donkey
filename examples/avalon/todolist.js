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

    window.data2 = {
        $id: 'todoList1',
        todo: '',
        list: [{
            text: 'demo',
            done: false
        }],
        list2: ['abc', 'b890', 'a123', 'a456'],
        abc: {
            def: 123
        },
        add: function (eve) {
            if (eve.which === 13) {
                vm.list.push({
                    text: vm.todo,
                    done: false
                });
                vm.todo = '';
            }
        },
        check: function (index, item) {
            item.done = !item.done;
        }
    };

    avalon.filter('uppercase', function (value, prefix) {
        return prefix + value.toUpperCase();
    });
    var vm = window.vm = avalon.define(data2);
    vm.$watch('todo', function (newValue, oldValue, key) {
        console.log(arguments);
    });

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

    window.vue = new Vue({
        el: '#todoList3',
        data: data,
        methods: {
            add: function (eve) {
                if (eve.which === 13) {
                    data.list.push({
                        text: data.todo,
                        done: false
                    });
                    data.todo = '';
                }
            },
            check: function (index, item) {
                item.done = !item.done;
            }
        }
    });
});