/**
 * v-on
 * @author ydr.me
 * @create 2015-12-05 21:55
 */


define(function (require, exports, module) {
    'use strict';

    var typeis = require('../../utils/typeis.js');

    module.exports = {
        bind: function (ele, token) {
            var the = this;
            var parseRet = the.parseExpression();
            var eventName = parseRet.varibles.shift();

            switch (token.value) {
                case 'enter':
                    $(ele).on('keypress', function (eve) {
                        if (eve.keyCode === 13) {
                            if (typeis.Function(the.data[eventName])) {
                                the.data[eventName].call(this, eve.originalEvent);
                            }
                        }
                    });
                    break;

                default:
                    $(ele).on(token.value, function (eve) {
                        if (typeis.Function(the.data[eventName])) {
                            the.data[eventName].call(this, eve.originalEvent);
                        }
                    });
                    break;
            }
        }
    };
});