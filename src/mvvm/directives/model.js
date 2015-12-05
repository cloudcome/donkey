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
            bind: function (ele, token, data) {
                var the = this;
                the.$ele = $(ele);
                the.expression = token.expression;
                the.trigger = false;
                the.$ele.on('input propertychange', function () {
                    the.trigger = true;
                    data[token.expression] = this.value;
                }).on('blur', function () {
                    the.trigger = false;
                });
            },
            update: function (newValue) {
                if (!this.trigger) {
                    this.$ele.val(Mvvm.excute(this.expression, newValue));
                }
            }
        };
    };
});