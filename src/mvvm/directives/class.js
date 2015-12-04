/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 16:04
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;

    var eval2 = require('../_eval.js');

    module.exports = {
        name: 'class',
        bind: function (ele, className, expression) {
            this.$ele = $(ele);
            this.className = className;
            this.expression = expression;
        },
        update: function (newValue) {
            if (eval2(this.expression, newValue)) {
                this.$ele.addClass(this.className);
            }
        }
    };
});