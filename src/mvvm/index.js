/**
 * mvvm
 * @author ydr.me
 * @create 2015-12-04 16:07
 */


define(function (require, exports, module) {
    'use strict';

    var klass = require('../utils/class.js');
    var dato = require('../utils/dato.js');
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
            the._options = options = dato.extend({}, defaults, options);
            the._scanner = scan.call(the, ele, directives, data, options);
            the._watcher = new Watcher(data, options);
            Emitter.pipe(the._watcher, the);
            the._render(data);
        },

        /**
         * 实例指令
         */
        directive: function () {
            // 实例指令
        },


        /**
         * 创建子 vm
         * @params ele
         * @params data
         * @returns {Mvvm}
         */
        child: function (ele, data) {
            var the = this;
            var child = new Mvvm(ele, data, the._options);

            child.parent = the;
            the.children = the.children || [];
            the.children.push(child);
            return child;
        },


        watch: function () {

        },


        /**
         * 渲染
         * @param data
         * @private
         */
        _render: function (data) {
            var the = this;
            var render = function (scanner, data) {
                dato.each(scanner.attributes, function (index, attribute) {
                    var directive = attribute.directive;

                    if (!directive) {
                        return;
                    }

                    directive.update();

                    if (attribute.varibles.length) {
                        the._watcher.watch(attribute.varibles, function (key, newValue, oldValue, parent) {
                            directive.update(key, newValue, oldValue, parent);
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