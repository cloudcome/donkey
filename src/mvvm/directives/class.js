/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 16:04
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;

    module.exports = function (Mvvm) {
        return {
            bind: function (ele, className, expression) {
                this.$ele = $(ele);
                this.className = className;
                this.expression = expression;
            },
            update: function (newValue) {
                if (Mvvm.excute(this.expression, newValue)) {
                    this.$ele.addClass(this.className);
                } else {
                    this.$ele.removeClass(this.className);
                }
            }
        };
    };
});