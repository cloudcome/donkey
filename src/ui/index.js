/*!
 * ui 主文件
 * @author ydr.me
 * @create 2015-07-17 13:08
 */


define(function (require, exports, module) {
    /**
     * @module ui/index
     */

    'use strict';

    var $ = window.jQuery;
    var Emitter = require('../libs/emitter.js');
    var typeis = require('../utils/typeis.js');
    var dato = require('../utils/dato.js');
    var klass = require('../utils/class.js');
    var number = require('../utils/number.js');
    var allocation = require('../utils/allocation.js');
    var modification = require('../core/dom/modification.js');
    var compatible = require('../core/navigator/compatible.js');
    var udf;
    //var warningPropertyList = 'emit on un _eventsPool _eventsLimit'.split(' ');
    var zIndex = 999;
    var css3Transform = compatible.css3('transform');
    var REG_NUMBER = /^[+\-]?\d+(\.\d*)?$/;
    var REG_PERCENT = /%/;

    /**
     * 使用 UI 基础类给各个 UI 组件来分配 z-index
     * @returns {number}
     */
    exports.getZindex = function () {
        return zIndex++;
    };


    /**
     * 创建一个 UI 类
     * @param prototypes {Object} 原型链
     * @param [isInheritSuperStatic=false] {Boolean} 是否继承父类的静态方法
     *
     * @example
     * var Dialog = ui.create({...});
     */
    exports.create = function (prototypes, isInheritSuperStatic) {
        if (!typeis.isFunction(prototypes.constructor)) {
            throw 'UI class constructor must be a function';
        }

        // 添加默认方法
        if (prototypes.getOptions === udf) {
            prototypes.getOptions = function (key) {
                var the = this;
                var keyType = typeis(key);
                var ret = [];

                /**
                 * 获取 ui 配置
                 * @event getoptions
                 */
                the.emit('getoptions');

                if (keyType === 'string' || keyType === 'number') {
                    return the._options && the._options[key];
                } else if (keyType === 'array') {
                    dato.each(key, function (index, k) {
                        ret.push(the._options && the._options[k]);
                    });

                    return ret;
                } else {
                    return the._options;
                }
            };
        }

        if (prototypes.setOptions === udf) {
            prototypes.setOptions = function (key, val) {
                var the = this;
                var keyType = typeis(key);

                if (keyType === 'string' || keyType === 'number') {
                    the._options ? the._options[key] = val : udf;
                } else if (keyType === 'object') {
                    dato.extend(true, the._options, key);
                }

                /**
                 * 设置 ui 配置
                 * @event setoptions
                 * @params options {Object} 参数
                 */
                the.emit('setoptions', the._options);

                return the;
            };
        }

        return klass.extend(Emitter, isInheritSuperStatic).create(prototypes);
    };


    /**
     * 导入 UI 样式
     * @param styleText {String}
     */
    exports.importStyle = function (styleText) {
        modification.importStyle(styleText);
    };


    var defaults = {
        x: 1 / 2,
        y: 1 / 3,
        // 当小于边界时，是否修复
        adapt: true
    };
    /**
     * 元素对齐
     * @param $child {jQuery|Object|String} 子元素
     * @param $parent {jQuery|Object|String} 父元素
     * @param [options] {Object} 配置
     * @param [options.x] {String|Number} 水平位置
     * @param [options.y] {String|Number} 垂直位置
     * @param [options.adaptBoundary=true] {Boolean} 是否调整边界
     * @param [options.returnStyle=false] {Boolean} 是否调整边界
     */
    exports.align = function ($child, $parent, options) {
        $child = $($child);
        $parent = $($parent);
        options = dato.extend({}, defaults, options);

        if (options.x === 'c') {
            options.x = 1 / 2;
        }

        if (options.y === 'c') {
            options.y = 1 / 2;
        }

        var childWidth = $child.outerWidth();
        var childHeight = $child.outerHeight();
        var parentWidth = $parent.outerWidth();
        var parentHeight = $parent.outerHeight();
        var left = (parentWidth - childWidth) * options.x;
        var top = (parentHeight - childHeight) * options.y;

        if (options.adaptBoundary !== false && left < 0) {
            left = 0;
        }

        if (options.adaptBoundary !== false && top < 0) {
            top = 0;
        }

        if (options.returnStyle) {
            return {
                left: left,
                top: top
            };
        }

        $child.css({
            left: left,
            top: top
        });
    };


    /**
     * 兼容性的 translate，暂时不支持 %
     * @param ele
     * @param translate
     * @param xy
     * @returns {{}}
     */
    var translate = function (ele, translate, xy) {
        var style = {};

        if (css3Transform) {
            if (REG_NUMBER.test(translate)) {
                translate = translate + 'px';
            }

            style[css3Transform] = 'translate' + xy + '(' + translate + ')';
        } else {
            if (xy === 'X') {
                style.marginLeft = translate;
            } else {
                style.marginTop = translate;
            }
        }

        if (ele === null) {
            return style;
        }

        $(ele).css(style);
    };


    /**
     * 兼容性的 translateX
     * @param [ele] {Object|String|Number} 元素
     * @param translateX {Number|String} 偏移量
     * @returns {Object|undefined}
     */
    exports.translateX = function (ele, translateX) {
        var args = allocation.args(arguments);

        if (args.length === 1) {
            return translate(null, args[0], 'X');
        }

        translate(ele, translateX, 'X');
    };


    /**
     * 兼容性的 translateY
     * @param [ele] {Object|String|Number} 元素
     * @param translateX {Number|String} 偏移量
     * @returns {Object|undefined}
     */
    exports.translateY = function (ele, translateX) {
        var args = allocation.args(arguments);

        if (args.length === 1) {
            return translate(null, args[0], 'Y');
        }

        translate(ele, translateX, 'Y');
    };
});