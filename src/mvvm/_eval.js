/**
 * 执行表达式
 * @author ydr.me
 * @create 2015-12-04 17:03
 */


define(function (require, exports, module) {
    /**
     * @module parent/eval
     */

    'use strict';

    var dato = require('../utils/dato.js');
    var typeis = require('../utils/typeis.js');
    var random = require('../utils/random.js');

    var REG_SAFE_VARIBLE = /^[a-z_$]/;
    var prefix = '__mvvm__eval__';

    var generate = function () {
        return prefix + random.guid();
    };

    var makeSafe = function (expression) {
        return '(function(){' +
                /*****/'try{' +
                /*****//*****/'return ' + expression + ';' +
            '}catch(e){' +
                /*****/'return undefined;' +
                /*****//*****/'}' +
            '}());';
    };

    /**
     * 执行表达式
     * @param expression
     * @param data
     * @returns {*}
     */
    exports.expression = function (expression, data) {
        var vars = [];
        var argName = generate();

        dato.each(data, function (key) {
            if (REG_SAFE_VARIBLE.test(key)) {
                vars.push('var ' + key + ' = ' + argName + '["' + key + '"];');
            }
        });

        var fnString = vars.join('\n');

        /* jshint evil: true */
        var fn = new Function(argName, fnString + 'return ' + makeSafe(expression));

        return fn(data);
    };


    ///**
    // * 执行数据路径
    // * @param paths {Array} 路径
    // * @param data
    // * @returns {*}
    // */
    //exports.path = function (paths, data) {
    //    var ret = data;
    //
    //    dato.each(paths, function (index, path) {
    //        var d = ret[path];
    //
    //        if (typeof d === 'object') {
    //            ret = d;
    //            return true;
    //        }
    //
    //        return false;
    //    });
    //
    //    return ret === data ? undefined : ret;
    //};
});