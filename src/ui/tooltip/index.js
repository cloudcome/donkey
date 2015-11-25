/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-25 10:19
 */


define(function (require, exports, module) {
    /**
     * @module parent/tooltips
     */

    'use strict';

    var $ = window.jQuery;
    var ui = require('../index.js');
    var dato = require('../../utlis/dato.js');
    var Msg = require('../msg/index.js');

    var defaults = {
        duration: 123,
        selector: '.tooltip',
        // 标签的 data 值，即“data-tooltip”，否则读取 图片的 alt 属性，或者 innerText 值
        data: 'tooltip',
        // 触发打开、关闭事件类型
        openEvent: 'mouseover',
        closeEvent: 'mouseout',
        // 超时消失时间
        timeout: 300
    };
    var Tooltip = ui.create({
        constructor: function (options) {
            var the = this;

            the._options = dato.extend({}, defaults, options);
            the._lastTooltip = null;
            the._initEvent();
        },

        _initEvent: function () {
            var the = this;
            var options = the._options;

            $(document).on(options.openEvent, options.selector, function () {
                the.open(this);
            }).on(options.closeEvent, options.selector, function () {
                the.close();
            });
        },

        open: function (ele) {
            var the = this;
            var options = the._options;
            var $ele = $(ele);
            var tooltip = $ele.data(options.data) || $ele.attr('alt') || $(ele).text();

            the._lastTooltip = new Msg();
        },

        close: function () {

        }
    });

    Tooltip.defaults = defaults;
    module.exports = Tooltip;
});