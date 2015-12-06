/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 16:04
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;

    module.exports = {
        update: function () {
            var the = this;

            the.node.textContent = the.node.innerText = the.exec();
        }
    };
});