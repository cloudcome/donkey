/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 16:07
 */


define(function (require, exports, module) {
    /**
     * @module parent/index
     */

    'use strict';

    var dato = require('../utils/dato.js');
    var scan = require('./_scan.js');
    var watch = require('../3rd/watch.js');
    var Directive = require('./_directive.js');
    var defaults = {
        prefix: 'v'
    };
    var directives = [];
    var Mvvm = module.exports = function (ele, data, options) {
        options = dato.extend({}, defaults, options);
        var scanner = scan(ele, directives, options);

        dato.each(scanner, function () {

        });
    };

    Mvvm.directive = function (directive) {
        directives.push(new Directive(directive));
    };
    Mvvm.directives = directives;
});