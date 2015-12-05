/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 11:38
 */


define(function (require, exports, module) {
    /**
     * @module parent/observe
     */

    'use strict';

    var _parser = require('../../src/mvvm/_parser/text.js');

    document.getElementById('parse').onclick = function () {
        var ret = _parser(document.getElementById('textarea').value, '{{', '}}');

        document.getElementById('ret').innerHTML = JSON.stringify(ret, null, 4);
    };
});