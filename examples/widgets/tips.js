/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-08-18 10:05
 */


define(function (require, exports, module) {
    /**
     * @module parent/window
     */

    'use strict';

    var tips = require('../../src/widgets/tips.js');
    var random = require('../../src/utils/random.js');

    $('#openTips0').on('click', function () {
        tips(random.string(random.number(20, 99)), 'aA0');
    });

    $('#openTips1').on('click', function () {
        tips.success(random.string(random.number(20, 99)), 'aA0');
    });

    $('#openTips2').on('click', function () {
        tips.danger(random.string(random.number(20, 99)), 'aA0');
    });
});