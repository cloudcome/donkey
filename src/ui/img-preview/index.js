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
    var defaults = {
        width: 'auto',
        height: 'auto',
        maxWidth: 'none',
        maxHeight: 'none'
    };
    var ImgPreview = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = $($parent);
            the._options = dato.extend({}, defaults, options);
        },


        /**
         * 预览本地图片
         * @param fileInput {String|Element|jQuery|Object}
         * @param [callback] {Function}
         * @returns {ImgPreview}
         */
        preview: function (fileInput, callback) {
            var the = this;
            var url;
            var options = the._options;
            the._$parent.html('<img>');
            the._$img = the._$parent.children();
            the._$img.css(the._options);
            the._eleImg = the._$img[0];
            the._eleImg.onload = function () {
                the.emit('afterload', this.src);
            };

            if (REG_HTTP.test(fileInput.value)) {
                url = fileInput.value;
            } else if (URL) {
                fileInput = $(fileInput)[0];

                if (!fileInput.files) {
                    err = new Error('文件不存在');
                    err.type = 'empty';
                    the.emit('error', err);
                    return the;
                }

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
                the._eleImg.src = url;

                if (typeis.function(callback)) {
                    callback.call(the, url);
                }
            } else {
                upload(fileInput, {
                    url: options.uploadURL,
                    body: {
                        type: 'image/jpeg'
                    }
                }).on('success', function (json) {
                    if (json.code !== 200) {
                        return the.emit('erorr', new Error(json.message));
                    }

                    var ret = json.result;

                    url = ret[0];
                    the._eleImg.src = url;

                    if (typeis.function(callback)) {
                        callback.call(the, url);
                    }
                }).on('error', function (err) {
                    the.emit('error', err);
                });
                //the.emit('error', new Error('该浏览器不支持图片预览'));
            }

            the.emit('beforeload');

            return url;
        },


        /**
         * 清空预览
         * @returns {ImgPreview}
         */
        empty: function () {
            var the = this;

            the._$parent.empty();
            the._eleImg = null;

            return the;
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