/*!
 * 判断数据类型
 * @author ydr.me
 * @create 2014-11-15 12:54
 */


define(function (require, exports, module) {
    /**
     * @module utils/typeis
     */
    'use strict';

    require('../polyfill/object.js');
    var udf = 'undefined';
    var REG_URL = /^https?:\/\/([a-z\d-]+\.)+[a-z]{2,5}(\/|\/[\w#!:.?+=&%@!\-\/]+)?$/i;
    var REG_EMAIL = /^\w+[-+.\w]*@([a-z\d-]+\.)+[a-z]{2,5}$/i;
    var REG_INVALID = /invalid/i;


    /**
     * 判断数据类型，结果全部为小写<br>
     * 原始数据类型：boolean、number、string、undefined、symbol
     * @param {*} object 任何对象
     * @returns {string}
     *
     * @example
     * typeis();
     * // => "undefined"
     *
     * typeis(null);
     * // => "null"
     *
     * typeis(1);
     * // => "number"
     *
     * typeis("1");
     * // => "string"
     *
     * typeis(false);
     * // => "boolean"
     *
     * typeis({});
     * // => "object"
     *
     * typeis([]);
     * // => "array"
     *
     * typeis(/./);
     * // => "regexp"
     *
     * typeis(window);
     * // => "window"
     *
     * typeis(document);
     * // => "document"
     *
     * typeis(document);
     * // => "document"
     *
     * typeis(NaN);
     * // => "nan"
     *
     * typeis(Infinity);
     * // => "number"
     *
     * typeis(function(){});
     * // => "function"
     *
     * typeis(new Image);
     * // => "element"
     *
     * typeis(new Date);
     * // => "date"
     *
     * typeis(document.links);
     * // => "htmlcollection"
     *
     * typeis(document.body.dataset);
     * // => "domstringmap"
     *
     * typeis(document.body.classList);
     * // => "domtokenlist"
     *
     * typeis(document.body.childNodes);
     * // => "nodelist"
     *
     * typeis(document.createAttribute('abc'));
     * // => "attr"
     *
     * typeis(document.createComment('abc'));
     * // => "comment"
     *
     * typeis(new Event('abc'));
     * // => "event"
     *
     * typeis(document.createExpression());
     * // => "xpathexpression"
     *
     * typeis(document.createRange());
     * // => "range"
     *
     * typeis(document.createTextNode(''));
     * // => "text"
     */
    var typeis = function (object) {
        if (typeof object === udf) {
            return udf;
        } else if (typeof window !== udf && object === window) {
            return 'window';
        } else if (typeof global !== udf && object === global) {
            return 'global';
        } else if (typeof document !== udf && object === document) {
            return 'document';
        } else if (object === null) {
            return 'null';
        } else if (object !== object) {
            return 'nan';
        }

        var ret = Object.prototype.toString.call(object).slice(8, -1).toLowerCase();

        // android 5.0+ element 对象的 toString 不为 [Object HTMLElement...]
        if (object.nodeType === 1 && object.nodeName) {
            return 'element';
        }

        return ret;
    };
    var i = 0;
    var jud = 'string number function object undefined null nan element regexp boolean array window document global'.split(' ');
    var makeStatic = function (tp) {
        var tp2 = tp.replace(/^./, function ($0) {
            return $0.toUpperCase();
        });
        /**
         * 快捷判断
         * @name typeis
         * @property string {Function}
         * @property String {Function}
         * @property isString {Function}
         * @property number {Function}
         * @property Number {Function}
         * @property isNumber {Function}
         * @property function {Function}
         * @property Function {Function}
         * @property isFunction {Function}
         * @property object {Function}
         * @property Object {Function}
         * @property isObject {Function}
         * @property undefined {Function}
         * @property Undefined {Function}
         * @property isUndefined {Function}
         * @property null {Function}
         * @property Null {Function}
         * @property isNull {Function}
         * @property nan {Function}
         * @property Nan {Function}
         * @property isNan {Function}
         * @property element {Function}
         * @property Element {Function}
         * @property isElement {Function}
         * @property regexp {Function}
         * @property Regexp {Function}
         * @property isRegexp {Function}
         * @property boolean {Function}
         * @property Boolean {Function}
         * @property isBoolean {Function}
         * @property array {Function}
         * @property Array {Function}
         * @property isArray {Function}
         * @property window {Function}
         * @property Window {Function}
         * @property isWindow {Function}
         * @property document {Function}
         * @property Document {Function}
         * @property isDocument {Function}
         * @property global {Function}
         * @property Global {Function}
         * @property isGlobal {Function}
         * @returns {boolean}
         */
        typeis[tp] = typeis[tp2] = typeis['is' + tp2] = function (obj) {
            return typeis(obj) === tp;
        };
    };

    for (; i < jud.length; i++) {
        makeStatic(jud[i]);
    }

    /**
     * 判断是否为纯对象
     * @param obj {*}
     * @returns {Boolean}
     *
     * @example
     * typeis.plainObject({a:1});
     * // => true
     */
    typeis.plainObject = function (obj) {
        return typeis(obj) === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
    };


    /**
     * 判断是否为空对象
     * @param obj {*}
     * @returns {Boolean}
     *
     * @example
     * typeis.plainObject({});
     * // => true
     */
    typeis.emptyObject = function (obj) {
        return typeis.plainObject(obj) && Object.keys(obj).length === 0;
    };


    /**
     * 判断是否为 undefine 或 null
     * @param obj
     * @returns {Boolean}
     */
    typeis.empty = function (obj) {
        return typeof obj === udf || typeis.isNull(obj);
    };


    /**
     * 判断是否为 URL 格式
     * @param string
     * @returns {Boolean}
     *
     * @example
     * typeis.url('http://123.com/123/456/?a=3#00');
     * // => true
     */
    typeis.url = function (string) {
        return typeis.isString(string) && REG_URL.test(string);
    };


    /**
     * 判断是否为 email 格式
     * @param string
     * @returns {Boolean}
     *
     * @example
     * typeis.email('abc@def.com');
     * // => true
     */
    typeis.email = function (string) {
        return typeis.isString(string) && REG_EMAIL.test(string);
    };


    /**
     * 判断能否转换为合法Date
     * @param  {*} anything
     * @return {Boolean}
     * @version 1.0
     * 2014年5月2日21:07:33
     */
    typeis.validDate = function (anything) {
        return !REG_INVALID.test(new Date(anything).toString());
    };


    //Node.ELEMENT_NODE (1)
    //Node.ATTRIBUTE_NODE (2)
    //Node.TEXT_NODE (3)
    //Node.CDATA_SECTION_NODE (4)
    //Node.ENTITY_REFERENCE_NODE(5)
    //Node.ENTITY_NODE (6)
    //Node.PROCESSING_INSTRUCTION_NODE (7)
    //Node.COMMENT_NODE (8)
    //Node.DOCUMENT_NODE (9)
    //Node.DOCUMENT_TYPE_NODE (10)
    //Node.DOCUMENT_FRAGMENT_NODE (11)
    //Node.NOTATION_NODE (12)

    /**
     * 判断对象是否为 node 节点
     * @param anything
     * @returns {boolean}
     */
    typeis.node = function (anything) {
        return !!anything &&
            typeis.number(anything.nodeType) && anything.nodeType > 0 && anything.nodeType < 13 &&
            'nodeName' in anything && 'nodeValue' in anything;
    };


    /**
     * 判断对象是否为 jquery 对象
     * @param anything
     * @returns {boolean}
     */
    typeis.jquery = function (anything) {
        return !!anything && 'length' in anything && !!anything.jquery;
    };


    /**
     * @name typeis
     * @type {Function}
     */
    module.exports = typeis;
});