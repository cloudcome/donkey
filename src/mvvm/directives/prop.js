/**
 * v-prop
 * @author ydr.me
 * @create 2015-12-04 16:04
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;

    module.exports = {
        bind: function (ele, token) {
            this.$ele = $(ele);
            this.propName = token.value;
        },
        update: function () {
            this.$ele.prop(this.propName, Boolean(this.exec()));
        }
    };
});