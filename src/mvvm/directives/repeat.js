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
    var typeis = require('../../utils/typeis.js');

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
        update: function (key, newValue, oldValue, paths) {
            var the = this;
            var node = the.node;
            var flag = the.flag;
            var list = the.exec(the.listVar, the.data) || [];

            // 二次更新
            if (key) {
                //the.mvvm.broadcast('broadcast', key, newValue, oldValue, paths);
            }
            // 初次更新
            else {
                dato.each(list, function (index, item) {
                    var clone = node.cloneNode(true);
                    var childData = dato.extend(true, {}, the.data);

                    if (typeof item === 'object') {
                        childData[the.itemVar] = dato.extend(true, typeis.Array(item) ? [] : {}, item);
                    } else {
                        childData[the.itemVar] = item;
                    }
                    childData[the.indexVar] = index;
                    modification.insert(clone, flag, 'beforebegin');
                    the.mvvm.create(clone, childData, [
                        the.listVar,
                        index
                    ]);
                });
            }
        }
    };
});