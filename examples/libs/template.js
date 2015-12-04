/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-24 15:28
 */


define(function (require, exports, module) {
    /**
     * @module parent/template
     */

    'use strict';

    var Template = require('../../src/libs/template.js');
    var $textarea = document.getElementById('textarea');
    var $pre1 = document.getElementById('pre1');
    var $pre2 = document.getElementById('pre2');

    Template.filter('blurPhone', function (phone) {
        return phone.slice(0, 2) + '****' + phone.slice(7, 10);
    });

    var tpl = window.tpl = new Template($textarea.value, {
        debug: true
    });
    $pre1.innerHTML = tpl.fn.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    $pre2.innerHTML = tpl.render({
        a: 1,
        b: 2,
        phone: '18809091212'
    }).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
});