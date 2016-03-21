/**
 * 复制
 * @author ydr.me
 * @create 2016-03-21 09:47
 */


define(function (require, exports, module) {
    /**
     * @module ui/copy/
     * @reuqires core/dom/selector
     * @reuqires ui/
     */

    'use strict';

    var dato = require('../../utils/dato.js');
    var ur = require('../../utils/url.js');
    var selector = require('../../core/dom/selector.js');
    // @docs https://github.com/zeroclipboard/zeroclipboard/blob/v2.0.2/docs/api/ZeroClipboard.md
    var ZeroClipboard = require('./zero-clipboard.js');
    var swf = require('./zero-clipboard.swf', 'file|url');
    var ui = require('../index.js');

    var coolie = window.coolie;
    ZeroClipboard.config({
        swfPath: swf,
        trustedDomains: [
            location.host,
            // 信任 coolie.js
            ur.parse(coolie.url).host,
            // 信任模块入口文件
            ur.parse(coolie.mainURL).host,
            // 信任模块配置文件
            ur.parse(coolie.configURL).host
        ]
    });

    var defaults = {
        text: ''
    };

    /**
     * @class Copy
     */
    var Copy = ui.create({
        constructor: function (copyEl, options) {
            var the = this;

            the._copyEl = selector.query(copyEl)[0];
            the._client = new ZeroClipboard(the._copyEl);
            the._options = dato.extend({}, defaults, options);
            the._initEvent();
        },

        _initEvent: function () {
            var the = this;
            var options = the._options;

            the._client.on('ready', function (e) {
                the.emit('ready', e);
            });

            the._client.on('error', function (e) {
                var err = new Error(e.message);

                dato.extend(err, e);
                the.emit('error', err);
            });

            the._client.on('copy', function (e) {
                the.setText(options.text);
                the.emit('copy', e);
            });

            the._client.on('aftercopy', function (e) {
                the.emit('copied', e);
            });
        },


        /**
         * 设置复制文本
         * @param text
         * @returns {Copy}
         */
        setText: function (text) {
            var the = this;

            the._client.setText(String(text));
            return the;
        },


        /**
         * 销毁实例
         */
        destroy: function () {
            var the = this;

            the._client.destroy();
        }
    });

    Copy.defaults = defaults;
    module.exports = Copy;
});