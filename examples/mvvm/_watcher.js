/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-06 15:32
 */


define(function (require, exports, module) {
    /**
     * @module parent/_watcher
     */

    'use strict';

    var watcher = require('../../src/mvvm/_watcher.js');
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
        }],
        onChange: function () {
            data.users[0].tags[0] = Math.random();
        }
    };

    watcher.observe(data, function () {
        console.log(1);
        console.log(arguments);
    });

    watcher.observe(data.users[0], function () {
        console.log(2);
        console.log(arguments);
    });

    setTimeout(data.onChange, 1000);
});