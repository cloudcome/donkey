/**
 * editor card
 * @author ydr.me
 * @create 2015-12-24 19:50
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;
    var ui = require('../index.js');
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
        autoClose: true,
        animation: {
            duration: 123
        }
    };
    var Card = ui.create({
        constructor: function (options) {
            var the = this;

            the._options = dato.extend(true, {}, defaults, options);
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
            var eDiv = the._eDiv = modification.create('div', {
                style: options.style
            });

            eDiv.innerHTML = options.template;
            $(eDiv).appendTo(document.body);
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            var timeid = 0;

            event.on(the._eDiv, 'mouseover', function () {
                clearTimeout(timeid);
            });

            event.on(the._eDiv, 'mouseout', function () {
                timeid = setTimeout(function () {
                    the.close();
                }, 400);
            });
        },


        /**
         * 获取节点
         * @returns {Node|*}
         */
        getNode: function () {
            return this._eDiv;
        },


        /**
         * 打开卡片
         * @param $target {*} 参考目标
         * @param [callback] {Function} 回调
         * @returns {Card}
         */
        open: function ($target, callback) {
            var the = this;
            $target = $($target);
            var offset = $target.offset();

            offset.display = 'block';
            offset.opacity = 0;
            offset.top += $target.height();
            offset.zIndex = ui.getZindex();
            $(the._eDiv).css(offset);

            the.emit('beforeopen');
            animation.animate(the._eDiv, {
                opacity: 1
            }, the._options.animation, function () {
                if (typeis.Function(callback)) {
                    callback.call(the);
                }

                the.emit('open');
            });

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
            animation.animate(the._eDiv, {
                opacity: 0
            }, the._options.animation, function () {
                the._eDiv.style.display = 'none';
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