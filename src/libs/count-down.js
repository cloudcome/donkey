/**
 * 倒计时
 * @author ydr.me
 * @create 2015-09-28 11:48
 */

define(function (require, exports, module) {
    'use strict';

    var klass = require('../utils/class.js');
    var dato = require('../utils/dato.js');
    var Emitter = require('./emitter.js');

    var defaults = {
        // 倒计时时长，单位：毫秒
        count: 10000,
        // 步长
        interval: 1000,
        // 最小步长
        minStep: 'second',
        // 最大步长
        maxStep: 'year'
    };
    var CountDown = klass.extend(Emitter).create({
        constructor: function (options) {
            var the = this;

            the._options = dato.extend({}, defaults, options);
        },

        _start: function () {
            var the = this;
            var options = the._options;
            var startTime = new Date().getTime();
            var count = the._remain;
            var doStep = function () {
                the._timeid = setTimeout(function () {
                    var now = new Date().getTime();
                    var pastTime = now - startTime;
                    var remain = the._remain = count - pastTime;
                    var steps = Math.floor(remain / options.interval);

                    if (steps) {
                        the.emit('change', remain);
                        return doStep();
                    }

                    the._remain = 0;
                    the.emit('change', 0);
                    the._pause();
                    the.emit('stop', 0);
                }, options.interval - 6);
            };

            the._pause();
            the.emit('change', the._remain);

            if (the._remain) {
                doStep();
            } else {
                the.emit('stop', 0);
            }
        },

        /**
         * （重新）开始计时
         * @returns {CountDown}
         */
        start: function () {
            var the = this;

            the._remain = Math.max(the._options.count, 0);
            the.emit('start', the._remain);
            the._start();

            return the;
        },

        _pause: function () {
            var the = this;

            if (the._timeid) {
                clearTimeout(the._timeid);
                the._timeid = 0;
            }
        },


        /**
         * 暂停计时
         * @returns {CountDown}
         */
        pause: function () {
            var the = this;

            the._pause();
            the.emit('pause', the._remain);

            return the;
        },

        /**
         * 恢复计时
         * @returns {CountDown}
         */
        resume: function () {
            var the = this;

            the._remain -= the._options.interval;
            the.emit('resume', the._remain);
            the._start();

            return the;
        },


        /**
         * 停止计时
         * @returns {CountDown}
         */
        stop: function () {
            var the = this;

            the._pause();
            the._remain = 0;
            the.emit('change', 0);
            the.emit('stop', 0);

            return the;
        }
    });

    CountDown.defaults = defaults;
    module.exports = CountDown;
});