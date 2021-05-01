/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ODataBinding","./lib/_Cache","./lib/_Helper","sap/base/Log","sap/ui/base/SyncPromise","sap/ui/model/BindingMode","sap/ui/model/ChangeReason","sap/ui/model/odata/v4/Context","sap/ui/model/PropertyBinding"],function(e,t,o,n,i,r,s,a,h){"use strict";var u="sap.ui.model.odata.v4.ODataPropertyBinding",d=Object.freeze([]),p={AggregatedDataStateChange:true,change:true,dataReceived:true,dataRequested:true,DataStateChange:true};var l=h.extend("sap.ui.model.odata.v4.ODataPropertyBinding",{constructor:function(t,n,i,r){h.call(this,t,n);e.call(this);if(n.endsWith("/")){throw new Error("Invalid path: "+n)}if(r){this.checkBindingParameters(r,["$$groupId","$$ignoreMessages","$$noPatch"]);this.sGroupId=r.$$groupId;this.bNoPatch=r.$$noPatch;this.setIgnoreMessages(r.$$ignoreMessages)}else{this.sGroupId=undefined}this.oCheckUpdateCallToken=undefined;this.mQueryOptions=this.oModel.buildQueryOptions(o.clone(r),false);this.fetchCache(i);this.oContext=i;this.bHasDeclaredType=undefined;this.bInitial=true;this.vValue=undefined;t.bindingCreated(this)},metadata:{publicMethods:[]}});e(l.prototype);l.prototype.adjustPredicate=function(){};l.prototype.attachEvent=function(e){if(!(e in p)){throw new Error("Unsupported event '"+e+"': v4.ODataPropertyBinding#attachEvent")}return h.prototype.attachEvent.apply(this,arguments)};l.prototype.checkUpdateInternal=function(e,t,h,d){var p=false,l=this.sPath.indexOf("##"),c=l>=0,f=this.oModel.getMetaModel(),g={data:{}},y=this.oModel.resolve(this.sPath,this.oContext),C={forceUpdate:y&&(e||this.oCheckUpdateCallToken&&this.oCheckUpdateCallToken.forceUpdate)},v=this.oType,M=this;this.oCheckUpdateCallToken=C;if(this.bHasDeclaredType===undefined){this.bHasDeclaredType=!!v}if(y&&!this.bHasDeclaredType&&this.sInternalType!=="any"&&!c){v=f.fetchUI5Type(y)}if(arguments.length<4){d=this.oCachePromise.then(function(e){var t,o;if(e){return e.fetchValue(M.lockGroup(h||M.getGroupId()),undefined,function(){p=true;M.fireDataRequested()},M).then(function(t){M.assertSameCache(e);return t})}if(!M.sReducedPath||!M.isResolved()){return undefined}if(M.bRelative&&M.oContext.iIndex===a.VIRTUAL){C.forceUpdate=false}if(!c){return M.oContext.fetchValue(M.sReducedPath,M)}t=M.sPath.slice(0,l);o=M.sPath.slice(l+2);if(o[0]==="/"){o="."+o}return f.fetchObject(o,f.getMetaContext(M.oModel.resolve(t,M.oContext)))}).then(function(e){if(!e||typeof e!=="object"){return e}if(M.sInternalType==="any"&&(M.getBindingMode()===r.OneTime||M.sPath[M.sPath.lastIndexOf("/")+1]==="#"&&!c)){if(c){return e}else if(M.bRelative){return o.publicClone(e)}}n.error("Accessed value is not primitive",y,u)},function(e){M.oModel.reportError("Failed to read path "+y,u,e);if(e.canceled){C.forceUpdate=false;return M.vValue}g={error:e}});if(e&&d.isFulfilled()){if(v&&v.isFulfilled&&v.isFulfilled()){this.setType(v.getResult(),this.sInternalType)}this.vValue=d.getResult()}d=Promise.resolve(d)}return i.all([d,v]).then(function(e){var o=e[1],n=e[0];if(C===M.oCheckUpdateCallToken){M.oCheckUpdateCallToken=undefined;M.setType(o,M.sInternalType);if(C.forceUpdate||M.vValue!==n){M.bInitial=false;M.vValue=n;M._fireChange({reason:t||s.Change})}M.checkDataState()}if(p){M.fireDataReceived(g)}})};l.prototype.deregisterChange=function(){var e=this;this.withCache(function(t,o,n){n.doDeregisterChangeListener(o,e)}).catch(function(t){e.oModel.reportError("Error in deregisterChange",u,t)},"",false,true)};l.prototype.destroy=function(){this.deregisterChange();this.oModel.bindingDestroyed(this);this.oCheckUpdateCallToken=undefined;this.mQueryOptions=undefined;this.vValue=undefined;e.prototype.destroy.call(this);h.prototype.destroy.apply(this,arguments)};l.prototype.doCreateCache=function(e,o){return t.createProperty(this.oModel.oRequestor,e,o)};l.prototype.doFetchQueryOptions=function(){return this.isRoot()?i.resolve(this.mQueryOptions):i.resolve({})};l.prototype.getDependentBindings=function(){return d};l.prototype.getResumePromise=function(){};l.prototype.getValue=function(){return this.vValue};l.prototype.getValueListType=function(){var e=this.getModel().resolve(this.sPath,this.oContext);if(!e){throw new Error(this+" is unresolved")}return this.getModel().getMetaModel().getValueListType(e)};l.prototype.hasPendingChangesInDependents=function(){return false};l.prototype.initialize=function(){if(this.isResolved()){if(this.getRootBinding().isSuspended()){this.sResumeChangeReason=s.Change}else{this.checkUpdate(true)}}};l.prototype.isMeta=function(){return this.sPath.includes("##")};l.prototype.onChange=function(e){this.checkUpdateInternal(undefined,undefined,undefined,e)};l.prototype.refreshInternal=function(e,t,o){if(this.isRootBindingSuspended()){this.sResumeChangeReason=s.Refresh;return i.resolve()}this.fetchCache(this.oContext);return o?this.checkUpdateInternal(false,s.Refresh,t):i.resolve()};l.prototype.requestValue=function(){var e=this;return Promise.resolve(this.checkUpdateInternal().then(function(){return e.getValue()}))};l.prototype.requestValueListInfo=function(e){var t=this.getModel().resolve(this.sPath,this.oContext);if(!t){throw new Error(this+" is unresolved")}return this.getModel().getMetaModel().requestValueListInfo(t,e,this.oContext)};l.prototype.requestValueListType=function(){var e=this.getModel().resolve(this.sPath,this.oContext);if(!e){throw new Error(this+" is unresolved")}return this.getModel().getMetaModel().requestValueListType(e)};l.prototype.resetChangesInDependents=function(){};l.prototype.resetInvalidDataState=function(){if(this.getDataState().isControlDirty()){this._fireChange({reason:s.Change})}};l.prototype.resume=function(){throw new Error("Unsupported operation: resume")};l.prototype.resumeInternal=function(e){var t=this.sResumeChangeReason;this.sResumeChangeReason=undefined;this.fetchCache(this.oContext);if(e){this.checkUpdateInternal(false,t)}};l.prototype.setContext=function(e){if(this.oContext!==e){if(this.bRelative){this.deregisterChange()}this.oContext=e;this.sResumeChangeReason=undefined;if(this.bRelative){this.fetchCache(this.oContext);this.checkUpdateInternal(this.bInitial,s.Context)}}};l.prototype.setType=function(e){var t=this.oType;if(e&&e.getName()==="sap.ui.model.odata.type.DateTimeOffset"){e.setV4()}h.prototype.setType.apply(this,arguments);if(!this.bInitial&&t!==e){this._fireChange({reason:s.Change})}};l.prototype.setValue=function(e,t){var o,n=this;function i(e){n.oModel.reportError("Failed to update path "+n.oModel.resolve(n.sPath,n.oContext),u,e);return e}this.checkSuspended();if(this.bNoPatch&&t){throw i(new Error("Must not specify a group ID ("+t+") with $$noPatch"))}this.oModel.checkGroupId(t);if(typeof e==="function"||e&&typeof e==="object"){throw i(new Error("Not a primitive value"))}if(!this.bNoPatch&&this.vValue===undefined){throw i(new Error("Must not change a property before it has been read"))}if(this.vValue!==e){if(this.oCache){i(new Error("Cannot set value on this binding as it is not relative"+" to a sap.ui.model.odata.v4.Context"));return}o=this.bNoPatch?null:this.lockGroup(t,true,true);this.oContext.doSetProperty(this.sPath,e,o).catch(function(e){if(o){o.unlock(true)}i(e)})}};l.prototype.supportsIgnoreMessages=function(){return true};l.prototype.suspend=function(){throw new Error("Unsupported operation: suspend")};l.prototype.visitSideEffects=function(){};return l});