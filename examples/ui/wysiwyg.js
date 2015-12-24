/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-24 11:52
 */


define(function (require, exports, module) {
    /**
     * @module parent/editor
     */

    'use strict';

    var Wysiwyg = require('../../src/ui/wysiwyg/index.js');

    window.wy = new Wysiwyg('#textarea');
});