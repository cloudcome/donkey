/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-08-20 15:30
 */


define(function (require, exports, module) {
    /**
     * @module parent/validation-lang
     */

    'use strict';

    var lang = {
        minLength: {
            input: '${0}不能少于${1}个字符',
            select: '${0}至少需要选择${1}项'
        },
        maxLength: {
            input: '${0}不能超过${1}个字符',
            select: '${0}最多只能选择${1}项'
        },
        least: '${0}至少需要选择${1}项',
        most: '${0}最多只能选择${1}项',
        type: {
            number: '${0}必须是数值格式',
            integer: '${0}必须是整数',
            mobile: '${0}必须是手机号',
            email: '${0}必须是邮箱格式',
            url: '${0}必须是网址'
        },
        required: '${0}不能为空',
        equal: '${0}必须与${1}相同',
        min: '${0}不能小于${1}',
        max: '${0}不能大于${1}',
        step: '${0}步进值必须为${1}'
    };
});