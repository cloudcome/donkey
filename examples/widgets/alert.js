/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-23 10:48
 */


define(function (require, exports, module) {
    /**
     * @module parent/alert
     */

    'use strict';

    var alert = require('../../src/widgets/alert.js');

    $('#btn0').on('click', function () {
        alert('没有按钮').on('close', function (index) {
            alert('已关闭');
        });
    });

    $('#btn1').on('click', function () {
        alert('一个按钮').on('close', function (index) {
            alert('已关闭');
        });
    });
});