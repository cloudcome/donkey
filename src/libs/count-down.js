/*!
 * 倒计时
 * @author ydr.me
 * @create 2015-09-28 11:48
 */

define(function (require, exports, module) {
    'use strict';


    var klass = require('../utils/class.js');
    var dato = require('../utils/dato.js');
    var Emitter = require('./emitter.js');
    var oneSecond = 1000;
    var oneMinute = oneSecond * 60;
    var oneHour = oneMinute * 60;
    var oneDate = oneHour * 24;
    var oneMonth = oneDate * 30;
    var oneYear = oneMonth * 12;
    var stepMap = {
        year: 7,
        month: 6,
        date: 5,
        hour: 4,
        minute: 3,
        second: 2,
        millisecond: 1
    };
    var udf;
    var defaults = {
        // 倒计时时长，单位：毫秒
        count: 10000,
        // 步长
        step: 1000,
        // 最小步长
        minStep: 'millisecond',
        // 最大步长
        maxStep: 'year'
    };
    var CountDown = klass.extend(Emitter).create({
        constructor: function (options) {
            var the = this;

            options = the._options = dato.extend({}, defaults, options);
            options.minStepValue = stepMap[options.minStep];
            options.maxStepValue = stepMap[options.maxStep];
        },

        start: function () {
            var the = this;
            var options = the._options;
            var startTime = new Date().getTime();
            var doStep = function () {
                the._timeid = setTimeout(function () {
                    var now = new Date().getTime();
                    var pastTime = now - startTime;
                    var remain = options.count - pastTime;

                    if (remain / options.step > 0) {
                        the.emit('change', the.humanize(remain));
                        return doStep();
                    }

                    the.emit('change', the.humanize(0));
                    the._pause();
                    the.emit('stop');
                }, options.step - 6);
            };

            the._pause();
            the.emit('change', the.humanize(options.count));
            the.emit('start');
            doStep();
        },

        _pause: function () {
            var the = this;

            if (the._timeid) {
                clearTimeout(the._timeid);
                the._timeid = 0;
            }
        },


        pause: function () {
            var the = this;

            the._pause();
            the.emit('pause');

            return the;
        },

        stop: function () {
            var the = this;

            the._pause();
            the.emit('change', the.humanize(0));
            the.emit('stop');

            return the;
        },

        /**
         * 时间人性化
         * @param time {Number} 时间
         * @returns {{}}
         */
        humanize: function (time) {
            var the = this;
            var options = the._options;
            var ret = {};

            // 年
            if (options.maxStepValue > 6) {
                ret.years = Math.round(time / oneYear);
                time = time % oneYear;
            }

            if (options.minStepValue > 6 && ret.years === udf) {
                ret.years = Math.floor(time / oneYear);
                time = time % oneYear;
            }

            // 月
            if (options.maxStepValue > 5) {
                ret.months = Math.round(time / oneMonth);
                time = time % oneMonth;
            }

            if (options.minStepValue > 5 && ret.months === udf) {
                ret.months = Math.floor(time / oneMonth);
                time = time % oneMonth;
            }

            // 日
            if (options.maxStepValue > 4) {
                ret.dates = Math.round(time / oneDate);
                time = time % oneDate;
            }

            if (options.minStepValue > 4 && ret.dates === udf) {
                ret.dates = Math.floor(time / oneDate);
                time = time % oneDate;
            }

            // 时
            if (options.maxStepValue > 3) {
                ret.hours = Math.round(time / oneHour);
                time = time % oneHour;
            }

            if (options.minStepValue > 3 && ret.hours === udf) {
                ret.hours = Math.floor(time / oneHour);
                time = time % oneHour;
            }

            // 分
            if (options.maxStepValue > 2) {
                ret.minutes = Math.round(time / oneMinute);
                time = time % oneMinute;
            }

            if (options.minStepValue > 2 && ret.minutes === udf) {
                ret.minutes = Math.floor(time / oneMinute);
                time = time % oneMinute;
            }

            // 秒
            if (options.maxStepValue > 1) {
                ret.seconds = options.minStepValue < 2 ? Math.floor(time / oneSecond) : Math.round(time / oneSecond);
            }

            if (options.minStepValue > 1 && ret.seconds === udf) {
                ret.seconds = Math.floor(time / oneSecond);
            }

            // 毫秒
            if (options.minStepValue === 1) {
                ret.milliSeconds = time % oneSecond;
            }

            return ret;
        }
    });

    CountDown.defaults = defaults;
    module.exports = CountDown;
});