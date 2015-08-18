/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-08-18 10:03
 */


define(function (require, exports, module) {
    /**
     * @module ui/window/
     */

    'use strict';

    var $ = window.jQuery;
    var ui = require('../index.js');
    var dato = require('../../utils/dato.js');
    var modification = require('../../core/dom/modification.js');
    var animation = require('../../core/dom/animation.js');
    var Template = require('../../libs/template.js');
    var template = require('./template.html', 'html');
    var tpl = new Template(template);
    var style = require('./style.css', 'css');
    var namespace = 'donkey-ui-window';
    var donekyId = 0;
    var eBody = document.body;
    var defaults = {
        // width 可以等于 height，height 也可以等于 width
        // 当两者都互相相等时，即是一个正方形
        width: 'auto',
        height: 'auto',
        minWidth: 'none',
        minHeight: 'none',
        maxWidth: 1000,
        maxHeight: 800,
        duration: 567,
        addClass: ''
    };
    var Window = ui.create({
        constructor: function ($window, options) {
            var the = this;

            the._$window = $($window);
            the._options = dato.extend({}, defaults, options);
            the._id = donekyId++;
            the._initNode();
            the._initEvent();
        },


        /**
         * 初始化节点
         * @private
         */
        _initNode: function () {
            var the = this;
            var options = the._options;

            the._$container = $(tpl.render({
                id: the._id
            })).appendTo(eBody);
            the._$parent = the._$container.children();
            the._$window.appendTo(the._$parent);
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            var options = the._options;


        },

        open: function () {
            var the = this;
            var options = the._options;
            var width = options.width;
            var height = options.height;
            var widthEheight = false;
            var heightEWidth = false;

            the._$container.show();
            the._$parent.css({
                display: 'block',
                visibility: 'hidden',
                width: 'auto',
                height: 'auto',
                minWidth: options.minWidth,
                minHeight: options.minHeight,
                maxWidth: options.maxWidth,
                maxHeight: options.maxHeight
            });

            if (width === 'height') {
                width = 'auto';
                widthEheight = true;
            }

            if (height === 'width') {
                height = 'auto';
                heightEWidth = true;
            }

            the._$parent.width(width).height(height);

            if (widthEheight && heightEWidth) {
                width = the._$parent.width();
                height = the._$parent.height();
                width = height = Math.max(width, height);
                the._$parent.width(width).height(height);
            } else if (widthEheight) {
                width = height = the._$parent.height();
                the._$parent.height(height);
            } else if (heightEWidth) {
                height = width = the._$parent.width();
                the._$parent.width(height);
            }


            ui.align(the._$parent, window);

            return the;
        }
    });

    Window.defaults = defaults;
    ui.importStyle(style);
    module.exports = Window;
});