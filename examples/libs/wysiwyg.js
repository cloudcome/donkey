/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-24 16:36
 */


define(function (require, exports, module) {
    /**
     * @module parent/editable
     */

    'use strict';

    var Wysiwyg = require('../../src/libs/wysiwyg.js');
    var wy = new Wysiwyg('#wysiwyg');

    $('#bold').click(function () {
        wy.bold();
    });
});