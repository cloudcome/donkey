/**
 * mask
 * @author ydr.me
 * @create 2015-07-17 13:49
 */


define(function (require, exports, module) {
    /**
     * @module ui/mask
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
        opacity: 0.5,
        fixed: true
    };
    var Mask = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = $($parent);
            the._options = dato.extend({}, defaults, options);
            the._id = donkeyIndex++;
            the.className = 'mask';
            the.visible = false;
            the.destroyed = false;
            the._initNode();
        },

        _initNode: function () {
            var the = this;
            var options = the._options;
            var innerHTML = tpl.render({
                id: the._id
            });

            the._$mask = $(innerHTML).appendTo(body);
            the._$mask.css(options);
        },


        /**
         * 打开遮罩
         * @returns {Mask}
         */
        open: function () {
            var the = this;

            if (the.visible) {
                return the;
            }


            the.emit('beforeopen');
            the.visible = true;

            if (!_isSameToWindow(the._$parent[0])) {
                var offset = the._$parent.offset();

                the._$mask.css({
                    position: 'absolute',
                    width: the._$parent.outerWidth(),
                    height: the._$parent.outerHeight(),
                    right: 'auto',
                    bottom: 'auto',
                    top: offset ? offset.top : 0,
                    left: offset ? offset.left : 0,
                    zIndex: ui.getZindex()
                });
            }

            the._$mask.show();
            the.emit('afteropen');

            return the;
        },


        resize: function () {

        },


        /**
         * 关闭遮罩
         * @returns {Mask}
         */
        close: function () {
            var the = this;

            if (!the.visible) {
                return the;
            }

            the.emit('beforeclose');
            the.visible = false;
            the._$mask.hide();
            the.emit('close');

            return the;
        },


        /**
         * 销毁实例
         */
        destroy: function () {
            var the = this;

            if (the.destroyed) {
                return;
            }

            the.emit('beforedestroy');
            the.destroyed = true;
            the._$mask.remove();
            the.emit('destroy');
        }
    });

    Mask.defaults = defaults;
    module.exports = Mask;
    ui.importStyle(require('./style.css', 'css'));


    function _isSameToWindow(ele) {
        return ele === window || ele === html || ele === doc || ele === body;
    }
});