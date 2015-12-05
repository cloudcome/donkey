/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 16:57
 */


define(function (require, exports, module) {
    'use strict';

    var dato = require('../utils/dato.js');

    var allowedKeywords =
        'Math,Date,this,true,false,null,undefined,Infinity,NaN,' +
        'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' +
        'encodeURIComponent,parseInt,parseFloat';
    var REG_ALLOWED_KEYWORDS =
        new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');

// keywords that don't make sense inside expressions
    var improperKeywords =
        'break,case,class,catch,const,continue,debugger,default,' +
        'delete,do,else,export,extends,finally,for,function,if,' +
        'import,in,instanceof,let,return,super,switch,throw,try,' +
        'var,while,with,yield,enum,await,implements,package,' +
        'proctected,static,interface,private,public';
    var REG_IMPROPER_KEYWORDS =
        new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');
    var REG_VAR = /^[a-z_$]/i;
    var operators = [' ', '+', '-', '*', '/', '>', '<', '=', '!'];
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
        // ""
        var inDoubleQuote = false;
        // ''
        var inSingleQuote = false;
        // ()
        var inBrackets = false;
        // []
        var inSquareBrackets = false;
        // .
        var inPoint = false;
        var index = 0;
        var length = expression.length;
        var ret = {
            raw: expression,
            vars: []
        };
        var lastChar = '';
        var lastVar = '';
        var lastOperator = '';
        var pushVar = function () {
            if (lastVar && !REG_ALLOWED_KEYWORDS.test(lastVar) && !REG_IMPROPER_KEYWORDS.test(lastVar) &&
                REG_VAR.test(lastVar)
            ) {
                ret.vars.push(lastVar);
            }

            lastVar = '';
        };

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
            } else if (inSquareBrackets) {
                if (char === ']') {
                    inSquareBrackets = false;
                } else if (!inDoubleQuote && !inSingleQuote) {
                    lastVar += char;
                }
            } else if (inPoint) {
                if (operatorsMap[char]) {
                    inPoint = false;
                    pushVar();
                }
            } else if (char === '.') {
                if (lastChar && lastChar !== ' ') {
                    inPoint = true;
                }
            } else if (char === '[') {
                if (lastChar && lastChar !== ' ') {
                    inSquareBrackets = true;
                }
            } else {
                if (operatorsMap[char]) {
                    pushVar();
                } else {
                    lastVar += char;
                }
            }

            lastChar = char;
        }

        pushVar();

        return ret;
    };
});