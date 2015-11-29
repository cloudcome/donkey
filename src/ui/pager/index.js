/**
 * pager
 * @author ydr.me
 * @create 2015-11-19 17:11
 */


define(function (require, exports, module) {
    /**
     * @module ui/pager
     * @requires ui/
     * @requires libs/template
     * @requires utils/dato
     * @requires utils/number
     * @requires utils/string
     * @requires core/dom/modification
     */

    'use strict';

    var $ = window.jQuery;
    var ui = require('../index.js');
    var Template = require('../../libs/template.js');
    var dato = require('../../utils/dato.js');
    var number = require('../../utils/number.js');
    var string = require('../../utils/string.js');
    var modification = require('../../core/dom/modification.js');
    var template = require('./template.html', 'html');
    var style = require('./style.css', 'css');
    var tpl = new Template(template);
    var disabledClass = 'disabled';
    var defaults = {
        hasTotalStatusText: '共有${total}条，${page}/${maxPage}页',
        noTotalStatusText: '当前第${page}页',
        sureText: '确定',
        navPrev: '<',
        navStart: '<<',
        navNext: '>',
        navEnd: '>>',
        total: 0,
        page: 1,
        pageSize: 10,
        // 是否自动渲染，即点击页码之后自动更新页码，而不必等待异步操作
        autoRender: true,
        jump: true
    };
    var Pager = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = $($parent);
            the._options = dato.extend({}, defaults, options);
            the._initNode();
            the._initEvent();
            the.render();
        },

        _initNode: function () {
            var the = this;
            var options = the._options;

            the._$parent.html(tpl.render({
                options: options
            }));
            var $flags = $('.j-flag', the._$parent);
            the._$status = $($flags[0]);
            the._$actions = $($flags[1]).children();
            the._$input = $($flags[2]);
            the._$sure = $($flags[3]);
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            var options = the._options;

            // 监听箭头
            the._$actions.on('click', function () {
                var $this = $(this);
                var index = $this.data('index') * 1;

                if ($this.hasClass(disabledClass)) {
                    return;
                }

                var pager = the._pager;
                var page = pager.page;

                switch (index) {
                    case 0:
                        page = 1;
                        break;

                    case 1:
                        page = page - 1;
                        break;

                    case 2:
                        page = page + 1;
                        break;

                    case 3:
                        page = pager.maxPage;
                        break;
                }

                the._change(page);
            });

            // 监听确定
            the._$sure.on('click', function () {
                var page = number.parseInt(the._$input.val(), 1);
                the._change(page);
            });
        },


        /**
         * 改变
         * @param page
         * @private
         */
        _change: function (page) {
            var the = this;
            var pager = the._pager;

            if (page < 1) {
                page = 1;
            } else if (page > pager.maxPage) {
                page = pager.maxPage;
            }

            if (page === pager.page) {
                return;
            }

            the._pager.page = page;
            the.emit('change', page, pager.maxPage);
        },


        /**
         * 计算分页数据
         * @private
         */
        _cal: function () {
            var the = this;
            var options = the._options;
            var pager = the._pager = {
                total: options.total,
                page: options.page,
                pageSize: options.pageSize,
                maxPage: options.total < 0 ? Number.MAX_VALUE : Math.max(Math.ceil(options.total / options.pageSize), 1)
            };

            if (options.total < 0) {
                if (pager.page < 2) {
                    $(the._$actions[0]).addClass(disabledClass);
                } else {
                    $(the._$actions[0]).removeClass(disabledClass);
                }
            } else {
                if (pager.maxPage < 2) {
                    $(the._$actions).addClass(disabledClass);
                } else {
                    $(the._$actions).removeClass(disabledClass);

                    if (pager.page > 1) {
                        $(the._$actions[0]).removeClass(disabledClass);
                    } else {
                        $(the._$actions[0]).addClass(disabledClass);
                    }

                    if (pager.page === pager.maxPage) {
                        $(the._$actions[3]).addClass(disabledClass);
                    } else {
                        $(the._$actions[3]).removeClass(disabledClass);
                    }
                }
            }
        },


        /**
         * 渲染页码
         * @param [data] {Object} 数据
         * @param [data.page] {Number} 当前页码
         * @param [data.total] {Number} 数量
         * @param [data.pageSize] {Number} 每页数量
         * @returns {Pager}
         */
        render: function (data) {
            var the = this;
            var options = the._options;

            dato.extend(options, the._pager, data);
            the._cal();
            the._$status.html(string.assign(the._pager.total < 0 ? options.noTotalStatusText : options.hasTotalStatusText, the._pager));
            the._$input.val(the._pager.page);

            return the;
        }
    });

    modification.importStyle(style);
    Pager.defaults = defaults;
    module.exports = Pager;
});