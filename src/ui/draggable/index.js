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

    var $ = window.jQuery;
    var ui = require('../index.js');
    var dato = require('../../utils/dato.js');
    require('../../3rd/jquery-ui/1.9.2/draggable.js');
    var defaults = {
        /**
         * 拖拽方向：x、y，为空表示 xy
         * @type String
         */
        axis: '',
        /**
         * 在限定的元素（选择器）内进行拖拽
         * @type {String|Object|Array|Element}  String->'parent','document','window'
         */
        containment: 'parent',
        /**
         * 拖拽过程中鼠标样式
         * @type {String}
         */
        cursor: 'auto',
        /**
         * 拖拽过程中元素的不透明度
         * @type {Number}
         */
        opacity: 1,
        /**
         * 在某元素内（选择器）使拖拽的元素处于最前
         * @type {Object}
         */
        stack: '',
        /**
         * 防止指定元素拖动
         * @type {Object}
         */
        cancel: '',
        /**
         * 鼠标点击后，延迟拖拽动作（ms）
         * @type {Number}
         */
        delay: 0,
        /**
         * 拖拽动效禁用
         * @type {Boolean}
         */
        disabled: false,
        valueDataKey: 'id'
    };

    var Draggable = ui.create({
        constructor: function ($content, options) {
            var the = this;
            the._$content = $($content);
            the._options = dato.extend({}, defaults, options);
            the._step = options.step;

            the._init();
        },


        /**
         * 初始化
         * @private
         */
        _init: function () {
            var the = this;
            var options = the._options;

            the._$content.draggable(options);

            the._initEvent();
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            var options = the._options;

            the._$content.on('dragstop', function (event, ui) {
                var $pre;
                var multi;
                var move = ui.position.left;
                var index = $(this).index();

                multi = parseInt(move / the._step);

                the._$content = $('.move');
                $pre = $(the._$content[index + multi - 1]);

                if (move >= 0) {
                    $pre.after($(this));

                } else {
                    $pre.before($(this));
                }

                $(this).css({
                    left: 0
                });
            });

        },


        /**
         * 获取顺序
         * @returns {Array}
         */
        getValue: function () {
            var the = this;
            the._list = [];
            the._$content = $('.move');

            $.each(the._$content, function (index) {
                the._list.push($(the._$content[index]).data(the._options.valueDataKey));
            });

            return the._list;
        }
    });

    Draggable.defaults = defaults;
    module.exports = Draggable;
});