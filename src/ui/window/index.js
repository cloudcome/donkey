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
    var Mask = require('../mask/index.js');
    var namespace = 'donkey-ui-window';
    var donekyId = 0;
    var elBody = document.body;
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
        duration: 345,
        addClass: '',
        translateY: 25,
        autoResize: true,
        modal: true
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
            })).appendTo(elBody);
            var $children = the._$parent.children();
            the._$focus = $($children[0]);
            the._$body = $($children[1]);
            the._$flag.insertAfter(the._$window);
            the._$window.appendTo(the._$body);
            the._$parent.addClass(options.addClass);

            if (options.modal) {
                the._mask = new Mask(window);
                the._$modal = $(modification.create('div', {
                    'class': namespace + '-modal',
                    id: namespace + '-modal-' + the._id
                }));
                the._$modal.appendTo(elBody);
                the._$parent.appendTo(the._$modal);
            }
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
         * 获取当前节点
         * @returns {Node}
         */
        getNode: function () {
            return this._$parent[0];
        },


        /**
         * 打开 window
         * @returns {Window}
         */
        open: function (callback) {
            var the = this;

            if (the.visible) {
                return the;
            }

            var options = the._options;



            the.emit('beforeopen');
            the.visible = true;

            if (the._mask) {
                the._mask.open();
                the._$modal.css('zIndex', ui.getZindex()).show();
            }

            the._$parent.css('opacity', 0);
            the.update();

            var style = ui.align(the._$parent, window, {
                returnStyle: true
            });
            var translateYStyle1 = ui.translateY(options.translateY);
            var translateYStyle2 = ui.translateY(0);
            var fromStyle = dato.extend({}, style, translateYStyle1);
            var toStyle = dato.extend(style, translateYStyle2, {
                opacity: 1
            });

            the._$parent.css(fromStyle);
            // 焦点聚焦到 window 上
            the._$focus.focus();
            animation.animate(the._$parent, toStyle, {
                duration: options.duration
            }, function () {
                the._$focus.blur();

                if (typeis.function(callback)) {
                    callback.call(the);
                }

                the.emit('afteropen');
            });

            return the;
        },


        /**
         * 更新了 window 内容
         * @returns {Window}
         */
        update: function () {
            var the = this;
            var options = the._options;

            if (!the.visible) {
                return the;
            }

            var width = options.width;
            var height = options.height;
            var widthEheight = false;
            var heightEWidth = false;

            the.emit('beforeupdate');
            the._$parent.css({
                display: 'block',
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

            the.resize();
            the.emit('afterupdate');

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

            the.emit('beforeresize');
            ui.align(the._$parent, window);
            the.emit('afterresize');

            return the;
        },


        _close: function (callback) {
            var the = this;
            var options = the._options;

            the.emit('beforeclose');
            the.visible = false;
            var translateYStyle1 = ui.translateY(-options.translateY);
            animation.animate(the._$parent, dato.extend(translateYStyle1, {
                opacity: 0
            }), {
                duration: options.duration
            }, function () {
                the._$parent.hide();

                if (the._mask) {
                    the._mask.close();
                    the._$modal.hide();
                }

                if (typeis.function(callback)) {
                    callback.call(the);
                }

                the.emit('afterclose');
            });
        },


        /**
         * 关闭 window
         * @params callback {Function} 回调
         * @returns {Window}
         */
        close: function (callback) {
            var the = this;

            if (!the.visible) {
                return the;
            }

            the._close(callback);
        },


        /**
         * 销毁 window
         */
        destroy: function (callback) {
            var the = this;

            if (the.destroyed) {
                return;
            }

            if (the._onresize) {
                $(window).off('resize', the._onresize);
            }

            the.emit('beforedestroy');
            the.destroyed = true;
            the._close(function () {
                the._$window.insertAfter(the._$flag);
                the._$parent.remove();
                the._$flag.remove();

                if (the._mask) {
                    the._mask.destroy();
                    the._$modal.remove();
                }

                windowMap[the._id] = null;
                var findIndex = -1;
                dato.each(windowList, function (index, id) {
                    if (id === the._id) {
                        findIndex = index;
                        return false;
                    }
                });
                windowList.splice(findIndex, 1);

                if (typeis.function(callback)) {
                    callback.call(the);
                }

                the.emit('afterdestroy');
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