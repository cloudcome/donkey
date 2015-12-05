/**
 * v-class
 * @author ydr.me
 * @create 2015-12-04 16:04
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;

    module.exports = {
        bind: function (ele, token) {
            this.$ele = $(ele);
            this.className = token.value;
        },
        update: function () {
            if (Boolean(this.exec())) {
                this.$ele.addClass(this.className);
            } else {
                this.$ele.removeClass(this.className);
            }
        }
    };
});