/**
 * 节点扫描
 * @author ydr.me
 * @create 2015-12-04 14:25
 */


define(function (require, exports, module) {
    'use strict';

    var dato = require('../utils/dato.js');
    var Directive = require('./_directive.js');
    var parser = require('./_parser.js');

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
        var scanRet = [];
        var directRet = true;
        var buildDirective = function (dirctiveName, dirctiveValue, expression) {
            var findDirective = null;
            var ret = true;
            dato.each(directives, function (index, directive) {
                if (directive.name === dirctiveName) {
                    findDirective = new Directive(directive);
                    ret = findDirective.bind(node, dirctiveName, dirctiveValue, expression);
                    return false;
                }
            });
            return [findDirective, ret];
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
                var buildRet = buildDirective(retType.name, retType.value, attrValue);
                node.removeAttribute(attribute.name);

                if (buildRet[1] === false) {
                    directRet = false;
                }

                // v-class-abc="true"
                scanRet.push({
                    name: attrName,
                    value: attrValue,
                    // class
                    diractiveName: retType.name,
                    // abc
                    diractiveValue: retType.value,
                    // true
                    expression: attrValue,
                    // ["varible"]
                    varibles: parser(attrValue).varibles,
                    // 指令集
                    directive: buildRet[0]
                });
            }
        }

        return [scanRet, directRet];
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
        var attrbuteRet = scanAttribute(ele, attributes, directives, options);

        return {
            tagName: tagName,
            node: ele,
            childNodes: ele.childNodes,
            attributes: attrbuteRet[0],
            // 是否深度遍历
            deep: attrbuteRet[1] !== false
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

            if (_ret.deep) {
                dato.each(childNodes, function (index, childNode) {
                    if (childNode.nodeType === 1) {
                        var _childRet = {};

                        _ret.children.push(_childRet);
                        scanDeep(_childRet, childNode);
                    }
                });
            }
        };

        scanDeep(ret, ele);

        return ret;
    };
});