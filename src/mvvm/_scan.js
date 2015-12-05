/**
 * 节点扫描
 * @author ydr.me
 * @create 2015-12-04 14:25
 */


define(function (require, exports, module) {
    'use strict';

    var dato = require('../utils/dato.js');
    var Directive = require('./_directive.js');

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
     * @param node {Object} 节点
     * @param attributes {Array} 属性列表
     * @param directives {Array} 指令数组
     * @param options {Object} 配置
     * @returns {Array}
     */
    var scanAttribute = function (node, attributes, directives, options) {
        var length = attributes.length;
        var prefixLength = options.prefix.length + 1;
        var ret = [];
        var buildDirective = function (dirctiveName) {
            var findDirective = null;
            dato.each(directives, function (index, directive) {
                if (directive.name === dirctiveName) {
                    findDirective = new Directive(directive);
                    findDirective.bind(node, type, attrValue);
                    return false;
                }
            });
            return findDirective;
        };
        var REG_ATTR = /^attr-/;
        var parseType = function (type) {
            type = type.replace(REG_ATTR, '');

            var types = type.split('-');
            var name = types.shift();

            return {
                name: name,
                value: types.join('-')
            };
        };

        while (length--) {
            var attribute = attributes[length];
            var attrName = attribute.name;
            var attrValue = attribute.value;
            var isDirective = attrName.slice(0, prefixLength) === options.prefix + '-';

            if (isDirective) {
                var type = attrName.slice(prefixLength);
                var retType = parseType(type);
                node.removeAttribute(attribute.name);


                // v-class-abc="true"
                ret.push({
                    attrName: attrName,
                    attrValue: attrValue,
                    // class-abc
                    diractiveName: retType.name,
                    diractiveValue: retType.value,
                    // true
                    expression: attrValue,
                    // 指令集
                    directive: buildDirective(retType.name)
                });
            }
        }

        return ret;
    };


    /**
     * 扫描节点
     * @param ele {Object} 元素
     * @param directives {Array} 指令数组
     * @param options {object} 配置
     * @returns {{}}
     */
    var scanNode = function (ele, directives, options) {
        var attributes = ele.attributes;
        var tagName = ele.tagName;

        return {
            tagName: tagName,
            node: ele,
            childNodes: ele.childNodes,
            attributes: scanAttribute(ele, attributes, directives, options)
        };
    };


    /**
     * 深度扫描
     * @param ele {Object} 元素
     * @param directives {Array} 指令数组
     * @param [options] {object} 配置
     * @returns {{}}
     */
    module.exports = function (ele, directives, options) {
        options = dato.extend({}, defaults, options);

        var ret = {};
        var scanDeep = function (ret, ele) {
            var _ret = scanNode(ele, directives, options);

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