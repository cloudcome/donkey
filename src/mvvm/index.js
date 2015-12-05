/**
 * mvvm
 * @author ydr.me
 * @create 2015-12-04 16:07
 */


define(function (require, exports, module) {
    'use strict';

    var klass = require('../utils/class.js');
    var dato = require('../utils/dato.js');
    var scan = require('./_scan.js');
    var Watcher = require('./_watcher.js');
    var defaults = {
        prefix: 'v',
        openTag: '{{',
        closeTag: '}}',
        timeout: 50
    };
    var directives = [];
    var Mvvm = module.exports = klass.create({
        constructor: function (ele, data, options) {
            var the = this;

            the._options = options = dato.extend({}, defaults, options);
            the._scanner = scan(ele, directives, data, options);
            the._watcher = new Watcher(data, options);
            the._render(data);
        },

        directive: function () {
            // 实例指令
        },

        _render: function (data) {
            var the = this;
            var render = function (scanner, data) {
                dato.each(scanner.attributes, function (index, attribute) {
                    var directive = attribute.directive;

                    if (!directive) {
                        return;
                    }

                    directive.update(data);

                    if (attribute.varibles.length) {
                        the._watcher.watch(attribute.varibles, function () {
                            directive.update(data);
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
        directive = directive(Mvvm);
        directive.name = name;
        directives.push(directive);
    };
    Mvvm.defaults = defaults;
    Mvvm.directives = directives;
    Mvvm.excute = require('./_eval.js');
});