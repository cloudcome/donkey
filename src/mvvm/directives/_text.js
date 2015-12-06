/**
 * 文本节点
 * @author ydr.me
 * @create 2015-12-05 18:13
 */


define(function (require, exports, module) {
    'use strict';

    module.exports = {
        name: '#text',
        bind: function (node, token) {
            var the = this;
            the.node = node;
            the.expression = token.expression;
        },
        update: function () {
            var the = this;

            the.node.nodeValue = the.exec();
        }
    };
});