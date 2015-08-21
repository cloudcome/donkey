/*!
 * 多级数据联动
 * @author ydr.me
 * @create 2015-07-04 23:11
 */


define(function (require, exports, module) {
    /**
     * @module ui/linkage/
     * @requires utils/dato
     * @requires utils/howdo
     * @requires utils/typeis
     * @requires utils/controller
     * @requires ui/
     * @requires core/dom/modification
     */

    'use strict';

    var $ = window.jQuery;
    var dato = require('../../utils/dato.js');
    var howdo = require('../../utils/howdo.js');
    var typeis = require('../../utils/typeis.js');
    var controller = require('../../utils/controller.js');
    var ui = require('../index.js');
    //var selector = require('../../core/dom/selector.js');
    var modification = require('../../core/dom/modification.js');
    //var attribute = require('../../core/dom/attribute.js');
    //var event = require('../../core/event/base.js');
    //var xhr = require('../../core/communication/xhr.js');
    var namespace = 'alien-ui-linkage';
    var defaults = {
        // 数据的 text 键名
        textName: 'text',
        // 数据的 value 键名
        valueName: 'value',
        // 请求数据的键名
        queryName: 'parent',
        // 级联长度
        length: 3,
        // 获取级联数据的 urls
        // 执行普通的 get 请求
        urls: [],
        // select 选择器，默认为父级下的前几个
        selectSelectors: [],
        cache: true,
        placeholder: {
            text: '请选择',
            value: ''
        }
    };
    var Linkage = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = $($parent);
            the._options = dato.extend({}, defaults, options);
            the._length = the._options.urls.length || the._options.length;
            the._hasPlaceholder = the._options.placeholder && the._options.placeholder.text;
            the._values = [];
            the._cache = {};
            the._initNode();
            the._initEvent();
            // 初始加载第一级
            the.change(0);
        },


        /**
         * 初始化节点
         * @private
         */
        _initNode: function () {
            var the = this;
            var options = the._options;

            the._$selects = [];

            if (options.selectSelectors.length) {
                dato.each(options.selectSelectors, function (index, sel) {
                    the._$selects.push($(sel, the._$parent)[0]);
                });
            } else {
                the._$selects = $('select', the._$parent);
            }

            dato.repeat(the._length, function (index) {
                the._$selects[index][namespace + 'index'] = index;
            });
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            //var options = the._options;

            // 获取到了列表数据
            the.on('list', the._renderList);

            dato.repeat(the._length, function (index) {
                $(the._$selects[index]).on('change', the._onchange = function () {
                    var index = this[namespace + 'index'];
                    var value = this.value;
                    var nextIndex = index + 1;

                    the._values[index] = value;
                    the.emit('change', index, value);
                    the._cleanValues(nextIndex);

                    if (nextIndex < the._length) {
                        the.change(index + 1);
                    }
                });
            });
        },


        /**
         * 改变级联选择
         * @param index
         * @param callback
         * @returns {Linkage}
         */
        change: function (index, callback) {
            var the = this;
            var cb;

            the._getData(index);
            the.after('render', cb = function (_index) {
                if (_index === index) {
                    the.un('afterrender', cb);

                    if (typeis.function(callback)) {
                        callback.call(the);
                    }
                }
            });

            return the;
        },


        /**
         * 手动设置级联值
         * @param values {Array} 手动值
         * @returns {Linkage}
         */
        setValue: function (values) {
            var the = this;

            the._xhr.abort();
            howdo.each(values, function (index, value, next) {
                the._unDispathChange = true;
                the._values[index] = value + '';
                the.change(index, next);
            }).follow(function () {
                the._unDispathChange = false;
            });

            return the;
        },


        /**
         * 获得当前选中的值
         * @returns {Array}
         */
        getValue: function () {
            return this._values;
        },


        /**
         * 获取 select
         * @param index {Number} 索引值
         * @returns {*}
         */
        getSelect: function (index) {
            return this._$selects[index];
        },


        /**
         * 获取级联数据
         * @param index {Number} 当前级联索引值
         * @private
         */
        _getData: function (index) {
            var the = this;
            var options = the._options;
            var value = the._values[index - 1];

            the._currentIndex = index;

            // 未选择时，回到初始状态
            if (index > 0 && !value) {
                return the.emit('list');
            }

            if (index && the._cache[index - 1]) {
                var cacheList = the._cache[index - 1][value];

                if (cacheList) {
                    return the.emit('list', cacheList.slice(the._hasPlaceholder ? 1 : 0));
                }
            }

            if (the.emit('beforedata', index) === false) {
                return;
            }

            var query = {};

            query[options.queryName] = index > 0 ? value : '';

            the._xhr = $.ajax({
                url: options.urls[index],
                data: query
            }).done(function (list) {
                if (the.emit('afterdata', list) === false) {
                    return;
                }

                the.emit('list', list);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                the.emit('error', new Error(errorThrown));
            });
        },


        /**
         * 清除当前及后续的值
         * @param index
         * @private
         */
        _cleanValues: function (index) {
            var the = this;

            dato.repeat(the._length, function (_index) {
                if (_index >= index) {
                    the._values[_index] = '';
                }
            });
        },


        /**
         * 渲染 select option
         * @param [list] {Array} 渲染的数据列表
         * @returns {string}
         * @private
         */
        _renderList: function (list) {
            var the = this;
            var options = the._options;
            var selectOptions = '';
            var index = the._currentIndex;

            the.emit('beforerender', index);

            var selectedValue = the._values[index];
            var isFind = false;

            if (list) {
                if (index && options.cache) {
                    var prevValue = the._values[index - 1];
                    // 上一个选中的子级
                    the._cache[index - 1] = the._cache[index - 1] || {};
                    the._cache[index - 1][prevValue] = list;
                }
            } else {
                list = [];
            }

            if (the._hasPlaceholder) {
                list.unshift(options.placeholder);
            }

            dato.each(list, function (i, item) {
                var text = item[options.textName];
                var value = item[options.valueName] + '';
                var isSelected = selectedValue === value;

                if (isSelected) {
                    isFind = true;
                }

                selectOptions += '<option value="' + value + '"' +
                    (isSelected ? ' selected' : '') +
                    '>' + text + '</option>';
            });

            if (selectedValue && !isFind) {
                the._cleanValues(index);
            }

            var $select = $(the._$selects[index]);

            if (selectOptions) {
                $select.prop('disabled', false).html(selectOptions);
            } else {
                $select.prop('disabled', true);
            }

            if (!the._unDispathChange) {
                the._cleanValues(index + 1);

                if (index + 1 < the._length) {
                    the.change(index + 1);
                }
            }

            the.emit('afterrender', index);
        },


        /**
         * 销毁实例
         */
        destroy: function () {
            var the = this;

            dato.repeat(the._length, function (index) {
                $(the._$selects[index]).off('change', the._onchange);
            });
        }
    });

    Linkage.defaults = defaults;
    module.exports = Linkage;
});