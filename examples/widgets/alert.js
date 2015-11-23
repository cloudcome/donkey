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
        alert('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈').on('close', function (index) {
            alert('已关闭');
        });
    });
});