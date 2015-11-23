/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-23 12:03
 */


define(function (require, exports, module) {
    /**
     * @module parent/alert
     */

    'use strict';

    var Msg = require('../ui/msg/index.js');
    var dato = require('../utils/dato.js');
    var typeis = require('../utils/typeis.js');
    var modification = require('../core/dom/modification.js');
    var style= require('./alert.css', 'css');

    var defaults = {
        addClass: 'donkey-widgets-alert',
        buttons: [{
            text: '好',
            addClass: ''
        }]
    };
    module.exports = function (content) {
        var options = {};

        if (typeis(content) === 'string') {
            options.content = content;
        } else {
            options = content;
        }

        return new Msg(dato.extend({}, defaults, options));
    };
    modification.importStyle(style);
});