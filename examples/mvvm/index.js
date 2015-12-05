/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 11:38
 */


define(function (require, exports, module) {
    'use strict';

    var Mvvm = require('../../src/mvvm/index.js');

    Mvvm.directive('class', require('../../src/mvvm/directives/class.js'));
    Mvvm.directive('text', require('../../src/mvvm/directives/text.js'));
    Mvvm.directive('model', require('../../src/mvvm/directives/model.js'));
    Mvvm.directive('event', require('../../src/mvvm/directives/event.js'));

    var data = window.data = {
        username: '#云淡然',
        onClick: function () {
            window.alert('你好，MVVM');
        }
    };

    var mv1 = new Mvvm(document.getElementById('demo'), data);
});