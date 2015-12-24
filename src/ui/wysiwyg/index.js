/**
 * 可写内容区域的操作
 * @link https://github.com/wysiwygjs/wysiwyg.js/blob/master/src/wysiwyg.js
 * @author ydr.me
 * @create 2015-12-24 16:32
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;
    var ui = require('../index.js');
    var dato = require('../../utils/dato.js');

    var defaults = {};
    var Wysiwyg = ui.create({
        constructor: function ($wysiwyg, options) {
            var the = this;

            the._$wysiwyg = $($wysiwyg);
            the._eWysiwyg = the._$wysiwyg[0];
            the._options = dato.extend({}, defaults, options);
            the._popup_saved_selection = null;
            the._trailingDiv = null;
        },

        IEtrailingDIV: function () {
            var the = this;
            var node_wysiwyg = the._eWysiwyg;

            // Detect IE - http://stackoverflow.com/questions/17907445/how-to-detect-ie11
            if (document.all || !!window.MSInputMethodContext) {
                var trailingDiv = the._trailingDiv = document.createElement('DIV');
                node_wysiwyg.appendChild(trailingDiv);
            }
        },


        restoreSelection: function (containerNode, savedSel) {
            if (!savedSel) {
                return;
            }

            if (window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(savedSel);
            } else if (document.selection) {
                savedSel.select();
            }
        },


        /**
         * @link http://stackoverflow.com/questions/2234979/how-to-check-in-javascript-if-one-element-is-a-child-of-another
         * @param ancestor
         * @param descendant
         * @returns {boolean}
         */
        isOrContainsNode: function (ancestor, descendant) {
            var node = descendant;
            while (node) {
                if (node === ancestor) {
                    return true;
                }

                node = node.parentNode;
            }
            return false;
        },


        selectionInside: function (containerNode, force) {
            var the = this;
            var sel;
            var range;
            // selection inside editor?
            if (window.getSelection) {
                sel = window.getSelection();
                if (the.isOrContainsNode(containerNode, sel.anchorNode) &&
                    the.isOrContainsNode(containerNode, sel.focusNode)) {
                    return true;
                }
                // selection at least partly outside editor
                if (!force) {
                    return false;
                }
                // force selection to editor
                range = document.createRange();
                range.selectNodeContents(containerNode);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.selection) {
                sel = document.selection;

                // e.g. an image selected
                if (sel.type === 'Control') {
                    // http://msdn.microsoft.com/en-us/library/ie/hh826021%28v=vs.85%29.aspx
                    range = sel.createRange();
                    // test only the first element
                    if (range.length !== 0 && the.isOrContainsNode(containerNode, range(0))) {
                        return true;
                    }
                } else {
                    // Range of container
                    // http://stackoverflow.com/questions/12243898/how-to-select-all-text-in-contenteditable-div
                    var rangeContainer = document.body.createTextRange();
                    rangeContainer.moveToElementText(containerNode);
                    // Compare with selection range
                    range = sel.createRange();
                    if (rangeContainer.inRange(range)) {
                        return true;
                    }
                }

                // selection at least partly outside editor
                if (!force) {
                    return false;
                }
                // force selection to editor
                // http://stackoverflow.com/questions/12243898/how-to-select-all-text-in-contenteditable-div
                range = document.body.createTextRange();
                range.moveToElementText(containerNode);
                range.setEndPoint('StartToEnd', range); // collapse
                range.select();
            }
            return true;
        },


        /**
         * @link http://stackoverflow.com/questions/8513368/collapse-selection-to-start-of-selection-not-div
         */
        collapseSelectionEnd: function () {
            var sel;
            if (window.getSelection) {
                sel = window.getSelection();
                if (!sel.isCollapsed) {
                    // Form-submits via Enter throw 'NS_ERROR_FAILURE' on Firefox 34
                    try {
                        sel.collapseToEnd();
                    } catch (e) {
                        // ignore
                    }
                }
            }
            else if (document.selection) {
                sel = document.selection;

                if (sel.type !== 'Control') {
                    var range = sel.createRange();
                    range.collapse(false);
                    range.select();
                }
            }
        },


        /**
         * save/restore selection
         * @link http://stackoverflow.com/questions/13949059/persisting-the-changes-of-range-objects-after-selection-in-html/13950376#13950376
         * @returns {*}
         */
        saveSelection: function () {
            var sel;
            if (window.getSelection) {
                sel = window.getSelection();

                if (sel.rangeCount > 0) {
                    return sel.getRangeAt(0);
                }
            }
            else if (document.selection) {
                sel = document.selection;
                return sel.createRange();
            }

            return null;
        },


        // Command structure
        callUpdates: function (selection_destroyed) {
            var the = this;
            var node_wysiwyg = the._eWysiwyg;
            // Remove IE11 workaround
            if (the._trailingDiv) {
                node_wysiwyg.removeChild(the._trailingDiv);
                the._trailingDiv = null;
            }
            // handle saved selection
            if (selection_destroyed) {
                the.collapseSelectionEnd();
                the._popup_saved_selection = null; // selection destroyed
            }
            else if (the._popup_saved_selection) {
                the._popup_saved_selection = the.saveSelection(node_wysiwyg);
            }
        },


        /**
         * @link https://developer.mozilla.org/en-US/docs/Web/API/document.execCommand
         * @link http://www.quirksmode.org/dom/execCommand.html
         * @param command
         * @param param
         * @param force_selection
         * @private
         */
        execCommand: function (command, param, force_selection) {
            var the = this;
            var node_wysiwyg = the._eWysiwyg;
            // give selection to contenteditable element
            the.restoreSelection(node_wysiwyg, the._popup_saved_selection);
            // tried to avoid forcing focus(), but ... - https://github.com/wysiwygjs/wysiwyg.js/issues/51
            node_wysiwyg.focus();

            // returns 'selection inside editor'
            if (!the.selectionInside(node_wysiwyg, force_selection)) {
                return false;
            }

            // for webkit, mozilla, opera
            if (window.getSelection) {
                // Buggy, call within 'try/catch'
                try {
                    if (document.queryCommandSupported && !document.queryCommandSupported(command)) {
                        return false;
                    }

                    return document.execCommand(command, false, param);
                } catch (e) {
                    // ignore
                }
            }
            // for IE
            else if (document.selection) {
                var sel = document.selection;
                if (sel.type !== 'None') {
                    var range = sel.createRange();
                    // Buggy, call within 'try/catch'
                    try {
                        if (!range.queryCommandEnabled(command)) {
                            return false;
                        }

                        return range.execCommand(command, false, param);
                    } catch (e) {
                        // ignore
                    }
                }
            }
            return false;
        },


        /**
         * 当前位置粘贴 html
         * @link http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div/6691294#6691294
         * @link http://stackoverflow.com/questions/4823691/insert-an-html-element-in-a-contenteditable-element
         * @link http://stackoverflow.com/questions/6139107/programatically-select-text-in-a-contenteditable-html-element
         * @param containerNode
         * @param html
         */
        pasteHtmlAtCaret: function (containerNode, html) {
            var the = this;
            var sel;
            var range;

            if (window.getSelection) {
                // IE9 and non-IE
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    // Range.createContextualFragment() would be useful here but is
                    // only relatively recently standardized and is not supported in
                    // some browsers (IE9, for one)
                    var el = document.createElement('div');
                    el.innerHTML = html;
                    var frag = document.createDocumentFragment(), node, lastNode;
                    while ((node = el.firstChild)) {
                        lastNode = frag.appendChild(node);
                    }
                    if (the.isOrContainsNode(containerNode, range.commonAncestorContainer)) {
                        range.deleteContents();
                        range.insertNode(frag);
                    }
                    else {
                        containerNode.appendChild(frag);
                    }
                    // Preserve the selection
                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            }
            else if (document.selection) {
                // IE <= 8
                sel = document.selection;
                if (sel.type !== 'Control') {
                    var originalRange = sel.createRange();
                    originalRange.collapse(true);
                    range = sel.createRange();
                    if (the.isOrContainsNode(containerNode, range.parentElement())) {
                        range.pasteHTML(html);
                    }
                    // simply append to Editor
                    else {
                        var textRange = document.body.createTextRange();
                        textRange.moveToElementText(containerNode);
                        textRange.collapse(false);
                        textRange.select();
                        textRange.pasteHTML(html);
                    }

                    // Preserve the selection
                    range = sel.createRange();
                    range.setEndPoint('StartToEnd', originalRange);
                    range.select();
                }
            }
        },


        /**
         * 加粗
         * @returns {Wysiwyg}
         */
        bold: function () {
            var the = this;
            the.execCommand('bold');
            the.callUpdates();
            return the;
        },


        /**
         * 斜体
         * @returns {Wysiwyg}
         */
        italic: function () {
            var the = this;
            the.execCommand('italic');
            the.callUpdates();
            return the;
        },


        /**
         * 下划线
         * @returns {Wysiwyg}
         */
        underline: function () {
            var the = this;
            the.execCommand('underline');
            the.callUpdates();
            return the;
        },


        /**
         * 删除线
         * @returns {Wysiwyg}
         */
        strikethrough: function () {
            var the = this;
            the.execCommand('strikethrough');
            the.callUpdates();
            return the;
        },


        /**
         * 前景色
         * @param color
         * @returns {Wysiwyg}
         */
        foreColor: function (color) {
            var the = this;
            the.execCommand('foreColor', color);
            the.callUpdates();
            return the;
        },


        /**
         * 背景色
         * @param color
         * @returns {Wysiwyg}
         */
        backColor: function (color) {
            var the = this;
            // @link http://stackoverflow.com/questions/2756931/highlight-the-text-of-the-dom-range-element
            if (!the.execCommand('hiliteColor', color)) {
                // some browsers apply 'backColor' to the whole block
                the.execCommand('backColor', color);
            }
            the.callUpdates();
            return the;
        },


        /**
         * 字体名称
         * @param fontName
         * @returns {Wysiwyg}
         */
        fontName: function (fontName) {
            var the = this;
            the.execCommand('fontName', fontName);
            the.callUpdates();
            return the;
        },


        /**
         * 字体大小
         * @param fontSize
         * @returns {Wysiwyg}
         */
        fontSize: function (fontSize) {
            var the = this;
            the.execCommand('fontSize', fontSize);
            the.callUpdates();
            return the;
        },


        /**
         * 上标
         * @returns {Wysiwyg}
         */
        subscript: function () {
            var the = this;
            the.execCommand('subscript');
            the.callUpdates();
            return the;
        },


        /**
         * 下标
         * @returns {Wysiwyg}
         */
        superscript: function () {
            var the = this;
            the.execCommand('superscript');
            the.callUpdates();
            return the;
        },


        /**
         * 左对齐
         * @returns {Wysiwyg}
         */
        justifyLeft: function () {
            var the = this;
            the.IEtrailingDIV();
            the.execCommand('justifyLeft');
            the.callUpdates();
            return the;
        },


        /**
         * 居中
         * @returns {Wysiwyg}
         */
        justifyCenter: function () {
            var the = this;
            the.IEtrailingDIV();
            the.execCommand('justifyCenter');
            the.callUpdates();
            return the;
        },


        /**
         * 右对齐
         * @returns {Wysiwyg}
         */
        justifyRight: function () {
            var the = this;
            the.IEtrailingDIV();
            the.execCommand('justifyRight');
            the.callUpdates();
            return the;
        },


        /**
         * 两边对齐
         * @returns {Wysiwyg}
         */
        justifyFull: function () {
            var the = this;
            the.IEtrailingDIV();
            the.execCommand('justifyFull');
            the.callUpdates();
            return the;
        },


        /**
         * 格式化
         * @param tagname
         * @returns {*}
         */
        format: function (tagname) {
            var the = this;
            the.IEtrailingDIV();
            the.execCommand('formatBlock', tagname);
            the.callUpdates();
            return the;
        },


        /**
         * 增加缩进
         * @returns {Wysiwyg}
         */
        indent: function () {
            var the = this;
            the.IEtrailingDIV();
            the.execCommand('indent');
            the.callUpdates();
            return the;
        },


        /**
         * 减少缩进
         * @returns {Wysiwyg}
         */
        outdent: function () {
            var the = this;
            the.IEtrailingDIV();
            the.execCommand('outdent');
            the.callUpdates();
            return the;
        },


        /**
         * 插入链接
         * @param url
         * @returns {Wysiwyg}
         */
        insertLink: function (url) {
            var the = this;
            the.execCommand('createLink', url);
            the.callUpdates(true); // selection destroyed
            return the;
        },


        /**
         * 插入图片
         * @param url
         * @returns {Wysiwyg}
         */
        insertImage: function (url) {
            var the = this;
            the.execCommand('insertImage', url, true);
            the.callUpdates(true); // selection destroyed
            return the;
        },


        /**
         * 插入 html
         * @param html
         * @returns {Wysiwyg}
         */
        insertHTML: function (html) {
            var the = this;
            var node_wysiwyg = the._eWysiwyg;
            if (!the.execCommand('insertHTML', html, true)) {
                // IE 11 still does not support 'insertHTML'
                the.restoreSelection(node_wysiwyg, the._popup_saved_selection);
                the.selectionInside(node_wysiwyg, true);
                the.pasteHtmlAtCaret(node_wysiwyg, html);
            }
            the.callUpdates(true); // selection destroyed
            return this;
        },


        /**
         * 插入有序列表
         * @returns {Wysiwyg}
         */
        insertOrderedList: function () {
            var the = this;
            the.IEtrailingDIV();
            the.execCommand('insertOrderedList');
            the.callUpdates();
            return the;
        },


        /**
         * 插入无须列表
         * @returns {Wysiwyg}
         */
        insertUnorderedList: function () {
            var the = this;
            the.IEtrailingDIV();
            the.execCommand('insertUnorderedList');
            the.callUpdates();
            return the;
        }
    });

    Wysiwyg.defaults = defaults;
    module.exports = Wysiwyg;
});