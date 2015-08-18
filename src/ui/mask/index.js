/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-07-17 13:49
 */


define(function (require, exports, module) {
    /**
     * @module parent/index
     */

    'use strict';

    var win = window;
    var $ = win.jQuery;
    var doc = win.document;
    var html = doc.documentElement;
    var body = doc.body;
    var ui = require('../index.js');
    var template = require('./template.html', 'html');
    var Template = require('../../libs/template.js');
    var dato = require('../../utils/dato.js');
    var tpl = new Template(template);
    var donkeyIndex = 0;
    var defaults = {
        backgroundColor: '#000',
        opacity: 0.5
    };
    var Mask = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = $($parent);
            the._options = dato.extend({}, defaults, options);
            the._id = donkeyIndex++;
            the._initNode();
        },


        ///**
        // * 更新尺寸关系
        // * @returns {Mask}
        // */
        //update: function () {
        //    var the = this;
        //    var style = the._options.style;
        //
        //    the._topStyle = {
        //        top: 0,
        //        left: 0,
        //        width: '100%',
        //        height: style.top
        //    };
        //    the._rightStyle = {
        //        top: style.top,
        //        right: 0,
        //        left: style.left + style.width,
        //        height: style.height
        //    };
        //    the._bottomStyle = {
        //        bottom: 0,
        //        left: 0,
        //        width: '100%',
        //        top: style.top + style.height
        //    };
        //    the._leftStyle = {
        //        top: style.top,
        //        left: 0,
        //        width: style.left,
        //        height: style.height
        //    };
        //
        //    the._$top.css(the._topStyle);
        //    the._$right.css(the._rightStyle);
        //    the._$bottom.css(the._bottomStyle);
        //    the._$left.css(the._leftStyle);
        //
        //    return the;
        //},

        _initNode: function () {
            var the = this;
            var options = the._options;
            var innerHTML = tpl.render({
                id: the._id
            });

            the._$mask = $(innerHTML).appendTo(body || html);
            the._$mask.css(options);
        },


        /**
         * 打开遮罩
         * @returns {Mask}
         */
        open: function () {
            var the = this;

            the._$mask.css({
                zIndex: ui.getZindex(),
                display: 'block'
            });

            return the;
        },


        /**
         * 关闭遮罩
         * @returns {Mask}
         */
        close: function () {
            var the = this;

            the._$mask.hide();

            return the;
        },


        /**
         * 销毁实例
         */
        destroy: function () {
            this._$mask.remove();
        }
    });

    Mask.defaults = defaults;
    module.exports = Mask;
    ui.importStyle(require('./style.css', 'css'));
});