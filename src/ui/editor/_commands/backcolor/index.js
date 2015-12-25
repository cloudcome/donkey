/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-24 15:37
 */


define(function (require, exports, module) {
    /**
     * @module parent/bold
     */

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

    var namespace = 'alien-ui-editor--backcolor';
    var defaults = {
        colors: [
            '880000', '800080', 'ff0000', 'ff00ff',
            '000080', '0000ff', '00ffff', '008080',
            '008000', '808000', '00ff00', 'ffcc00',
            '808080', 'c0c0c0', '000000', 'ffffff'
        ]
    };

    var BackColor2 = ui.create({
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
                template: tpl.render(options)
            });
        },


        _initEvent: function () {
            var the = this;

            event.on(the._card.getNode(), 'click', '.' + namespace + '-color', function () {
                var color = $(this).data('color');
                the.editor.wysiwyg.backColor(color);
            });
        }
    });

    klass.transfer(Card, BackColor2, '_card');
    BackColor2.defaults = defaults;
    module.exports = BackColor2;
});