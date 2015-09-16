/*!
 * css3 关键帧动画
 * @author ydr.me
 * @create 2015-02-12 13:51
 */


define(function (require, exports, module) {
    /**
     * @module parent/keyframes
     * @requires utils/allocation
     * @requires core/dom/attribute
     * @requires core/dom/modification
     */
    'use strict';

    var $ = window.jQuery;
    var allocation = require('../../utils/allocation.js');
    var modification = require('./modification.js');
    var typeis = require('./../../utils/typeis.js');
    var dato = require('./../../utils/dato.js');
    var attribute = require('./attribute.js');
    var REG_NUM = /^(\d+?\.)?\d+$/;
    var VENDOR_PREFIX = ['-webkit-', '-moz-', '-ms-', ''];
    var alienIndex = 0;
    /**
     * 帧动画 MAP，用于管理
     * @type {{}}
     */
    var keyframesMap = {};
    var $style = modification.create('style');
    $('head').append($style);


    /**
     * 在 DOM 中创建一个帧动画样式
     * @param [name] {String} 帧动画名称
     * @param keyframes {Object} 帧动画帧描述
     * @returns {Object}
     */
    exports.create = function (name, keyframes) {
        var args = allocation.args(arguments);

        if (!typeis.string(name)) {
            keyframes = args[0];
            name = 'alien-keyframes-' + alienIndex++;
        }

        var mainStyle = '';

        dato.each(keyframes, function (percent, properties) {
            percent = REG_NUM.test(percent) ? percent * 100 + '%' : percent;
            mainStyle += percent + '{';

            var transformKey = '';
            var transformVal = [];

            dato.each(properties, function (key, val) {
                var fix = attribute.fixCss(key, val);

                if (!fix.key) {
                    return;
                }

                if (fix.key.indexOf('transform') > -1) {
                    transformKey = fix.key;
                    transformVal.push(fix.val + (fix.imp ? ' !important' : ''));
                } else {
                    mainStyle += fix.key + ':' + fix.val + (fix.imp ? ' !important' : '') + ';';
                }
            });

            mainStyle += (transformVal.length ? transformKey + ':' + transformVal.join(' ') : '') + '}';
        });

        var style = '';

        dato.each(VENDOR_PREFIX, function (i, prefix) {
            style += '@' + prefix + 'keyframes ' + name + '{' + mainStyle + '}';
        });

        keyframesMap[name] = style;
        modification.importStyle(style, $style, true);

        return name;
    };


    ///**
    // * 从 DOM 中移除某个帧动画样式
    // * @param name {String} 帧动画名称
    // */
    //exports.remove = function (name) {
    //    var $style = keyframesMap[name];
    //
    //    modification.remove($style);
    //    keyframesMap[name] = null;
    //};


    /**
     * 获取帧动画的样式
     * @param name {String} 帧动画名称
     * @returns {String}
     */
    exports.getStyle = function (name) {
        return keyframesMap[name];
    };
});