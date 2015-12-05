/**
 * 文本节点
 * @author ydr.me
 * @create 2015-12-05 18:13
 */


define(function (require, exports, module) {
    'use strict';

    var eval2 = require('../_eval.js');

    module.exports = {
        bind: function (node, expression) {
            this.expression = expression;
        },
        update: function (node, data) {
            node.nodeValue = eval2(this.expression, data);
        }
    };
});