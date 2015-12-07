/**
 * mvvm
 * @author ydr.me
 * @create 2015-12-04 16:07
 */


define(function (require, exports, module) {
    'use strict';

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
    var Mvvm = module.exports = klass.extend(Emitter).create({
        constructor: function (ele, data, options) {
            var the = this;

            data = data || {};
            the.data = data;
            the.parent = null;
            the.paths = [];
            the.children = [];
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
                        });
                    }
                });

                if (scanner.directive) {
                    scanner.directive.update(data);

                    if (scanner.varibles.length) {
                        the._watcher.watch(scanner.varibles, function () {
                            scanner.directive.update(data);
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
            var child = new Mvvm(ele, data, the._options);

            child.parent = the;
            child.paths = paths;
            the.children.push(child);
            return child;
        },


        /**
         * 事件向下传播
         * @returns {exports}
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
         * @returns {exports}
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
    Mvvm.excute = require('./_eval.js');
});