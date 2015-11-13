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

    var Avalon = window.Avalon;

    new Avalon({
        el: 'attribute',
        data: {
            disabled: true,
            isYellow: true,
            isGreen: true
        }
    });
});