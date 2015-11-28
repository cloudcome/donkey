/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-23 14:21
 */


define(function (require, exports, module) {
    /**
     * @module parent/confirm
     */

    'use strict';

    var Msg = require('../ui/msg/index.js');
    var dato = require('../utils/dato.js');
    var typeis = require('../utils/typeis.js');
    var modification = require('../core/dom/modification.js');
    var style = require('./confirm.css', 'css');

    var namespace = 'donkey-widgets-confirm';
    var defaults = {
        addClass: namespace,
        buttons: [{
            text: '确定',
            addClass: namespace + '-sure'
        }, {
            text: '取消',
            addClass: namespace + '-cancel'
        }],
        sureIndex: 0,
        title: '确认操作'
    };
    module.exports = function (content) {
        var options = {};

        if (typeis(content) === 'string') {
            options.content = content;
        } else if (content && content.message) {
            options.content = content.message;
        } else {
            options = content;
        }

        return new Msg(options = dato.extend({}, defaults, options)).on('close', function (index) {
            this.emit(options.sureIndex === index ? 'sure' : 'cancel');
        });
    };
    modification.importStyle(style);
});