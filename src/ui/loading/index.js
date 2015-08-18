/*!
 * loading
 * @author ydr.me
 * @create 2015-08-04 15:07
 */


define(function (require, exports, module) {
    /**
     * @module ui/loading/
     * @requires ui/
     * @requires ui/mask/
     * @requires utils/dato
     * @requires utils/typeis
     * @requires utils/controller
     */

    'use strict';

    var $ = window.jQuery;
    var ui = require('../index.js');
    var Mask = require('../mask/index.js');
    var dato = require('../../utils/dato.js');
    var typeis = require('../../utils/typeis.js');
    var controller = require('../../utils/controller.js');
    var template = require('./template.html', 'html');
    var style = require('./style.css', 'css');
    var loadingGif = require('./loading.gif', 'image');
    var defaults = {
        text: '加载中',
        modal: true
    };
    var Loading = ui.create({
        constructor: function (options) {
            var the = this;

            the._options = dato.extend({}, defaults, options);
            the.visible = false;
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

            if (options.modal) {
                the._mask = new Mask(window, {
                    opacity: 0
                });
            }

            the._$loading = $(template).appendTo('body');
            the._$inner = the._$loading.children();
            var nodes = the._$inner.children();
            the._$gif = $(nodes[0]);
            the._$text = $(nodes[1]);
            the._$gif.html('<img src="' + loadingGif + '" width="30" height="30">');
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            //var options = the._options;

            // loading 位置
            $(window).on('resize', the._onresize = controller.debounce(function () {
                if (!the.visible) {
                    return;
                }

                ui.align(the._$loading, window, {
                    x: 'c',
                    y: 'c'
                });
            }));
        },


        /**
         * 改变 loading 文字
         * @param [text] {String} loading提示
         * @returns {Loading}
         */
        setText: function (text) {
            var the = this;
            var options = the._options;

            options.text = typeis.empty(text) ? '' : text;

            if (!the.visible) {
                return the;
            }

            the._$text.html(options.text).css('display', options.text ? 'block' : 'none');
            the._$inner.css('marginTop', 0);
            the._$loading.css({
                display: 'block',
                width: 'auto',
                height: 'auto',
                visibility: 'hidden'
            });

            var width = the._$loading.width();
            var height = the._$loading.height();
            var innerHeight = the._$inner.height();
            var size = Math.max(width, height);
            var marginTop = (size - innerHeight) / 2;

            if (marginTop < 0) {
                marginTop = 0;
            }

            the._$inner.css('marginTop', marginTop);
            the._$loading.css({
                visibility: 'visible'
            }).width(size).height(size);
            ui.align(the._$loading, window, {
                x: 'c',
                y: 'c'
            });

            return the;
        },

        /**
         * 打开 loading
         * @returns {Loading}
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

            the.visible = true;
            the._$loading.css('zIndex', ui.getZindex());
            the.setText(options.text);
            return the;
        },


        /**
         * 关闭 loading
         * @returns {Loading}
         */
        close: function () {
            var the = this;

            if (!the.visible) {
                return the;
            }

            the._$loading.hide();

            if (the._mask) {
                the._mask.close();
            }

            the.visible = false;
        },


        /**
         * 动画结束
         */
        done: function () {
            this.destroy();
        },


        /**
         * 销毁实例
         */
        destroy: function () {
            var the = this;

            $(window).off('resize', the._onresize);
            the.close();
            the._$loading.remove();

            if (the._mask) {
                the._mask.destroy();
            }
        }
    });

    ui.importStyle(style);
    Loading.defaults = defaults;
    module.exports = Loading;
});