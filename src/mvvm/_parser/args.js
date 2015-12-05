/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-05 22:51
 */


define(function (require, exports, module) {
    /**
     * @module parent/args
     */

    'use strict';

    module.exports = function (string) {
        string = string || '';
        var args = [];
        var inDoubleQuote = false;
        var inSingleQuote = false;
        var lastArg = '';
        var index = 0;
        var length = string.length;

        var pushArg = function () {
            if (lastArg) {
                args.push(lastArg);
            }

            lastArg = '';
        };

        for (; index < length; index++) {
            var char = string[index];

            if (inDoubleQuote) {
                if (char === '"') {
                    inDoubleQuote = false;
                }

                lastArg += char;
            } else if (inSingleQuote) {
                if (char === '\'') {
                    inSingleQuote = false;
                }

                lastArg += char;
            } else if (char === '"') {
                inDoubleQuote = true;
                lastArg += char;
            }
            else if (char === '\'') {
                inSingleQuote = true;
                lastArg += char;
            } else if (char === ',') {
                pushArg();
            } else {
                lastArg += char;
            }
        }

        pushArg();

        return {
            raw: string,
            args: args
        };
    };
});