/**
 * 数据监听变化
 * @author ydr.me
 * @create 2015-12-04 10:46
 */


define(function (require, exports, module) {
    /**
     * @module parent/observe
     */

    'use strict';

    var $ = window.jQuery;
    var dato = require('../utils/dato.js');
    var watch = require('../3rd/watch.js');

    Array.prototype.$push = function () {

    };

    var maskAccessors = function (obj, callback) {
        var accessors = {};
        dato.each(obj, function (key, val) {
            accessors[key] = {
                get: function () {
                    return val;
                },
                set: function (_val) {
                    callback(key, _val);
                    val = _val;
                },
                enumerable: true,
                configurable: true
            };
        });
        return accessors;
    };

    module.exports = function (obj, callback) {
        dato.each(obj, function (key, val) {
            if (key.charAt(0) !== '$' && key.charAt(0) !== '_') {
                watch.watch(obj, key, callback);
            }
        });
    };
});