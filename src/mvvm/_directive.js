/**
 * 指令构造器
 * @author ydr.me
 * @create 2015-12-04 15:48
 */


define(function (require, exports, module) {
    'use strict';

    require('../polyfill/string.js');
    var klass = require('../utils/class.js');
    var dato = require('../utils/dato.js');
    var typeis = require('../utils/typeis.js');
    var allocation = require('../utils/allocation.js');

    var directiveId = 0;
    var defaults = {};
    var Directive = klass.create({
        constructor: function (directive, options) {
            var the = this;
            var _directiveName = null;

            the._id = directiveId++;
            the._directive = directive;
            the._options = dato.extend({}, defaults, options);
            // 复制指令属性到当前实例
            // name 等
            dato.each(the._directive, function (key, val) {
                the[key] = val;
            });
            the.bind = function (node, dirctiveName, dirctiveValue, expression) {
                var the = this;
                var options = the._options;
                var ret = true;
                var args = allocation.args(arguments);

                _directiveName = dirctiveName;
                if (typeis.Function(the._directive.bind) && the.name === dirctiveName) {
                    if (args.length === 4) {
                        ret = the._directive.bind.call(the, node, dirctiveValue, expression);
                    } else {
                        expression = args[2];
                        ret = the._directive.bind.call(the, node, expression);
                    }
                }

                return ret;
            };
            the.update = function (newValue) {
                var the = this;
                var options = the._options;
                if (typeis.Function(the._directive.update) && the.name === _directiveName) {
                    the._directive.update.call(the, newValue);
                }
            };
            the.destroy = function () {
                var the = this;
                var options = the._options;

                if (typeis.Function(the._directive.destroy) && the.name === _directiveName) {
                    the._directive.destroy.call(the);
                }
            };
        }
    });

    Directive.defaults = defaults;
    module.exports = Directive;
});