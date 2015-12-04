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

    module.exports = function (obj, callback) {
        dato.each(obj, function (key, val) {
            if (key[0] !== '$' && key[0] !== '_') {
                watch.watch(obj, key, callback);
            }
        });
    };
});