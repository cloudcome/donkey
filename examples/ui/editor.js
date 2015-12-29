/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-24 11:52
 */


define(function (require, exports, module) {
    /**
     * @module parent/editor
     */

    'use strict';

    var Editor = require('../../src/ui/editor/index.js');

    window.ed = new Editor('#textarea');

    //$('#italic').click(function () {
    //    ed._wysiwyg.italic();
    //});
});