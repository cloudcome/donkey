/**
 * 编辑器对话框
 * @author ydr.me
 * @create 2015-12-29 18:19
 */


define(function (require, exports, module) {
    'use strict';

    var ui = require('../index.js');
    var Dialog = require('../dialog/index.js');
    var klass = require('../../utils/class.js');
    var dato = require('../../utils/dato.js');
    var event = require('../../core/event/base.js');
    var modification = require('../../core/dom/modification.js');
    var style = require('./dialog.css', 'css');

    var namespace = 'alien-ui-editor_dialog';
    ui.importStyle(style);
    module.exports = klass.extend(Dialog, {
        'static': true,
        prototype: true
    }).create(function () {
        var the = this;
        var eContainer = the.getNode();

        if (the._options.buttons.length) {
            var eDiv = modification.create('div', {
                'class': namespace + '-action'
            });

            eContainer.appendChild(eDiv);
            eContainer = eDiv;
        }

        dato.each(the._options.buttons, function (index, button) {
            button['class'] = button['class'] || '';
            button['class'] += ' ' + namespace + '-btn';
            var eBtn = modification.create('button', button);

            eBtn.innerHTML = button.text;
            eContainer.appendChild(eBtn);
        });
        the._$window.addClass(namespace);
    });
});