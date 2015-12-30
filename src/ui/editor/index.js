/**
 * rich editor
 * @author ydr.me
 * @create 2015-12-24 11:45
 */


define(function (require, exports, module) {
    /**
     * @module ui/editor
     * @requires ui/
     * @requires ui/wysiwyg/
     * @requires ui/tooltip/
     * @requires utils/dato
     * @requires utils/class
     * @requires core/dom/modification
     * @requires core/event/base
     * @requires libs/template
     */

    'use strict';

    var $ = window.jQuery;
    var ui = require('../index.js');
    var Wysiwyg = require('../wysiwyg/index.js');
    var Tooltip = require('../tooltip/index.js');
    var dato = require('../../utils/dato.js');
    var klass = require('../../utils/class.js');
    var modification = require('../../core/dom/modification.js');
    var event = require('../../core/event/base.js');
    var Template = require('../../libs/Template.js');
    var template = require('./template.html', 'html');
    var tpl = new Template(template);
    var style = require('./style.css', 'css');
    var icons = require('./icons.png', 'image');

    var namespace = 'donkey-ui-editor';
    var donkeyIndex = 0;
    var defaultButtons = {
        bold: {
            text: '加粗',
            command: 'bold'
        },
        italic: {
            text: '斜体',
            command: 'italic'
        },
        underline: {
            text: '下划线',
            command: 'underline'
        },
        forecolor: {
            text: '字体颜色',
            command: 'color',
            type: 1
        },
        backcolor: {
            text: '背景颜色',
            command: 'color',
            type: 2
        },
        heading: {
            text: '标题',
            command: 'heading'
        },
        justifyleft: {
            text: '左对齐',
            command: 'justifyLeft'
        },
        justifycenter: {
            text: '居中对齐',
            command: 'justifyCenter'
        },
        justifyright: {
            text: '右对齐',
            command: 'justifyRight'
        },
        justifyfull: {
            text: '两端对齐',
            command: 'justifyFull'
        },
        orderlist: {
            text: '有序列表',
            command: 'insertOrderedList'
        },
        unorderlist: {
            text: '无序列表',
            command: 'insertUnorderedList'
        },
        link: {
            text: '添加链接',
            command: 'link'
        },
        unlink: {
            text: '取消链接',
            command: 'unlink'
        },
        line: {
            text: '分割线',
            command: 'line'
        },
        image: {
            text: '图片',
            command: 'image'
        },
        undo: {
            text: '撤销',
            command: 'undo'
        },
        redo: {
            text: '重做',
            command: 'redo'
        },
        '|': {}
    };
    var actions = {};
    var defaults = {
        style: {
            width: 'auto',
            height: 500
        },
        buttons: [
            'bold', 'italic', 'underline', '|',
            'forecolor', 'backcolor', 'heading', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyboth', '|',
            'orderlist', 'unorderlist', '|',
            'link', 'unlink', '|',
            'line', 'image'
        ],
        placeholder: '输入，从这里开始',
        addClass: '',
        whiteList: [
            'p', 'div', 'hr', 'ul', 'ol', 'li', 'pre',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'img', 'span', 'a', 'i', 'em', 's', 'b', 'br', 'small', 'strong', 'code',
            'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td'
        ]
    };
    var Editor = ui.create({
        constructor: function ($textarea, options) {
            var the = this;

            the._$textarea = $($textarea);
            the._index = donkeyIndex++;
            the._options = dato.extend({}, defaults, options);
            the._commands = {};
            the._initData();
            the._initNode();
            the._initEvent();
        },


        _initData: function () {
            var the = this;
            var options = the._options;

            the._whiteMap = {};
            dato.each(options.whiteList, function (index, tagName) {
                the._whiteMap[tagName] = 1;
            });
        },


        /**
         * 初始化节点
         * @private
         */
        _initNode: function () {
            var the = this;
            var options = the._options;
            var eflag = modification.create('#comment', namespace + '-' + the._index);
            var buttons = [];

            dato.each(options.buttons, function (index, button) {
                var item = defaultButtons[button];
                if (item) {
                    item.name = button;
                    buttons.push(item);
                }
            });

            var html = tpl.render({
                index: the._index,
                buttons: buttons
            });

            the._buttons = buttons;
            modification.insert(eflag, the._$textarea[0], 'afterend');
            the._$editor = $(html).insertAfter(the._$textarea).addClass(options.addClass);
            $('.' + namespace + '-icon', the._$editor).each(function (index, ele) {
                var buttonIndex = $(ele).data('index');
                var btn = buttons[buttonIndex];

                if (btn) {
                    btn.ele = ele;
                }
            });
            var nodes = $('.j-flag', the._$editor);
            var content = the._$textarea.val();
            the._$textarea.hide();
            the._$header = $(nodes[0]);
            the._$content = $(nodes[1]);
            the._$footer = $(nodes[2]);
            the._placeholder = false;

            if (!content && options.placeholder) {
                content = options.placeholder;
                the._placeholder = true;
            }

            the._$content.css(options.style).html(content);
            the._wysiwyg = new Wysiwyg(the._$content[0]);
            the._tooltip = new Tooltip({
                selector: '.' + namespace + '-icon',
                timeout: 100,
                style: {
                    maxWidth: 'none',
                    minWidth: 'none',
                    textAlign: 'center'
                }
            });
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;

            event.on(the._$header[0], 'mousedown', '.' + namespace + '-icon', function (eve) {
                the._wysiwyg.saveSelection();
            });
            event.on(the._$header[0], 'click', '.' + namespace + '-icon', function (eve) {
                var command = $(this).data('command');
                var type = $(this).data('type') || '';

                if (!command) {
                    return;
                }

                var action = command + type;
                if (action && actions[command]) {
                    the._commands[action] = the._commands[action] || new actions[command](the, {
                            type: type
                        });

                    // open popup
                    if (the._commands[action].open) {
                        the._commands[action].open(this);
                    }
                    // direct execute
                    else if (the._commands[action].exec) {
                        the._commands[action].exec();
                    }
                } else if (command && the._wysiwyg[command]) {
                    the._wysiwyg[command]();
                }

                eve.preventDefault();
            });

            // 选中图片
            event.on(the._$content[0], 'click', 'img', function (eve) {
                the._wysiwyg.select(this);
            });

            the._wysiwyg.on('selectionChange contentChange', function () {
                if (the._placeholder) {
                    the._placeholder = false;
                    the._wysiwyg.setHTML('');
                }

                dato.each(the._buttons, function (index, btn) {
                    var command = btn.command;
                    var isState = the._wysiwyg.isState(command);
                    var className = namespace + '-icon-active';

                    if (isState) {
                        $(btn.ele).addClass(className);
                    } else {
                        $(btn.ele).removeClass(className);
                    }
                });
            });
        },


        /**
         * 清理 HTML
         * @private
         */
        _clean: function () {
            var the = this;

            var $nodes = $('*', the._$content);

            dato.each($nodes, function (index, node) {
                var tagName = node.tagName.toLowerCase();
                var isWhite = the._whiteMap[tagName];

                if (!isWhite) {
                    modification.remove(node);
                }
            }, true);
        },


        /**
         * 获取 HTML 内容
         * @returns {string}
         */
        getHTML: function () {
            var the = this;

            the._clean();

            return the._wysiwyg.getHTML();
        },


        /**
         * 获取 Text
         * @returns {string}
         */
        getText: function () {
            var the = this;

            the._clean();

            return the._wysiwyg.getText();
        }
    });


    /**
     * 注册编辑器命令
     * @param command
     * @param commander
     */
    Editor.action = function (command, commander) {
        actions[command] = commander;
    };

    // import actions
    Editor.action('color', require('./_actions/color/index.js'));
    Editor.action('heading', require('./_actions/heading/index.js'));
    Editor.action('link', require('./_actions/link/index.js'));
    Editor.action('line', require('./_actions/line/index.js'));
    Editor.action('image', require('./_actions/image/index.js'));

    // style
    style += '.' + namespace + '-icon::after{background-image:url(' + icons + ')}';
    ui.importStyle(style);

    // exports
    Editor.defaults = defaults;
    klass.transfer(Wysiwyg, Editor, '_wysiwyg');
    module.exports = Editor;
});