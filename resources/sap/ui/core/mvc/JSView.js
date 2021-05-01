/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./View","./JSViewRenderer","sap/base/util/extend","sap/base/util/merge","sap/ui/base/ManagedObject","sap/ui/core/library","sap/base/Log"],function(e,i,t,n,r,s,o){"use strict";var a=e.extend("sap.ui.core.mvc.JSView",{metadata:{library:"sap.ui.core"}});var c={};a.asyncSupport=true;a._sType="JS";var p=s.mvc.ViewType;a.create=function(i){var n=t({},i);for(var r in n){if(r==="definition"||r==="preprocessors"){delete n[r];o.warning("JSView.create does not support the options definition or preprocessor!")}}n.type=p.JS;return e.create(n)};sap.ui.jsview=function(e,i,t){var n=function(t){o[t]("Do not use deprecated view factory functions. "+"Use the static create function on the specific view module instead: [XML|JS|HTML|JSON]View.create().","sap.ui.view",null,function(){return{type:"sap.ui.view",name:e||i&&i.name}})};if(i&&i.async){n("info")}else{n("warning")}return u.apply(this,arguments)};function u(e,i,t){var n={},r;if(i&&typeof i=="string"){n.viewName=i;if(typeof arguments[2]=="boolean"){n.async=t}else if(typeof arguments[2]=="object"){n.controller=arguments[2];n.async=!!arguments[3]}r=new a(e,n);return r}else if(i&&typeof i=="object"){c[e]=i;sap.ui.loader._.declareModule(e.replace(/\./g,"/")+".view.js");o.info("For defining views use JSView.extend instead.")}else if(arguments.length==1&&typeof e=="string"||arguments.length==2&&typeof arguments[0]=="string"&&typeof arguments[1]=="boolean"){n.viewName=arguments[0];n.async=!!arguments[1];r=n.id?new a(n.id,n):new a(n);return r}else{throw new Error("Wrong arguments ('"+e+"', '"+i+"')! Either call sap.ui.jsview([sId,] sViewName) to instantiate a View or sap.ui.jsview(sViewName, oViewImpl) to define a View type.")}}a.prototype.initViewSettings=function(e){var i;if(!c[e.viewName]){var t=e.viewName.replace(/\./g,"/")+".view";if(e.async){i=new Promise(function(e,i){sap.ui.require([t],e,i)})}else{sap.ui.requireSync(t)}}if(e.async){return Promise.resolve(i).then(function(){n(this,c[e.viewName])}.bind(this))}n(this,c[e.viewName])};a.prototype.onControllerConnected=function(e){r.runWithPreprocessors(function(){this.applySettings({content:this.createContent(e)})},{id:this.getAutoPrefixId()?this.createId.bind(this):undefined,settings:this._fnSettingsPreprocessor},this)};a.prototype.getAutoPrefixId=function(){return false};return a});