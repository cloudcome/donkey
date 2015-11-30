/**
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
    var Window = require('../window/index.js');
    var dato = require('../../utils/dato.js');
    var typeis = require('../../utils/typeis.js');
    var controller = require('../../utils/controller.js');

    var template = require('./template.html', 'html');
    var style = require('./style.css', 'css');
    var loadingGif = require('./loading.gif', 'image');
    var paddingSize = 20;
    var defaults = {
        text: '加载中',
        modal: true
    };
    var Loading = ui.create({
        constructor: function (options) {
            var the = this;

            if (typeis(options) === 'string') {
                options = {
                    text: options
                };
            }

            the._options = dato.extend({}, defaults, options);
            the.visible = false;
            the.className = 'loading';
            the._initNode();
        },


        /**
         * 初始化节点
         * @private
         */
        _initNode: function () {
            var the = this;
            var options = the._options;

            the._$loading = $(template).appendTo(document.body);
            the._$inner = the._$loading.children();
            the._window = new Window(the._$loading, {
                modal: options.modal,
                width: 'height',
                height: 'width',
                translateY: 0
            }).on('update', function (size) {
                var marginTop = (size.height - the._$inner.height() - paddingSize) / 2;

                the._$inner.css('marginTop', Math.max(marginTop, 0));
            });
            var nodes = the._$inner.children();
            the._$gif = $(nodes[0]);
            the._$text = $(nodes[1]);
            the._$gif.html('<img src="' + loadingGif + '" width="30" height="30">');
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
            the._$text.html(options.text).css('display', options.text ? 'block' : 'none');

            if (!the.visible) {
                return the;
            }

            the._window.update();

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

            the.visible = true;
            the.setText(options.text);
            the._window.open();
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

            the._window.close();

            the.visible = false;

            return the;
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

            the.close();
            the._$loading.remove();
        }
    });

    ui.importStyle(style);
    Loading.defaults = defaults;
    module.exports = Loading;
});