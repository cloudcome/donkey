/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-16 17:21
 */


define(function (require, exports, module) {
    /**
     * @module parent/qrcode
     */

    'use strict';

    var Qrcode = require('../../src/ui/qrcode/index.js');
    var qrcode = new Qrcode('#demo', {
        render: 'table'
    });

    qrcode.render('https://ydr.me/');
});