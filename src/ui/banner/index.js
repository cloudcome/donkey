/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-09-14 22:43
 */


define(function (require, exports, module) {
    /**
     * @module parent/index
     */

    'use strict';

    var $ = window.jQuery;
    var namespace = 'donkey-ui-banner';
    var donkeyId = 0;
    var ui = require('../index.js');
    var dato = require('../../utils/dato.js');
    var animation = require('../../core/dom/animation.js');
    var style = require('./style.css', 'css');
    var defaults = {
        width: 1024,
        height: 800,
        duration: 678,
        interval: 5000,
        listSelector: 'ul',
        itemSelector: 'li'
    };
    var Banner = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = $($parent);
            the._options = dato.extend({}, defaults, options);
            the._id = donkeyId++;
            the._initNode();
        },

        _initNode: function () {
            var the = this;
            var options = the._options;

            the._$parent.css({
                width: options.width,
                height: options.height
            }).addClass(namespace);
            the._$items = $(options.itemSelector, the._$parent)
                .addClass(namespace + '-item')
                .css({
                    width: options.width,
                    height: options.height
                });
            the._length = the._$items.length;
            the._$list = $(options.listSelector, the._$parent)
                .addClass(namespace + '-list')
                .css({
                    width: the._length * options.width
                });
        },

        _initEvent: function () {

        },


        change: function (index) {
            var the = this;
            var options = the._options;
            var left = index * options.width;

            if(animation.supportTransition){
                animation.animate(the._$list, {
                    translateX: left
                });
            }else{
                animation.animate(the._$list);
            }

            return the;
        }
    });

    Banner.defaults = defaults;
    module.exports = Banner;
    ui.importStyle(style);
});