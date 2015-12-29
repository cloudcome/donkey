/**
 * 倒计时
 * @author ydr.me
 * @create 2015-09-28 11:48
 */

define(function (require, exports, module) {
    'use strict';

    var klass = require('../utils/class.js');
    var number = require('../utils/number.js');
    var dato = require('../utils/dato.js');
    var Emitter = require('./emitter.js');

    var oneSecond = 1000;
    var oneMinute = 60 * oneSecond;
    var oneHour = 60 * oneMinute;
    var oneDate = 24 * oneHour;
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
            the._paused = false;
        },

        _now: function () {
            return new Date().getTime();
        },

        _start: function () {
            var the = this;
            var options = the._options;
            var startTime = new Date().getTime();
            var count = the._remain;
            var doStep = function () {
                the._timeid = setTimeout(function () {
                    var now = the._now();
                    var pastTime = now - startTime;
                    var remain = the._remain = count - pastTime;
                    var steps = Math.round(remain / options.interval);

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

            the._remain = number.parseInt(the._options.count);
            the._remain = Math.max(the._remain, 0);
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
            the._paused = true;
            the._pauseTime = the._now();
            the.emit('pause', the._remain);

            return the;
        },

        /**
         * 恢复计时
         * @params [ignorePast] {Boolean} 是否忽略经过时间
         * @returns {CountDown}
         */
        resume: function (ignorePast) {
            var the = this;

            if (!ignorePast) {
                the._remain -= the._now() - the._pauseTime;
            }

            the._paused = false;
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
        },


        /**
         * 判断是否正在计时
         * @returns {boolean}
         */
        is: function () {
            var the = this;

            if (the._paused) {
                return false;
            }

            return this._remain > 0;
        }
    });

    CountDown.defaults = defaults;
    /**
     * 剩余时间人性化
     * @param remain {Number} 剩余时间
     * @returns {{}}
     */
    CountDown.humanrize = function (remain) {
        var ret = {};

        remain = number.parseInt(remain);
        remain = Math.max(remain, 0);
        ret.times = remain;
        ret.dates = Math.floor(remain / oneDate);
        remain -= ret.dates * oneDate;
        ret.hours = Math.floor(remain / oneHour);
        remain -= ret.hours * oneHour;
        ret.minutes = Math.floor(remain / oneMinute);
        remain -= ret.minutes * oneMinute;
        ret.seconds = Math.floor(remain / oneSecond);
        remain -= ret.seconds * oneSecond;
        ret.milliseconds = remain;

        return ret;
    };
    module.exports = CountDown;
});