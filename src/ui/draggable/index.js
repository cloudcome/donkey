/**
 * Created by Administrator on 2015/7/27.
 */

define(function (require, exports, module) {

    'use strict';

    /**
     * @module parent/upload
     * @requires ui/
     * @requires utils/dato
     */

    require('../../jquery-ui/draggable.js');
    var $ = window.jQuery;
    var ui = require('../index.js');
    var dato = require('../../utils/dato.js');
    var defaults = {
        // 触发位，默认为整体
        handle: false,
        // 复制位：original、clone
        helper: 'original',
        // 是否返回
        revert: false,
        // 返回动画时间
        revertDuration: 345,
        // 拖拽方向：x、y、false
        axis: false
    };
    var Draggable = ui.create({
        constructor: function ($draggable, options) {
            var the = this;

            the._$draggable = $($draggable);
            the._options = dato.extend({}, defaults, options);
            the.destroyed = false;
            the._initEvent();
        },


        _initEvent: function () {
            var the = this;
            var options = the._options;

            the._$draggable.draggable({
                start: function (event, ui) {
                    the.emit('beforedrag');
                },
                drag: function (event, ui) {
                    the.emit('drag');
                },
                stop: function (event, ui) {
                    the.emit('afterdrag');
                }
            });
        },


        /**
         * 设置为可拖拽
         * @returns {Draggable}
         */
        enable: function () {
            var the = this;

            the._$draggable.draggable('enable');

            return the;
        },


        /**
         * 设置为不可拖拽
         * @returns {Draggable}
         */
        disable: function () {
            var the = this;

            the._$draggable.draggable('disable');

            return the;
        },


        /**
         * 销毁实例
         */
        destroy: function () {
            var the = this;

            if (the.destroyed) {
                return;
            }

            the.destroyed = true;
            the._$draggable.draggable('destroy');
        }
    });

    Draggable.defaults = defaults;
    module.exports = Draggable;
});