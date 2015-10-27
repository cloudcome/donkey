/*!
 * 排序
 * @ref http://api.jqueryui.com/sortable/
 * @author ydr.me
 * @create 2015-08-04 20:52
 */


define(function (require, exports, module) {
    /**
     * @module ui/sortable
     */

    'use strict';

    var $ = window.jQuery;

    require('../../jquery-ui/sortable.js');

    var ui = require('../index.js');
    var dato = require('../../utils/dato.js');
    var defaults = {
        appendTo: 'parent',
        // x/y
        axis: '',
        //cancel: 'input,textarea,button,select,option',
        //connectWith: false,
        //containment: false,
        //cursor: '',
        //cursorAt: '',
        //delay: '',
        //disabled: '',
        //distance: '',
        //dropOnEmpty: '',
        //forceHelperSize: '',
        //forcePlaceholderSize: '',
        //grid: '',
        handle: false,
        // original/clone/<function>
        helper: 'original',
        // 可排序的项目
        items: '>*',
        //opacity: '',
        // 占位的样式名
        placeholder: '',
        //revert: '',
        //scroll: '',
        //scrollSensitivity: '',
        //scrollSpeed: '',
        //tolerance: '',
        dataAttr: 'id'
    };
    var Sortable = ui.create({
        constructor: function ($parent, options) {
            var the = this;

            the._$parent = $($parent);
            the._options = dato.extend({}, defaults, options);
            the._$parent.sortable(the._options);
            the.className = 'sortable';
        },


        /**
         * 更新节点及位置信息
         * @returns {Sortable}
         */
        update: function () {
            var the = this;

            the._$parent.sortable('refresh');

            return the;
        },


        /**
         * 取值
         */
        getValue: function () {
            var the = this;

            return the._$parent.sortable('toArray', {
                attribute: 'data-' + the._options.dataAttr
            });
        },


        /**
         * 销毁实例
         */
        destroy: function () {
            var the = this;

            the._$parent.sortable('destroy');

        }
    });

    Sortable.defaults = defaults;
    module.exports = Sortable;
});