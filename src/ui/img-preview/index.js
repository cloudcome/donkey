/*!
 * 图片预览
 * @todo 提高兼容性
 * @author ydr.me
 * @create 2015-08-03 21:02
 */


define(function (require, exports, module) {
    /**
     * @module ui/img-preview
     * @requires ui/
     * @requires utils/typeis
     * @requires utils/dato
     * @requires core/navigator/compatible
     */

    'use strict';

    var $ = window.jQuery;
    var ui = require('../index.js');
    var typeis = require('../../utils/typeis.js');
    var dato = require('../../utils/dato.js');
    //var canvasImg = require('../../canvas/img.js');
    //var canvasContent = require('../../canvas/content.js');
    //var modification = require('../../core/dom/modification.js');
    var compatible = require('../../core/navigator/compatible.js');
    var URL = compatible.html5('URL', window);
    //var eleCanvas = modification.create('canvas');
    //var supportCanvas = 'getContext' in eleCanvas;
    var REG_IMAGE = /^image\//;
    var REG_HTTP = /^https?:\/\//;
    var defaults = {};
    var ImgPreview = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = $($parent);
            the._$parent.html('<img>');
            the._eleImg = the._$parent.children()[0];
            the._options = dato.extend({}, defaults, options);
        },


        /**
         * 预览本地图片
         * @param fileInput {String|Element|jQuery|Object}
         * @returns {ImgPreview}
         */
        preview: function (fileInput) {
            var the = this;
            var url;

            if (REG_HTTP.test(fileInput)) {
                url = fileInput;
            } else {
                fileInput = $(fileInput)[0];

                var file = fileInput.files[0];
                var err;

                if (!file) {
                    err = new Error('文件为空');
                    err.type = 'empty';
                    the.emit('error', err);
                    return the;
                }

                if (!REG_IMAGE.test(file.type)) {
                    err = new Error('文件类型不是图片');
                    err.type = 'type';
                    the.emit('error', err);
                    return the;
                }

                url = URL.createObjectURL(file);
            }

            the._eleImg.src = url;

            return url;
        },


        /**
         * 获取图片对象
         * @returns {*}
         */
        getImgNode: function () {
            return this._eleImg;
        }
    });

    ImgPreview.defaults = defaults;
    module.exports = ImgPreview;
});