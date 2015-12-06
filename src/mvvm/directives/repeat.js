/**
 * v-repeat
 * @author ydr.me
 * @create 2015-12-06 11:36
 */


define(function (require, exports, module) {
    'use strict';

    require('../../polyfill/string.js');
    var modification = require('../../core/dom/modification.js');
    var repeatId = 0;
    var namespace = '-mvvm-directive-repeat-' + Math.random();

    module.exports = {
        bind: function (node, token) {
            var flag = this.flag = modification.create('#comment', 'v-repeat-' + repeatId);
            var args = token.expression.split(',');

            this.node = node;
            this.listVar = args.pop().trim();
            this.indexVar = (args[0] || '$index').trim();

            modification.remove(this.node);
            modification.insert(flag, node, 'afterend');
            flag[namespace] = node[namespace] = repeatId;
            repeatId++;

            debugger;
            return false;
        },
        update: function (data) {
            var list = data[this.listVar] || [];


        }
    };
});