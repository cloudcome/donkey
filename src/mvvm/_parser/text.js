/**
 * 文本节点分析
 * @author ydr.me
 * @create 2015-12-05 16:29
 */


define(function (require, exports, module) {
    'use strict';

    module.exports = function (string, openTag, closeTag) {
        var ret = [];
        var index = 0;
        var length = string.length;
        var lastToken = '';
        var lastChar = '';
        var lastLastChar = '';
        var inToken = false;
        var inDoubleQuote = false;
        var inSingleQuote = false;
        var open0 = openTag[0];
        var open1 = openTag[1];
        var close0 = closeTag[0];
        var close1 = closeTag[1];
        var start = 0;

        var pushToken = function () {
            if (!lastToken) {
                start = index - 2;
                lastToken = openTag;
            }

            lastToken += char;
        };

        for (; index < length; index++) {
            var char = string[index];

            if (inDoubleQuote && inToken) {
                if (char === '"') {
                    inDoubleQuote = false;
                }

                pushToken();
            } else if (inSingleQuote && inToken) {
                if (char === '\'') {
                    inSingleQuote = false;
                }

                pushToken();
            }
            else if (char === '"' && inToken) {
                inDoubleQuote = true;
                pushToken();
            }
            else if (char === '\'' && inToken) {
                inSingleQuote = true;
                pushToken();
            }
            // {{
            else if (char === open1 && lastChar === open0 && !inToken && !inDoubleQuote && !inSingleQuote) {
                inToken = true;
            }
            // }}
            else if (char === close1 && lastChar === close0 && inToken && !inDoubleQuote && !inSingleQuote) {
                inToken = false;
                var raw = lastToken + close1;

                lastToken = '';
                ret.push({
                    token: raw,
                    expression: raw.slice(2, -2),
                    start: start,
                    end: index + 1
                });
            }
            // in token
            else if (inToken) {
                pushToken();
            }

            lastLastChar = lastChar;
            lastChar = char;
        }

        return {
            raw: string,
            tokens: ret
        };
    };
});