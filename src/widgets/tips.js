/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-08-19 13:50
 */


define(function (require, exports, module) {
    /**
     * @module parent/tips
     */

    'use strict';

    var $ = window.jQuery;
    var elBody = document.body;
    var dato = require('../utils/dato.js');
    var typeis = require('../utils/typeis.js');
    var modification = require('../core/dom/modification.js');
    var ui = require('../ui/index.js');
    var Window = require('../ui/window/index.js');
    var namespace = 'donkey-widgets-tips';
    var donkeyId = 0;
    var defaults = {
        // normal/success/danger
        type: 'normal',
        text: '提示',
        addClass: '',
        timeout: 2345,
        maxWidth: 500
    };
    var Tips = ui.create({
        constructor: function (options) {
            var the = this;

            the._options = dato.extend({}, defaults, options);
            the._id = donkeyId++;
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
            var div = modification.create('div', {
                'class': namespace + ' ' + namespace + '-' + options.type + ' ' + options.addClass,
                id: namespace + '-' + the._id
            });

            div.innerHTML = options.text;
            the._$tips = $(div).appendTo(elBody);
            the._window = new Window(the._$tips, {
                modal: false,
                maxWidth: options.maxWidth
            });
        },


        _initEvent: function () {
            var the = this;
            var options = the._options;

            if (options.timeout) {
                the._timeid = setTimeout(function () {
                    the.destroy();
                }, options.timeout);
            }
        },


        /**
         * 打开 tips
         * @returns {Tips}
         */
        open: function () {
            var the = this;

            the._window.open();

            return the;
        },


        /**
         * 关闭 tips
         * @returns {Tips}
         */
        close: function () {
            var the = this;

            the._window.close();

            return the;
        },


        /**
         * 销毁 tips
         */
        destroy: function () {
            var the = this;

            clearTimeout(the._timeid);
            the._window.destroy(function () {
                the._$tips.remove();
            });
        }
    });

    Tips.defaults = defaults;

    var tips = function (options) {
        if (typeis.string(options)) {
            options = {
                text: options
            };
        }

        return new Tips(options).open();
    };


    tips.success = function (text) {
        return tips({
            type: 'success',
            text: text
        });
    };


    tips.danger = function (text) {
        return tips({
            type: 'danger',
            text: text
        });
    };

    ui.importStyle(require('./tips.css', 'css'));
    module.exports = tips;
});