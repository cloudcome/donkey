/**
 * v-repeat
 * @author ydr.me
 * @create 2015-12-06 11:36
 */


define(function (require, exports, module) {
    'use strict';

    require('../../polyfill/string.js');
    var modification = require('../../core/dom/modification.js');
    var dato = require('../../utils/dato.js');

    var repeatId = 0;
    var namespace = '-donkey-mvvm-directive-repeat-' + Math.random();

    module.exports = {
        bind: function (node, token) {
            var the = this;
            var flag = the.flag = modification.create('#comment', 'v-repeat-' + repeatId);
            var args = token.expression.split(',');

            this.node = node;
            this.itemVar = token.value;
            this.listVar = args.pop().trim();
            this.indexVar = (args[0] || '$index').trim();

            modification.insert(flag, node, 'afterend');
            modification.remove(node);
            flag[namespace] = node[namespace] = repeatId;
            repeatId++;

            return false;
        },
        update: function (data) {
            var the = this;
            var node = the.node;
            var flag = the.flag;
            var list = data[the.listVar] || [];

            dato.each(list, function (index, item) {
                var clone = node.cloneNode(true);
                var childData = dato.extend({}, data);

                childData[the.itemVar] = item;
                childData[the.indexVar] = index;
                modification.insert(clone, flag, 'beforebegin');
                the.mvvm.child(clone, childData);
            });
        }
    };
});