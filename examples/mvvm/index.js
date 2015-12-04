/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 11:38
 */


define(function (require, exports, module) {
    /**
     * @module parent/observe
     */

    'use strict';

    var Mvvm = require('../../src/mvvm/index.js');

    Mvvm.directive(require('../../src/mvvm/directives/class.js'));

    var v1 = new Mvvm(document.getElementById('demo'), {
        big: true
    });

    //v1.directive(require('../../src/mvvm/directives/class.js'));
});