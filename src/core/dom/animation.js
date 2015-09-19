/*!
 * animation.js
 * @author ydr.me
 * 2014-09-20 11:08
 */


define(function (require, exports, module) {
    'use strict';

    var dato = require('../../utils/dato.js');
    var typeis = require('../../utils/typeis.js');
    var allocation = require('../../utils/allocation.js');
    var easing = require('../../utils/easing.js');
    var modification = require('../../core/dom/modification.js');
    var compatible = require('../../core/navigator/compatible.js');
    var supportTransition = !!compatible.css3('transition');
    var $ = window.jQuery;


    require('../../jquery-plugins/jquery-transit.js')($);

    var defaults = {
        easing: 'linear',
        duration: 456,
        offsetLeft: 0,
        offsetTop: -50
    };

    /**
     * 动画
     * @param ele {Element} 元素
     * @param to {Object} 动画终点
     * @param [options] {Object} 动画配置
     * @param [options.easing="linear"] {String} 动画缓冲
     * @param [options.duration=567] {Number} 动画时间
     * @param [callback] {Function} 动画完成回调
     */
    exports.animate = function (ele, to, options, callback) {
        var args = allocation.args(arguments);

        if (args.length === 3) {
            if (typeis.isFunction(args[2])) {
                callback = args[2];
                options = null;
            }
        }

        if (supportTransition) {
            if (!typeis.empty(to.translateX)) {
                to.translate = [to.translateX, 0];
                to.translateX = null;
            } else if (!typeis.empty(to.translateY)) {
                to.translate = [0, to.translateY];
                to.translateY = null;
            }

            options.easing = easing.get(options.easing);
            $(ele).transition(dato.extend(to, options, {
                complete: callback
            }));
        } else {
            $(ele).animate(to, dato.extend(options, {
                complete: callback
            }));
        }
    };

    /**
     * 定点滚动
     * @param position {Object} 滚动的位置或者元素
     * @param [options] {Object} 动画配置
     * @param [options.easing="linear"] {String} 动画缓冲
     * @param [options.duration=567] {Number} 动画时间
     * @param [options.offsetLeft=0] {Number} 左位移
     * @param [options.offsetTop=20] {Number} 上位移
     * @param [callback] {Function} 动画完成回调
     */
    exports.scrollTo = function (position, options, callback) {
        var args = allocation.args(arguments);

        if (args.length === 2) {
            if (typeis.isFunction(args[1])) {
                callback = args[1];
                options = null;
            }
        } else if (args.length === 1) {
            callback = null;
            options = null;
        }

        options = dato.extend({}, defaults, options);
        options.complete = callback;

        if (typeis.isElement(position) || position.length && typeis.isElement(position[0])) {
            position = $(position).offset();
            position.left += options.offsetLeft;
            position.top += options.offsetTop;
        }

        $('html,body').animate({
            scrollTop: position.top || 0,
            scrollLeft: position.left || 0
        }, options);
    };
});

