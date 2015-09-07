/*!
 * 图片裁剪
 * @author ydr.me
 * @create 2015-07-28 15:36
 */


define(function (require, exports, module) {
    /**
     * @module ui/img-clip/
     * @requires ui/
     * @requires utils/dato
     */

    'use strict';

    var $ = window.jQuery;
    require('../../jquery-plugins/jquery-clip.js');
    var ui = require('../index.js');
    var dato = require('../../utils/dato.js');
    var typeis = require('../../utils/typeis.js');
    var random = require('../../utils/random.js');
    var style = require('./style.css', 'css');
    var gif = require('./line.gif', 'image');
    var modification = require('../../core/dom/modification.js');
    var canvasImg = require('../../canvas/img.js');
    var canvasContent = require('../../canvas/content.js');
    var eleCanvas = modification.create('canvas', {
        style: {
            display: 'none'
        }
    });
    var supportCanvas = 'getContext' in eleCanvas;
    var namespace = 'doneky-ui-imgclip';
    var defaults = {
        /**
         * 宽高比，0：宽高不定
         * @type Number
         */
        aspectRatio: 0,
        // 最小尺寸
        minSize: [0, 0],
        // 最大尺寸
        maxSize: [0, 0],
        // 裁剪的图片类型
        type: 'image/jpeg',
        // 裁剪的图片质量
        quality: 0.8,
        // 自动选区
        autoSelect: true,
        // 是否客户端裁剪
        clientClip: true,
        // 裁剪的尺寸
        clipSize: [0, 0]
    };
    var ImgClip = ui.create({
        constructor: function ($img, options) {
            var the = this;

            the._$img = $($img);
            the._hasSelection = false;
            the._selection = null;
            the._imgWidth = 0;
            the._imgHeight = 0;
            options = the._options = dato.extend({}, defaults, options);
            options.baseClass = namespace;
            options.onSelect = function () {
                the._hasSelection = true;
                the.emit('select');
            };
            options.onRelease = function () {
                the._hasSelection = false;
                the.emit('release');
            };
            options.onChange = function (selection) {
                var self = this;
                var scale = self.getScaleFactor();
                //// 原始尺寸
                //console.log(this.getBounds());
                //// 裁剪的尺寸
                //console.log(this.getWidgetSize());
                //// 缩放比例

                //x: c.x * xscale,
                //y: c.y * yscale,
                //x2: c.x2 * xscale,
                //y2: c.y2 * yscale,
                //w: c.w * xscale,
                //h: c.h * yscale
                selection.ow = the._imgWidth;
                selection.oh = the._imgHeight;
                // 缩放比例，原始比当前
                selection.scale = scale;
                the._selection = selection;
                the.emit('change', selection);
            };
            var onload = function () {
                the._imgWidth = img.width;
                the._imgHeight = img.height;
                options.trueSize = [img.width, img.height];
                the._$img.Jcrop(options);
                the._clip = the._$img.data('Jcrop');

                if (img.width < options.minSize[0]) {
                    the.emit('error', new Error('图片宽度不能小于' + options.minSize[0]));
                    the._clip.disable();
                } else if (img.height < options.minSize[1]) {
                    the.emit('error', new Error('图片高度不能小于' + options.minSize[1]));
                    the._clip.disable();
                } else {
                    if (options.autoSelect) {
                        the.setSelection();
                    }

                    the.emit('success');
                }

                the.emit('afterload');
            };
            var img = new Image();
            the.emit('beforeload');
            img.src = the._$img[0].src;
            img.onload = onload;
        },


        /**
         * 设置图片
         * @param url
         * @param callback
         * @returns {ImgClip}
         */
        setURL: function (url, callback) {
            var the = this;
            var options = the._options;
            var img = new Image();

            the._clip.enable();
            img.src = url;
            img.onload = function () {
                the._imgWidth = img.width;
                the._imgHeight = img.height;
                the._options.trueSize = [img.width, img.height];
                the._clip.setOptions(the._options);
                the._clip.setImage(url, function () {
                    if (typeis.isFunction(callback)) {
                        callback();
                    }

                    if (img.width < options.minSize[0]) {
                        the.emit('error', new Error('图片宽度不能小于' + options.minSize[0]));
                        the._clip.disable();
                    } else if (img.height < options.minSize[1]) {
                        the.emit('error', new Error('图片高度不能小于' + options.minSize[1]));
                        the._clip.disable();
                    } else {
                        if (options.autoSelect) {
                            the.setSelection();
                        }

                        the.emit('success');
                    }

                    the.emit('load');
                });


            };

            return the;
        },


        /**
         * 禁用
         * @returns {ImgClip}
         */
        disable: function () {
            var the = this;

            the._clip.disable();

            return the;
        },


        /**
         * 启用
         * @returns {ImgClip}
         */
        enable: function () {
            var the = this;

            the._clip.enable();

            return the;
        },


        /**
         * 当前是否有选区
         * @returns {boolean}
         */
        hasSelection: function () {
            return this._hasSelection;
        },


        /**
         * 设置选区
         * @param [selection]
         * @returns {ImgClip}
         */
        setSelection: function (selection) {
            var the = this;
            var options = the._options;
            //var scaleList = the._clip.getScaleFactor();
            var maxWidth = the._imgWidth;
            var maxHeight = the._imgHeight;

            // 自动新建选区
            if (!selection) {
                // x,y,x2,y2
                selection = [0, 0, 0, 0];

                // 按比例最大选区
                if (options.aspectRatio) {
                    var clipWidth = maxHeight * options.aspectRatio;
                    var clipHeight = maxWidth / options.aspectRatio;

                    if (maxWidth >= clipWidth) {
                        clipHeight = clipWidth / options.aspectRatio;
                    } else {
                        clipWidth = clipHeight * options.aspectRatio;
                    }

                    selection[0] = (maxWidth - clipWidth) / 2;
                    selection[1] = (maxHeight - clipHeight) / 2;
                    selection[2] = clipWidth + selection[0];
                    selection[3] = clipHeight + selection[1];
                }
                // 随机选区
                else {
                    selection[0] = random.number(0, maxWidth);
                    selection[1] = random.number(0, maxHeight);
                    selection[2] = random.number(selection[0], maxWidth);
                    selection[3] = random.number(selection[1], maxHeight);
                }
            }

            the._clip.setSelect(selection);
            return the;
        },


        /**
         * 返回选区，如果可能的话，返回 blob
         * @params callback {Function} 回调
         * @returns {*}
         */
        getSelection: function (callback) {
            var the = this;
            var options = the._options;

            if (!the._hasSelection || !the._selection) {
                return null;
            }

            // 支持画布
            if (supportCanvas && options.clientClip) {
                eleCanvas.width = options.clipSize[0] || the._selection.w;
                eleCanvas.height = options.clipSize[1] || the._selection.h;
                canvasImg(eleCanvas, the._$img[0], {
                    srcLeft: the._selection.x,
                    srcTop: the._selection.y,
                    srcWidth: the._selection.w,
                    srcHeight: the._selection.h,
                    drawLeft: 0,
                    drawTop: 0,
                    drawWidth: eleCanvas.width,
                    drawHeight: eleCanvas.height
                });
                return canvasContent.toBlob(eleCanvas, {
                    type: options.type,
                    quality: options.quality
                }, function (blob) {
                    callback({
                        w: eleCanvas.width,
                        h: eleCanvas.height,
                        x: 0,
                        y: 0,
                        x1: eleCanvas.width,
                        y1: eleCanvas.height,
                        // 画布原始尺寸
                        ow: eleCanvas.width,
                        oh: eleCanvas.height
                    }, blob);
                });
            }

            return callback(the._selection, null);
        },


        /**
         * 销毁实例
         */
        destroy: function () {
            var the = this;

            the._clip.destroy();
        }
    });

    style += '.doneky-ui-imgclip-vline,.doneky-ui-imgclip-hline{background-image:url(' + gif + ')}';
    ui.importStyle(style);
    ImgClip.defaults = defaults;
    module.exports = ImgClip;
});