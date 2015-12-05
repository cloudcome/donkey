/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 16:04
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;

    module.exports = {
        bind: function (ele, token) {
            this.$ele = $(ele);
            this.expression = token.expression;
        },
        update: function (newValue) {
            this.$ele.text(this.exec(this.expression, newValue));
        }
    };
});