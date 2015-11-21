/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-20 18:06
 */


define(function (require, exports, module) {
    /**
     * @module parent/mask
     */

    'use strict';

    var Mask = require('../../src/ui/mask/index.js');

    $('#btn1').click(function () {
        new Mask('#demo').open();
    });

    $('#btn2').click(function () {
        new Mask(window).open();
    });
});