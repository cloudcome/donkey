/*!
 * 时间日历选择器
 * @author ydr.me
 * @create 2015-02-05 10:51
 */


define(function (require, exports, module) {
    /**
     * @module ui/datetime-picker/
     * @requires utils/calendar
     * @requires utils/dato
     * @requires utils/date
     * @requires utils/string
     * @requires utils/typeis
     * @requires core/dom/selector
     * @requires core/dom/attribute
     * @requires core/dom/modification
     * @requires core/dom/animation
     * @requires core/event/base
     * @requires libs/template
     * @requires ui/
     * @requires ui/range/
     * @requires ui/popup/
     */
    'use strict';

    var calendar = require('../../utils/calendar.js');
    var dato = require('../../utils/dato.js');
    var date = require('../../utils/date.js');
    var string = require('../../utils/string.js');
    //var typeis = require('../../utils/typeis.js');
    var selector = require('../../core/dom/selector.js');
    var attribute = require('../../core/dom/attribute.js');
    //var modification = require('../../core/dom/modification.js');
    //var animation = require('../../core/dom/animation.js');
    var event = require('../../core/event/base.js');
    var Template = require('../../libs/template.js');
    var ui = require('../');
    var templateWrap = require('./wrap.html', 'html');
    var templateList = require('./list.html', 'html');
    var templateToolbar = require('./toolbar.html', 'html');
    var style = require('./style.css', 'css');
    var Range = require('../range/');
    var Popup = require('../popup/');
    var tplWrap = new Template(templateWrap);
    var tplList = new Template(templateList);
    var tplToolbar = new Template(templateToolbar);
    var namespace = 'alien-ui-datetimepicker';
    var alienIndex = 0;
    var REG_HOUR = /h/i;
    var REG_MINUTE = /m/;
    var REG_SECOND = /s/;
    var doc = document;
    var defaults = {
        format: 'YYYY-MM-DD',
        firstDayInWeek: 0,
        addClass: '',
        lang: {
            year: '年',
            month: '月',
            // 星期前缀，如：“星期”或“周”等
            weekPrefix: '',
            weeks: ['日', '一', '二', '三', '四', '五', '六']
        },
        range: [new Date(1970, 0, 1, 8, 0, 0, 0), new Date()],
        duration: 234,
        easing: 'in-out',
        disabledPrevMonth: true,
        disabledNextMonth: true
    };
    var DatetimePicker = ui.create({
        constructor: function ($input, options) {
            var the = this;

            the._eInput = selector.query($input)[0];
            options = the._options = dato.extend(true, {}, defaults, options);
            the.destroyed = false;
            the._id = alienIndex++;
            the._lastChoose = {};
            // 选择的日期、时间
            the._choose = {};
            // 确定的日期、时间
            the._select = {
                hours: 0,
                minutes: 0,
                seconds: 0
            };
            // 是否包含小时、分钟、秒
            the._hasHour = REG_HOUR.test(options.format);
            the._hasMinute = REG_MINUTE.test(options.format);
            the._hasSecond = REG_SECOND.test(options.format);
            the.className = 'datetime-picker';
            the._initNode();
            the._initEvent();
        },


        /**
         * 渲染节点
         * @private
         */
        _initNode: function () {
            var the = this;

            the._date = date.parse(the._eInput.value);
            the._popup = new Popup(the._eInput, {
                addClass: namespace + '-popup',
                priority: 'side'
            });
            the._popup.setContent(tplWrap.render({
                id: the._id,
                hasHour: the._hasHour,
                hasMinute: the._hasMinute,
                hasSecond: the._hasSecond
            }));
            var $wrap = selector.query('#' + namespace + '-' + the._id)[0];
            var nodes = selector.query('.j-flag', $wrap);

            the._$toolbar = nodes[0];
            the._$list = nodes[1];
            the._$rangeText = nodes[2];
            the._$hour = nodes[3];
            the._$minute = nodes[4];
            the._$second = nodes[5];
            the._$wrap = $wrap;
            the._$cancel = selector.query('.j-cancel', $wrap)[0];
            the._$now = selector.query('.j-now', $wrap)[0];
            the._$sure = selector.query('.j-sure', $wrap)[0];

            if (the._$hour) {
                the._rHours = new Range(the._$hour, {
                    min: 0,
                    max: 23,
                    step: 1,
                    value: the._choose.hours = the._date.getHours()
                }).on('change', function (val) {
                    the._select.hours = the._choose.hours = val.max;
                    the._renderTime();
                    the._changeChoose();
                });
            }

            if (the._$minute) {
                the._rMinutes = new Range(the._$minute, {
                    min: 0,
                    max: 59,
                    step: 1,
                    value: the._choose.minutes = the._date.getMinutes()
                }).on('change', function (val) {
                    the._select.minutes = the._choose.minutes = val.max;
                    the._renderTime();
                    the._changeChoose();
                });
            }

            if (the._$second) {
                the._rSeconds = new Range(the._$second, {
                    min: 0,
                    max: 59,
                    step: 1,
                    value: the._choose.seconds = the._date.getSeconds()
                }).on('change', function (val) {
                    the._select.seconds = the._choose.seconds = val.max;
                    the._renderTime();
                    the._changeChoose();
                });
            }

            the._renderToolbar();
        },


        /**
         * 渲染 toolbar
         * @private
         */
        _renderToolbar: function () {
            var the = this;
            var options = the._options;
            var data = {
                years: [],
                months: []
            };
            var i;
            var j;

            for (i = options.range[0].getFullYear(), j = options.range[1].getFullYear(); i <= j; i++) {
                data.years.push({
                    value: i,
                    text: i + options.lang.year
                });
            }

            for (i = 1, j = 13; i < j; i++) {
                data.months.push({
                    value: i - 1,
                    text: i + options.lang.month
                });
            }

            the._$toolbar.innerHTML = tplToolbar.render(data);

            var nodes = selector.query('.j-flag', the._$toolbar);

            the._$year = nodes[0];
            the._$month = nodes[1];
        },


        /**
         * 渲染时间
         * @private
         */
        _renderTime: function () {
            var the = this;

            if (!the._$rangeText) {
                return;
            }

            var temp = '${hours}';

            if (the._$minute) {
                temp += ':${minutes}';
            }

            if (the._$second) {
                temp += ':${seconds}';
            }

            the._$rangeText.innerHTML = string.assign(temp, the._choose, function (val) {
                return string.padLeft(val, 2, 0);
            });
        },


        /**
         * 选择年份
         * @param fullyear
         * @returns {DatetimePicker}
         */
        selectYear: function (fullyear) {
            var the = this;

            the._choose.year = the._$year.value = fullyear;

            return the;
        },


        /**
         * 选择月份
         * @param month {Number} 月份
         * @returns {DatetimePicker}
         */
        selectMonth: function (month) {
            var the = this;

            the._choose.month = the._$month.value = month;

            return the;
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            var options = the._options;
            var disabledCls = namespace + '-disabled';

            // 打开日历
            event.on(the._eInput, 'focus', the.open.bind(the));

            // 改变年月
            event.on(the._$year, 'change', the._onchangeyear = function () {
                the._choose.year = this.value;
                the._renderList();
                the._changeChoose();
            });
            event.on(the._$month, 'change', the._onchangemonth = function () {
                the._choose.month = this.value;
                the._renderList();
                the._changeChoose();
            });

            var activieTd = function (el) {
                attribute.removeClass(selector.query('td', the._$list), namespace + '-active');
                attribute.addClass(el, namespace + '-active');
            };

            // 点击日期
            event.on(the._$list, 'click', 'td', the._onchoose = function () {
                var el = this;
                var y = attribute.data(el, 'year');
                var m = attribute.data(el, 'month');
                var d = attribute.data(el, 'date');

                if (attribute.hasClass(el, disabledCls)) {
                    return;
                }

                //if (y < options.range[0].getFullYear() || y > options.range[1].getFullYear()) {
                //    return;
                //}
                //
                //if (m < options.range[0].getMonth() || m > options.range[1].getMonth()) {
                //    return;
                //}
                //
                //if (y === the._choose.year && m === the._choose.month && d === the._choose.date) {
                //    return;
                //}

                the._select.year = y;
                the._select.month = m;
                the._select.date = d;
                activieTd(el);
                the._changeChoose();

                return false;
            });

            // 点击取消
            event.on(the._$cancel, 'click', function () {
                the.close();
                the.emit('cancel');

                return false;
            });

            var buildId = function (item) {
                // 20150218
                return [item.year, string.padLeft(item.month + 1, 2, '0'), string.padLeft(item.date, 2, '0')].join('') * 1;
            };

            // 点击现在
            event.on(the._$now, 'click', function () {
                the._changeChoose(new Date());
                the._render(true);
                var el = selector.query('.' + namespace + '-' + buildId(the._select), the._$list)[0];
                activieTd(el);
                the.emit('now', the._date);

                return false;
            });

            // 点击确定
            event.on(the._$sure, 'click', function () {
                var d = new Date(the._select.year, the._select.month, the._select.date,
                    the._select.hours, the._select.minutes, the._select.seconds, 0);
                the._eInput.value = date.format(options.format, d);
                the.close();
                the.emit('sure', d);

                return false;
            });

            // 点击 document
            event.on(doc, 'click', the._onclick = function (eve) {
                if (!the._visible) {
                    return;
                }

                var $target = eve.target;

                if ($target === the._eInput || selector.closest($target, '.' + namespace)[0]) {
                    return;
                }

                the.close();
                the.emit('cancel');
            });
        },


        /**
         * 日期、时间变化
         * @param [d] {Date} 设置日期、时间
         * @private
         */
        _changeChoose: function (d) {
            var the = this;

            the._date = d || new Date(the._choose.year, the._choose.month, the._choose.date,
                    the._choose.hours, the._choose.minutes, the._choose.seconds, 0);
            the.emit('change', the._date);
        },


        /**
         * 渲染
         * @param selected
         * @private
         */
        _render: function (selected) {
            var the = this;

            the._choose.year = the._date.getFullYear();
            the._choose.month = the._date.getMonth();
            the._choose.date = the._date.getDate();
            the._choose.hours = the._date.getHours();
            the._choose.minutes = the._date.getMinutes();
            the._choose.seconds = the._date.getSeconds();

            if (selected) {
                the._select.year = the._choose.year;
                the._select.month = the._choose.month;
                the._select.date = the._choose.date;
                the._select.hours = the._choose.hours;
                the._select.minutes = the._choose.minutes;
                the._select.seconds = the._choose.seconds;
            }

            the.selectYear(the._choose.year);
            the.selectMonth(the._choose.month);
            the._renderList();
            the._renderTime();

            if (the._rHours) {
                the._rHours.change(the._choose.hours);
            }

            if (the._rMinutes) {
                the._rMinutes.change(the._choose.minutes);
            }

            if (the._rSeconds) {
                the._rSeconds.change(the._choose.seconds);
            }
        },


        /**
         * 打开日历
         * @public
         */
        open: function () {
            var the = this;
            var value = the._eInput.value;

            the._date = date.parse(value);
            the._render(true);
            the._changeChoose();
            the._popup.open(function () {
                // 重新打开后，更新滑块的位置信息
                if (the._rHours) {
                    the._rHours.update();
                }

                if (the._rMinutes) {
                    the._rMinutes.update();
                }

                if (the._rSeconds) {
                    the._rSeconds.update();
                }

                the._visible = true;
            });

            return the;
        },


        /**
         * 关闭日历
         * @returns {DatetimePicker}
         */
        close: function () {
            var the = this;

            the._popup.close(function () {
                the._visible = false;
            });

            return the;
        },


        /**
         * 渲染日历
         * @private
         */
        _renderList: function () {
            var the = this;
            var options = the._options;
            var list = calendar.month(the._choose.year, the._choose.month, dato.extend({}, options, {
                activeDate: the._select.year ? new Date(the._select.year, the._select.month, the._select.date) : null,
                start: options.range[0],
                end: options.range[1]
            }));
            var data = {
                thead: [],
                tbody: list
            };
            var i = options.firstDayInWeek;
            var j = i + 7;
            var k;

            for (; i < j; i++) {
                k = i % 7;
                data.thead.push(options.lang.weekPrefix + options.lang.weeks[k]);
            }

            the._$list.innerHTML = tplList.render(data);
            //the._lastChoose.year = the._choose.year;
            //the._lastChoose.month = the._choose.month;
        },


        /**
         * 销毁实例
         */
        destroy: function () {
            var the = this;

            if (the.destroyed) {
                return;
            }

            the.destroyed = true;

            if (the._rHours) {
                the._rHours.destroy();
            }

            if (the._rMinutes) {
                the._rMinutes.destroy();
            }

            if (the._rSeconds) {
                the._rSeconds.destroy();
            }

            event.un(the._$year, 'change');
            event.un(the._$month, 'change');
            event.un(the._eInput, 'focus', the.open);
            event.un(the._$list, 'click');
            event.un(the._$now, 'click');
            event.un(the._$sure, 'click');
            event.un(doc, 'click', the._onclick);
            the._popup.destroy();
        }
    });

    DatetimePicker.defaults = defaults;
    module.exports = DatetimePicker;
    ui.importStyle(style);
});