/**
 * 编辑器对话框
 * @author ydr.me
 * @create 2015-12-29 18:19
 */


define(function (require, exports, module) {
    'use strict';

    var ui = require('../index.js');
    var Dialog = require('../dialog/index.js');
    var klass = require('../../utils/class.js');
    var style = require('./dialog.css', 'css');

    ui.importStyle(style);
    module.exports = klass.extend(Dialog).create(function () {
        this._$window.addClass('alien-ui-editor_dialog');
    });
});