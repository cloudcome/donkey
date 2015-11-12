/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-12 12:44
 */


define(function (require, exports, module) {
    /**
     * @module parent/attribute
     */

    'use strict';

    var avalon = window.avalon;

    avalon.define('attribute', function (vm) {
        vm.disabled = true;
        vm.isYellow = true;
        vm.isGreen = true;
    });
    avalon.scan();
});