/*!
 * 区域滚动监听
 * @author ydr.me
 * @create 2015-09-16 19:21
 */


define(function (require, exports, module) {
    /**
     * @module ui/scroll/
     * @module utils/dato
     */

    'use strict';

    var $ = window.jQuery;
    var ui = require('../index.js');
    var dato = require('../../utils/dato.js');
    var defaults = {};
    var Scroll = ui.create({
        constructor: function ($container, options) {
            var the = this;

            the._$container = $($container);
            the._options = dato.extend({}, defaults, options);
            the.destroyed = false;
            the.className = 'scroll';
            the._initEvent();
        },


        _initEvent: function () {
            var the = this;
            //var options = the._options;
            var lastScrollTop = the._$container.scrollTop();

            the._$container.on('scroll', the._onscroll = function () {
                var scrollTop = the._$container.scrollTop();

                /**
                 * @event down
                 * @event up
                 */
                the.emit(scrollTop > lastScrollTop ? 'down' : 'up', scrollTop);
                lastScrollTop = scrollTop;
            });
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
            the._$container.off('scroll', the._onscroll);
        }
    });

    Scroll.defaults = defaults;
    module.exports = Scroll;
});