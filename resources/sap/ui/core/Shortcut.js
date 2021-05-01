/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/util/ShortcutHelper","sap/base/assert","sap/ui/dom/jquery/control"],function(t,e,r){"use strict";var o={register:function(e,r,o){if(!e){throw new Error("Shortcut.register: oScopeControl must be given.")}if(typeof o!=="function"){throw new Error("Shortcut.register: a function fnCallback must be given.")}var i=t.getNormalizedShortcutSpec(r);t.validateKeyCombination(i);var n=t.findShortcut(e,i);if(n){throw new Error("Same shortcut is already registered on this element")}function u(){var t=document.activeElement,e=document.createElement("span"),r=sap.ui.getCore().getStaticAreaRef();e.setAttribute("tabindex",0);e.setAttribute("id","sap-ui-shortcut-focus");e.style.position="absolute";e.style.top="50%";e.style.bottom="50%";e.style.left="50%";e.style.right="50%";r.appendChild(e);e.focus();t.focus();r.removeChild(e);o.apply(null,arguments)}var a={};a["onkeydown"]=t.handleKeydown.bind(null,i,r,u);e.addEventDelegate(a);var c=e.data("sap.ui.core.Shortcut");if(!c){c=[];e.data("sap.ui.core.Shortcut",c)}c.push({shortcutSpec:i,platformIndependentShortcutString:t.getNormalizedShortcutString(i),delegate:a})},isRegistered:function(r,o){e(r,"Shortcut.isRegistered: oScopeControl must be given.");var i=t.getNormalizedShortcutSpec(o);return!!t.findShortcut(r,i)},unregister:function(r,o){e(r,"Shortcut.unregister: oScopeControl must be given.");var i=t.getNormalizedShortcutSpec(o);var n=t.findShortcut(r,i);if(n){r.removeEventDelegate(n.delegate);var u=r.data("sap.ui.core.Shortcut");var a=u.indexOf(n);u.splice(a,1);return true}return false}};return o});