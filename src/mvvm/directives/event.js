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
            var parseRet = the.parseFunction();
            var cbName = parseRet.fnName;
            var cbArgs = parseRet.args;

            switch (token.value) {
                case 'enter':
                    $(ele).on('keypress', function (eve) {
                        if (eve.keyCode === 13) {
                            if (typeis.Function(the.data[cbName])) {
                                the.data[cbName].call(this, eve.originalEvent);
                            }
                        }
                    });
                    break;

                default:
                    $(ele).on(token.value, function (eve) {
                        if (typeis.Function(the.data[cbName])) {
                            the.data[cbName].call(this, eve.originalEvent);
                        }
                    });
                    break;
            }
        }
    };
});