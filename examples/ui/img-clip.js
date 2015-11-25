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
    var ImgClip = require('../../src/ui/img-clip/index.js');

    new ImgClip('#img');
});