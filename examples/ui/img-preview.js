/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-25 14:15
 */


define(function (require, exports, module) {
    /**
     * @module parent/img-preview
     */

    'use strict';

    var $ = window.jQuery;
    var ImgPreview = require('../../src/ui/img-preview/index.js');

    var pre = new ImgPreview('#demo');

    $('#file').change(function () {
        pre.preview(this);
    });
});