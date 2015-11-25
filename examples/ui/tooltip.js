define(function (require) {
    'use strict';

    var Tooltip = require('../../src/ui/tooltip/index.js');

    new Tooltip({
        selector: '.tooltip',
        timeout: 1000,
        data: 'tooltip'
    });
});