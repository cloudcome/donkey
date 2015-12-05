/**
 * v-attr
 * @author ydr.me
 * @create 2015-12-04 16:04
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;

    module.exports = {
        bind: function (ele, token) {
            this.$ele = $(ele);
            this.attrName = token.value;
        },
        update: function () {
            if (Boolean(this.exec())) {
                this.$ele.addClass(this.className);
            } else {
                this.$ele.removeClass(this.className);
            }

            this.$ele.addClass(this.attrName, Boolean(this.exec()) ? '':'');
        }
    };
});