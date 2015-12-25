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
    var modification = require('../../core/dom/modification.js');

    var defaults = {
        style: {
            display: 'none',
            position: 'absolute',
            width: 400,
            height: 'auto'
        },
        template: '',
        // click out
        autoClose: true
    };
    var Card = ui.create({
        constructor: function (options) {
            var the = this;

            the._options = dato.extend(true, {}, defaults, options);
            the._initNode();
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
         * @returns {Card}
         */
        open: function ($target) {
            var the = this;
            $target = $($target);
            var offset = $target.offset();

            offset.display = 'block';
            offset.top += $target.height();
            offset.zIndex = ui.getZindex();
            $(the._eDiv).css(offset);
            return the;
        },


        /**
         * 关闭卡片
         * @returns {Card}
         */
        close: function () {
            var the = this;
            the._eDiv.style.display = 'none';
            return the;
        }
    });

    Card.defaults = defaults;
    module.exports = Card;
});