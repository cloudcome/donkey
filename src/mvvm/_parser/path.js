/**
 * 路径解析
 * @author ydr.me
 * @create 2015-12-06 13:37
 */


define(function (require, exports, module) {
    'use strict';

    module.exports = function (string, parentData) {
        var paths = [];
        var index = 0;
        var length = string.length;
        // []
        var inSquareBrackets = false;
        // ""
        var inDoubleQuote = false;
        // ''
        var inSingleQuote = false;
        // .
        var inPoint = false;
        var squareBracketsQuote = '';
        var lastChar = '';
        var lastPath = '';

        var pushPath = function () {
            if (lastPath) {
                paths.push(lastPath);
            }

            lastPath = '';
        };

        for (; index < length; index++) {
            var char = string[index];

            if (char === '[' && !inSquareBrackets) {
                inSquareBrackets = true;
                inPoint = false;
            } else if (char === ']' && inSquareBrackets) {
                if (lastChar === squareBracketsQuote) {
                    squareBracketsQuote = '';
                    inSingleQuote= false;
                    inDoubleQuote = false;
                    pushPath();
                    inSquareBrackets = false;
                } else {
                    lastPath += char;
                }
            } else if (inSquareBrackets && char === '"' && !inSingleQuote) {
                squareBracketsQuote = char;
                inDoubleQuote = true;
            } else if (inSquareBrackets && char === '\'' && !inDoubleQuote) {
                squareBracketsQuote = char;
                inSingleQuote = true;
            } else if (char === '.' && !inSquareBrackets) {
                pushPath();
                inPoint = true;
            } else {
                lastPath += char;
            }

            lastChar = char;
        }

        pushPath();

        return {
            raw: string,
            paths: paths
        };
    };
});