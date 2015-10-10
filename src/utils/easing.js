/*!
 * easing.js
 * @author ydr.me
 * @create 2014-10-06 18:06
 */


define(function (require, exports, module) {
    /**
     * @module utils/easing
     */
    'use strict';


    /**
     * 贝塞尔曲线
     * @type {Object}
     */
    var easingDefineMap = {
        ease: [0.25, 0.1, 0.25, 1],
        swing: [0.25, 0.1, 0.25, 1],
        linear: [0, 0, 1, 1],
        snap: [0, 1, 0.5, 1],
        'in': [0.42, 0, 1, 1],
        out: [0, 0, 0.58, 1],
        'in-out': [0.42, 0, 0.58, 1],
        'in-quad': [0.55, 0.085, 0.68, 0.53],
        'in-cubic': [0.55, 0.055, 0.675, 0.19],
        'in-quart': [0.895, 0.03, 0.685, 0.22],
        'in-quint': [0.755, 0.05, 0.855, 0.06],
        'in-sine': [0.470, 0, 0.745, 0.715],
        'in-expo': [0.950, 0.05, 0.795, 0.035],
        'in-circ': [0.6, 0.04, 0.98, 0.335],
        'in-back': [0.6, -0.28, 0.735, 0.045],
        'out-quad': [0.25, 0.46, 0.45, 0.94],
        'out-cubic': [0.215, 0.61, 0.355, 1],
        'out-quart': [0.165, 0.84, 0.44, 1],
        'out-quint': [0.23, 1, 0.32, 1],
        'out-sine': [0.39, 0.575, 0.565, 1],
        'out-expo': [0.19, 1, 0.22, 1],
        'out-circ': [0.075, 0.82, 0.165, 1],
        'out-back': [0.175, 0.885, 0.32, 1.275],
        'in-out-quart': [0.770, 0, 0.175, 1],
        'in-out-quint': [0.860, 0, 0.07, 1],
        'in-out-sine': [0.445, 0.05, 0.55, 0.95],
        'in-out-expo': [1, 0, 0, 1],
        'in-out-circ': [0.785, 0.135, 0.15, 0.86],
        'in-out-back': [0.68, -0.55, 0.265, 1.55]
    };
    var easeingBuildMap = {};
    var defaultEasingName = 'ease';
    var cubicBezierGenerator = function (arr) {
        return 'cubic-bezier(' + arr.join(',') + ')';
    };


    /**
     * 定义一个 easing
     * @param name
     * @param mX1
     * @param mY1
     * @param mX2
     * @param mY2
     * @returns {Function}
     */
    exports.define = function (name, mX1, mY1, mX2, mY2) {
        easingDefineMap[name] = [mX1, mY1, mX2, mY2];

        return exports;
    };


    /**
     * 获取 easing function
     * @param name
     * @returns {Function}
     */
    exports.get = function (name) {
        // 读取已经生成的 easing function
        var easing = easeingBuildMap[name];

        if (easing) {
            return easing;
        }

        // 读取配置
        var arr = easingDefineMap[name];

        // 配置不存在
        if (!arr) {
            name = defaultEasingName;
        }

        // 判断是否存在刚才默认化的 easing
        easing = easeingBuildMap[name];

        if (easing) {
            return easing;
        }

        arr = easingDefineMap[name];
        easing = cubicBezierGenerator(arr);
        easeingBuildMap[name] = easing;

        return easing;
    };
});
