/**
 * editor card
 * @author ydr.me
 * @create 2015-12-24 19:50
 */


define(function (require, exports, module) {
    'use strict';

    var $ = window.jQuery;
    var ui = require('../index.js');
    var dato = require('../../utils/dato.js');
    var modification = require('../../core/dom/modification.js');

    var defaults = {
        style: {
            display: 'none',
            position: 'absolute',
            width: 400,
            height: 'auto'
        },
        template: '',
        // click out
        autoClose: true
    };
    var Card = ui.create({
        constructor: function ($target, options) {
            var the = this;

            the._$target = $($target);
            the._options = dato.extend(true, {}, defaults, options);
            the._initNode();
        },

        _initNode: function () {
            var the = this;
            var options = the._options;
            var eDiv = the._eDiv = modification.create('div', {
                style: options.style
            });

            eDiv.innerHTML = options.template;
        },


        getNode: function () {
            return this._eDiv;
        },

        open: function () {
            var the = this;
            var offset = the._$target.offset();

            offset.display = 'block';
            offset.top += the._$target.height();
            offset.zIndex = ui.getZindex();
            $(the._eDiv).css(offset);
            return the;
        },

        close: function () {
            var the = this;
            the._eDiv.style.display = 'none';
            return the;
        }
    });

    Card.defaults = defaults;
    module.exports = Card;
});