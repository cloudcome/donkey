/*!
 * dialog
 * @author ydr.me
 * @create 2015-08-18 12:07
 */


define(function (require, exports, module) {
    /**
     * @module ui/dialog/
     * @requires libs/template
     * @requires utils/dato
     * @requires utils/typeis
     * @requires ui/
     * @requires ui/window/
     * @requires core/dom/modification
     */

    'use strict';


    var win = window;
    var $ = win.jQuery;
    var doc = win.document;
    var elBody = doc.body;
    var ui = require('../index.js');
    var Emitter = require('../../libs/emitter.js');
    var Template = require('../../libs/template.js');
    var template = require('./template.html', 'html');
    var tpl = new Template(template);
    var style = require('./style.css', 'css');
    var dato = require('../../utils/dato.js');
    var typeis = require('../../utils/typeis.js');
    var Window = require('../window/index.js');
    var Draggable = require('../draggable/index.js');
    var modification = require('../../core/dom/modification.js');
    var namespace = 'donkey-ui-dialog';
    var donkeyId = 0;
    var defaults = {
        // width 可以等于 height，height 也可以等于 width
        // 当两者都互相相等时，即是一个正方形
        width: 600,
        height: 'auto',
        minWidth: 'none',
        minHeight: 'none',
        maxWidth: 1000,
        maxHeight: 800,
        duration: 345,
        // 动画偏移量
        translateY: 25,
        modal: true,
        // 是否自动调整位置
        autoResize: true,
        //-------------------------
        addClass: '',
        // 标题
        title: '无标题',
        // 是否可以拖动
        draggable: true,
        // 是否可以关闭
        canClose: true,
        // overflow
        overflow: 'auto'
    };
    var Dialog = ui.create({
        constructor: function ($dialog, options) {
            var the = this;

            the._$dialog = $($dialog);
            the._options = dato.extend({}, defaults, options);
            the.visible = false;
            the.destroyed = false;
            the._id = donkeyId++;
            the.className = 'dialog';
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

            the._$parent = $(tpl.render({
                id: the._id
            })).appendTo(elBody);
            var nodes = $('.j-flag', the._$parent);
            the._$head = $(nodes[0]);
            the._$title = $(nodes[1]);
            the._$close = $(nodes[2]);
            the._$body = $(nodes[3]);
            the._window = new Window(the._$parent, dato.extend({}, options, {
                addClass: namespace + '-window ' + options.addClass
            }));
            the._$window = $(the._window.getNode());

            var ndFlag = modification.create('#comment', namespace + '-' + the._id);
            the._$flag = $(ndFlag).insertAfter(the._$dialog);
            the._$dialog.appendTo(the._$body);
            the._$body.css('overflow', options.overflow);
            the.setTitle(options.title);

            if (!options.canClose) {
                the._$close.hide();
            }

            if (options.draggable) {
                the._draggable = new Draggable(the._$window, {
                    handle: the._$head[0]
                });
                Emitter.pipe(the._draggable, the);
            }
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            //var options = the._options;

            the._$close.on('click', function () {
                the.close();
            });
        },


        /**
         * 设置 dialog title
         * @param title {String|null|undefined} 标题
         * @returns {Dialog}
         */
        setTitle: function (title) {
            var the = this;
            var nohead = '-nohead';

            if (title) {
                the._$parent.removeClass(namespace + nohead);
                the._$head.show();
                the._$title.html(title);
            } else {
                the._$parent.addClass(namespace + nohead);
                the._$head.hide();
            }

            the._options.title = title;
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
         * 更新了 dialog 内容
         * @returns {Dialog}
         */
        update: function () {
            var the = this;
            var options = the._options;

            if (!the.visible) {
                return the;
            }

            the.emit('beforeupdate');
            the._$body.css('overflow', 'auto');
            the._window.update();
            the._$body.css('overflow', options.overflow);
            the.emit('afterupdate');

            return the;
        },


        /**
         * 跳转 dialog 大小
         * @returns {Dialog}
         */
        resize: function () {
            var the = this;

            if (!the.visible) {
                return the;
            }

            the.emit('beforeresize');
            the._window.resize();
            the.emit('afterresize');

            return the;
        },


        /**
         * 打开 dialog
         * @params [callback] {Function} 回调
         * @returns {Dialog}
         */
        open: function (callback) {
            var the = this;

            if (the.visible) {
                return the;
            }

            the.emit('beforeopen');
            the.visible = true;
            the._window.open(function () {
                if (typeis.isFunction(callback)) {
                    callback.call(the);
                }

                the.emit('afteropen');
            });

            return the;
        },


        /**
         * 关闭 dialog
         * @params [callback] {Function} 回调
         * @returns {Dialog}
         */
        close: function (callback) {
            var the = this;

            if (!the.visible) {
                return the;
            }

            the.emit('beforeclose');
            the.visible = false;
            the._window.close(function () {
                if (typeis.isFunction(callback)) {
                    callback.call(the);
                }

                the.emit('afterclose');
            });

            return the;
        },


        /**
         * 销毁 dialog
         */
        destroy: function () {
            var the = this;

            if (the.destroyed) {
                return;
            }

            the.emit('beforedestroy');
            the.destroyed = true;

            if (the._draggable) {
                the._draggable.destroy();
            }

            the._window.destroy(function () {
                the._$dialog.insertAfter(the._$flag);
                the._$flag.remove();
                the._$parent.remove();
                the._$close.off('click');
                the.emit('afterdestroy');
            });
        }
    });


    Dialog.defaults = defaults;
    ui.importStyle(style);
    module.exports = Dialog;
});