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
                the.$ele.on('input propertychange', this.oninput = function () {
                    the.trigger = true;
                    the.set(this.value);
                }).on('blur', this.onblur = function () {
                    the.trigger = false;
                });
            },
            update: function (newValue) {
                if (!this.trigger) {
                    this.$ele.val(Mvvm.excute(this.expression, newValue));
                }
            },
            unbind: function () {
                this.$ele.off('input propertychange', this.oninput);
                this.$ele.off('blur', this.onblur);
            }
        };
    };
});