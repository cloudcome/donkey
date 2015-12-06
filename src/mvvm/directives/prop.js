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
            var the = this;

            the.$ele = $(ele);
            the.propName = token.value;
        },
        update: function () {
            var the = this;

            the.$ele.prop(the.propName, Boolean(the.exec()));
        }
    };
});