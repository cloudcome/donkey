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
    var watch = require('../3rd/watch.js');
    var defaults = {
        prefix: 'v'
    };
    var directives = [];
    var Mvvm = module.exports = klass.create({
        constructor: function (ele, data, options) {
            var the = this;

            the._options = options = dato.extend({}, defaults, options);
            the._scanner = scan(ele, directives, options);
            the._render(data);
        },

        directive: function () {
            // 实例指令
        },

        _render: function (data) {
            var the = this;
            var render = function (scanner) {
                dato.each(scanner, function (tagName, info) {
                    dato.each(info.attributes, function (index, meta) {
                        dato.each(meta.directives, function (index, directive) {
                            directive.update(data);
                        });
                    });

                    dato.each(info.children, function (index, scanner) {
                        render(scanner, data);
                    });
                });
            };

            render(the._scanner, data);
        }
    });

    Mvvm.directive = function (directive) {
        directives.push(directive);
    };
    Mvvm.defaults = defaults;
    Mvvm.directives = directives;
});