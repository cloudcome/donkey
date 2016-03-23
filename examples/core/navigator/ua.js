/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-09-19 13:50
 */


define(function (require, exports, module) {
    /**
     * @module parent/compatible
     */

    'use strict';

    var ua = require('../../../src/core/navigator/ua.js');

    window.ua = ua;
});