/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-09-28 14:03
 */


define(function (require, exports, module) {
    /**
     * @module parent/count-down.js
     */

    'use strict';

    var $ = window.jQuery;
    var $ret = $('#ret');
    var CountDown = require('../../src/libs/count-down.js');
    var ct = new CountDown();

    ct.on('change', function (info) {
        console.log(info.seconds);
        $ret.text(JSON.stringify(info, null, 4));
    });
    $('#btn').on('click', function () {
        ct.start();
    });
});