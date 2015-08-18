/**
 * @author lumeixi
 * @author zhangyunlai
 * @create 2015-08-03 20:44:05
 */
define(function (require, exports, module) {
    'use strict';

    /**
     * @module core/communication/upload
     * @requires libs/emitter
     * @requires utils/class
     * @requires utils/dato
     */

    require('../../polyfill/json2.js');

    var Emitter = require('../../libs/emitter.js');
    var klass = require('../../utils/class.js');
    var dato = require('../../utils/dato.js');
    var namespace = 'donkey-core-communication-upload';
    var $ = window.jQuery;
    var supportHtml5 = 'FormData' in window;
    var defaults = {
        // 上传方法
        method: 'post',
        // 上传地址
        url: '',
        // 上传的额外内容
        body: null,
        // A Binary Large OBject
        blob: null,
        dataType: 'json'
    };
    var Upload = klass.extends(Emitter).create({
        constructor: function ($file, options) {
            var the = this;

            the._$file = $($file);
            the._options = dato.extend({}, defaults, options);
        },


        /**
         * 执行上传
         * @returns {Upload}
         */
        upload: function () {
            var the = this;

            if (supportHtml5) {
                the._html5();
            } else {
                the._html4();
            }

            return the;
        },

        // html5
        // XMLHttpRequest
        /**
         * html5 上传
         * @private
         */
        _html5: function () {
            var the = this;
            var options = the._options;
            var fd = new FormData();
            var filename = the._$file[0].value.match(/[^\/]*$/)[0];

            fd.append(the._$file[0].name, options.blob || the._$file[0].files[0], filename);

            dato.each(options.body, function (key, val) {
                fd.append(key, val);
            });

            // @todo 上传进度
            $.ajax({
                url: options.url,
                method: options.method,
                data: fd,
                processData: false,
                contentType: false,
                dataType: options.dataType
            }).done(function (json) {
                the.emit('complete');
                the.emit('success', json);
                the.emit('finish');
            }).fail(function (jqXHR, textStatus, errorThrown) {
                the.emit('complete');
                the.emit('error', new Error(errorThrown));
                the.emit('finish');
            });
        },


        /**
         * html4 上传
         * @private
         */
        _html4: function () {
            // html4
            // form target => iframe[name]
            var the = this;
            var options = the._options;
            var name = namespace + new Date().getTime();
            var $form = $('<form action="' + options.url + '" method="post" enctype="multipart/form-data" target="' + name + '" style="display:none;"></form>').appendTo('body');
            var $iframe = $('<iframe src="javascript:;" name="' + name + '" style="display:none"></iframe>').appendTo('body');
            var iframe = $iframe[0];
            var $clone = the._$file.clone().removeAttr('id').insertAfter(the._$file);

            $form.append(the._$file);
            iframe.onload = function () {
                var text = iframe.contentDocument.body.innerText;

                the._$file.insertAfter($clone);
                $clone.remove();
                $iframe.remove();
                $form.remove();
                the.emit('complete');

                try {
                    the.emit('success', JSON.parse(text));
                } catch (err) {
                    the.emit('error', err);
                }

                the.emit('finish');
            };

            var html = '';

            dato.each(options.body, function (key, val) {
                html += '<input type="text" name="' + key + '" value=' + val + '>';
            });
            html += '<input type="text" name="_responseType" value="text">';
            $form.append(html);

            var $submit = $('<input type="submit">').appendTo($form);

            $submit.trigger('click');
        }
    });

    module.exports = function ($file, options) {
        return new Upload($file, options).upload();
    };
});