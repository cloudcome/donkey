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
    var Banner = require('../../src/ui/banner/index.js');
    var banner = new Banner('#banner', {
        width: 1000,
        height: 400,
        auto: false,
        loop: true
    });

    $('#prev').on('click', function () {
        banner.prev();
    });

    $('#next').on('click', function () {
        banner.next();
    });

    $('#resize').on('click', function () {
        banner.resize({
            width: random.number(600, 1000),
            height: random.number(200, 400)
        });
    });

});