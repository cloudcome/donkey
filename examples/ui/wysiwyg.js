/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-24 16:36
 */


define(function (require, exports, module) {
    /**
     * @module parent/editable
     */

    'use strict';

    var Wysiwyg = require('../../src/ui/wysiwyg/index.js');
    var random = require('../../src/utils/random.js');
    var wy = new Wysiwyg('#wysiwyg');

    $('#bold').click(function () {
        wy.bold();
    });
    $('#italic').click(function () {
        wy.italic();
    });
    $('#underline').click(function () {
        wy.underline();
    });
    $('#strikethrough').click(function () {
        wy.strikethrough();
    });
    $('#foreColor').click(function () {
        wy.foreColor(random.color());
    });
    $('#backColor').click(function () {
        wy.backColor(random.color());
    });
    $('#fontName').click(function () {
        wy.fontName('monospace');
    });
    $('#fontSize').click(function () {
        wy.fontSize(random.number(1, 7));
    });
    $('#subscript').click(function () {
        wy.subscript();
    });
    $('#superscript').click(function () {
        wy.superscript();
    });
    $('#justifyLeft').click(function () {
        wy.justifyLeft();
    });
    $('#justifyCenter').click(function () {
        wy.justifyCenter();
    });
    $('#justifyRight').click(function () {
        wy.justifyRight();
    });
    $('#justifyFull').click(function () {
        wy.justifyFull();
    });
    $('#format').click(function () {
        wy.format();
    });
    $('#removeFormat').click(function () {
        wy.removeFormat();
    });
    $('#indent').click(function () {
        wy.indent();
    });
    $('#outdent').click(function () {
        wy.outdent();
    });
    $('#createLink').click(function () {
        wy.createLink(location.href);
    });
    $('#unlink').click(function () {
        wy.unlink();
    });
    $('#insertImage').click(function () {
        wy.insertImage('http://dummyimage.com/600x400');
    });
    $('#insertHTML').click(function () {
        wy.insertHTML('<h1>HTML</h1>');
    });
    $('#insertOrderedList').click(function () {
        wy.insertOrderedList();
    });
    $('#insertUnorderedList').click(function () {
        wy.insertUnorderedList();
    });
});