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

    var REG_ATTR = /^attr-/;

    var parseType = function (type) {
        type = type.replace(REG_ATTR, '');

        var types = type.split('-');
        var name = types.shift();

        return {
            name: name,
            type: types.join('-')
        };
    };
    var directiveId = 0;
    var defaults = {};
    var Directive = klass.create({
        constructor: function (directive, options) {
            var the = this;

            the._id = directiveId++;
            the._directive = directive;
            the._options = dato.extend({}, defaults, options);
            // 复制指令属性到当前实例
            dato.each(the._directive, function (key, val) {
                the[key] = val;
            });
            the.bind = function (node, type, value) {
                var the = this;
                var options = the._options;
                var ret = parseType(type);

                the._directiveName = ret.name;
                if (typeis.Function(the._directive.bind) && the._directive.name === ret.name) {
                    the._directive.bind.call(the, node, ret.type, value);
                }
            };
            the.update = function (newValue) {
                var the = this;
                var options = the._options;
                if (typeis.Function(the._directive.update) && the._directive.name === the._directiveName) {
                    the._directive.update.call(the, newValue);
                }
            };
            the.destroy = function () {
                var the = this;
                var options = the._options;

                if (typeis.Function(the._directive.destroy) && the._directive.name === the._directiveName) {
                    the._directive.destroy.call(the);
                }
            };
        }
    });

    Directive.defaults = defaults;
    module.exports = Directive;
});