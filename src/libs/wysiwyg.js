/**
 * 可写内容区域的操作
 * @link https://github.com/wysiwygjs/wysiwyg.js/blob/master/src/wysiwyg.js
 * @author ydr.me
 * @create 2015-12-24 16:32
 */


define(function (require, exports, module) {
    /**
     * @module utils/contenteditable
     */

    'use strict';

    var Emitter = require('./emitter.js');
    var klass = require('../utils/class.js');

    var Wysiwyg = klass.create({

    });

    /**
     * 执行命令
     * @link https://developer.mozilla.org/en-US/docs/Web/API/document.execCommand
     * @link http://www.quirksmode.org/dom/execCommand.html
     * @param node_wysiwyg
     * @param command
     * @param param
     * @param force_selection
     * @returns {boolean}
     */
    var execute = function (node_wysiwyg, command, param, force_selection) {
// give selection to contenteditable element
        restoreSelection(node_wysiwyg, popup_saved_selection);
        // tried to avoid forcing focus(), but ... - https://github.com/wysiwygjs/wysiwyg.js/issues/51
        node_wysiwyg.focus();
        if (!selectionInside(node_wysiwyg, force_selection)) // returns 'selection inside editor'
            return false;

        // for webkit, mozilla, opera
        if (window.getSelection) {
            // Buggy, call within 'try/catch'
            try {
                if (document.queryCommandSupported && !document.queryCommandSupported(command))
                    return false;
                return document.execCommand(command, false, param);
            }
            catch (e) {
            }
        }
        // for IE
        else if (document.selection) {
            var sel = document.selection;
            if (sel.type != 'None') {
                var range = sel.createRange();
                // Buggy, call within 'try/catch'
                try {
                    if (!range.queryCommandEnabled(command))
                        return false;
                    return range.execCommand(command, false, param);
                }
                catch (e) {
                }
            }
        }
        return false;
    };


    /**
     * 加粗
     */
    exports.bold = function () {
        execute('bold');
    };


});