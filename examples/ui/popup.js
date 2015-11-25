/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-05-15 15:33
 */


define(function (require, exports, module) {
    /**
     * @module parent/Slidebar
     */

    'use strict';

    var $ = window.jQuery;
    var Popup = require('../../src/ui/popup/');
    var random = require('../../src/utils/random.js');

    $('button').each(function (index, $btn) {
        var pp = new Popup($btn);

        $btn.onclick = function () {
            pp.setContent('<p style="word-break: break-all;">' +
                random.string(random.number(5, 500), 'aA0') + '。</p>').open();
        };
    });
});