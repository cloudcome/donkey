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
            bind: function (ele, attrValue, expression) {
                this.$ele = $(ele);
                this.expression = expression;
            },
            update: function (newValue) {
                this.$ele.text(Mvvm.excute(this.expression, newValue));
            }
        };
    };
});