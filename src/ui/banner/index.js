/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-09-14 22:43
 */


define(function (require, exports, module) {
    /**
     * @module parent/index
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
    var style = require('./style.css', 'css');
    var defaults = {
        width: 1024,
        height: 800,
        duration: 678,
        interval: 5000,
        // 列表选择器
        listSelector: '.banner-list',
        // 项目选择器
        itemSelector: '.banner-list li',
        // 导航选择器
        navSelector: '.banner-nav',
        // 导航生成器
        navGenerator: function (index, length) {
            return '<li></li>';
        },
        activeClass: 'active',
        // 是否自动播放
        auto: true
    };
    var Banner = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = $($parent);
            the._options = dato.extend({}, defaults, options);
            the._id = donkeyId++;
            the._currentIndex = 0;
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

            the._$parent.css({
                width: options.width,
                height: options.height
            }).addClass(namespace);
            the._$items = $(options.itemSelector, the._$parent)
                .addClass(namespace + '-item')
                .css({
                    width: options.width,
                    height: options.height
                });
            the._length = the._$items.length;
            the._$list = $(options.listSelector, the._$parent)
                .addClass(namespace + '-list')
                .css({
                    width: the._length * options.width
                });
            the._$nav = $(options.navSelector, the._$parent);

            if (typeis.function(options.navGenerator)) {
                var html = '';

                dato.repeat(the._length, function (index) {
                    html += options.navGenerator.call(this, index, the._length);
                });
                the._$nav.html(html);
            }

            the._$navItems = the._$nav.children().each(function (index) {
                $(this).data('index', index);
            });
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

            the.on('change', function (index) {
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
                the.emit('change', 0);
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
                the.change(the._currentIndex + 1);
            }, options.interval);
        },


        /**
         * 改变 banner
         * @param index
         * @returns {Banner}
         */
        change: function (index) {
            var the = this;
            var options = the._options;

            index = number.parseInt(index, 0);
            index = index % the._length;

            if (index < 0) {
                index = the._length + index;
            }

            if (index === the._currentIndex) {
                return the;
            }

            var left = -index * options.width;
            var oncallback = function () {
                the.emit('change', index);
            };

            if (animation.supportTransition) {
                animation.animate(the._$list, {
                    translateX: left
                }, {
                    duration: options.duration
                }, oncallback);
            } else {
                animation.animate(the._$list, {
                    marginLeft: left
                }, {
                    duration: options.duration
                }, oncallback);
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
            the.change(the._currentIndex - 1);

            return the;
        },


        /**
         * 下一张
         * @returns {Banner}
         */
        next: function () {
            var the = this;

            the._pause();
            the.change(the._currentIndex + 1);

            return the;
        }
    });

    Banner.defaults = defaults;
    module.exports = Banner;
    ui.importStyle(style);
});