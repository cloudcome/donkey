/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 16:57
 */


define(function (require, exports, module) {
    'use strict';


    /**
     * 分隔表达式为键值对
     * @param expression
     * @param keyIsVarible
     *
     * @example
     * 'abc' + def: true
     * // => key: 'abc' + def
     * // => val: true
     */
    exports.split = function (expression, keyIsVarible) {
        var inDoubleQuote = false;
        var inSingleQuote = false;

        var arr = expression.split(':');

        return {
            key: (arr[0] || '').trim(),
            val: (arr[1] || '').trim()
        };
    };
});