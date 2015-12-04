/**
 * 节点扫描
 * @author ydr.me
 * @create 2015-12-04 14:25
 */


define(function (require, exports, module) {
    'use strict';

    var dato = require('../utils/dato.js');

    var defaults = {
        // 前缀
        prefix: 'v',
        // 跳过深度检测的属性
        skipDeepOfAttributes: [
            'text',
            'html'
        ]
    };


    /**
     * 扫描属性
     * @param attributes {Array} 属性列表
     * @param options {Object} 配置
     * @returns {Array}
     */
    var scanAttribute = function (attributes, options) {
        var length = attributes.length;
        var prefixLength = options.prefix.length + 1;
        var ret = [];

        while (length--) {
            var attribute = attributes[length];
            var attrName = attribute.name;
            var attrValue = attribute.value;
            var isBind = attrName.slice(0, prefixLength) === options.prefix + '-';

            if (isBind) {
                var type = attrName.slice(prefixLength);
                //var expression = attrValue;

                ret.push({
                    type: type,
                    expression: attrValue
                });
            }
        }

        return ret;
    };


    /**
     * 扫描节点
     * @param ele {Object} 元素
     * @param options {object} 配置
     * @returns {{tagName: string, ele: *, childNodes: (*|NodeList), directives: Array}}
     */
    var scanNode = function (ele, options) {
        var attributes = ele.attributes;
        var tagName = ele.tagName;

        return {
            tagName: tagName,
            ele: ele,
            childNodes: ele.childNodes,
            directives: scanAttribute(attributes, options)
        };
    };


    /**
     * 深度扫描
     * @param ele {Object} 元素
     * @param options {object} 配置
     * @returns {{}}
     */
    module.exports = function (ele, options) {
        options = dato.extend({}, defaults, options);

        var ret = {};
        var scanDeep = function (ret, ele) {
            var _ret = scanNode(ele, options);

            ret[_ret.tagName] = _ret;
            _ret.children = [];
            var childNodes = _ret.childNodes;
            delete(_ret.childNodes);

            dato.each(childNodes, function (index, childNode) {
                if (childNode.nodeType === 1) {
                    var _childRet = {};

                    _ret.children.push(_childRet);
                    scanDeep(_childRet, childNode);
                }
            });
        };

        scanDeep(ret, ele);

        return ret;
    };
});