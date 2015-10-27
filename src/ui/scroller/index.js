/*!
 * 区域滚动检查器
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
        // 最后一次触发的 xx ms后检查
        wait: 123,
        // 上、下视线比
        topLine: 0,
        bottomLine: 1
    };
    var Scroller = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = $($parent);
            the.className = 'scroller';
            options = the._options = dato.extend({}, defaults, options);

            if (options.topLine > options.bottomLine) {
                var temp = options.topLine;
                options.topLine = options.bottomLine;
                options.bottomLine = temp;
            }

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
            var lineMap = {};
            var onscroll = controller.debounce(function () {
                var scrollTop = the._$container.scrollTop();
                var containerHeight = the._$container.height();

                var topLine = scrollTop + containerHeight * options.topLine;
                var bottomLine = scrollTop + containerHeight * options.bottomLine;

                // 遍历判断，是否在视线区间
                dato.each(the._list, function (index, item) {
                    if (
                        item.bottom < topLine || item.top > bottomLine
                    ) {
                        if (lineMap[index]) {
                            lineMap[index] = false;
                            the.emit('leave', item.ele, index);
                        }
                    } else {
                        if (!lineMap[index]) {
                            lineMap[index] = true;
                            the.emit('enter', item.ele, index);
                        }
                    }
                });
            }, options.wait);

            the._scroll = new Scroll(the._$container);
            the._scroll.on('up', function () {
                onscroll();
            }).on('down', function () {
                onscroll();
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