/**
 * attribute
 * @author ydr.me
 * @create 2015-09-16 21:57
 */


define(function (require, exports, module) {
    /**
     * @module core/dom/selector
     * @module core/dom/attribute
     * @requires core/navigator/compatible
     */

    'use strict';

    var w = window;
    var d = w.document;
    var b = d.body;
    var h = d.documentElement;

    var selector = require('./selector.js');
    var typeis = require('../../utils/typeis.js');
    var allocation = require('../../utils/allocation.js');
    var compatible = require('../navigator/compatible.js');
    var REG_PX = /margin|width|height|padding|top|right|bottom|left|translate|font/i;
    var REG_DEG = /rotate|skew/i;
    var REG_TRANSFORM_WORD = /translate|scale|skew|rotate|matrix|perspective/i;
    var REG_IMPORTANT = /\s!important$/i;
    //var REG_TRANSFORM_KEY = /transform/i;
    //var REG_PERCENT = /%/;
    // +123.456
    // -123.456
    var regNum = /^[+\-]?\d+(\.\d*)?$/;
    var regEndPoint = /\.$/;
    var regHump = /-(\w)/g;
    var regSep = /^-+|-+$/g;
    var regSplit = /[A-Z]/g;
    //var regSpace = /\s+/;

    var makeJqueryGetSet = function (jqueryPro) {
        return function (ele, key) {
            var args = allocation.args(arguments);

            if (args.length === 2) {
                $(ele)[jqueryPro](key);
                return;
            }

            return $(ele)[jqueryPro]();
        };
    };



    /**
     * 设置、获取元素的属性
     * @param {Object} ele 元素
     * @param {String/Object/Array} key 特征键、键值对、键数组
     * @param {String} [val] 特征值
     * @returns {*}
     *
     * @example
     * // set
     * attribute.attr(ele, 'href', 'http://ydr.me');
     * attribute.attr(ele, {
     *    href: '',
     *    title: ''
     * });
     *
     * // get
     * attribute.attr(ele, 'href');
     * attribute.attr(ele, ['href', 'title']);
     */
    exports.attr = function (ele, key, val) {
        var args = allocation.args(arguments);

        if (args.length === 2) {
            return $(ele).attr(key);
        }

        $(ele).attr(key, val || {});
        //return _getSet(arguments, {
        //    get: function (ele, key) {
        //        if (!typeis.element(ele)) {
        //            return;
        //        }
        //
        //        return ele.getAttribute(key);
        //    },
        //    set: function (ele, key, val) {
        //        if (!typeis.element(ele)) {
        //            return;
        //        }
        //
        //        ele.setAttribute(key, val);
        //    }
        //});
    };


    /**
     * 判断元素是否包含某个属性
     * @param {HTMLElement|Node} ele 元素
     * @param {String} key 单个特征
     * @returns {boolean}
     *
     * @example
     * // 判断是否有某个属性
     * attribute.hasAttr(ele, 'href');
     * // => true
     */
    exports.hasAttr = function (ele, key) {
        if (!typeis.Element(ele)) {
            return false;
        }

        return ele.hasAttribute(key);
    };


    /**
     * 移除元素的某个属性
     * @param {HTMLElement|Node} ele 元素
     * @param {String} [key] 单个或多个特征属性，为空表示移除所有特征
     *
     * @example
     * // 移除
     * attribute.removeAttr(ele, 'href');
     */
    exports.removeAttr = function (ele, key) {
        return $(ele).removeAttr(key);
        //if (!ele || ele.nodeType !== 1) {
        //    return;
        //}
        //
        //var attrKeys = key ? key.split(regSpace) : ele.attributes;
        //
        //dato.each(attrKeys, function (index, key) {
        //    if (key) {
        //        ele.removeAttribute(typeis(key) === 'attr' ? key.nodeName : key);
        //    }
        //});
    };


    /**
     * 设置、获取元素的特性
     * @param {HTMLElement|Node} ele 元素
     * @param {String/Object/Array} key 特性键、特性键值对、特性组
     * @param {*} [val] 特性值
     * @returns {*}
     *
     * @example
     * // set
     * attribute.prop(ele, 'hi', 'hey');
     * attribute.prop(ele, {
         *     hi: 'hey',
         *     ha: 'hehe'
         * });
     *
     * // get
     * attribute.prop(ele, 'hi');
     * attribute.prop(ele, ['hi', 'ha']);
     */
    exports.prop = makeJqueryGetSet('prop');


    /**
     * 修正 css 键值
     * @param {String} key css 键
     * @param {*} [val] css 值
     * @returns {{key: String, val: *}}
     *
     * @example
     * attribute.fixCss('translateX', 10);
     * // =>
     * // {
     * //    key: 'transform',
     * //    val: 'translateX(10px)',
     * //    imp: false
     * // }
     *
     * attribute.fixCss('marginTop', '10px !important');
     * // =>
     * // {
     * //    key: 'margin-top',
     * //    val: '10px',
     * //    imp: true
     * // }
     */
    exports.fixCss = function (key, val) {
        val = val === null ? '' : String(val).trim();

        var important = null;

        if (REG_IMPORTANT.test(val)) {
            important = 'important';
            val = val.replace(REG_IMPORTANT, '');
        }

        var fixkey = key;
        var fixVal = _toCssVal(key, val);

        if (REG_TRANSFORM_WORD.test(key)) {
            fixkey = 'transform';
            fixVal = key + '(' + fixVal + ')';
        }

        return {
            key: compatible.css3(_toSepString(fixkey)),
            val: compatible.css3(fixVal) || fixVal,
            imp: important
        };
    };


    /**
     * 设置、获取元素的样式
     * @param {HTMLElement|Node} ele 元素
     * @param {String/Object/Array} key 样式属性、样式键值对、样式属性数组，
     *                                     样式属性可以写成`width::after`（伪元素的width）或`width`（实际元素的width）
     * @param {String|Number} [val] 样式属性值
     * @returns {*}
     *
     * @example
     * // set
     * attribute.css(ele, 'width', 100);
     * attribute.css(ele, 'width', 100);
     * attribute.css(ele, {
     *    width: 100,
     *    height: '200px !important'
     * });
     *
     * // get
     * attribute.css(ele, 'width');
     * attribute.css(ele, 'width::after');
     * attribute.css(ele, ['width','height']);
     */
    exports.css = exports.style = function (ele, key, val) {
        var args = allocation.args(arguments);

        if (args.length === 2) {
            return $(ele).css(key);
        }

        $(ele).css(key, val);
        //var transformKey = '';
        //var important = '';
        //
        //return _getSet(arguments, {
        //    get: function (ele, key) {
        //        if (!typeis.element(ele)) {
        //            return;
        //        }
        //
        //        var temp = key.split('::');
        //        var pseudo = temp.length === 1 ? null : temp[temp.length - 1];
        //
        //        key = temp[0];
        //
        //        if (key && REG_TRANSFORM_WORD.test(key)) {
        //            return _toCssVal(key, _getEleTransform(ele, key));
        //        }
        //
        //        pseudo = pseudo ? pseudo : null;
        //        return getComputedStyle(ele, pseudo).getPropertyValue(_toSepString(key));
        //    },
        //    set: function (ele, key, val) {
        //        if (!typeis.element(ele)) {
        //            return;
        //        }
        //
        //        key = key.split('::', 1)[0];
        //
        //        var fix = exports.fixCss(key, val);
        //
        //        if (!fix.key) {
        //            return;
        //        }
        //
        //        if (REG_TRANSFORM_KEY.test(fix.key)) {
        //            transformKey = fix.key;
        //            _setEleTransform(ele, key, val);
        //
        //            if (!important && fix.imp) {
        //                important = fix.imp;
        //            }
        //        } else {
        //            // 样式名, 样式值, 优先级
        //            // object.setProperty (propertyName, propertyValue, priority);
        //            ele.style.setProperty(fix.key, fix.val, fix.imp);
        //        }
        //    },
        //    onset: function () {
        //        if (transformKey) {
        //            ele.style.setProperty(transformKey, _calEleTransform(ele), important);
        //        }
        //    }
        //});
    };


    /**
     * 设置元素可见
     * @param $ele
     * @param [display]
     */
    exports.show = function ($ele, display) {
        if (display) {
            return $($ele).css('display', display);
        }

        return $($ele).show();
        //exports.css($ele, 'display', display || see.getDisplay($ele));
    };


    /**
     * 设置元素不可见
     * @param $ele
     */
    exports.hide = function ($ele) {
        return $($ele).hide();
        //exports.css($ele, 'display', 'none');
    };


    /**
     * 设置、获取元素的滚动条上边距
     * @param ele {HTMLElement|Node|Window|Document|Object} 元素
     * @param [top] {Number} 高度
     * @returns {number|undefined}
     *
     * @example
     * // get
     * attribute.scrollTop(ele);
     *
     * // set
     * attribute.scrollTop(ele, 100);
     */
    exports.scrollTop = makeJqueryGetSet('scrollTop');


    /**
     * 设置、获取元素的滚动条左距离
     * @param ele {HTMLElement|Node|Window|Document|Object} 元素
     * @param [left] {Number} 高度
     * @returns {number|undefined}
     *
     * @example
     * // get
     * attribute.scrollLeft(ele);
     *
     * // set
     * attribute.scrollLeft(ele, 100);
     */
    exports.scrollLeft = makeJqueryGetSet('scrollLeft');


    /**
     * 设置、获取元素的滚动高度
     * @param ele {HTMLElement|Node|Window|Document|Object} 元素
     * @returns {number|undefined}
     *
     * @example
     * // get
     * attribute.scrollHeight(ele);
     */
    exports.scrollHeight = makeJqueryGetSet('scrollHeight');


    /**
     * 设置、获取元素的滚动宽度
     * @param ele {HTMLElement|Node|Window|Document|Object} 元素
     * @returns {number|undefined}
     *
     * @example
     * // get
     * attribute.scrollWidth(ele);
     */
    exports.scrollWidth = makeJqueryGetSet('scrollWidth');


    /**
     * 设置、获取元素的数据集
     * @param {Object} ele 元素
     * @param {String/Object/Array} key 数据集键、键值对、键数组
     * @param {String} [val] 数据集值
     * @returns {*}
     *
     * @example
     * // set
     * attribute.data(ele, 'abc', 123);
     * attribute.data(ele, 'def', {
         *    a: 1,
         *    b: 2
         * });
     * // => <div data-abc="123" data-def='{"a":1,"b":2}'></div>
     * // data 逻辑与jquery 的 data 是不一致的，所有的数据都是保存在 DOM 上的
     *
     * // get
     * attribute.data(ele, 'abc');
     * // => "123"
     * attribute.data(ele, ['abc', 'def']);
     * // 数据会优先被 JSON 解析，如果解析失败将返回原始字符串
     * // => {a: 1, b: 2}
     */
    exports.data = function (ele, key, val) {
        var args = allocation.args(arguments);

        if (args.length === 2) {
            return $(ele).attr('data-' + key);
        }

        $(ele).attr('data-' + key, val);
        //return _getSet(arguments, {
        //    get: function (ele, key) {
        //        if (!typeis.element(ele)) {
        //            return;
        //        }
        //
        //        var dataset = ele.dataset || {};
        //        var ret = dataset[string.humprize(key)];
        //        var ret2 = ret;
        //
        //        try {
        //            ret = JSON.parse(ret);
        //        } catch (err1) {
        //            try {
        //                /* jshint evil: true */
        //                var fn = new Function('', 'return ' + ret);
        //                ret = fn();
        //            } catch (err2) {
        //                // ignore
        //            }
        //        }
        //
        //        if (typeis.object(ret) || typeis.array(ret)) {
        //            return ret;
        //        }
        //
        //        return ret2;
        //    },
        //    set: function (ele, key, val) {
        //        if (!typeis.element(ele)) {
        //            return;
        //        }
        //
        //        if (typeis(val) === 'object') {
        //            try {
        //                val = JSON.stringify(val);
        //            } catch (err) {
        //                val = '';
        //            }
        //        }
        //        ele.dataset[string.humprize(key)] = val;
        //    }
        //});
    };


    /**
     * 移除元素的数据集
     * @param $ele {HTMLElement|Node} 元素
     * @param key {String} 键
     * @returns {*}
     */
    exports.removeData = function ($ele, key) {
        $($ele).removeAttr('data-' + key);
        //if (!typeis.element($ele)) {
        //    return;
        //}
        //
        //return exports.removeAttr($ele, 'data-' + key);
    };


    /**
     * 设置、获取元素的innerHTML
     * @param {Object} $ele 元素
     * @param {String} [html] html字符串
     * @returns {String|undefined}
     *
     * @example
     * // set
     * attribute.html(ele, 'html');
     *
     * // get
     * attribute.html(ele);
     */
    exports.html = makeJqueryGetSet('html');


    /**
     * 设置、获取元素的innerText
     * @param {Object} $ele 元素
     * @param {String} [text]  text字符串
     * @returns {String|undefined}
     *
     * @example
     * // set
     * attribute.text(ele, 'text');
     *
     * // get
     * attribute.text(ele);
     */
    exports.text = makeJqueryGetSet('text');


    /**
     * 添加元素的className
     * @param {Object} ele 元素
     * @param {String} className 多个className使用空格分开
     * @returns {undefined}
     *
     * @example
     * attribute.addClass(ele, 'class');
     * attribute.addClass(ele, 'class1 class2');
     */
    exports.addClass = function (ele, className) {
        $(ele).addClass(className);
        //var eles = typeis.array(ele) ? ele : [ele];
        //
        //dato.each(eles, function (i, ele) {
        //    _class(ele, 0, className);
        //});
    };


    /**
     * 移除元素的className
     * @param {Object|Array} ele 元素
     * @param {String} [className] 多个className使用空格分开，留空表示移除所有className
     * @returns {undefined}
     *
     * @example
     * // remove all className
     * attribute.removeClass(ele);
     * attribute.removeClass(ele, 'class');
     * attribute.removeClass(ele, 'class1 class2');
     */
    exports.removeClass = function (ele, className) {
        $(ele).removeClass(className);
        //var eles = typeis.array(ele) ? ele : [ele];
        //
        //dato.each(eles, function (i, ele) {
        //    _class(ele, 1, className);
        //});
    };


    /**
     * 判断元素是否包含某个className
     * @param {HTMLElement|Node} ele 元素
     * @param {String} className 单个className
     * @returns {Boolean}
     *
     * @example
     * attribute.hasClass(ele, 'class');
     */
    exports.hasClass = function (ele, className) {
        return $(ele).hasClass(className);
        //return _class(ele, 2, className);
    };


    /**
     * 获取、设置元素距离文档边缘的 top 距离
     * @param {Object} $ele
     * @param {Number} [val] 距离值
     * @returns {Number|undefined|*}
     *
     * @example
     * // set
     * position.top($ele, 100);
     *
     * // get
     * position.top($ele);
     */
    exports.top = function ($ele, val) {
        var args = allocation.args(arguments);

        if (args.length === 1) {
            return $($ele).offset().top;
        }

        $($ele).offset({
            top: val
        });
        //return _middleware('top', arguments, ['scrollTop']);
    };


    /**
     * 获取、设置元素距离文档边缘的 left 距离
     * @param {Object} $ele
     * @param {Number} [val] 距离值
     * @returns {Number|undefined|*}
     *
     * @example
     * // set
     * position.left($ele, 100);
     *
     * // get
     * position.left($ele);
     */
    exports.left = function ($ele, val) {
        var args = allocation.args(arguments);

        if (args.length === 1) {
            return $($ele).offset().left;
        }

        $($ele).offset({
            left: val
        });
        //return _middleware('left', arguments, ['scrollLeft']);
    };


    /**
     * 获取、设置元素的占位宽度
     * content + padding + border
     * @param {Object} $ele
     * @param {Number} [val] 宽度值
     * @returns {Number|undefined|*}
     *
     * @example
     * // set
     * position.width($ele, 100);
     *
     * // get
     * position.width($ele);
     */
    exports.outerWidth = makeJqueryGetSet('outerWidth');


    /**
     * 获取、设置元素的占位宽度
     * content + padding
     * @param {Object} $ele
     * @param {Number} [val] 宽度值
     * @returns {Number|undefined|*}
     *
     * @example
     * // set
     * position.width($ele, 100);
     *
     * // get
     * position.width($ele);
     */
    exports.innerWidth = makeJqueryGetSet('innerWidth');


    /**
     * 获取、设置元素的占位宽度
     * content
     * @param {Object} $ele
     * @param {Number} [val] 宽度值
     * @returns {Number|undefined|*}
     *
     * @example
     * // set
     * position.width($ele, 100);
     *
     * // get
     * position.width($ele);
     */
    exports.width = makeJqueryGetSet('width');


    /**
     * 获取、设置元素的占位高度
     * content + padding + border
     * @param {Object} $ele
     * @param {Number} [val] 高度值
     * @returns {Number|undefined|*}
     *
     * @example
     * // set
     * position.height(ele, 100);
     *
     * // get
     * position.height(ele);
     */
    exports.outerHeight = makeJqueryGetSet('outerHeight');


    /**
     * 获取、设置元素的占位高度
     * content + padding
     * @param {Object} $ele
     * @param {Number} [val] 高度值
     * @returns {Number|undefined|*}
     *
     * @example
     * // set
     * position.height(ele, 100);
     *
     * // get
     * position.height(ele);
     */
    exports.innerHeight = makeJqueryGetSet('innerHeight');


    /**
     * 获取、设置元素的占位高度
     * content
     * @param {Object} $ele
     * @param {Number} [val] 高度值
     * @returns {Number|undefined|*}
     *
     * @example
     * // set
     * position.height(ele, 100);
     *
     * // get
     * position.height(ele);
     */
    exports.height = makeJqueryGetSet('height');


    ///**
    // * 返回当前文档上处于指定坐标位置最顶层的可见元素,
    // * 坐标是相对于包含该文档的浏览器窗口的左上角为原点来计算的,
    // * 通常 x 和 y 坐标都应为正数.
    // * @param clientX {Number} 元素位置x
    // * @param clientY {Number} 元素位置y
    // * @returns {HTMLElement}
    // * @ref https://github.com/moll/js-element-from-point
    // */
    //exports.getElementFromPoint = function (clientX, clientY) {
    //    if (!isRelativeToViewport) {
    //        clientX += win.pageXOffset;
    //        clientY += win.pageYOffset;
    //    }
    //
    //    return doc.elementFromPoint(clientX, clientY);
    //};

    /**
     * 转换驼峰为分隔字符串
     * @param {String} string 原始字符串
     * @returns {String} string  格式化后的字符串
     * @private
     */
    function _toSepString(string) {
        return regHump.test(string) ?
            string :
            string.replace(regSep, '').replace(regSplit, function ($0) {
                return '-' + $0.toLowerCase();
            });
    }


    /**
     * 转换纯数字的css属性为字符，如：width=100 => width=100px
     * @param {String} key css属性
     * @param {String|Number} val css属性值
     * @returns {*}
     * @private
     */
    function _toCssVal(key, val) {
        val += '';

        if (!REG_PX.test(key) && !REG_DEG.test(key)) {
            return val;
        }

        if (regNum.test(val)) {
            return val.replace(regEndPoint, '') +
                (REG_PX.test(key) ? 'px' : 'deg');
        }

        return val;
    }


    ///**
    // * 是否为有争议的 ele
    // * @param ele
    // * @returns {boolean}
    // * @private
    // */
    //function _isDispute(ele) {
    //    return ele === w || ele === d || ele === b || ele === h;
    //}
});