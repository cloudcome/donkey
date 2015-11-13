/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-09 13:01
 */


define(function (require, exports, module) {
    'use strict';

    var dato = require('../../src/utils/dato.js');
    var Avalon = window.Avalon;
    var avalon = window.avalon;
    var $div1 = document.getElementById('div1');
    var type = 'important';

    var newAv = function (ele) {
        var data = {
            name: Math.random(),
            age: Math.random()
        };

        new Avalon({
            el: ele,
            data: data
        });

        //data.$id = ele.id;
        //avalon.define(data);
        //avalon.scan();
    };

    $div1.setAttribute('ms-' + type, $div1.id);
    newAv($div1);
    document.getElementById('push').onclick = function () {
        var $divList = $div1.getElementsByTagName('div');
        var divLength = $divList.length;
        var $lastDiv = $divList[divLength - 1];
        var $newDiv = document.createElement('div');

        $lastDiv = $lastDiv || $div1;
        divLength += 2;
        $newDiv.id = 'div' + divLength;
        $newDiv.setAttribute('ms-' + type, $newDiv.id);
        $newDiv.innerHTML = '<h2>div' + divLength + '</h2>' +
            'name:{{name}}' +
            '<input type="text" ms-duplex="name"><br>' +
            'age:{{age}}' +
            '<input type="text" ms-duplex="age"><br>';
        $lastDiv.appendChild($newDiv);
        newAv($newDiv);
    };


    //// 原始方法
    //avalon.define({
    //    $id: 'div1',
    //    name: 'aaaa',
    //    age: 20
    //});
    //avalon.define({
    //    $id: 'div2',
    //    name: 'bbbb'
    //});
    //avalon.define({
    //    $id: 'div3',
    //    name: 'cccc'
    //});
    //avalon.scan();
});