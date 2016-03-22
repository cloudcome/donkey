/**
 * 文件描述
 * @author ydr.me
 * @create 2016-02-15 10:08
 */


define(function (require, exports, module) {
    'use strict';

    var win = window;
    var doc = win.document;
    var tinymce = win.tinymce;
    var PluginManager = require("../../classes/AddOnManager").PluginManager;
    var controller = require('../../../../utils/controller.js');
    var attribute = require('../../../../core/dom/attribute.js');
    var event = require('../../../../core/event/base.js');
    var ui = require('../../../../ui/index.js');

    PluginManager.add('auto-fixed-toolbar', function (editor) {
        var resize = function (eve) {
            if (editor.destroyed) {
                return;
            }

            var toolbarEle = editor.theme.getToolbar();

            if (!toolbarEle) {
                return;
            }

            var containerEle = editor.getContainer();
            var scrollTop = attribute.scrollTop(win);
            var containerTop = attribute.top(containerEle);
            var winScrollLeft = attribute.scrollLeft(win);
            var toolbarHeight = attribute.height(toolbarEle);
            var containerHeight = attribute.height(containerEle);
            var containerLeft = attribute.left(containerEle);

            if (scrollTop > containerTop && scrollTop < containerTop + containerHeight - toolbarHeight) {
                attribute.css(toolbarEle, {
                    position: 'fixed',
                    width: attribute.innerWidth(containerEle),
                    top: 0,
                    zIndex: ui.getZindex(),
                    left: containerLeft - winScrollLeft
                });
                attribute.css(containerEle, 'padding-top', attribute.outerHeight(toolbarEle));
            } else {
                attribute.css(toolbarEle, {
                    position: 'static',
                    width: 'auto',
                    top: 'auto',
                    zIndex: 'auto',
                    left: 'auto'
                });
                attribute.css(containerEle, 'padding-top', 0);
            }
        };

        event.on(win, 'scroll resize', controller.debounce(resize, 10));
        event.on(doc, 'scroll', controller.debounce(resize, 10));

        // Add appropriate listeners for resizing content area
        editor.on("nodechange setcontent keyup FullscreenStateChanged", controller.debounce(resize, 10));

        if (editor.getParam('auto_fixed_toolbar_on_init', true)) {
            editor.on('init', controller.once(resize));
        }

        // Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
        editor.addCommand('mceAutoResize', resize);
    });
});