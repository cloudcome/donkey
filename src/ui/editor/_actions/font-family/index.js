/**
 * 字体选择器
 * @author ydr.me
 * @create 2015-12-28 17:36
 */


define(function (require, exports, module) {
    'use strict';

    var Card = require('../../_card.js');
    var ui = require('../../../index.js');
    var klass = require('../../../../utils/class.js');
    var dato = require('../../../../utils/dato.js');
    var event = require('../../../../core/event/base.js');
    var Template = require('../../../../libs/template.js');
    var template = require('./template.html', 'html');
    var style = require('./style.css', 'css');
    var tpl = new Template(template);

    var namespace = 'alien-ui-editor_action-backcolor';
    var defaults = {
        fontFamilies: [{
            name: 'SimSun',
            text: '宋体'
        }, {
            name: 'Microsoft YaHei',
            text: '微软雅黑'
        }, {
            name: 'arial, helvetica,sans-serif',
            text: 'Arial'
        }],
        style: {
            width: 122
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

            event.on(the._card.getNode(), 'click', '.' + namespace + '-color', function () {
                var font = $(this).data('font');

                the.editor.wysiwyg.fontName(font);
                the._card.close();
            });
        }
    });

    ui.importStyle(style);
    klass.transfer(Card, Color, '_card');
    Color.defaults = defaults;
    module.exports = Color;
});