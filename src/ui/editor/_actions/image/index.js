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
    var defaults = {
        width: 500,
        title: '图片',
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

            the._dialog = new Dialog({
                width: options.width,
                title: options.title,
                template: tpl.render({
                    id: donkeyIndex++
                }),
                buttons: options.buttons
            });
            var nodes = $('.j-flag', the._dialog.getNode());
            the._eTab = nodes[0];
            //the._eTitle = nodes[1];
            //the._eTarget = nodes[2];
            //the._eSure = nodes[3];
            //the._eCancel = nodes[4];
            the._tab = new Tab(the._eTab);
        },


        _initEvent: function () {
            var the = this;

            the._tab.on('change', function (index) {

            });
        },


        /**
         * 重置
         * @returns {Image}
         */
        reset: function () {
            var the = this;

            //the._eUrl.value = '';
            //the._eTitle.value = '';
            //the._eTarget.checked = false;

            return the;
        }
    });

    ui.importStyle(style);
    klass.transfer(Dialog, Image, '_dialog');
    klass.transfer(Dialog.super_, Image, '_dialog');
    Image.defaults = defaults;
    module.exports = Image;
});