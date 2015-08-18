/*!
 * string
 * @author ydr.me
 * @create 2015-08-10 15:42
 */


define(function (require, exports, module) {
    'use strict';

    // @ref https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    }
});