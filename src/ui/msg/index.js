/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-08-19 12:49
 */


define(function (require, exports, module) {
    /**
     * @module parent/index
     */

    'use strict';

    var $ = window.jQuery;
    var Dialog = require('../dialog/index.js');
    var ui = require('../index.js');
    var typeis = require('../../utils/typeis.js');
    var number = require('../../utils/number.js');
    var dato = require('../../utils/dato.js');
    var Template = require('../../libs/template.js');
    var modification = require('../../core/dom/modification.js');

    var template = require('./template.html', 'html');
    var tpl = new Template(template);
    var style = require('./style.css', 'css');

    var namespace = 'donkey-ui-msg';
    var defaults = {
        width: 300,
        height: 'auto',
        left: 'center',
        top: 'center',
        title: '提示',
        content: '提示',
        addClass: '',
        buttons: null,
        canDrag: true,
        modal: true,
        duration: 123,
        easing: 'swig',
        timeout: 0,
        autoFocus: true,
        autoOpen: true
    };
    var Msg = ui.create({
        constructor: function (options) {
            var the = this;

            if (typeis.string(options)) {
                options = {
                    content: options
                };
            }

            the._options = dato.extend(true, {}, defaults, options);
            the._options.buttons = the._options.buttons || [];
            dato.each(the._options.buttons, function (index, text) {
                if (typeis.string(text)) {
                    the._options.buttons[index] = {
                        text: text,
                        addClass: ''
                    };
                }
            });
            the._initNode();
            the._initEvent();
        },

        _initNode: function () {
            var the = this;
            var options = the._options;

            the._dialog = new Dialog({
                width: options.width,
                height: options.height,
                left: options.left,
                top: options.top,
                title: options.title,
                template: tpl.render({
                    content: options.content,
                    buttons: options.buttons
                }),
                canDrag: options.canDrag,
                modal: options.modal,
                duration: options.duration,
                autoFocus: options.autoFocus
            });
            the._$body = the._dialog.getNode();
            the._$buttons = $('.j-flag', the._$body);
        },

        _initEvent: function () {
            var the = this;
            var options = the._options;
            var index = -1;
            var timeid = 0;

            the._dialog.on('close', function () {
                clearTimeout(timeid);
                the.emit('close', index);
                the.destroy();
            });

            the._$buttons.on('click', function () {
                index = number.parseInt($(this).data('index'));
                the._dialog.close();
            });

            if (options.autoOpen) {
                the._dialog.open();
            }

            if (options.timeout > 0) {
                timeid = setTimeout(function () {
                    the._dialog.close();
                }, options.timeout);
            }
        },

        /**
         * 打开消息框
         * @returns {Msg}
         */
        open: function () {
            var the = this;

            the._dialog.open();
            return the;
        },


        /**
         * 关闭消息框
         * @returns {Msg}
         */
        close: function () {
            var the = this;

            the._dialog.close(function () {
                the._dialog.destroy();
            });
            return the;
        },


        /**
         * 销毁消息框
         * @returns {*|Msg}
         */
        destroy: function () {
            return this.close();
        }
    });

    Msg.defaults = defaults;
    module.exports = Msg;
    modification.importStyle(style);
});