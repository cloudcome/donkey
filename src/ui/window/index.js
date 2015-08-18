/*!
 * window
 * @author ydr.me
 * @create 2015-08-18 10:03
 */


define(function (require, exports, module) {
    /**
     * @module ui/window/
     * @requires ui/
     * @requires utils/dato
     * @requires utils/typeis
     * @requires utils/controller
     * @requires core/dom/modification
     * @requires core/dom/animation
     * @requires libs/template
     */

    'use strict';

    var $ = window.jQuery;
    var ui = require('../index.js');
    var dato = require('../../utils/dato.js');
    var typeis = require('../../utils/typeis.js');
    var controller = require('../../utils/controller.js');
    var modification = require('../../core/dom/modification.js');
    var animation = require('../../core/dom/animation.js');
    var Template = require('../../libs/template.js');
    var template = require('./template.html', 'html');
    var tpl = new Template(template);
    var style = require('./style.css', 'css');
    var namespace = 'donkey-ui-window';
    var donekyId = 0;
    var eBody = document.body;
    var windowList = [];
    var windowMap = {};
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
        addClass: '',
        translateY: 10,
        autoResize: true
    };
    var Window = ui.create({
        constructor: function ($window, options) {
            var the = this;

            the._$window = $($window);
            the._options = dato.extend({}, defaults, options);
            the._id = donekyId++;
            the.destroyed = false;
            windowMap[the._id] = the;
            windowList.push(the._id);
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

            the._$flag = $(modification.create('#comment', namespace + '-' + the._id));
            the._$parent = $(tpl.render({
                id: the._id
            })).appendTo(eBody);
            var $children = the._$parent.children();
            the._$focus = $($children[0]);
            the._$body = $($children[1]);
            the._$flag.insertAfter(the._$window);
            the._$window.appendTo(the._$body);
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            var options = the._options;

            if (options.autoResize) {
                $(window).on('resize', the._onresize = controller.debounce(function () {
                    the.resize();
                }));
            }
        },


        /**
         * 打开 window
         * @returns {Window}
         */
        open: function () {
            var the = this;

            if (the.visible) {
                return the;
            }

            var options = the._options;
            var width = options.width;
            var height = options.height;
            var widthEheight = false;
            var heightEWidth = false;

            the.visible = true;
            the._$parent.css({
                display: 'block',
                opacity: 0,
                width: 'auto',
                height: 'auto',
                minWidth: options.minWidth,
                minHeight: options.minHeight,
                maxWidth: options.maxWidth,
                maxHeight: options.maxHeight,
                zIndex: ui.getZindex()
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

            var style = ui.align(the._$parent, window, {
                returnStyle: true
            });
            var translateYStyle1 = ui.translateY(options.translateY);
            var translateYStyle2 = ui.translateY(0);
            var fromStyle = dato.extend({}, style, translateYStyle1);
            var toStyle = dato.extend(style, translateYStyle2, {
                opacity: 1
            });

            the.emit('beforeopen');
            the._$parent.css(fromStyle);
            // 焦点聚焦到 window 上
            the._$focus.focus();
            animation.animate(the._$parent, toStyle, {
                duration: options.duration
            }, function () {
                the._$focus.blur();
                the.emit('aftereopen');
            });

            return the;
        },


        /**
         * 调整 window 位置
         * @returns {Window}
         */
        resize: function () {
            var the = this;

            if (!the.visible) {
                return the;
            }

            ui.align(the._$parent, window);

            return the;
        },


        /**
         * 关闭 window
         * @params callback {Function} 回调
         * @returns {Window}
         */
        close: function (callback) {
            var the = this;
            var options = the._options;

            if (!the.visible) {
                return the;
            }

            the.visible = false;
            the.emit('beforeclose');
            var translateYStyle1 = ui.translateY(-options.translateY);
            animation.animate(the._$parent, dato.extend(translateYStyle1, {
                opacity: 0
            }), {
                duration: options.duration
            }, function () {
                the._$parent.hide();

                if (typeis.function(callback)) {
                    callback.call(the);
                }

                the.emit('afterclose');
            });
        },


        /**
         * 销毁 window
         */
        destroy: function () {
            var the = this;

            if (the.destroyed) {
                return;
            }

            if (the._onresize) {
                $(window).off('resize', the._onresize);
            }

            the.destroyed = true;
            the.close(function () {
                the._$window.insertAfter(the._$flag);
                the._$parent.remove();
                the._$flag.remove();
                windowMap[the._id] = null;
                var findIndex = -1;
                dato.each(windowList, function (index, id) {
                    if (id === the._id) {
                        findIndex = index;
                        return false;
                    }
                });
                windowList.splice(findIndex, 1);
            });
        }
    });


    /**
     * 返回最顶层的 window
     * @returns {Window}
     */
    Window.getTopWindow = function () {
        return windowMap[windowList[0]];
    };

    Window.defaults = defaults;
    ui.importStyle(style);
    module.exports = Window;
});