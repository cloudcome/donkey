/*!
 * 核心 dom 修改器
 * @author ydr.me
 * 2014-09-16 17:02
 */


define(function (require, exports, module) {
    /**
     * @module core/dom/modification
     * @requires utils/dato
     */
    'use strict';

    require('../../polyfill/json2.js');
    var $ = window.jQuery;
    var dato = require('../../utils/dato.js');
    var typeis = require('../../utils/typeis.js');
    var doc = window.document;
    var head = $('head')[0] || doc.documentElement;


    /**
     * 创建节点
     * @param {String}       nodeName       节点名称，可以为#text、#comment、tagName
     * @param {String|Object} [attributes]   节点属性
     * @param {Object} [properties]   节点特性
     * @returns {Node}
     *
     * @example
     * modification.create('#text', '123');
     * // => textNode
     *
     * modification.create('#comment', '123');
     * // => commentNode
     *
     * modification.create('div', {id:'id-123'});
     * // => DIVNode
     */
    exports.create = function (nodeName, attributes, properties) {
        var node;

        switch (nodeName) {
            case '#text':
                node = doc.createTextNode(typeis.undefined(attributes) ? '' : String(attributes));
                break;

            case '#comment':
                node = doc.createComment(typeis.undefined(attributes) ? '' : String(attributes));
                break;

            default:
                node = doc.createElement(nodeName);
                var $node = $(node);

                dato.each(attributes, function (key, val) {
                    if (typeof val === 'object') {
                        if (key === 'style') {
                            $node.css(val);
                        } else {
                            try {
                                val = JSON.stringify(val);
                            } catch (err) {
                                val = '';
                            }

                            $node.attr(key, val);
                        }
                    } else {
                        $node.attr(key, val);
                    }
                });

                break;
        }

        dato.each(properties, function (key, val) {
            node[key] = val;
        });

        return node;
    };


    /**
     * 添加样式
     * @param {String} styleText 样式内容
     * @param {String|HTMLElement|Node} [selector=null] 选择器
     * @param {Boolean} [isAppend=false] 是否为追加模式
     * @returns {HTMLStyleElement}
     *
     * @example
     * modification.importStyle('body{padding: 10px;}');
     */
    exports.importStyle = function (styleText, selector, isAppend) {
        var args = arguments;

        if (typeis.boolean(args[1])) {
            isAppend = args[1];
            selector = null;
        }

        var $style = $(selector)[0];

        if (!$style) {
            $style = $('<style>').appendTo(head)[0];
        }

        styleText = String(styleText);

        // IE
        if ($style.styleSheet) {
            // 此 BUG 仅影响 IE8（含） 以下浏览器
            // http://support.microsoft.com/kb/262161
            // if (document.getElementsByTagName('style').length > 31) {
            //     throw new Error('Exceed the maximal count of style tags in IE')
            // }

            if (isAppend) {
                $style.styleSheet.cssText += styleText;
            } else {
                $style.styleSheet.cssText = styleText;
            }
        }
        // W3C
        else {
            if (isAppend) {
                $style.innerHTML += styleText;
            } else {
                $style.innerHTML = styleText;
            }
        }

        return $style;
    };
});