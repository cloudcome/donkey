/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-09-28 14:03
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;
    var $ret = $('#ret');
    var CountDown = require('../../src/libs/count-down.js');
    var ct = new CountDown({
        count: new Date(2015, 10, 20, 18, 0, 0, 0) - Date.now()
    });

    ct.on('change', function (remain) {
        $ret.text('剩余' + Math.ceil(remain / 1000) + '秒');
    }).on('start', function (remain) {
        console.log('开始计时', remain);
    }).on('pause', function (remain) {
        console.log('暂停计时', remain);
    }).on('stop', function (remain) {
        console.log('停止计时', remain);
    });
    $('#btn1').on('click', function () {
        ct.start();
    });
    var isPause = false;
    $('#btn2').on('click', function () {
        if (isPause) {
            ct.resume();
        } else {
            ct.pause();
        }

        isPause = !isPause;
        $(this).html(isPause ? '恢复计时' : '暂停计时');
    });
    $('#btn3').on('click', function () {
        ct.stop();
    });
});