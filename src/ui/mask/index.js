/**
 * mask
 * @author ydr.me
 * @create 2015-07-17 13:49
 */


define(function (require, exports, module) {
    /**
     * @module ui/mask
     * @requires libs/template
     * @requires utils/dato
     */

    'use strict';

    var win = window;
    var $ = win.jQuery;
    var doc = win.document;
    var $html = doc.documentElement;
    var $body = doc.body;

    var ui = require('../index.js');
    var style = require('./style.css', 'css');
    var template = require('./template.html', 'html');
    var Template = require('../../libs/template.js');
    var dato = require('../../utils/dato.js');

    var maskWindowLength = 0;
    var maskWindowList = [];
    var namespace = 'donkey-ui-mask';
    var tpl = new Template(template);
    var donkeyIndex = 0;
    var defaults = {
        backgroundColor: '#000',
        opacity: 0.5,
        // 是否固定滚动条
        fixed: true
    };
    var Mask = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = $($parent);
            the._options = dato.extend({}, defaults, options);
            the.id = donkeyIndex++;
            the.className = 'mask';
            the.visible = false;
            the.destroyed = false;
            the._initNode();
        },

        _initNode: function () {
            var the = this;
            var options = the._options;
            var innerHTML = tpl.render({
                id: the.id
            });

            the._$mask = $(innerHTML).appendTo($body);
            the._$mask.css(options);
        },


        /**
         * 打开遮罩
         * @returns {Mask}
         */
        open: function () {
            var the = this;
            var options = the._options;

            if (the.visible) {
                return the;
            }


            the.emit('beforeopen');
            the.visible = true;

            if (_isSameToWindow(the._$parent[0])) {
                if (options.fixed) {
                    $($html).addClass(namespace + '-overflow');
                }

                maskWindowLength++;
                maskWindowList.push(the);
            } else {
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
            $($html).removeClass(namespace + '-overflow');
            if (_isSameToWindow(the._$parent[0])) {
                maskWindowLength--;

                var findIndex = -1;

                dato.each(maskWindowList, function (index, mask) {
                    if (mask.id === the.id) {
                        findIndex = index;
                        return false;
                    }
                });

                maskWindowList.splice(findIndex, 1);
            }

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

    /**
     * 覆盖 window 的 mask 列表
     * @type {Array}
     */
    Mask.maskWindowList = maskWindowList;


    /**
     * 获得当前最顶层覆盖 window 的 mask
     * @returns {*}
     */
    Mask.getTopWindowMask = function () {
        return maskWindowList[maskWindowLength - 1];
    };

    Mask.defaults = defaults;
    module.exports = Mask;
    style += '.' + namespace + '-overflow{padding-right:' + _getScrollbarWidth() + 'px !important;}';
    ui.importStyle(style);

    /**
     * 获得当前页面的滚动条宽度
     * @returns {number}
     * @private
     */
    function _getScrollbarWidth() {
        var divWidth = 100;
        var $div = $('<div style="width:' + 100 + 'px;height:' + 100 + 'px;position:absolute;overflow:scroll">').appendTo($body);

        var width = divWidth - $div[0].clientWidth;
        $div.remove();

        return width;
    }


    function _isSameToWindow(ele) {
        return ele === window || ele === $html || ele === doc || ele === $body;
    }
});