/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 11:38
 */


define(function (require, exports, module) {
    /**
     * @module parent/observe
     */

    'use strict';

    var observe = require('../../src/mvvm/observe.js');

    var obj = window.obj = {
        array: []
    };

    observe(obj, function (path, operator, newValue, oldValue) {
        console.log('path', path);
        console.log('operator', operator);
        console.log('newValue', newValue);
        console.log('oldValue', oldValue);
    });
});