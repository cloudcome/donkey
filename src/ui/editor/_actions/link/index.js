/**
 * 链接选择器
 * @author ydr.me
 * @create 2015-12-28 17:36
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;
    var Card = require('../../_card.js');
    var ui = require('../../../index.js');
    var klass = require('../../../../utils/class.js');
    var dato = require('../../../../utils/dato.js');
    var event = require('../../../../core/event/base.js');
    var modification = require('../../../../core/dom/modification.js');
    var Template = require('../../../../libs/template.js');
    var template = require('./template.html', 'html');
    var style = require('./style.css', 'css');
    var tpl = new Template(template);

    var defaults = {
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
                template: tpl.render(options),
                autoClose: -1,
                mask: true
            });
            var nodes = $('.j-flag', the._card.getNode());
            the._eUrl = nodes[0];
            the._eTitle = nodes[1];
            the._eTarget = nodes[2];
            the._eSure = nodes[3];
            the._eCancel = nodes[4];
        },


        _initEvent: function () {
            var the = this;

            the.on('open', function () {
                the._eUrl.focus();
            });

            event.on(the._eSure, 'click', function () {
                var url = the._eUrl.value;

                if (!url) {
                    the.close();
                    return;
                }

                the.editor.wrap('a', {
                    href: url,
                    target: the._eTarget.checked ? '_blank' : '_self',
                    title: the._eTitle.value
                });
                the.reset();
                the.close();
            });

            event.on(the._eCancel, 'click', function () {
                the.close();
            });
        },


        /**
         * 重置
         * @returns {Color}
         */
        reset: function () {
            var the = this;

            the._eUrl.value = '';
            the._eTitle.value = '';
            the._eTarget.checked = false;

            return the;
        }
    });

    ui.importStyle(style);
    klass.transfer(Card, Color, '_card');
    Color.defaults = defaults;
    module.exports = Color;
});