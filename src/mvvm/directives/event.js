/**
 * v-on
 * @author ydr.me
 * @create 2015-12-05 21:55
 */


define(function (require, exports, module) {
    /**
     * @module parent/event
     */

    'use strict';

    module.exports = {
        bind: function (ele, token) {
            var the = this;

            switch (token.value){
                case 'enter':
                    break;

                default:
                    $(ele).on(token.value, function () {
                        the.data[token.expression]();
                    });
                    break;
            }
        }
    };
});