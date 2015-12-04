/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 16:57
 */


define(function (require, exports, module) {
    'use strict';

    var dato = require('../utils/dato.js');

    var operators = [' ', '+', '-', '*', '/', '>', '<', '=', '!']
    var operatorsMap = {};

    dato.each(operators, function (index, token) {
        operatorsMap[token] = true;
    });


    /**
     * 此法分析
     * @param expression
     *
     * @example
     */
    module.exports = function (expression) {
        var inDoubleQuote = false;
        var inSingleQuote = false;
        var inSquareBrackets = false;
        var inPoint = false;
        var index = 0;
        var length = expression.length;
        var ret = {
            raw: expression,
            vars: []
        };
        var lastVar = '';
        var lastOperator = '';

        for (; index < length; index++) {
            var char = expression[index];

            if (inDoubleQuote) {
                if (char === '"') {
                    inDoubleQuote = false;
                }
            } else if (inSingleQuote) {
                if (char === '\'') {
                    inSingleQuote = false;
                }
            } else if (char === '"') {
                inDoubleQuote = true;
            } else if (char === '\'') {
                inSingleQuote = true;
            } else {
                if (operatorsMap[char]) {
                    if (lastVar) {
                        ret.vars.push(lastVar);
                        lastVar = '';
                    }
                } else {
                    lastVar += char;
                }
            }
        }

        if (lastVar) {
            ret.vars.push(lastVar);
        }

        return ret;
    };
});