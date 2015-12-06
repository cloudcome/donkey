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
    var parseExpression = require('./_parser/expression.js');
    var parseText = require('./_parser/text.js');
    var parseArgs = require('./_parser/args.js');
    var parsePath = require('./_parser/path.js');

    var directiveId = 0;
    var defaults = {};
    var Directive = klass.create({
        constructor: function (node, directive, token, data, mvvm) {
            var the = this;
            var _directiveName = null;

            the._id = directiveId++;
            the.node = node;
            the.directive = directive;
            the.token = token;
            the.data = data;
            the.mvvm = mvvm;

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

            /**
             * 执行表达式
             * @param [_expression]
             * @param [_data]
             * @returns {*}
             */
            the.exec = function (_expression, _data) {
                if (typeis.Object(_expression)) {
                    _data = _expression;
                    _expression = null;
                }

                return eval2.expression(_expression || token.expression, _data || data);
            };

            /**
             * 解析表达式
             * @param [_expression]
             * @returns {*}
             */
            the.parseExpression = function (_expression) {
                return parseExpression(_expression || token.expression);
            };

            /**
             * 解析表达式
             * @param [_expression]
             * @returns {*}
             */
            the.parseText = function (_expression) {
                return parseText(_expression || token.expression);
            };

            /**
             * 解析参数
             * @param [_expression]
             * @returns {*}
             */
            the.parseFunction = function (_expression) {
                var fnName = '';
                var raw = _expression = _expression || token.expression;

                _expression = _expression
                    .replace(/^[^(]+\(/, function (_fnName) {
                        fnName = _fnName.slice(0, -1);
                        return '';
                    })
                    .replace(/\)[^)]*$/, '');

                var ret = parseArgs(fnName ? _expression : '');
                ret.fnName = fnName || _expression.trim();
                ret.raw = raw;
                return ret;
            };


            ///**
            // * 根据路径获取数据
            // * @param _path
            // * @param _data
            // * @returns {*}
            // */
            //the.getValue = function (_path, _data) {
            //    _path = _path || token.expression;
            //    _data = _data || data;
            //
            //    var paths = parsePath(_path).paths;
            //    return eval2.path(paths, _data);
            //};
        }
    });

    Directive.defaults = defaults;
    module.exports = Directive;
});