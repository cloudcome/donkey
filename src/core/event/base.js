/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-24 15:38
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;

    var allocation = require('../../utils/allocation.js');
    var dato = require('../../utils/dato.js');
    var typeis = require('../../utils/typeis.js');

    var REG_SPACE = /\s+/;
    var defaults = {
        // 是否冒泡
        bubbles: true,
        // 是否可以被阻止冒泡
        cancelable: true,
        // 事情细节
        detail: {}
    };

    /**
     * @link http://www.w3school.com.cn/jsref/dom_obj_event.asp
     * - altKey            返回当事件被触发时，"ALT" 是否被按下。
     * - button            返回当事件被触发时，哪个鼠标按钮被点击。
     * - clientX        返回当事件被触发时，鼠标指针的水平坐标。
     * - clientY        返回当事件被触发时，鼠标指针的垂直坐标。
     * - ctrlKey        返回当事件被触发时，"CTRL" 键是否被按下。
     * - metaKey        返回当事件被触发时，"meta" 键是否被按下。
     * - relatedTarget    返回与事件的目标节点相关的节点。
     * - screenX        返回当某个事件被触发时，鼠标指针的水平坐标。
     * - screenY        返回当某个事件被触发时，鼠标指针的垂直坐标。
     * - shiftKey        返回当事件被触发时，"SHIFT" 键是否被按下。
     * - bubbles        返回布尔值，指示事件是否是起泡事件类型。
     * - cancelable        返回布尔值，指示事件是否可拥可取消的默认动作。
     * - currentTarget    返回其事件监听器触发该事件的元素。
     * - eventPhase        返回事件传播的当前阶段。0=结束或未开始，1=捕获，2=到底，3=冒泡
     * - target            返回触发此事件的元素（事件的目标节点）。
     * - timeStamp        返回事件生成的日期和时间。
     * - type            返回当前 Event 对象表示的事件的名称。
     */
    var mustEventProperties = 'altKey button which clientX clientY ctrlKey metaKey relatedTarget pageX pageY screenX screenY shiftKey bubbles cancelable currentTaget eventPhase target timeStamp'.split(' ');
    var eventTypeArr = ['Events', 'HTMLEvents', 'MouseEvents', 'UIEvents', 'MutationEvents'];
    var eventInitArr = ['', '', 'Mouse', 'UI', 'Mutation'];

    /**
     * http://hi.baidu.com/flondon/item/a83892e3b454192a5a7cfb35
     * eventType 共5种类型：Events、HTMLEvents、UIEevents、MouseEvents、MutationEvents。
     * ● Events ：所有的事件。
     * ● HTMLEvents：abort、blur、change、error、focus、load、reset、resize、scroll、select、submit、unload。
     * ● UIEvents：DOMActivate、DOMFocusIn、DOMFocusOut、keydown、keypress、keyup。
     * ● MouseEvents：click、mousedown、mousemove、mouseout、mouseover、mouseup、touch。
     * ● MutationEvents：DOMAttrModified、DOMNodeInserted、DOMNodeRemoved、DOMCharacterDataModified、DOMNodeInsertedIntoDocument、DOMNodeRemovedFromDocument、DOMSubtreeModified。
     */
    var htmlEvents = 'abort blur change error focus load reset resize scroll select submit unload'.split(' ');
    var mouseEvents = /click|mouse|touch/;
    var uiEvents = /key|DOM(Active|Focus)/;
    var mutationEvents = /DOM(Attr|Node|Character|Subtree)/;


    /**
     * 事件监听
     * @param ele {Object} 元素
     * @param eventType {String} 事件类型
     * @param [selector] {String} 选择器
     * @param listener {Function} 回调
     */
    exports.on = function (ele, eventType, selector, listener) {
        var eventTypes = eventType.split(REG_SPACE);

        dato.each(eventTypes, function (index, eventType) {
            $(ele).on(eventType, selector, listener);
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
     * 事件创建
     * @param {String} eventType 事件类型
     * @param {Object} [properties] 事件属性
     * @param {Boolean} [properties.bubbles] 是否冒泡，默认 true
     * @param {Boolean} [properties.cancelable] 是否可以被取消冒泡，默认 true
     * @param {Object} [properties.detail] 事件细节，默认{}
     * @returns {Event}
     * @link https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
     *
     * @example
     * event.create('myclick');
     * event.create('myclick', {
     *     bubbles: true,
     *     cancelable: true,
     *     detail: {
     *        a: 1,
     *        b: 2
     *     },
     * });
     */
    exports.create = function (eventType, properties) {
        properties = dato.extend({}, defaults, properties);

        var et;
        var args;
        var eventTypeIndex = 0;

        try {
            // ie11+/chrome/firefox
            et = new Event(eventType, properties);
        } catch (err1) {
            try {
                // who?
                et = new CustomEvent(eventType, properties);
            } catch (err2) {
                // <= 10
                args = [eventType, !!properties.bubbles, !!properties.cancelable, window, {},
                    0, 0, 0, 0, false, false, false, false, 0, null
                ];

                if (htmlEvents.indexOf(eventType)) {
                    eventTypeIndex = 1;
                } else if (mouseEvents.test(eventType)) {
                    eventTypeIndex = 2;
                } else if (uiEvents.test(eventType)) {
                    eventTypeIndex = 3;
                } else if (mutationEvents.test(eventType)) {
                    eventTypeIndex = 4;
                }

                et = document.createEvent(eventTypeArr[eventTypeIndex]);
                et['init' + eventInitArr[eventTypeIndex] + 'Event'].apply(et, args);
            }
        }

        return et;
    };


    /**
     * 扩展创建的事件对象，因自身创建的事件对象细节较少，需要从其他事件上 copy 过来
     * @param {String|Object} createEvent 创建事件
     * @param {Event} copyEvent 复制事件
     * @param {Object} [donkeyDetail] 事件细节，将会在事件上添加 donkey 的细节，donkeyDetail（防止重复）
     * @returns {Object} 创建事件
     *
     * @example
     * event.extend('myclick', clickEvent, {
     *     a: 1,
     *     b: 2
     * });
     */
    exports.extend = function (createEvent, copyEvent, donkeyDetail) {
        if (typeis.string(createEvent)) {
            createEvent = exports.create(createEvent);
        }

        dato.each(mustEventProperties, function (index, prototype) {
            if (copyEvent && prototype in copyEvent) {
                try {
                    // 某些浏览器不允许重写只读属性，如 iPhone safari
                    createEvent[prototype] = copyEvent[prototype];
                } catch (err) {
                    // ignore
                }
            }
        });

        donkeyDetail = donkeyDetail || {};
        createEvent.donkeyDetail = createEvent.donkeyDetail || {};

        dato.each(donkeyDetail, function (key, val) {
            createEvent.donkeyDetail[key] = val;
        });

        return createEvent;
    };


    /**
     * 触发事件
     * @param {Object} ele 元素
     * @param {Object|String} eventTypeOrEvent 事件类型或事件名称
     * @param {Object} [copyEvent] 需要复制的事件信息
     * @param {Object} [alienDetail] 事件细节，将会在事件上添加 alien 的细节，alienDetail（防止重复）
     * @returns {Object} event
     *
     * @example
     * event.dispatch(ele, 'myclick');
     * event.dispatch(ele, myclikEvent);
     * // 从当前事件 eve 上复制细节信息
     * event.dispatch(ele, myclikEvent, eve);
     */
    exports.dispatch = function (ele, eventTypeOrEvent, copyEvent, alienDetail) {
        var et = typeis.string(eventTypeOrEvent) ?
            exports.create(eventTypeOrEvent) :
            eventTypeOrEvent;

        if (copyEvent) {
            et = exports.extend(et, copyEvent, alienDetail);
        }

        var ret;

        try {
            // 同时触发相同的原生事件会报错
            ret = ele.dispatchEvent(et);
        } catch (err) {
            // ignore
        }

        return ret;
    };

});