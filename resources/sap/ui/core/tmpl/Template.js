/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/ui/base/BindingParser","sap/ui/core/Control","sap/ui/core/RenderManager","sap/base/util/ObjectPath","sap/base/Log","sap/base/assert","sap/ui/thirdparty/jquery"],function(e,t,r,a,n,i,o,s){"use strict";var p=e.extend("sap.ui.core.tmpl.Template",{constructor:function(t,r){e.apply(this,arguments)},metadata:{stereotype:"template",abstract:true,library:"sap.ui.core",properties:{content:{type:"string",group:"Data",defaultValue:null}},publicMethods:["declareControl","createControl","placeAt","createMetadata","createRenderer"]}});var c={};p.prototype.register=function(){var e=this.getId(),t=c[e],r;if(t&&this!==t){r="adding template with duplicate id '"+e+"'";i.error(r);throw new Error("Error: "+r)}c[e]=this};p.prototype.deregister=function(){delete c[this.getId()]};p.byId=function(e){return c[e]};p.prototype.getInterface=function(){return this};p._mSupportedTypes={};p.registerType=function(e,t){p._mSupportedTypes[e]=t};p.unregisterType=function(e){delete p._mSupportedTypes[e]};p.parsePath=function(e){var t,r=e.indexOf(">");if(r>0){t=e.substr(0,r);e=e.substr(r+1)}return{path:e,model:t}};p.prototype.init=function(a,n){if(this.getMetadata().getName()==="sap.ui.core.tmpl.Template"){throw new Error("The class 'sap.ui.core.tmpl.Template' is abstract and must not be instantiated!")}if(e.bindingParser===t.complexParser){p.prototype.extractBindingInfo=function(a,n,i){e.bindingParser=t.simpleParser;var o=r.prototype.extractBindingInfo.apply(this,arguments);e.bindingParser=t.complexParser;return o}}};p.prototype.declareControl=function(e){o(!!e,"A fully qualified name must be specified!");if(e){var t=this.createMetadata(),r=this.createRenderer(),a=this;var i=sap.ui.requireSync("sap/ui/core/tmpl/TemplateControl");i.extend(e,{metadata:t,init:function(){i.prototype.init.apply(this,arguments);this.setTemplate(a)},renderer:{renderTemplate:r,hasControlData:t._hasControlData}});return n.get(e||"")}};p.prototype.createControl=function(e,t,r){var a=sap.ui.requireSync("sap/ui/core/tmpl/TemplateControl");var n=new a({id:e,template:this,context:t});n.setTemplateRenderer(this.createRenderer(r));return n};p.prototype.placeAt=function(e,t,n,i){if(typeof t==="string"||typeof t==="number"){n=t;t=undefined}var o;if(!(e instanceof r)&&i){var p=typeof e==="string"?s(document.getElementById(e)):s(e);if(p.length>0){o=p.attr("id");e=p.get(0);var c=p.attr("data-context");t=t||c&&JSON.parse(c);a.markInlineTemplate(p)}}var l=this.createControl(o,t);l.placeAt(e,n);return l};p.prototype.createMetadata=function(){i.error("The function createMetadata is an abstract function which needs to be implemented by subclasses.")};p.prototype.createRenderer=function(){i.error("The function createRenderer is an abstract function which needs to be implemented by subclasses.")};sap.ui.template=function(e){var t=function(e){i.warning("The usage of Template Views is deprecated since 1.56. Please make use of the asynchronous create functions of the different view classes, e.g. XMLView.create()","Deprecation",null,function(){return{type:"sap.ui.template",name:e}})};if(!e){var r=[];s.each(p._mSupportedTypes,function(e,t){s("script[type='"+e+"'], [data-type='"+e+"']").each(function(a,n){r.push(sap.ui.template({id:n.id,domref:n,type:e,_class:t}))})});return r}else{if(typeof e==="string"){return sap.ui.template({id:e})}else if(e&&e.tagName&&e.nodeName&&e.ownerDocument&&e.nodeType===1){return sap.ui.template({id:e.id,domref:e})}e=s.extend({type:p.DEFAULT_TEMPLATE},e);t(e.id);var a,o,c,l,u=false,d=typeof e.src==="string",f=false;if(d){s.ajax({url:e.src,dataType:"text",async:false,success:function(t){a=e.id;o=e.type;c=e.control;l=t;var r=/^<!--\sUI5:Template\stype=([a-z\/\-]*)\s(?:controller=([A-Za-z.]*)\s)?-->/,n=l.match(r);if(n){o=n[1];if(n.length==3){u=n[2]}l=l.substr(n[0].length)}},error:function(){throw new Error("The template could not be loaded from "+e.src+"!")}})}else{var m=e.domref||(e.id?window.document.getElementById(e.id):null),h=s(m);f=false;a=e.id||m&&m.id;o=h.attr("type")||e.type;c=h.attr("data-control")||e.control;if(a){var y=sap.ui.getCore().getTemplate(a);if(!y instanceof p){throw new Error('Object for id "'+a+'" is no sap.ui.core.tmpl.Template!')}else{if(y){return y}}}if(h.length===0){throw new Error('DOM element for the Template with the id "'+a+'" not found!')}l=h.html();var g=m.tagName.toLowerCase();if(g!=="script"){f=h.parents("body").length===1}}var T=e._class;if(!T){T=p._mSupportedTypes[o];if(!T){throw new Error('The type "'+o+'" is not supported.')}}var b=sap.ui.requireSync(T.replace(/\./g,"/"));b=b||n.get(T||"");var w=new b({id:a,content:l});if(c){w.declareControl(c)}if(u){w._sControllerName=u}if(f){w.placeAt(a,e.context,undefined,true)}return w}};p.DEFAULT_TEMPLATE="text/x-handlebars-template";p.registerType(p.DEFAULT_TEMPLATE,"sap.ui.core.tmpl.HandlebarsTemplate");return p});