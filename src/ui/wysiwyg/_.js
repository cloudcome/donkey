/*!
 * froala_editor v2.0.5 (https://www.froala.com/wysiwyg-editor)
 * License https://froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */

!function (a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = function (b, c) {
        return void 0 === c && (c = "undefined" != typeof window ? require("jquery") : require("jquery")(b)), a(c), c
    } : a(jQuery)
}(function (a) {
    "use strict";
    a.extend(a.FroalaEditor.DEFAULTS, {
        codeMirror: !0,
        codeMirrorOptions: {
            lineNumbers: !0,
            tabMode: "indent",
            indentWithTabs: !0,
            lineWrapping: !0,
            mode: "text/html",
            tabSize: 2
        }
    }), a.FroalaEditor.PLUGINS.codeView = function (b) {
        function c() {
            return b.$box.hasClass("fr-code-view")
        }

        function d() {
            return k ? k.getValue() : j.val()
        }

        function e(a) {
            var c = d();
            b.html.set(c), b.$el.blur(), b.$tb.find(" > .fr-command").not(a).removeClass("fr-disabled"), a.removeClass("fr-active"), b.events.focus(!0), b.placeholder.refresh(), b.undo.saveStep()
        }

        function f(a, c) {
            !k && b.opts.codeMirror && "undefined" != typeof CodeMirror && (k = CodeMirror.fromTextArea(j.get(0), b.opts.codeMirrorOptions)), b.undo.saveStep(), b.html.cleanWhiteTags(!0), b.core.hasFocus() && (b.selection.save(), b.$el.find('.fr-marker[data-type="true"]:first').replaceWith('<span class="fr-tmp fr-sm">F</span>'), b.$el.find('.fr-marker[data-type="false"]:last').replaceWith('<span class="fr-tmp fr-em">F</span>'), b.$el.blur());
            var d = b.html.get(!1, !0);
            b.$el.find("span.fr-tmp").remove(), d = d.replace(/<span class="fr-tmp fr-sm">F<\/span>/, "FROALA-SM"), d = d.replace(/<span class="fr-tmp fr-em">F<\/span>/, "FROALA-EM"), b.codeBeautifier && (d = b.codeBeautifier.run(d, {
                end_with_newline: !0,
                indent_inner_html: !0,
                extra_liners: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "ul", "ol", "table"],
                brace_style: "expand",
                indent_char: "	",
                indent_size: 1,
                wrap_line_length: 0
            }));
            var e, f;
            if (k) {
                e = d.indexOf("FROALA-SM"), f = d.indexOf("FROALA-EM"), e > f ? e = f : f -= 9, d = d.replace(/FROALA-SM/g, "").replace(/FROALA-EM/g, "");
                var g = d.substring(0, e).length - d.substring(0, e).replace(/\n/g, "").length, h = d.substring(0, f).length - d.substring(0, f).replace(/\n/g, "").length;
                e = d.substring(0, e).length - d.substring(0, d.substring(0, e).lastIndexOf("\n") + 1).length, f = d.substring(0, f).length - d.substring(0, d.substring(0, f).lastIndexOf("\n") + 1).length, k.setSize(null, Math.max(c, 150)), k.setValue(d), k.focus(), k.setSelection({
                    line: g,
                    ch: e
                }, {line: h, ch: f}), k.refresh(), k.clearHistory()
            } else e = d.indexOf("FROALA-SM"), f = d.indexOf("FROALA-EM") - 9, j.css("height", c), j.val(d.replace(/FROALA-SM/g, "").replace(/FROALA-EM/g, "")), j.focus(), j.get(0).setSelectionRange(e, f);
            b.$tb.find(" > .fr-command").not(a).addClass("fr-disabled"), a.addClass("fr-active"), !b.helpers.isMobile() && b.opts.toolbarInline && b.toolbar.hide()
        }

        function g() {
            var a = b.$tb.find('.fr-command[data-cmd="html"]');
            if (c())b.$box.toggleClass("fr-code-view", !1), e(a); else {
                b.popups.hideAll();
                var d = b.$wp.outerHeight();
                b.$box.toggleClass("fr-code-view", !0), f(a, d)
            }
        }

        function h() {
            c() && (g(b.$tb.find('button[data-cmd="html"]')), j.val("").removeData().remove()), l && l.remove()
        }

        function i() {
            if (!b.$wp)return !1;
            j = a('<textarea class="fr-code" tabindex="-1">'), b.$wp.append(j), j.attr("dir", b.opts.direction);
            var e = function () {
                return !c()
            };
            b.opts.toolbarInline && (l = a('<a data-cmd="html" title="Code View" class="fr-command fr-btn html-switch' + (b.helpers.isMobile() ? "" : " fr-desktop") + '" role="button" tabindex="-1"><i class="fa fa-code"></i></button>'), b.$box.append(l), b.events.bindClick(b.$box, "a.html-switch", function () {
                g(b.$tb.find('button[data-cmd="html"]'))
            })), b.events.on("buttons.refresh", e), b.events.on("copy", e, !0), b.events.on("cut", e, !0), b.events.on("paste", e, !0), b.events.on("destroy", h, !0), b.events.on("form.submit", function () {
                c() && (b.html.set(d()), b.events.trigger("contentChanged", [], !0))
            }, !0)
        }

        var j, k, l;
        return {_init: i, toggle: g, isActive: c, get: d}
    }, a.FroalaEditor.RegisterCommand("html", {
        title: "Code View",
        undo: !1,
        focus: !1,
        forcedRefresh: !0,
        callback: function () {
            this.codeView.toggle()
        }
    }), a.FroalaEditor.DefineIcon("html", {NAME: "code"})
});