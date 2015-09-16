/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-09-16 10:34
 */


define(function (require, exports, module) {
    /**
     * @module parent/validation.js
     */

    'use strict';

    var Validation = require('../../src/ui/validation/index.js');

    var v = new Validation('#form', {
        breakOnInvalid: true
    });

    v.before('validate', function (ele) {
        $(ele).next('span').html('');
    }).on('invalid', function (err, ele) {
        if (!$(ele).next('span').length) {
            $('<span/>').insertAfter(ele);
        }

        $(ele).next('span').html(err.message);
    });

    $('#submit').click(function () {
        v.validate(function (pass) {
            console.log(pass);
        });
    });

    $('#submit1').click(function () {
        v.validate(['username', 'password'], function (pass) {
            console.log(pass);
        });
    });
});