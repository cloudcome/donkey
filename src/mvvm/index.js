/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 16:07
 */


define(function (require, exports, module) {
    /**
     * @module parent/index
     */

    'use strict';

    var klass = require('../utils/class.js');
    var dato = require('../utils/dato.js');
    var scan = require('./_scan.js');
    var watcher = require('./_watcher.js');
    var defaults = {
        prefix: 'v',
        openTag: '{{',
        closeTag: '}}'
    };
    var directives = [];
    var Mvvm = module.exports = klass.create({
        constructor: function (ele, data, options) {
            var the = this;

            the._options = options = dato.extend({}, defaults, options);
            the._scanner = scan(ele, directives, options);
            the._render(data);
            watcher(data, the._scanner);
        },

        directive: function () {
            // 实例指令
        },

        _render: function (data) {
            var the = this;
            var render = function (scanner, data) {
                dato.each(scanner, function (tagName, info) {
                    dato.each(info.attributes, function (index, attribute) {
                        var directive = attribute.directive;

                        if (!directive) {
                            return;
                        }

                        directive.update(data);

                        if (attribute.varibles.length) {
                            watcher(data, attribute.varibles, function () {
                                directive.update(data);
                            });
                        }
                    });

                    dato.each(info.children, function (index, _scanner) {
                        render(_scanner, data);
                    });
                });
            };

            render(the._scanner, data);
        }
    });

    Mvvm.directive = function (name, directive) {
        directive = directive(Mvvm);
        directive.name = name;
        directives.push(directive);
    };
    Mvvm.defaults = defaults;
    Mvvm.directives = directives;
    Mvvm.excute = require('./_eval.js');
});