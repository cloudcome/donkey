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
            var flag = the.flag = modification.create('#comment', 'repeat-' + repeatId);
            var args = token.expression.split(',');

            the.node = node;
            the.itemVar = token.value;
            the.listVar = args.pop().trim();
            the.indexVar = (args[0] || '$index').trim();

            modification.insert(flag, node, 'afterend');
            modification.remove(node);
            flag[namespace] = node[namespace] = repeatId;
            repeatId++;

            return false;
        },
        update: function () {
            var the = this;
            var node = the.node;
            var flag = the.flag;
            var list = the.exec(the.listVar, the.data) || [];

            dato.each(list, function (index, item) {
                var clone = node.cloneNode(true);
                var childData = dato.extend({}, the.data);

                childData[the.itemVar] = item;
                childData[the.indexVar] = index;
                modification.insert(clone, flag, 'beforebegin');
                the.mvvm.child(clone, childData);
            });
        }
    };
});