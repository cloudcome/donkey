/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-26 15:41
 */


define(function (require, exports, module) {
    /**
     * @module parent/loading
     */

    'use strict';

    var Loading = require('../../src/ui/loading/index.js');

    var loading = new Loading();

    loading.open();
    setTimeout(function () {
        loading.setText('长长的文字长长的文字');
    }, 2000);
    setTimeout(function () {
        loading.setText('短');
    }, 4000);
    setTimeout(function () {
        loading.setText('');
    }, 6000);
});