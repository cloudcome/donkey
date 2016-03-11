/**
 * cookie 操作
 * @author ydr.me
 * @create 2014-10-30 10:42
 * @update 2016年03月09日17:51:13 ydr
 */


define(function (require, exports) {
    /**
     * @module core/navigator/cookie
     * @requires utils/dato
     * @requires utils/typeis
     */
    'use strict';

    require('../../polyfill/json2.js');

    var dato = require('../../utils/dato.js');
    var string = require('../../utils/string.js');
    var typeis = require('../../utils/typeis.js');
    var allocation = require('../../utils/allocation.js');
    var defaults = {
        // 是否以严格模式读取和设置cookie，默认true
        // 严格模式下，将在读之后、写之前都会进行<code>encodeURIComponent</code>、<code>decodeURIComponent</code>操作
        strict: true,
        // 在无域名的时候，必须设置为空才能在本地写入
        domain: location.hostname === 'localhost' ? '' : location.hostname,
        // 默认cookie有效期1个小时（单位毫秒）
        expires: 3600000,
        // 默认cookie存储路径
        path: '/',
        // 是否加密cookie
        secure: false
    };


    exports.defaults = defaults;


    /**
     * 获取当前可读 cookie
     * @param [key] {String} cookie 键，可选，为空时返回所有
     * @param [options] {Object} 配置
     * @param [options.strict=true] {Boolean} 是否严格模式，默认true
     * @returns {String|Object}
     */
    exports.get = function (key, options) {
        return _get(key, options);
    };


    /**
     * 获取当前可读 cookie 的 JSON 格式
     * @param [key] {String} cookie 键，可选，为空时返回所有
     * @param [options] {Object} 配置
     * @param [options.strict=true] {Boolean} 是否严格模式，默认true
     * @returns {String|Object}
     */
    exports.getJSON = function (key, options) {
        var val = exports.get(key, options);

        try {
            return JSON.parse(val);
        } catch (err) {
            return {};
        }
    };


    /**
     * 设置一个或多个 cookie
     * @param key {String}
     * @param val {String}
     * @param [options] {Object} 配置
     * @param [options.strict=true] {Boolean} 是否严格模式，默认true
     * @param [options.domain] {String} 域，默认为 localhost.hostname
     * @param [options.expires=3600000] {Number} 默认为3600，单位s
     * @param [options.path="/"] {String} 路径
     * @param [options.secure=false] {Boolean} 是否加密
     */
    exports.set = function (key, val, options) {
        _set(key, val, options);
    };


    /**
     * 设置一个或多个 cookie
     * @param key {String}
     * @param val {Object}
     * @param [options] {Object} 配置
     * @param [options.strict=true] {Boolean} 是否严格模式，默认true
     * @param [options.domain] {String} 域，默认为 localhost.hostname
     * @param [options.expires=3600] {Number} 默认为3600，单位s
     * @param [options.path="/"] {String} 路径
     * @param [options.secure=false] {Boolean} 是否加密
     */
    exports.setJSON = function (key, val, options) {
        try {
            val = JSON.stringify(val);
        } catch (err) {
            val = '{}';
        }

        _set(key, val, options);
    };


    /**
     * 删除一个或多个 cookie
     * @param key {String|Array}
     * @param [options] {Object} 配置
     * @param [options.strict=true] {Boolean} 是否严格模式，默认true
     * @param [options.domain] {String} 域，默认为 localhost.hostname
     * @param [options.path="/"] {String} 路径
     * @param [options.secure=false] {Boolean} 是否加密
     * @returns {Boolean} true
     */
    exports.remove = function (key, options) {
        if (!typeis.Array(key)) {
            key = [key];
        }
        options = dato.extend(true, {}, defaults, options, {
            expires: -1
        });

        dato.each(key, function (index, _key) {
            _set(_key, '', options);
        });
    };


    /**
     * 获取 cookie
     * @param key {String} 键名
     * @param [options] {Object} 配置
     * @returns {String}
     * @private
     */
    function _get(key, options) {
        if (!key) {
            return '';
        }

        options = dato.extend({}, defaults, options);
        var strict = options.strict;
        var decode = function (val) {
            if (strict) {
                return _decode(val);
            }

            return val;
        };

        var reg = new RegExp('(;\\s|^)' + string.escapeRegExp(key) + '=(.*?)(;\\s|$)');
        var matches = document.cookie.match(reg);

        if (!matches) {
            return decode('');
        }

        return decode(matches[2]);
    }


    /**
     * 设置 cookie
     * @param key
     * @param val
     * @param options
     * @private
     */
    function _set(key, val, options) {
        options = dato.extend({}, defaults, options);

        if (options.strict) {
            key = _encode(key);
            val = _encode(val);
        }

        if (!key) {
            return;
        }

        var d = new Date();
        var ret = [key + '=' + val];

        d.setTime(d.getTime() + options.expires);
        ret.push('expires=' + d.toUTCString());

        if (options.path) {
            ret.push('path=' + options.path);
        }

        if (options.domain) {
            ret.push('domain=' + options.domain);
        }

        if (options.secure) {
            ret.push('secure=secure');
        }

        document.cookie = ret.join(';') + ';';
    }

    /**
     * 编码
     * @param str
     * @returns {string}
     * @private
     */
    function _encode(str) {
        try {
            try {
                str = str.toString();
            } catch (err) {
                str = String(str);
            }

            return encodeURIComponent(str);
        } catch (err) {
            return '';
        }
    }

    /**
     * 解码
     * @param str
     * @returns {string}
     * @private
     */
    function _decode(str) {
        try {
            return decodeURIComponent(str);
        } catch (err) {
            return '';
        }
    }
});