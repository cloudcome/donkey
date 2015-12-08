/**
 * mvvm
 * @author ydr.me
 * @create 2015-12-04 16:07
 */


define(function (require, exports, module) {
    'use strict';

    var allocation = require('../utils/allocation.js');
    var klass = require('../utils/class.js');
    var dato = require('../utils/dato.js');
    var typeis = require('../utils/typeis.js');
    var Emitter = require('../libs/emitter.js');
    /**
     * @type {Function}
     */
    var scan = require('./_scan.js');
    var Watcher = require('./_watcher.js');
    var defaults = {
        prefix: 'v',
        openTag: '{{',
        closeTag: '}}',
        timeout: 50
    };
    var directives = [];
    var ParentMvvm = klass.extend(Emitter).create(function (ele, data, options, parent, paths) {
        var the = this;

        the.parent = null;
        the.root = the;
        the.paths = [];
        the.children = [];

        if (parent) {
            the.parent = parent;
            the.paths = paths;
            parent.children.push(the);

            var root = parent;

            while (root.parent) {
                root = root.parent;
            }

            the.root = root;
        }
    });
    var Mvvm = klass.extend(ParentMvvm).create({
        constructor: function (ele, data, options) {
            var the = this;

            data = data || {};
            the.data = data;
            the._options = options = dato.extend({}, defaults, options);
            the._scanner = scan.call(the, ele, directives, data, options);
            the._watcher = new Watcher(data, options);
            Emitter.pipe(the._watcher, the);
            the._initEvent();
            the._initNode(data);
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            var isSameMVVM = function (paths) {
                if (paths.length !== the.paths.length) {
                    return false;
                }

                var ret = true;
                dato.each(paths, function (index, path) {
                    if (String(path) !== String(the.paths[index])) {
                        ret = false;
                        return false;
                    }
                });

                return ret;
            };

            // 广播事件
            the.on('broadcast', function (key, newValue, oldValue, paths) {
                if (isSameMVVM(paths)) {
                    debugger;
                }
            });

            // 冒泡事件
            the.on('bubble', function (key, newValue, oldValue, paths) {
                debugger;
            });
        },


        /**
         * 渲染
         * @param data
         * @private
         */
        _initNode: function (data) {
            var the = this;
            var render = function (scanner, data) {
                dato.each(scanner.attributes, function (index, attribute) {
                    var directive = attribute.directive;

                    if (!directive) {
                        return;
                    }

                    directive.update();

                    if (attribute.varibles.length) {
                        the._watcher.watch(attribute.varibles, function (key, newValue, oldValue, paths) {
                            directive.update(key, newValue, oldValue, paths);
                            var args = allocation.args(arguments);
                            args.unshift('broadcast');
                            // 数据变化了，向下广播
                            the.broadcast.apply(the, args);
                        });
                    }
                });

                if (scanner.directive) {
                    scanner.directive.update(data);

                    if (scanner.varibles.length) {
                        the._watcher.watch(scanner.varibles, function () {
                            scanner.directive.update(data);
                            //var args = allocation.args(arguments);
                            //args.unshift('bubble');
                            // 数据变化了，向上冒泡
                            //the.bubble.apply(the, args);
                        });
                    }
                }

                dato.each(scanner.children, function (index, _scanner) {
                    render(_scanner, data);
                });

            };

            render(the._scanner, data);
        },


        //getData: function () {
        //    var data = {};
        //    var readObj = function (obj) {
        //        var ret;
        //
        //        if (typeis.Object(obj)) {
        //            ret = {};
        //        } else if (typeis.Array(obj)) {
        //            ret = [];
        //        } else {
        //            return;
        //        }
        //
        //        dato.each(obj, function (key, val) {
        //            if (typeof val === 'object') {
        //                ret[key] = readObj(val);
        //            }
        //        });
        //
        //        return ret;
        //    };
        //
        //    readObj(this.data);
        //    return data;
        //},


        /**
         * 实例指令
         */
        directive: function () {
            // 实例指令
        },


        /**
         * 创建子 vm
         * @params ele {Object} 元素节点
         * @params data {Object} 数据
         * @params paths {Array} 从父级取数据的路径
         * @returns {Mvvm}
         */
        create: function (ele, data, paths) {
            var the = this;
            return new Mvvm(ele, data, the._options, the, paths);
        },


        /**
         * 事件向下传播
         * @returns {Mvvm}
         */
        broadcast: function () {
            var the = this;
            var args = arguments;

            //the.emit.apply(the, args);
            dato.each(the.children, function (index, child) {
                child.emit.apply(child, args);
                child.broadcast.apply(child, args);
            });

            return the;
        },


        /**
         * 事件向下传播
         * @returns {Mvvm}
         */
        bubble: function () {
            var the = this;
            var args = arguments;

            //the.emit.apply(the, args);
            if (the.parent) {
                the.parent.emit.apply(the.parent, args);
                the.parent.bubble.apply(the.parent, args);
            }

            return the;
        },

        watch: function () {

        }
    });


    /**
     * 静态指令
     * @param name
     * @param directive
     */
    Mvvm.directive = function (name, directive) {
        directive.name = name;
        directives.push(directive);
    };
    Mvvm.defaults = defaults;
    Mvvm.directives = directives;

    module.exports = Mvvm;
});