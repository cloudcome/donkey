var button1 = document.getElementById('button1');
var button2 = document.getElementById('button2');

button1.onclick = function () {
    c.formValidate();
    c.dataPackage();
    c.ajaxSubmit();
    c.catchResponse();
    c.showDialog();
};

button2.onclick = function () {
    c.formValidate();
    c.dataPackage();
    c.ajaxSubmit();
    c.catchResponse();
    c.showDialog();
};


// main.js
getScript([
    'form-validate.js',
    'data-package.js',
    'data-package.js',
    'ajax-submit.js',
    'catch-response.js',
    'drag.js',
    'animation.js',
    'show-dialog.js'
    // balabala....
], function () {
    // 入口
});


// hello.js
c.register('hello', [
    'dependencyModule'
], function () {
    c.sayHello = function () {
        alert(c.dependencyModule + '呵呵');
    };
});

// main.js
c.use('hello', function () {
    c.sayHello();
});


// hello.js
var dependencyModule = require('path/to/dependencyModule.js');

module.exports = function () {
    console.log(dependencyModule + '呵呵');
};

// main.js
var hello = require('path/to/hello.js');

hello();


// hello.js
define([
    'path/to/dependencyModule.js'
], function (dependencyModule) {
    console.log(dependencyModule + '呵呵');
});

// main.js
define([
    'path/to/hello.js'
], function (hello) {
    hello();
});


// hello.js
define(function (require, exports, module) {
    var dependencyModule = require('path/to/dependencyModule.js');

    module.exports = function () {
        console.log(dependencyModule + '呵呵');
    };
});

// main.js
define(function (require, exports, module) {
    var hello = require('path/to/hello.js');

    hello();
});


define([
    'a',
    'b'
], function (a, b) {
    // balabala...
    a();

    // balabala...
    b();
});

define(function (require) {
    // balabala...
    var a = require('a');
    a();

    // balabala...
    var b = require('b');
    b();
});


// startdate
define(function (require, exports, module) {
    var arrowPng = require('./arrow.png', 'image');
    var template = require('./template.html', 'html');
    var style = require('style.css', 'css');
    var ui = require('path/to/ui.js');

    // balabala

    var StartDate = ui.create({
        constructor: function () {
            // balabala
        }
        // balabala
    });

    module.exports = Startdate;
});


// main.js
define(function (require, exports, module) {
    var Startdate = require('path/to/startdate.js');

    new Startdate();
});

