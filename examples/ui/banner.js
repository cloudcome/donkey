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
        interval: 3000,
        auto: false
    });

    $('#prev').on('click', function () {
        banner.prev();
    });

});