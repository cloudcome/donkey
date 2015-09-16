/*!
 * 滚动器
 * @author ydr.me
 * @create 2015-09-16 18:44
 */


define(function (require, exports, module) {
    /**
     * @module ui/scroller/
     * @requires utils/dato
     * @requires utils/controller
     * @requires ui/scroll/
     */

    'use strict';

    var $ = window.jQuery;
    var ui = require('../index.js');
    var dato = require('../../utils/dato.js');
    var controller = require('../../utils/controller.js');
    var Scroll = require('../scroll/index.js');
    var defaults = {
        // 滚动容器选择器
        containerSelector: window,
        // 项目选择器
        itemSelector: '> *',
        // 偏移量
        offset: 0,
        // 最后一次触发的 xx ms后检查
        wait: 123
    };
    var Scroller = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = $($parent);
            options = the._options = dato.extend({}, defaults, options);
            the._$container = $(options.containerSelector);
            the.update();
            the._initEvent();
        },


        /**
         * 更新区域内块位置
         * @returns {Scroller}
         */
        update: function () {
            var the = this;
            var options = the._options;

            the._list = [];
            the._list2 = [];
            $(options.itemSelector, the._$parent).each(function () {
                var $this = $(this);
                var offset = $this.offset();
                var item = {
                    ele: $this[0],
                    top: offset.top,
                    bottom: offset.top + $this.height()
                };

                the._list.push(item);
                the._list2.unshift(item);
            });

            the._length = the._list.length;
            the._parentTop = the._$parent.offset().top;
            the._parentHeight = the._$parent.height();
            the._parentBottom = the._parentTop + the._parentHeight;
            return the;
        },

        _initEvent: function () {
            var the = this;
            var options = the._options;
            var lastEnter = -1;
            var lastLeave = -1;
            var onenter = function (ele, index) {
                if (lastEnter !== index) {
                    lastEnter = index;
                    the.emit('enter', ele, index);
                }
            };
            var onleave = function (ele, index) {
                if (lastLeave !== index) {
                    lastLeave = index;
                    the.emit('leave', ele, index);
                }
            };
            var onscroll = controller.debounce(function (isDown) {
                var scrollTop = the._$container.scrollTop();
                var containerHeight = the._$container.height();
                var hasEnter = false;
                var hasLeave = false;

                if (isDown) {
                    dato.each(the._list2, function (index, item) {
                        if (!hasEnter && scrollTop + containerHeight > item.top) {
                            hasEnter = true;
                            index = the._length - index - 1;
                            onenter(item.ele, index);
                        }

                        if (!hasLeave && item.bottom < scrollTop) {
                            hasLeave = true;
                            onleave(item.ele, index);
                        }

                        if (hasEnter && hasLeave) {
                            return false;
                        }
                    });
                } else {
                    dato.each(the._list, function (index, item) {
                        if (!hasEnter && item.bottom > scrollTop && scrollTop + containerHeight > the._parentTop) {
                            hasEnter = true;
                            onenter(item.ele, index);
                        }

                        if (!hasLeave && item.top > scrollTop + containerHeight) {
                            hasLeave = true;
                            onleave(item.ele, index);
                        }

                        if (hasEnter && hasLeave) {
                            return false;
                        }
                    });
                }
            }, options.wait);

            the._scroll = new Scroll(the._$container);
            the._scroll.on('up', function () {
                onscroll();
            }).on('down', function () {
                onscroll(true);
            });
        },


        /**
         * 销毁实例
         */
        destroy: function () {
            var the = this;

            the._scroll.destroy();
        }
    });

    Scroller.defaults = defaults;
    module.exports = Scroller;
});