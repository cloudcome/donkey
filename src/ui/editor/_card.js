/**
 * editor card
 * @author ydr.me
 * @create 2015-12-24 19:50
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;
    var ui = require('../index.js');
    var Mask = require('../mask/index.js');
    var Popup = require('../popup/index.js');
    var dato = require('../../utils/dato.js');
    var typeis = require('../../utils/typeis.js');
    var modification = require('../../core/dom/modification.js');
    var animation = require('../../core/dom/animation.js');
    var event = require('../../core/event/base.js');

    var defaults = {
        style: {
            display: 'none',
            position: 'absolute',
            width: 400,
            height: 'auto',
            background: '#fff',
            border: '1px solid #ccc',
            boxShadow: '0 0 10px #BBB',
            boxSizing: 'border-box'
        },
        template: '',
        autoClose: 500,
        animation: {
            duration: 123
        },
        mask: false,
        arrowPriority: 'center'
    };
    var Card = ui.create({
        constructor: function (options) {
            var the = this;

            the._options = dato.extend(true, {}, defaults, options);
            the._initEvent();
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            var timeid = 0;
            var options = the._options;

            event.on(the._eDiv, 'mouseover', function () {
                clearTimeout(timeid);
            });

            event.on(the._eDiv, 'mouseout', function () {
                if (options.autoClose > -1) {
                    timeid = setTimeout(function () {
                        the.close();
                    }, options.autoClose);
                }
            });
        },


        /**
         * 获取节点
         * @returns {Node|*}
         */
        getNode: function () {
            return this._popup.getNode();
        },


        /**
         * 打开卡片
         * @param $target {*} 参考目标
         * @param [callback] {Function} 回调
         * @returns {Card}
         */
        open: function ($target, callback) {
            var the = this;
            var options = the._options;

            if (options.mask && !the._mask) {
                the._mask = new Mask(window);
            }

            if (!the._popup) {
                the._popup = new Popup($target, {
                    priority: options.arrowPriority
                });
                the._popup.html(options.template);
            }

            if (the._mask) {
                the._mask.open();
            }

            the._popup.open();

            return the;
        },


        /**
         * 关闭卡片
         * @param [callback] {Function} 回调
         * @returns {Card}
         */
        close: function (callback) {
            var the = this;
            the.emit('beforeclose');
            the._popup.close(function () {
                if (the._mask) {
                    the._mask.close();
                }

                if (typeis.Function(callback)) {
                    callback.call(the);
                }

                the.emit('close');
            });
            return the;
        }
    });

    Card.defaults = defaults;
    module.exports = Card;
});