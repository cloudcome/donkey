/*!
 * dialog
 * @author ydr.me
 * @create 2015-08-18 12:07
 */


define(function (require, exports, module) {
    /**
     * @module parent/index
     */

    'use strict';

    var win = window;
    var $ = win.jQuery;
    var doc = win.document;
    var elBody = doc.body;
    var ui = require('../index.js');
    var Template = require('../../libs/template.js');
    var template = require('./template.html', 'html');
    var tpl = new Template(template);
    var style = require('./style.css', 'css');
    var dato = require('../../utils/dato.js');
    var Window = require('../window/index.js');
    var namespace = 'donkey-ui-dialog';
    var donkeyId = 0;
    var defaults = {
        // width 可以等于 height，height 也可以等于 width
        // 当两者都互相相等时，即是一个正方形
        width: 'auto',
        height: 'auto',
        minWidth: 'none',
        minHeight: 'none',
        maxWidth: 1000,
        maxHeight: 800,
        duration: 567,
        addClass: '',
        translateY: 10,
        autoResize: true,
        title: '无标题',
        draggable: true
    };
    var Dialog = ui.create({
        constructor: function ($dialog, options) {
            var the = this;

            the._$dialog = $($dialog);
            the._options = dato.extend({}, defaults, options);
            the._id = donkeyId++;
            the._initNode();
            the._initEvent();
        },


        _initNode: function () {
            var the = this;
            var options = the._options;

            the._$parent = $(tpl.render({
                id: the._id
            })).appendTo(elBody);
            var nodes = $('.j-flag', the._$parent);
            the._$head = $(nodes[0]);
            the._$title = $(nodes[1]);
            the._$close = $(nodes[2]);
            the._$body = $(nodes[3]);
            the._window = new Window(the._$parent, options);
        },


        _initEvent: function () {
            var the = this;
            var options = the._options;

        },


        /**
         * 设置 dialog title
         * @param title {String|null|undefined} 标题
         * @returns {Dialog}
         */
        setTitle: function (title) {
            var the = this;

            if (title) {
                the._$head.show();
                the._$title.html(title);
            } else {
                the._$head.hide();
            }

            return the.resize();
        },


        /**
         * 设置 dialog 内容
         * @param html
         * @returns {Dialog}
         */
        setBody: function (html) {
            var the = this;

            the._$body.html();

            return the.resize();
        },


        /**
         * 跳转 dialog 大小
         * @returns {Dialog}
         */
        resize: function () {
            var the = this;

            the._window.resize();

            return the;
        },


        /**
         * 打开 dialog
         * @returns {Dialog}
         */
        open: function () {
            var the = this;

            the._window.open();

            return the;
        },


        /**
         * 关闭 dialog
         * @returns {Dialog}
         */
        close: function () {
            var the = this;

            the._window.close();

            return the;
        },


        /**
         * 销毁 dialog
         */
        destroy: function () {
            var the = this;

            the._window.destroy();
        }
    });


    Dialog.defaults = defaults;
    ui.importStyle(style);
    module.exports = Dialog;
});