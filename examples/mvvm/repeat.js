/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-04 11:38
 */


define(function (require, exports, module) {
    'use strict';

    var Mvvm = require('../../src/mvvm/index.js');

    //Mvvm.directive('class', require('../../src/mvvm/directives/class.js'));
    //Mvvm.directive('text', require('../../src/mvvm/directives/text.js'));
    //Mvvm.directive('model', require('../../src/mvvm/directives/model.js'));
    //Mvvm.directive('event', require('../../src/mvvm/directives/event.js'));
    Mvvm.directive('repeat', require('../../src/mvvm/directives/repeat.js'));

    var data = window.data = {
        users: [{
            nickname: '#云淡然',
            tags: [
                '前端',
                'JavaScript',
                'CSS',
                'HTML'
            ]
        }, {
            nickname: '明明',
            tags: [
                '高',
                '富',
                '帅'
            ]
        }]
    };

    window.vm = new Mvvm(document.getElementById('demo'), data);
});
