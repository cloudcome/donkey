/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-09-16 10:34
 */


define(function (require, exports, module) {
    /**
     * @module parent/validation.js
     */

    'use strict';

    var Scroller = require('../../src/ui/scroller/index.js');
    var s = new Scroller('#demo');

    s.on('enter', function (ele) {
        console.log('enter', ele);
    });

    s.on('leave', function (ele) {
        console.log('leave', ele);
    });
});