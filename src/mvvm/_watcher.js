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
    var parser = require('./_parser.js');

    module.exports = function (obj, scanner) {
        dato.each(obj, function (key, val) {
            if (key[0] !== '$' && key[0] !== '_') {
                scanner;
                debugger;
                watch.watch(obj, key, function () {
                    //
                });
            }
        });
    };
});