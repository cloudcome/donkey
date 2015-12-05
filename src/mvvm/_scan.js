/**
 * 节点扫描
 * @author ydr.me
 * @create 2015-12-04 14:25
 */


define(function (require, exports, module) {
    'use strict';

    var dato = require('../utils/dato.js');
    var typeis = require('../utils/typeis.js');
    var Directive = require('./_directive.js');
    var parseExpression = require('./_parser/expression.js');
    var parseText = require('./_parser/text.js');
    var textNodeDirective = require('./directives/_text.js');
    var modification = require('../core/dom/modification.js');

    var namespace = '-donkey-mvvm-' + Math.random();
    var mvvmIndex = 0;
    var defaults = {
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
     * @param data {Object} 监听的数据
     * @param options {Object} 配置
     * @returns {Array}
     */
    var scanAttribute = function (node, attributes, directives, data, options) {
        var length = attributes.length;
        var prefixLength = options.prefix.length + 1;
        var scanRet = [];
        var directRet = true;
        var buildDirective = function (dirctiveName, dirctiveValue, expression) {
            var findDirective = null;
            var ret = true;
            dato.each(directives, function (index, directive) {
                if (directive.name === dirctiveName) {
                    findDirective = new Directive(node, directive, {
                        name: dirctiveName,
                        value: dirctiveValue,
                        expression: expression
                    }, data);
                    ret = findDirective.bind();
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
                    varibles: parseExpression(attrValue).varibles,
                    // 指令集
                    directive: buildRet[0]
                });
            }
        }

        return [scanRet, directRet];
    };


    /**
     * 扫描元素节点
     * @param ele {Object} 元素
     * @param directives {Array} 指令数组
     * @param data {Object} 监听的数据
     * @param options {object} 配置
     * @returns {{}}
     */
    var scanElement = function (ele, directives, data, options) {
        var attributes = ele.attributes;
        var tagName = ele.tagName;
        var attrbuteRet = scanAttribute(ele, attributes, directives, data, options);

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
     * 扫描文本节点
     * @param node
     * @param directives
     * @param data {Object} 监听的数据
     * @param options
     * @returns {Array}
     */
    var scanTextNode = function (node, directives, data, options) {
        var parseRet = parseText(node.nodeValue, options.openTag, options.closeTag);
        var ret = [];
        var parentNode = node.parentNode;
        var text = '#text';

        dato.each(parseRet.tokens, function (index, item) {
            var textNode = modification.create(text, item.token);
            var directive = null;
            var expression = item.expression;

            if (expression) {
                directive = new Directive(textNode, textNodeDirective, {
                    name: text,
                    expression: expression
                }, data);
                directive.bind();
            }

            parentNode.insertBefore(textNode, node);
            ret.push({
                node: textNode,
                token: item.token,
                expression: expression,
                varibles: parseExpression(expression).varibles,
                start: item.start,
                end: item.end,
                directive: directive
            });
        });

        node.nodeValue = '';
        return ret;
    };


    /**
     * 深度扫描
     * @param ele {Object} 元素
     * @param directives {Array} 指令数组
     * @param data {Object} 监听的数据
     * @param [options] {object} 配置
     * @returns {object|null}
     */
    module.exports = function (ele, directives, data, options) {
        options = dato.extend({}, defaults, options);

        var ret = {};
        var tagName = '';
        var scanDeep = function (ret, node) {
            var _ret = null;

            switch (node.nodeType) {
                // #element
                case 1:
                    _ret = scanElement(node, directives, data, options);
                    _ret.children = [];
                    break;

                // #text
                case 3:
                    _ret = scanTextNode(node, directives, data, options);
                    break;
            }

            if (!_ret) {
                return;
            }

            if (typeis.Array(_ret)) {
                dato.each(_ret, function (index, item) {
                    ret.push(item);
                });
            } else {
                if (typeis.Array(ret)) {
                    ret.push(_ret);
                } else {
                    ret[_ret.tagName] = _ret;
                    tagName = _ret.tagName;
                }

                var children = dato.toArray(_ret.childNodes);
                delete(_ret.childNodes);

                if (_ret.deep && !node[namespace]) {
                    dato.each(children, function (index, childNode) {
                        scanDeep(_ret.children, childNode);
                    });
                }
            }
        };

        if (ele[namespace]) {
            return null;
        }

        ele[namespace] = mvvmIndex++;
        scanDeep(ret, ele);

        return ret[tagName];
    };
});