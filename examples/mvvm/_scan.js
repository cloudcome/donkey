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

    var _scan = require('../../src/mvvm/_scan.js');
    var ret = _scan(document.getElementById('demo'));

    console.log(ret);
});