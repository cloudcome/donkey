/**
 * 链接选择器
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

    var namespace = 'alien-ui-editor_action-link';
    var typeMap = {
        1: 'createLink',
        2: 'unlink'
    };
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
        },
        type: 1
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
                template: tpl.render(options),
                autoClose: false
            });
        },


        _initEvent: function () {
            var the = this;

            event.on(the._card.getNode(), 'click', '.' + namespace + '-1', function () {
                console.log('sure');
            });

            event.on(the._card.getNode(), 'click', '.' + namespace + '-2', function () {
                console.log('cancel');
            });
        }
    });

    ui.importStyle(style);
    klass.transfer(Card, Color, '_card');
    Color.defaults = defaults;
    module.exports = Color;
});