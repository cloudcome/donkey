/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-24 11:45
 */


define(function (require, exports, module) {
    /**
     * @module parent/index
     */

    'use strict';

    var ui = require('../index.js');
    var dato = require('../../utils/dato.js');
    var CodeMirror = require('../../3rd/codemirror/lib/codemirror.js');

    require('../../3rd/codemirror/mode/xml/xml.js')(CodeMirror);

    var $ = window.jQuery;
    var defaults = {};
    var Editor = ui.create({
        constructor: function ($textarea, options) {
            var the = this;

            the._$textarea = $($textarea);
            the._options = dato.extend({}, defaults, options);
            the._initNode();
        },

        _initNode: function () {
            var the = this;

            CodeMirror.fromTextArea(the._$textarea[0]);
        }
    });

    Editor.defaults = defaults;
    module.exports = Editor;
});