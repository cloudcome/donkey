/*!
 * attribute
 * @author ydr.me
 * @create 2015-09-16 21:57
 */


define(function (require, exports, module) {
    /**
     * @module core/dom/attribute.js
     * @requires core/navigator/compatible
     */

    'use strict';
    var compatible = require('../navigator/compatible.js');
    var REG_PX = /margin|width|height|padding|top|right|bottom|left|translate|font/i;
    var REG_DEG = /rotate|skew/i;
    var REG_TRANSFORM_WORD = /translate|scale|skew|rotate|matrix|perspective/i;
    var REG_IMPORTANT = /\s!important$/i;
    var REG_TRANSFORM_KEY = /transform/i;
    var REG_PERCENT = /%/;
    // +123.456
    // -123.456
    var regNum = /^[+\-]?\d+(\.\d*)?$/;
    var regEndPoint = /\.$/;
    var regHump = /-(\w)/g;
    var regSep = /^-+|-+$/g;
    var regSplit = /[A-Z]/g;
    var regSpace = /\s+/;


    /**
     * 修正 css 键值
     * @param {String} key css 键
     * @param {*} [val] css 值
     * @returns {{key: String, val: *}}
     *
     * @example
     * attribute.fixCss('translateX', 10);
     * // =>
     * // {
     * //    key: 'transform',
     * //    val: 'translateX(10px)',
     * //    imp: false
     * // }
     *
     * attribute.fixCss('marginTop', '10px !important');
     * // =>
     * // {
     * //    key: 'margin-top',
     * //    val: '10px',
     * //    imp: true
     * // }
     */
    exports.fixCss = function (key, val) {
        val = val === null ? '' : String(val).trim();

        var important = null;

        if (REG_IMPORTANT.test(val)) {
            important = 'important';
            val = val.replace(REG_IMPORTANT, '');
        }

        var fixkey = key;
        var fixVal = _toCssVal(key, val);

        if (REG_TRANSFORM_WORD.test(key)) {
            fixkey = 'transform';
            fixVal = key + '(' + fixVal + ')';
        }

        return {
            key: compatible.css3(_toSepString(fixkey)),
            val: compatible.css3(fixVal) || fixVal,
            imp: important
        };
    };

    /**
     * 转换驼峰为分隔字符串
     * @param {String} string 原始字符串
     * @returns {String} string  格式化后的字符串
     * @private
     */
    function _toSepString(string) {
        return regHump.test(string) ?
            string :
            string.replace(regSep, '').replace(regSplit, function ($0) {
                return '-' + $0.toLowerCase();
            });
    }


    /**
     * 转换纯数字的css属性为字符，如：width=100 => width=100px
     * @param {String} key css属性
     * @param {String|Number} val css属性值
     * @returns {*}
     * @private
     */
    function _toCssVal(key, val) {
        val += '';

        if (!REG_PX.test(key) && !REG_DEG.test(key)) {
            return val;
        }

        if (regNum.test(val)) {
            return val.replace(regEndPoint, '') +
                (REG_PX.test(key) ? 'px' : 'deg');
        }

        return val;
    }
});