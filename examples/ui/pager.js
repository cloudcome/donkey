define(function (require) {
    'use strict';


    var Pager = require('../../src/ui/pager/index.js');

    new Pager('#demo1', {
        total: 111
    });
    new Pager('#demo2', {
        total: 111,
        jump: false
    });
    new Pager('#demo3', {
        total: -1
    });
    new Pager('#demo4', {
        total: -1,
        jump: false
    });
});