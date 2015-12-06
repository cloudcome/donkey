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
            var the = this;

            the.$ele = $(ele);
            the.attrName = token.value;
        },
        update: function () {
            var the = this;

            if (Boolean(the.exec())) {
                the.$ele.addClass(the.className);
            } else {
                the.$ele.removeClass(the.className);
            }

            the.$ele.addClass(the.attrName, Boolean(the.exec()) ? '':'');
        }
    };
});