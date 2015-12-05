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

    var directiveId = 0;
    var defaults = {};
    var Directive = klass.create({
        constructor: function (directive) {
            var the = this;
            var _directiveName = null;

            the._id = directiveId++;
            the._directive = directive;
            // 复制指令属性到当前实例
            // name 等
            dato.each(the._directive, function (key, val) {
                the[key] = val;
            });
            the.bind = function (node, token, data) {
                var the = this;
                var ret = true;

                _directiveName = token.name;

                if (typeis.Function(the._directive.bind) && the.name === _directiveName) {
                    ret = the._directive.bind.call(the, node, token, data);
                }

                return ret;
            };
            the.update = function (newValue) {
                var the = this;

                if (typeis.Function(the._directive.update) && the.name === _directiveName) {
                    the._directive.update.call(the, newValue);
                }
            };
            the.destroy = function () {
                var the = this;

                if (typeis.Function(the._directive.destroy) && the.name === _directiveName) {
                    the._directive.destroy.call(the);
                }
            };
        }
    });

    Directive.defaults = defaults;
    module.exports = Directive;
});