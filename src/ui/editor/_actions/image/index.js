/**
 * 图片选择器
 * @author ydr.me
 * @create 2015-12-28 17:36
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;
    var Dialog = require('../../_dialog.js');
    var ui = require('../../../index.js');
    var Tab = require('../../../tab/index.js');
    var klass = require('../../../../utils/class.js');
    var dato = require('../../../../utils/dato.js');
    var event = require('../../../../core/event/base.js');
    var modification = require('../../../../core/dom/modification.js');
    var Template = require('../../../../libs/template.js');
    var template = require('./template.html', 'html');
    var style = require('./style.css', 'css');
    var tpl = new Template(template);

    var donkeyIndex = 0;
    var namespace = 'donkey-ui-editor_action-image';
    var defaults = {
        width: 500,
        title: '图片',
        fileName: 'file',
        buttons: [{
            text: '确定'
        }, {
            text: '取消'
        }]
    };

    var Image = ui.create({
        constructor: function (editor, options) {
            var the = this;

            the._options = dato.extend({}, defaults, options);
            the.editor = editor;
            the._initNode();
            the._initEvent();
        },


        _initNode: function () {
            var the = this;
            var options = the._options;

            the._id = donkeyIndex++;
            the._dialog = new Dialog({
                width: options.width,
                title: options.title,
                template: tpl.render({
                    id: the._id,
                    fileName: options.fileName
                }),
                buttons: options.buttons
            });
            the._eDialog = the._dialog.getNode();
            var nodes = $('.j-flag', the._eDialog);
            the._eTab = nodes[0];
            the._eFile = nodes[1];
            the._eUrl = nodes[2];
            the._eTitle = nodes[3];
            the._tab = new Tab(the._eTab);
            $(the._eFile).addClass(the._fileClass = namespace + '-file-' + the._id);
        },


        _initEvent: function () {
            var the = this;

            event.on(the._eDialog, 'change', '.' + the._fileClass, function (eve) {
                var val = this.value;

                if (!val) {
                    return;
                }

                the.editor.emit('upload', eve, this, function (url) {
                    if (url) {
                        the.editor.insert('image', {
                            src: url
                        });
                        the.reset();
                    }

                    the._dialog.close();
                });
            });

            the._dialog.on('action', function (index) {
                switch (index) {
                    case 0:
                        var url = the._eUrl.value;

                        if (url) {
                            the.editor.insert('image', {
                                src: url
                            });
                            the.reset();
                        }
                        break;
                }

                the._dialog.close();

            });
        },


        /**
         * 重置
         * @returns {Image}
         */
        reset: function () {
            var the = this;

            the._eUrl.value = '';
            the._eTitle.value = '';
            the._eFile = modification.replace(the._eFile, 'input', {
                type: 'file',
                name: the._options.fileName,
                'class': the._fileClass
            });

            return the;
        }
    });

    ui.importStyle(style);
    klass.transfer(Dialog, Image, '_dialog');
    klass.transfer(Dialog.super_, Image, '_dialog');
    Image.defaults = defaults;
    module.exports = Image;
});