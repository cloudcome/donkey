/**
 * 文本节点
 * @author ydr.me
 * @create 2015-12-05 18:13
 */


define(function (require, exports, module) {
    'use strict';

    var eval2 = require('../_eval.js');

    module.exports = {
        name: '#text',
        bind: function (node, token) {
            this.node = node;
            this.expression = token.expression;
        },
        update: function (data) {
            this.node.nodeValue = eval2(this.expression, data);
        }
    };
});