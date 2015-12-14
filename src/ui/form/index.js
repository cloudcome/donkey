/**
 * 文件描述
 * @author ydr.me
 * @create 2015-12-14 11:49
 */


define(function (require, exports, module) {
    /**
     * @module ui/form
     */

    'use strict';

    var Validation = require('../validation/index.js');
    var typeis = require('../../utils/typeis.js');

    var defaults = {
        // true: 返回单个错误对象
        // false: 返回错误对象组成的数组
        // 浏览器端，默认为 false
        // 服务器端，默认为 true
        breakOnInvalid: typeis.window(window) ? false : true,
        defaultMsg: '${path}不合法',
        // 规则的 data 属性
        dataValidation: 'validation',
        dataAlias: 'alias',
        // data 规则分隔符
        dataSep: ',',
        // data 规则等于符
        dataEqual: ':',
        // 验证的表单项目选择器
        inputSelector: 'input,select,textarea',
        // 表单项目选择器
        itemSelector: '.form-item',
        // 表单提交选择器
        submitSelector: 'button[type="submit"],input[type="submit"]',
        // 验证消息类
        itemMsgClass: 'form-msg',
        // 验证合法时，添加的样式类
        itemSuccessClass: 'has-success',
        // 验证非法时，添加的样式类
        itemErrorClass: 'has-error',
        // 验证合法时，显示消息
        validMsg: '填写合法',
        // 验证非法时，是否自动聚焦
        invalidAutoFocus: true,
        // 表单输入框验证事件
        inputValidateEvent: 'input change',
        contentType: 'multipart/form-data',
        // 是否滚动到非法处
        scrollToInvalid: true,
        // 是否聚焦非法处
        focusOnInvalid: true,
        // 是否调试模式，调试模式则不会提交表单
        debug: false,
        focusDuration: 345,
        focusEasing: 'swing'
    };
    module.exports = {};
});