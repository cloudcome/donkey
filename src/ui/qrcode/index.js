/**
 * qrcode 渲染器
 * @ref https://github.com/jeromeetienne/jquery-qrcode/blob/master/src/jquery.qrcode.js
 * @author ydr.me
 * @create 2015-12-16 17:02
 */


define(function (require, exports, module) {
    /**
     * @module ui/qrcode
     * @requires ui
     * @requires libs/qrcode
     * @requires utils/dato
     */

    'use strict';

    var $ = window.jQuery;
    var QrcodeLib = require('../../libs/qrcode.js');
    var dato = require('../../utils/dato.js');
    var ui = require('../index.js');
    var supportCanvas = (function () {
        var canvas = document.createElement('canvas');
        return 'getContext' in canvas;
    }());

    var defaults = {
        size: 256,
        // canvas > table
        render: 'canvas',
        background: '#fff',
        foreground: '#000',
        typeNumber: -1,
        correctLevel: QrcodeLib.correctLevel.H
    };
    var Qrcode = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = $($parent);
            the._options = dato.extend({}, defaults, options);
        },


        /**
         * 渲染
         * @param text
         */
        render: function (text) {
            var the = this;
            var options = the._options;
            var qrcode = new QrcodeLib(options.typeNumber, options.correctLevel);

            qrcode.addData(text);
            qrcode.make();
            the._$parent.empty().append(the._toCanvas(qrcode));
        },


        /**
         * 使用 canvas 渲染
         * @param qrcode
         * @returns {*}
         * @private
         */
        _toCanvas: function (qrcode) {
            var the = this;
            var options = the._options;

            if (!supportCanvas || options.render !== 'canvas') {
                return the._toTable(qrcode);
            }

            // create canvas element
            var canvas = document.createElement('canvas');
            canvas.width = options.size;
            canvas.height = options.size;
            var ctx = canvas.getContext('2d');

            // compute tileW/tileH based on options.width/options.height
            var tileW = canvas.width / qrcode.getModuleCount();
            var tileH = canvas.height / qrcode.getModuleCount();

            // draw in the canvas
            for (var row = 0; row < qrcode.getModuleCount(); row++) {
                for (var col = 0; col < qrcode.getModuleCount(); col++) {
                    ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
                    var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                    var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
                    ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
                }
            }
        },


        /**
         * 使用表格渲染
         * @param qrcode
         * @private
         */
        _toTable: function (qrcode) {
            var the = this;
            var options = the._options;

            var $table = $('<table/>')
                .css('width', options.size)
                .css('height', options.size)
                .css('border', '0')
                .css('border-collapse', 'collapse')
                .css('background-color', options.background);

            // compute tileS percentage
            var tileW = options.width / qrcode.getModuleCount();
            var tileH = options.height / qrcode.getModuleCount();

            // draw in the table
            for (var row = 0; row < qrcode.getModuleCount(); row++) {
                var $row = $('<tr/>').css('height', tileH).appendTo($table);

                for (var col = 0; col < qrcode.getModuleCount(); col++) {
                    $('<td/>')
                        .css('width', tileW)
                        .css('background-color', qrcode.isDark(row, col) ? options.foreground : options.background)
                        .appendTo($row);
                }
            }

            return $table;
        }
    });

    Qrcode.defaults = defaults;
    module.exports = Qrcode;
});