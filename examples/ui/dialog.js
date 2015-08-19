/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-08-18 16:28
 */


define(function (require, exports, module) {
    /**
     * @module parent/dialog.js
     */

    'use strict';

    var random = require('../../src/utils/random.js');
    var Dialog = require('../../src/ui/dialog/index.js');
    var dialog = new Dialog('#demo', {
        maxHeight: 600
    });

    $('#demo').on('click', function () {
        $(this).width(random.number(200, 900)).height(random.number(200, 900));
        dialog.update();
    });

    $('#open').on('click', function () {
        dialog.open();
    });

    $('#resize').on('click', function () {
        dialog.resize();
    });

    $('#destroy').on('click', function () {
        dialog.destroy();
    });
});