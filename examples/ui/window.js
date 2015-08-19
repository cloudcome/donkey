/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-08-18 10:05
 */


define(function (require, exports, module) {
    /**
     * @module parent/window
     */

    'use strict';

    var Window = require('../../src/ui/window/index.js');
    var win = new Window('#demo', {
        width: 'height',
        height: 'width',
        maxHeight: $(window).height() - 100
    });

    $('#open').on('click', function () {
        win.open();
    });

    $('#resize').on('click', function () {
        win.resize();
    });

    $('#destroy').on('click', function () {
        win.destroy();
    });
});