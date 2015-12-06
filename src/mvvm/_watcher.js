/**
 * 数据监听变化
 * @author ydr.me
 * @create 2015-12-04 10:46
 */


define(function (require, exports, module) {
    'use strict';

    var klass = require('../utils/class.js');
    var dato = require('../utils/dato.js');
    var Emitter = require('../libs/emitter.js');
    var watch = require('../3rd/watch.js');

    var defaults = {
        // 超时时间 50 ms，避免频繁修改 DOM
        timeout: 50
    };

    var Watcher = klass.extend(Emitter).create({
        constructor: function (data, options) {
            var the = this;

            the.data = data;
            the._options = dato.extend({}, defaults, options);
            watch.watch(function () {
                console.log(arguments);
            });
            watch.onChange(function () {
                console.log(arguments);
                the.emit('change');
            });
        },

        /**
         * 监听数据变化
         * @param attrs
         * @param callback
         * @returns {Watcher}
         */
        watch: function (attrs, callback) {
            var the = this;
            var options = the._options;
            var timeid = 0;

            watch.watch(the.data, attrs, function (key, pro, neo, old) {
                var now = new Date().getTime();

                if (!the._lastTime || now - the._lastTime > options.timeout) {
                    clearTimeout(timeid);
                    callback(key, pro, neo, old);
                } else {
                    timeid = setTimeout(function () {
                        callback(key, pro, neo, old);
                    });
                }

                the._lastTime = now;
            });

            return the;
        }
    });

    Watcher.defaults = defaults;
    module.exports = Watcher;
});