/*!
 * 弹出层
 * @author ydr.me
 * @create 2015-05-16 11:36
 */


define(function (require, exports, module) {
    /**
     * @module ui/popup/
     * @requires core/dom/selector
     * @requires core/dom/attribute
     * @requires core/dom/modification
     * @requires core/dom/animation
     * @requires utils/dato
     * @requires utils/typeis
     * @requires utils/allocation
     * @requires libs/template
     */

    'use strict';

    var $ = window.jQuery;
    var ui = require('../index.js');
    var modification = require('../../core/dom/modification.js');
    var animation = require('../../core/dom/animation.js');
    var dato = require('../../utils/dato.js');
    var typeis = require('../../utils/typeis.js');
    var allocation = require('../../utils/allocation.js');
    var Template = require('../../libs/template.js');
    var template = require('./template.html', 'html');
    var tpl = new Template(template);
    var style = require('./style.css', 'css');
    var alienClass = 'doneky-ui-popup';
    var alienId = 0;
    var win = window;
    var doc = win.document;
    var elBody = doc.body;
    var defaults = {
        // 位置：auto、top、right、bottom、left
        position: 'auto',
        // 箭头的尺寸
        arrowSize: 10,
        // 偏移距离，通常为0
        offset: {
            left: 0,
            top: 0
        },
        // 对齐优先级：center、side
        // center:
        //       [=====]
        // [========^========]
        // side:
        // [=====]
        // [==^==============]
        priority: 'center',
        style: {
            // 弹出层的宽度
            width: 'auto',
            // 弹出层的高度
            height: 'auto',
            maxWidth: 300,
            minWidth: 100
        },
        duration: 123,
        easing: 'in-out',
        addClass: ''
    };
    var Popup = ui.create({
        constructor: function ($target, options) {
            var the = this;

            the._$target = $($target);
            the._options = dato.extend(true, {}, defaults, options);
            the.destroyed = false;
            the.className = 'popup';
            the._html = tpl.render({
                id: the._id = alienId++
            });
            the._$popup = $(the._html).appendTo(elBody).addClass(the._options.addClass);

            var nodes = $('.j-flag', the._$popup);

            the._$arrowTop = $(nodes[0]);
            the._$arrowRight = $(nodes[1]);
            the._$arrowBottom = $(nodes[2]);
            the._$arrowLeft = $(nodes[3]);
            the._$html = $(nodes[4]);
        },


        /**
         * 获取当前 popup 节点
         * @returns {Object}
         */
        getNode: function () {
            return this._$popup[0];
        },


        /**
         * 设置弹出层的内容
         * @param html {String} 内容
         * @returns {Popup}
         */
        setContent: function (html) {
            var the = this;

            the._$html.html(html);

            return the;
        },


        /**
         * 打开弹出层
         * @param [position] {Object} 指定位置或者元素
         * @param [position.width] {Number} 指定位置
         * @param [position.height] {Number} 指定位置
         * @param [position.left] {Number} 指定位置
         * @param [position.top] {Number} 指定位置
         * @param [callback] {Function} 回调
         * @returns {Popup}
         */
        open: function (position, callback) {
            var the = this;

            if (the.visible) {
                the._$popup.css('zIndex', ui.getZindex());
                return the;
            }

            var options = the._options;
            // popup 位置顺序
            var dirList = options.position === 'auto' ? ['bottom', 'right', 'top', 'left'] : [options.position];
            var arrowMap = {
                bottom: 'top',
                right: 'left',
                top: 'bottom',
                left: 'right'
            };
            // 优先级顺序
            var priorityList = options.priority === 'center' ? ['center', 'side'] : ['side'];
            var args = allocation.args(arguments);
            var $target2 = the._$target;

            if (typeis.element(args[0])) {
                $target2 = $(args[0]);
            } else if (typeis.object(args[0])) {
                the._target = $(args[0]);
            } else {
                callback = args[0];
            }

            // 1. 计算窗口位置
            the._document = {
                width: $(doc).outerWidth(),
                height: $(doc).outerHeight()
            };

            // 2. 计算目标位置
            if (!the._target) {
                var offset = $target2.offset();
                the._target = {
                    width: $target2.outerWidth(),
                    height: $target2.outerHeight(),
                    left: offset.left,
                    top: offset.top
                };
            }

            // 3. 透明显示 popup，便于计算
            the._$popup.css(dato.extend({
                zIndex: ui.getZindex(),
                display: 'block',
                top: 0,
                left: 0,
                visibility: 'hidden'
            }, options.style));
            the._popup = {
                width: the._$popup.outerWidth(),
                height: the._$popup.outerHeight()
            };

            // 3. 第一优先级的位置，如果全部位置都不符合，则选择第一优先级的位置
            var firstPos = null;
            var findArrow = null;
            var findPos = null;

            dato.each(dirList, function (i, dir) {
                var arrow = arrowMap[dir];

                dato.each(priorityList, function (j, priority) {
                    var pos = the._cal(dir, priority);

                    if (i === 0 && priority === 'side') {
                        firstPos = pos;
                    }

                    if (the._check(pos)) {
                        findPos = pos;
                        findArrow = arrow;
                        return false;
                    }
                });

                if (findPos) {
                    return false;
                }
            });

            if (!findPos) {
                findPos = firstPos;
                findArrow = arrowMap[dirList[0]];
            }

            // 4. 动画显示
            the._$popup.css({
                opacity: 0,
                visibility: 'visible',
                top: findPos.top,
                left: findPos.left
            });
            the._arrow(findPos._side, findArrow);
            animation.animate(the._$popup[0], {
                opacity: 1
            }, {
                duration: options.duration,
                easing: options.easing
            }, function () {
                the.visible = true;

                if (typeis.function(callback)) {
                    callback.apply(this, arguments);
                }
            });

            the.emit('open');
            the._target = null;

            return the;
        },


        /**
         * 关闭弹出层
         * @param callback
         * @returns {Popup}
         */
        close: function (callback) {
            var the = this;
            var options = the._options;

            animation.animate(the._$popup[0], {
                opacity: 0
            }, {
                duration: options.duration,
                easing: options.easing
            }, function () {
                the._$popup.css({
                    display: 'none',
                    scale: 1
                });
                the.visible = false;

                if (typeis.function(callback)) {
                    callback.apply(this, arguments);
                }
            });

            the.emit('close');

            return the;
        },


        /**
         * 按优先级来定位计算
         * @param dir
         * @param priority
         * @private
         */
        _cal: function (dir, priority) {
            var the = this;
            var options = the._options;
            var pos = {};
            var firstSide;
            var secondSide;
            /**
             * 靠边检测
             * @param type
             * @param firstSide
             * @param secondSide
             * @returns {*}
             */
            var sideCheck = function (type, firstSide, secondSide) {
                var list = [firstSide, secondSide];
                var findSide = null;

                dato.each(list, function (index, side) {
                    pos[type] = side;

                    if (the._check(pos)) {
                        findSide = side;
                        pos._side = index;
                        return false;
                    }
                });

                if (findSide === null) {
                    findSide = firstSide;
                    pos._side = 0;
                }

                pos[type] = findSide;

                switch (type) {
                    case 'left':
                        pos[type] += options.offset.left;
                        break;
                    case 'right':
                        pos[type] -= options.offset.left;
                        break;
                    case 'top':
                        pos[type] += options.offset.top;
                        break;
                    case 'bottom':
                        pos[type] -= options.offset.top;
                        break;
                }

            };

            if (priority === 'center') {
                switch (dir) {
                    case 'bottom':
                        pos.left = the._target.left + the._target.width / 2 - the._popup.width / 2;
                        pos.top = the._target.top + the._target.height + options.arrowSize + options.offset.top;
                        break;

                    case 'right':
                        pos.left = the._target.left + the._target.width + options.arrowSize + options.offset.left;
                        pos.top = the._target.top + the._target.height / 2 - the._popup.height / 2;
                        break;

                    case 'top':
                        pos.left = the._target.left + the._target.width / 2 - the._popup.width / 2;
                        pos.top = the._target.top - options.arrowSize - the._popup.height - options.offset.top;
                        break;

                    case 'left':
                        pos.left = the._target.left - options.arrowSize - the._popup.width - options.offset.left;
                        pos.top = the._target.top + the._target.height / 2 - the._popup.height / 2;
                        break;
                }
            } else {
                switch (dir) {
                    case 'bottom':
                        pos.top = the._target.top + the._target.height + options.arrowSize + options.offset.top;
                        firstSide = the._target.left;
                        secondSide = the._target.left + the._target.width - the._popup.width;
                        sideCheck('left', firstSide, secondSide);
                        break;

                    case 'right':
                        pos.left = the._target.left + the._target.width + options.arrowSize + options.offset.left;
                        firstSide = the._target.top;
                        secondSide = the._target.top + the._target.height - the._popup.height;
                        sideCheck('top', firstSide, secondSide);
                        break;

                    case 'top':
                        pos.top = the._target.top - the._popup.height - options.arrowSize - options.offset.top;
                        firstSide = the._target.left;
                        secondSide = the._target.left + the._target.width - the._popup.width;
                        sideCheck('left', firstSide, secondSide);
                        break;

                    case 'left':
                        pos.left = the._target.left - options.arrowSize - the._popup.width - options.offset.left;
                        firstSide = the._target.top;
                        secondSide = the._target.top + the._target.height - the._popup.height;
                        sideCheck('top', firstSide, secondSide);
                        break;
                }
            }

            return pos;
        },


        /**
         * 检查是否完整显示
         * @param pos
         * @returns {boolean}
         * @private
         */
        _check: function (pos) {
            var the = this;

            if (pos.left < 0 || pos.top < 0) {
                return false;
            }

            return pos.left + the._popup.width <= the._document.width && pos.top + the._popup.height <= the._document.height;
        },


        /**
         * 显示箭头
         * @param side {Number|undefined} 靠边，0=左上边，1=右下边，undefined：中间
         * @param dir {String} 箭头显示的方向
         * @private
         */
        _arrow: function (side, dir) {
            var the = this;
            var options = the._options;
            var none = {
                display: 'none'
            };
            var map = {
                top: the._$arrowTop,
                right: the._$arrowRight,
                bottom: the._$arrowBottom,
                left: the._$arrowLeft
            };
            var pos = {
                display: 'block'
            };

            the._$arrowTop.css(none);
            the._$arrowRight.css(none);
            the._$arrowBottom.css(none);
            the._$arrowLeft.css(none);

            if (!options.arrowSize) {
                return;
            }

            switch (dir) {
                case 'top':
                case 'bottom':
                    switch (side) {
                        case 0:
                            pos.left = the._target.width / 2;
                            break;

                        case 1:
                            pos.left = the._popup.width - the._target.width / 2;
                            break;

                        default:
                            pos.left = the._popup.width / 2;
                            break;
                    }
                    pos.left -= options.arrowSize;
                    break;

                case 'right':
                case 'left':
                    switch (side) {
                        case 0:
                            pos.top = the._target.height / 2;
                            break;

                        case 1:
                            pos.top = the._popup.height - the._target.height / 2;
                            break;

                        default:
                            pos.top = the._popup.height / 2;
                            break;
                    }
                    pos.top -= options.arrowSize;
                    break;
            }

            map[dir].css(pos);
        },

        /**
         * 销毁实例
         */
        destroy: function (callback) {
            var the = this;

            if (the.destroyed) {
                return;
            }

            the.destroyed = true;
            the.close(function () {
                the._$popup.remove();
                if (typeis.function(callback)) {
                    callback();
                }
            });
        }
    });

    Popup.defaults = defaults;
    ui.importStyle(style);
    module.exports = Popup;
});