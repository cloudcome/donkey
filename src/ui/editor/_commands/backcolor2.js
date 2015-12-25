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

    var Card = require('../_card.js');
    var ui = require('../../index.js');
    var dato = require('../../../utils/dato.js');

    var defaults = {
        colors: [
            '880000', '800080', 'ff0000', 'ff00ff',
            '000080', '0000ff', '00ffff', '008080',
            '008000', '808000', '00ff00', 'ffcc00',
            '808080', 'c0c0c0', '000000', 'ffffff'
        ]
    };

    var BackColor2 = ui.create({
        constructor: function (options) {
            var the = this;

            options = dato.extend({}, defaults, options);
            the.card = new Card();
        },

        _initNode: function () {
            var the = this;

        }
    });

    module.exports = function (options) {



        return {
            open: function () {
                card.open();
            }
        };
    };
});