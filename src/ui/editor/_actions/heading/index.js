/**
 * 标题选择器
 * @author ydr.me
 * @create 2015-12-28 17:36
 */


define(function (require, exports, module) {
    'use strict';

    var Card = require('../../_card.js');
    var ui = require('../../../index.js');
    var klass = require('../../../../utils/class.js');
    var dato = require('../../../../utils/dato.js');
    var number = require('../../../../utils/number.js');
    var event = require('../../../../core/event/base.js');
    var modification = require('../../../../core/dom/modification.js');
    var Template = require('../../../../libs/template.js');
    var template = require('./template.html', 'html');
    var style = require('./style.css', 'css');
    var tpl = new Template(template);
    var rangy = require('../../../../3rd/rangy/core.js');

    var namespace = 'alien-ui-editor_action-heading';
    var defaults = {
        headings: [
            '段落',
            '一级标题',
            '二级标题',
            '三级标题',
            '四级标题',
            '五级标题',
            '六级标题'
        ],
        style: {
            width: 'auto'
        }
    };

    var Color = ui.create({
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

            the._card = new Card({
                style: options.style,
                template: tpl.render(options)
            });
        },


        _initEvent: function () {
            var the = this;

            event.on(the._card.getNode(), 'click', '.' + namespace + '-item', function () {
                the.editor.restoreSelection();
                var index = $(this).data('index');
                var blockEle = the.editor.getClosestBlock();
                index = number.parseInt(index);

                if (blockEle) {
                    var sel = rangy.getSelection();
                    var rng = rangy.createRange();
                    // 缓存下这些变量，因为 replace 之后 selection 会变化
                    var anchorNode = sel.anchorNode;
                    var anchorOffset = sel.anchorOffset;
                    var focusNode = sel.focusNode;
                    var focusOffset = sel.focusOffset;

                    modification.replace(blockEle, index ? 'h' + index : 'p');
                    rng.setStart(anchorNode, anchorOffset);
                    rng.setEnd(focusNode, focusOffset);
                    sel.setSingleRange(rng);
                }

                the._card.close();
            });
        }
    });

    ui.importStyle(style);
    klass.transfer(Card, Color, '_card');
    Color.defaults = defaults;
    module.exports = Color;
});