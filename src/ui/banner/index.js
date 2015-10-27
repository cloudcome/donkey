/*!
 * banner
 * @author ydr.me
 * @create 2015-09-14 22:43
 */


define(function (require, exports, module) {
    /**
     * @module ui/banner/
     * @requires ui/
     * @requires utils/dato
     * @requires utils/number
     * @requires utils/typeis
     * @requires utils/controller
     * @requires core/dom/animation
     */

    'use strict';

    var $ = window.jQuery;
    var namespace = 'donkey-ui-banner';
    var donkeyId = 0;
    var ui = require('../index.js');
    var dato = require('../../utils/dato.js');
    var number = require('../../utils/number.js');
    var typeis = require('../../utils/typeis.js');
    var controller = require('../../utils/controller.js');
    var animation = require('../../core/dom/animation.js');
    var compatible = require('../../core/navigator/compatible.js');
    var supportTransition = !!compatible.css3('transition');
    var style = require('./style.css', 'css');
    var defaults = {
        width: 1024,
        height: 800,
        duration: 678,
        easing: 'swing',
        interval: 5000,
        // 列表选择器
        listSelector: '.banner-list',
        // 项目选择器
        itemSelector: '.banner-list > *',
        // 导航选择器
        navSelector: '.banner-nav',
        // 导航生成器
        navGenerator: function (index, length) {
            return '<li></li>';
        },
        activeClass: 'active',
        // 是否自动播放
        auto: true,
        // 是否循环
        loop: true,
        // 是否首尾相连
        circle: true
    };
    var Banner = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = $($parent);
            the._options = dato.extend({}, defaults, options);
            the._id = donkeyId++;
            the._currentIndex = 0;
            the.className = 'banner';
            the._initNode();
            the._initEvent();
            the._auto();
        },


        /**
         * 初始化节点
         * @private
         */
        _initNode: function () {
            var the = this;
            var options = the._options;

            // 首尾相连循环
            the._loopCircle = options.loop && options.circle;
            the._$parent.addClass(namespace);
            the._$list = $(options.listSelector, the._$parent).addClass(namespace + '-list');
            the._$nav = $(options.navSelector, the._$parent);
            the._$items = $(options.itemSelector, the._$parent).addClass(namespace + '-item');
            the._length = the._$items.length;

            if (the._loopCircle && the._length > 1) {
                var $firstItem = the._$items.first();
                var $lastItem = the._$items.last();
                var cloneClass = namespace + '-item-clone';

                the._$lastItemClone = $firstItem.clone().addClass(cloneClass);
                the._$firstItemClone = $lastItem.clone().addClass(cloneClass);
                the._$list.prepend(the._$firstItemClone);
                the._$list.append(the._$lastItemClone);
                the._$items = the._$items.add(the._$firstItemClone).add(the._$lastItemClone);
            }

            if (typeis.Function(options.navGenerator)) {
                var html = '';

                dato.repeat(the._length, function (index) {
                    html += options.navGenerator.call(this, index, the._length);
                });
                the._$nav.html(html);
            }

            the._$navItems = the._$nav.children().each(function (index) {
                $(this).data('index', index);
            });
            the._resize();
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            var options = the._options;

            the._$parent.on('mouseenter', function () {
                the._pause();
            }).on('mouseleave', function () {
                the._auto();
            });

            the.after('change', function (index) {
                the._currentIndex = index;
                the._$navItems.eq(index).addClass(options.activeClass)
                    .siblings().removeClass(options.activeClass);
            });

            the._$nav.on('click', '>*', function () {
                var index = $(this).data('index');

                the._pause();
                the.change(index);
                the._auto();
            });

            controller.nextTick(function () {
                the.emit('beforechange', 0, 0);
                the.emit('afterchange', 0, 0);
            });
        },


        /**
         * 暂停
         * @private
         */
        _pause: function () {
            var the = this;

            clearInterval(the._timeid);
        },


        /**
         * 自动播放
         * @private
         */
        _auto: function () {
            var the = this;
            var options = the._options;

            if (!options.auto) {
                return;
            }

            the._pause();
            the._timeid = setInterval(function () {
                the.change(the._currentIndex + 1, 'next');
            }, options.interval);
        },


        /**
         * 改变 banner
         * @param [index=0] {Number} 索引值
         * @param [direction="auto"] {String} 默认自动
         * @returns {Banner}
         */
        change: function (index, direction) {
            var the = this;
            var options = the._options;

            if (the._animating) {
                return the;
            }

            index = number.parseInt(index, 0);

            // 超过边界 && 不循环
            if ((index < 0 || index >= the._length) && !options.loop) {
                return the;
            }

            index = index % the._length;

            if (index < 0) {
                index = the._length + index;
            }

            if (index === the._currentIndex) {
                return the;
            }

            var left = 0;
            var endIndex = -1;

            if (the._loopCircle) {
                // 向后边界
                if (the._currentIndex === the._length - 1 && index === 0 && direction === 'next') {
                    left = (the._length + 1) * options.width;
                    endIndex = 1;
                }
                // 向前边界
                else if (!the._currentIndex && index === the._length - 1 && direction === 'prev') {
                    left = 0;
                    endIndex = the._length;
                } else {
                    left = (index + 1) * options.width;
                }
            } else {
                left = index * options.width;
            }

            var oncallback = function () {
                the._animating = false;

                if (endIndex > -1) {
                    the._$list.css(the._calLeft(endIndex * options.width));
                }

                the.emit('afterchange', index, the._currentIndex);
            };

            the.emit('beforechange', index, the._currentIndex);
            the._animating = true;
            var animateOptions = {
                duration: options.duration,
                easing: options.easing
            };

            if (supportTransition) {
                animation.animate(the._$list, {
                    translateX: -left
                }, animateOptions, oncallback);
            } else {
                animation.animate(the._$list, {
                    marginLeft: -left
                }, animateOptions, oncallback);
            }

            return the;
        },


        /**
         * 上一张
         * @returns {Banner}
         */
        prev: function () {
            var the = this;

            the._pause();
            the.change(the._currentIndex - 1, 'prev');

            return the;
        },


        /**
         * 下一张
         * @returns {Banner}
         */
        next: function () {
            var the = this;

            the._pause();
            the.change(the._currentIndex + 1, 'next');

            return the;
        },


        /**
         * 计算偏移量
         * @param left
         * @param to
         * @returns {*}
         * @private
         */
        _calLeft: function (left, to) {
            to = to || {};

            if (supportTransition) {
                to.transform = 'translate(-' + left + 'px, 0)';
            } else {
                to.marginLeft = -left;
            }

            return to;
        },


        /**
         * 重置尺寸
         * @private
         */
        _resize: function () {
            var the = this;
            var options = the._options;
            var left = the._length > 1 ?
            (the._currentIndex + (the._loopCircle ? 1 : 0)) * options.width : 0;

            the._$parent.css({
                width: options.width,
                height: options.height
            });
            the._$items.css({
                width: options.width,
                height: options.height
            });

            var to = {
                width: (the._length + (the._loopCircle ? 2 : 0)) * options.width
            };

            the._calLeft(left, to);

            the._$list.css(to);
        },


        /**
         * 重置 banner 尺寸
         * @param size
         * @returns {Banner}
         */
        resize: function (size) {
            var the = this;

            dato.extend(the._options, size);
            the._resize();

            return the;
        },


        destroy: function () {

        }
    });

    Banner.defaults = defaults;
    module.exports = Banner;
    ui.importStyle(style);
});