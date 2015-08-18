/*!
 * window
 * @author lumeixi
 * @author ydr.me
 * @create 2015-07-20 09:44
 */


define(function (require, exports, module) {

    'use strict';

    var $ = window.jQuery;
    var ui = require('../index.js');
    var style = require('./style.css', 'css');
    var Template = require('../../libs/template.js');
    var template = require('./template.html', 'html');
    var tpl = new Template(template);
    var dato = require('../../utils/dato.js');
    var animation = require('../../core/dom/animation.js');
    var controller = require('../../utils/controller.js');
    var Mask = require('../mask/index.js');
    var namespace = 'donkey-ui-window';
    var defaults = {
        width: 600,
        title: '标题',
        //是否需要遮罩
        showMask: true,
        // 是否可以关闭
        canClose: true
    };

    var Window = ui.create({
        constructor: function (options) {
            var the = this;

            the._options = dato.extend({}, defaults, options);
            the._init();
            // 当前窗体是否可见
            the.visible = false;
        },

        /**
         * 初始化
         * @private
         */
        _init: function () {
            var the = this;
            var options = the._options;

            if (options.showMask) {
                the._mask = new Mask(document.body, {
                    style: {
                        width: 0,
                        height: 0
                    }
                });
            }

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
            var html = tpl.render({
                canClose: options.canClose
            });

            the._$container = $(html).appendTo(document.body);
            the._$window = the._$container.children();
            var nodes = $('.j-flag', the._$window);
            the._$title = $(nodes[0]);
            the._$close = $(nodes[1]);
            the._$body = $(nodes[2]);

            the._$title.html(options.title);
            the._$window.width(options.width);
            the._$htmlBody = $('html,body');
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            var options = the._options;

            the._$close.on('click', function () {
                the.close();
            });

            $(window).on('resize', the._onresize = controller.debounce(function () {
                the.resize();
            }));
        },


        /**
         * 更新窗体位置
         * @returns {Window}
         */
        resize: function () {
            var the = this;

            if (!the.visible) {
                return the;
            }

            var options = the._options;
            var windowWidth = $(window).width();
            var windowHeight = $(window).height();
            var winWidth = the._$window.width();
            var winHeight = the._$window.height();
            var left = (windowWidth - winWidth) / 2;
            var top = (windowHeight - winHeight) / 3;

            if (left < 0) {
                left = 0;
            }

            if (top < 0) {
                top = 0;
            }

            the._$window.css({
                left: left,
                top: top
            });

            return the;
        },


        /**
         * 打开窗体
         * @returns {Window}
         */
        open: function () {
            var the = this;
            var options = the._options;

            if (the.visible) {
                return the;
            }

            if (the._mask) {
                the._mask.open();
            }

            the.emit('beforeopen');
            the._$htmlBody.addClass(namespace + '-overflow');
            the._$container.css({
                zIndex: ui.getZindex(),
                display: 'block'
            });
            animation.animate(the._$container, {
                opacity: 1
            }, function () {
                the.emit('afteropen');
            });

            the.visible = true;
            the.resize();

            return the;
        },


        /**
         * 关闭窗体
         * @returns {Window}
         */
        close: function () {
            var the = this;

            if (!the.visible) {
                return the;
            }

            the.emit('beforeclose');
            animation.animate(the._$container, {
                opacity: 0
            }, function () {
                the._$container.css('display', 'none');
                the._$htmlBody.removeClass(namespace + '-overflow');
                the.emit('afterclose');
            });

            if (the._mask) {
                the._mask.close();
            }

            the.visible = false;

            return the;
        },


        /**
         * 设置窗口内容
         * @param html
         * @returns {Window}
         */
        setContent: function (html) {
            var the = this;

            the._$body.html(html);
            the.resize();
            return the;
        },


        ///**
        // * 获取 window 节点
        // * @returns {*|jQuery}
        // */
        //getNodeOfWindow: function () {
        //    return this._$window;
        //},
        //
        //
        ///**
        // * 获取 body 节点
        // * @returns {*|jQuery}
        // */
        //getNodeOfBody: function () {
        //    return this._$body;
        //},


        /**
         * 销毁实例
         */
        destroy: function () {
            var the = this;

            if (the._mask) {
                the._mask.destroy();
            }

            $(window).off('resize', the._onresize);
            the._$window.remove();
        }
    });

    Window.defaults = defaults;
    module.exports = Window;
    ui.importStyle(style);
});