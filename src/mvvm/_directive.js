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
    var eval2 = require('./_eval.js');

    var directiveId = 0;
    var defaults = {};
    var Directive = klass.create({
        constructor: function (node, directive, token, data) {
            var the = this;
            var _directiveName = null;

            the._id = directiveId++;
            the.node = node;
            the.directive = directive;
            the.token = token;
            the.data = data;

            // 复制指令属性到当前实例
            // name 等
            dato.each(directive, function (key, val) {
                the[key] = val;
            });

            // 绑定指令
            the.bind = function () {
                var the = this;
                var ret = true;

                _directiveName = token.name;

                if (typeis.Function(directive.bind) && the.name === _directiveName) {
                    ret = the.directive.bind.call(the, node, token);
                }

                return ret;
            };

            // 更新指令
            the.update = function (newValue) {
                var the = this;

                if (typeis.Function(directive.update) && the.name === _directiveName) {
                    the.directive.update.call(the, newValue);
                }
            };

            // 解绑指令
            the.unbind = function () {
                var the = this;

                if (typeis.Function(directive.unbind) && the.name === _directiveName) {
                    the.directive.unbind.call(the);
                }
            };

            // 设置值
            the.set = function (value) {
                data[token.expression] = value;
            };

            // 执行表达式
            the.exec = function () {
                return eval2(token.expression, data);
            };
        }
    });

    Directive.defaults = defaults;
    module.exports = Directive;
});