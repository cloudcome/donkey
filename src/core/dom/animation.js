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
    var string = require('../../utils/string.js');
    var modification = require('../../core/dom/modification.js');
    var compatible = require('../../core/navigator/compatible.js');


    var $ = window.jQuery;
    var elDoc = window.document;
    var elHtml = elDoc.documentElement;
    var elBody = elDoc.body;
    require('../../jquery-plugins/jquery.easing.js')($);
    require('../../jquery-plugins/jquery-transit.js')($);

    var supportTransition = !!compatible.css3('transition');
    var REG_SEP = /-/;
    var animationDefaults = {
        easing: 'linear',
        duration: 456
    };
    var scrollTopDefaults = {
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

        options = dato.extend({}, animationDefaults, options);

        if (supportTransition) {
            if (!typeis.empty(to.translateX)) {
                to.x = to.translateX;
                delete(to.translateX);
            } else if (!typeis.empty(to.translateY)) {
                to.y = to.translateY;
                delete(to.translateY);
            }

            options.easing = easing.get(options.easing);
            $(ele).transition(dato.extend(to, options, {
                complete: callback
            }));
        } else {
            if (!$.easing[options.easing]) {
                options.easing = 'ease' + string.humprize(options.easing, true);
            }

            if (!$.easing[options.easing]) {
                options.easing = animationDefaults.easing;
            }

            $(ele).animate(to, dato.extend(options, {
                complete: callback
            }));
        }
    };

    /**
     * 定点滚动
     * @param position {Object} 滚动的位置或者元素
     * @param [options] {object} 动画配置
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

        options = dato.extend({}, scrollTopDefaults, options);
        options.complete = callback;

        if (typeis.Element(position) || position.length && typeis.Element(position[0])) {
            position = $(position).offset();
            position.left += options.offsetLeft || 0;
            position.top += options.offsetTop || 0;
        }

        $([elHtml, elBody]).animate({
            scrollTop: position.top || 0,
            scrollLeft: position.left || 0
        }, options);
    };
});

