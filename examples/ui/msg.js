/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-23 11:31
 */


define(function (require, exports, module) {
    /**
     * @module parent/msg
     */

    'use strict';

    var Msg = require('../../src/ui/msg/index.js');

    $('#btn0').click(function () {
        new Msg('无按钮').on('close', function (index) {
            console.log(index);
        });
    });

    $('#btn1').click(function () {
        new Msg({
            content: '一个按钮',
            buttons: ['好哒']
        }).on('close', function (index) {
            console.log(index);
        });
    });

    $('#btn2').click(function () {
        new Msg({
            content: '2个按钮',
            buttons: ['好哒', '不好']
        }).on('close', function (index) {
            console.log(index);
        });
    });

    $('#btn3').click(function () {
        new Msg({
            content: '3个按钮',
            buttons: ['好哒', '不好', '好不好']
        }).on('close', function (index) {
            console.log(index);
        });
    });

    $('#btn4').click(function () {
        new Msg({
            content: '4个按钮',
            buttons: ['好哒', '不好', '好不好', '额鹅鹅鹅鹅鹅鹅鹅鹅鹅鹅鹅鹅鹅鹅鹅']
        }).on('close', function (index) {
            console.log(index);
        });
    });
});