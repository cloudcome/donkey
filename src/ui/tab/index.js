/**
 * 选项卡
 * @author ydr.me
 * @create 2014-11-20 23:00
 */


define(function (require, exports, module) {
    /**
     * @module ui/tab/
     * @requires ui/
     * @requires core/dom/selector
     * @requires core/dom/attribute
     * @requires core/event/touch
     * @requires utils/dato
     * @requires utils/controller
     */
    'use strict';

    require('../../polyfill/function.js');
    var $ = window.jQuery;
    var ui = require('../');
    var dato = require('../../utils/dato.js');
    var controller = require('../../utils/controller.js');
    var defaults = {
        index: 0,
        eventType: 'click',
        activeClass: 'active',
        itemSelector: 'li',
        triggerSelector: 'a'
    };
    var Tab = ui.create({
        constructor: function ($tab, options) {
            var the = this;

            the._$tab = $($tab);
            the.className = 'tab';

            if (!the._$tab.length) {
                throw new Error('instance element is empty');
            }

            the._options = dato.extend(true, {}, defaults, options);
            the._index = the._options.index;
            the.update();
            the._initEvent();
        },


        /**
         * 更新节点信息
         */
        update: function () {
            var the = this;
            var options = the._options;

            the._$items = $(options.itemSelector, the._$tab[0]);

            if (!the._$items.length) {
                the._index = -1;
            }

            return the;
        },


        /**
         * 初始化事件
         * @private
         */
        _initEvent: function () {
            var the = this;
            var options = the._options;

            // 这里异步调用的原因是
            // 主线程执行完毕再执行这里
            // 此时，实例化已经完成，就能够读取实例上添加的属性了
            controller.nextTick(the._getActive, the);
            the._$tab.on(options.eventType, options.triggerSelector, the._ontrigger.bind(the));
        },


        /**
         * 改变当前 tab
         * @param index {Number} 切换的索引值
         */
        change: function (index) {
            var the = this;
            var options = the._options;

            the._ontrigger({
                target: $(options.triggerSelector, the._$tab[0])[index]
            });
        },


        /**
         * 获取当前激活的 tab 和 未激活的 tab
         * @private
         */
        _getActive: function () {
            var the = this;

            if (!the._$items.length) {
                return;
            }

            var options = the._options;
            var $active = $(options.triggerSelector, the._$items[the._index]);
            var $activeContent = $($active.attr('href'));

            the._toggleClass(the._$items[the._index]);
            the._toggleClass($activeContent);

            /**
             * Tab 索引发生变化后
             * @event change
             * @param index {Number} 变化后的索引
             * @param $activeTab {HTMLElement} 被激活的 tab 标签
             * @param $activeContent {HTMLElement} 被激活的 tab 内容
             */
            the.emit('change', the._index, the._$items[the._index], $activeContent[0]);
        },


        /**
         * 事件出发回调
         * @private
         */
        _ontrigger: function (eve) {
            var the = this;
            var options = the._options;
            var $item = $(eve.target).closest(options.itemSelector);

            if (!$item.length) {
                return;
            }

            var triggerIndex = $item.index();

            if (eve.preventDefault) {
                eve.preventDefault();
            }

            if (triggerIndex !== the._index) {
                the._index = triggerIndex;
                the._getActive();
            }
        },


        /**
         * 批量切换 className
         * @param $active
         * @private
         */
        _toggleClass: function ($active) {
            $active = $($active);

            var $siblings = $active.siblings();
            var className = this._options.activeClass;

            $active.addClass(className);
            $siblings.removeClass(className);
        },


        /**
         * 销毁实例
         */
        destroy: function () {
            var the = this;

            // 卸载事件绑定
            the._$tab.un(the._options.eventType, the._ontrigger);
        }
    });
    Tab.defaults = defaults;


    /**
     * 实例化一个 Tab 选项卡
     * 基本的 DOM 结构为：
     * ul#tab>(li>a)*n
     * 选项卡改变的时候会触发`change`事件
     *
     * @example
     * var tab = new Tab('#tab');
     * tab.on('chnage', function(index, $tab, $content){
     *     // do what
     * });
     */
    module.exports = Tab;
});