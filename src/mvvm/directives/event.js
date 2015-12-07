/**
 * v-on
 * @author ydr.me
 * @create 2015-12-05 21:55
 */


define(function (require, exports, module) {
    'use strict';

    var typeis = require('../../utils/typeis.js');
    var dato = require('../../utils/dato.js');

    module.exports = {
        bind: function (ele, token) {
            var the = this;
            var parseRet = the.parseFunction();
            var cbName = parseRet.fnName;
            var cbArgs = parseRet.args;
            var calArgs = function (eve) {
                eve = eve.originalEvent;

                if (!cbArgs.length) {
                    return [eve];
                }

                var args = [];

                dato.each(cbArgs, function (index, arg) {
                    if (arg[0] === '"' || arg[0] === '\'') {
                        args.push(arg.slice(1, -1));
                    } else if (arg === '$event') {
                        args.push(eve);
                    } else {
                        args.push(the.exec(arg));
                    }
                });

                return args;
            };

            switch (token.value) {
                case 'enter':
                    $(ele).on('keypress', function (eve) {
                        if (eve.keyCode === 13) {
                            if (typeis.Function(the.scope[cbName])) {
                                the.scope[cbName].apply(this, calArgs(eve));
                            }
                        }
                    });
                    break;

                default:
                    $(ele).on(token.value, function (eve) {
                        if (typeis.Function(the.scope[cbName])) {
                            the.scope[cbName].apply(this, calArgs(eve));
                        }
                    });
                    break;
            }
        }
    };
});