/**
 * 数据监听变化
 * @author ydr.me
 * @create 2015-12-04 10:46
 */


define(function (require, exports, module) {
    'use strict';

    var klass = require('../utils/class.js');
    var typeis = require('../utils/typeis.js');
    var dato = require('../utils/dato.js');
    var controller = require('../utils/controller.js');
    var Emitter = require('../libs/emitter.js');
    var observe = require('../3rd/observe.js');

    var defaults = {
        // 超时时间 50 ms，避免频繁修改 DOM
        timeout: 50
    };

    var Watcher = klass.extend(Emitter).create({
        constructor: function (data, options) {
            var the = this;

            the.data = data;
            the._options = dato.extend({}, defaults, options);
            the._callbacks = {};
        },

        /**
         * 监听数据变化
         * @param attrs
         * @param callback
         * @returns {Watcher}
         */
        watch: function (attrs, callback) {
            var the = this;

            observe(the.data, attrs, controller.debounce(function (key, neo, old, path) {
                var paths = path.replace(/^#-/, '').split('-');

                the.emit('change', key, neo, old, paths);
                callback.call(the, key, neo, old, paths);
            }, the._options.timeout, false));

            return the;
        }
    });

    Watcher.defaults = defaults;
    module.exports = Watcher;
});