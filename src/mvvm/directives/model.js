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
                the.$ele.on('input propertychange', function () {
                    data[token.expression] = this.value;
                });
            },
            update: function (newValue) {
                this.$ele.val(Mvvm.excute(this.expression, newValue));
            }
        };
    };
});