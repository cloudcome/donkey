/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-09-16 21:53
 */


define(function (require, exports, module) {
    /**
     * @module parent/keyframes
     */

    'use strict';

    var keyframes = require('../../../src/core/dom/keyframes.js');

    keyframes.create('shake', {
        0: {
            width: 100
        },
        1: {
            width: 200
        }
    });
});