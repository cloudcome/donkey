define(function (require) {
    'use strict';


    var Pager = require('../../src/ui/pager/index.js');

    new Pager('#demo', {
        total: 111
    }).on('change', function (page, maxPage) {
        console.log(page, maxPage);
        this.render();
    });
});