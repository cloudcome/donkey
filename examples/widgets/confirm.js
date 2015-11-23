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
    var confirm = require('../../src/widgets/confirm.js');

    $('#btn0').on('click', function () {
        confirm('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈？').on('sure', function (index) {
            alert('已确定');
        }).on('cancel', function () {
            alert('已取消');
        });
    });
});