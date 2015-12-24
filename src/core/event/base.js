/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-24 15:38
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;

    var dato = require('../../utils/dato.js');

    var REG_SPACE = /\s+/;


    /**
     * 事件监听
     * @param ele {Object} 元素
     * @param eventType {String} 事件类型
     * @param [selector] {String} 选择器
     * @param listener {Function} 回调
     * @param [capture] {Boolean} 是否捕获
     */
    exports.on = function (ele, eventType, selector, listener, capture) {
        var eventTypes = eventType.split(REG_SPACE);

        dato.each(eventTypes, function (index, eventType) {
            $(ele).on(eventType, selector, listener, capture);
        });
    };


    /**
     * 取消事件监听
     * @param ele {Object} 元素
     * @param eventType {String} 事件类型
     * @param listener {Function} 回调
     * @param [capture] {Boolean} 是否捕获
     */
    exports.un = function (ele, eventType, listener, capture) {
        var eventTypes = eventType.split(REG_SPACE);

        dato.each(eventTypes, function (index, eventType) {
            $(ele).off(eventType, listener, capture);
        });
    };


    /**
     * 事件触发器
     * @param ele {Object} 元素
     * @param eventType {String} 事件类型
     */
    exports.dispath = function (ele, eventType) {
        $(ele).trigger(eventType);
    };
});