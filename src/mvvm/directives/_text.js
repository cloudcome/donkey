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
            this.node = node;
            this.expression = token.expression;
        },
        update: function () {
            this.node.nodeValue = this.exec(this.expression);
        }
    };
});