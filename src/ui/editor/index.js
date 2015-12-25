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

    var $ = window.jQuery;
    var ui = require('../index.js');
    var Wysiwyg = require('../wysiwyg/index.js');
    var dato = require('../../utils/dato.js');
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
            command: ''
        },
        backcolor: {
            text: '背景颜色',
            command: 'backcolor2'
        },
        heading: {
            text: '标题',
            command: ''
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
            command: 'insertOrderList'
        },
        unorderlist: {
            text: '无序列表',
            command: 'insertUnorderList'
        },
        link: {
            text: '添加链接',
            command: ''
        },
        unlink: {
            text: '取消链接',
            command: 'unlink'
        },
        line: {
            text: '分割线',
            command: ''
        },
        image: {
            text: '图片',
            command: ''
        },
        undo: {
            text: '撤销',
            command: ''
        },
        redo: {
            text: '重做',
            command: ''
        },
        '|': {
            text: '',
            command: ''
        }
    };
    var customCommands = {};
    var defaults = {
        style: {
            width: 'auto',
            height: 500
        },
        buttons: [
            'bold', 'italic', 'underline', 'forecolor', 'backcolor', 'heading', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyboth', '|',
            'orderlist', 'unorderlist', '|',
            'link', 'unlink', '|',
            'line', 'image', '|',
            'undo', 'redo'
        ],
        placeholder: '输入，从这里开始'
    };
    var Editor = ui.create({
        constructor: function ($textarea, options) {
            var the = this;

            the._$textarea = $($textarea);
            the._index = donkeyIndex++;
            the._options = dato.extend({}, defaults, options);
            the._commands = {};
            the._initNode();
            the._initEvent();
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

            modification.insert(eflag, the._$textarea[0], 'afterend');
            the._$editor = $(html).insertAfter(the._$textarea);
            var nodes = $('.j-flag', the._$editor);
            the._$textarea.hide();
            the._$header = $(nodes[0]);
            the._$content = $(nodes[1]);
            the._$footer = $(nodes[2]);
            the._$content.css(options.style).html(the._$textarea.val());
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;

            the.wysiwyg = new Wysiwyg(the._$content[0]);
            event.on(the._$header[0], 'click', '.' + namespace + '-icon', function (eve) {
                var command = $(this).data('command');

                if (!command) {
                    return;
                }

                if (the.wysiwyg[command]) {
                    the.wysiwyg[command]();
                }else if(customCommands[command]){
                    the._commands[command] = the._commands[command] || new customCommands[command](the);
                    the._commands[command].open(this);
                }

                eve.preventDefault();
            });
        }
    });


    /**
     * 注册编辑器命令
     * @param command
     * @param commander
     */
    Editor.command = function (command, commander) {
        customCommands[command] = commander;
    };

    Editor.command('backcolor2', require('./_commands/backcolor/index.js'));

    style += '.' + namespace + '-icon::after{background-image:url(' + icons + ')}';
    ui.importStyle(style);
    Editor.defaults = defaults;
    module.exports = Editor;
});