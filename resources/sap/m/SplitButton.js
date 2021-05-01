/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","./Button","./ButtonRenderer","sap/ui/core/EnabledPropagator","sap/ui/core/IconPool","sap/ui/core/library","sap/ui/Device","sap/ui/core/InvisibleText","./SplitButtonRenderer","sap/ui/events/KeyCodes"],function(t,e,r,o,i,n,a,s,p,u,l){"use strict";var c=a.TextDirection;var y=t.ButtonType;var f=e.extend("sap.m.SplitButton",{metadata:{interfaces:["sap.m.IOverflowToolbarContent"],library:"sap.m",properties:{text:{type:"string",group:"Misc",defaultValue:null},type:{type:"sap.m.ButtonType",group:"Appearance",defaultValue:y.Default},width:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:null},enabled:{type:"boolean",group:"Behavior",defaultValue:true},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},activeIcon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},iconDensityAware:{type:"boolean",group:"Misc",defaultValue:true},textDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:c.Inherit}},aggregations:{_textButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"},_arrowButton:{type:"sap.m.Button",multiple:false,visibility:"hidden"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{press:{},arrowPress:{}}}});i.call(f.prototype);f.prototype.onAfterRendering=function(){var t=this._getTextButton().$(),e=this._getArrowButton().$();t.attr("tabindex","-1");e.attr("tabindex","-1");t.removeAttr("title");e.removeAttr("title");t.removeAttr("aria-describedby");e.removeAttr("aria-describedby")};f.prototype._handleAction=function(t){if(t){this.fireArrowPress()}else{this.firePress()}};f.prototype.setArrowState=function(t){var e=this.getAggregation("_arrowButton");if(!e){return}if(t){e.$().addClass("sapMSBActive")}else{e.$().removeClass("sapMSBActive")}};f.prototype._getTextButton=function(){var t=this.getAggregation("_textButton");if(!t){t=new r({width:"100%",icon:this.getIcon(),text:this.getText(),press:this._handleAction.bind(this,false)}).addStyleClass("sapMSBText");if(s.browser.msie){t.addStyleClass("sapMSBTextIE")}this.setAggregation("_textButton",t)}return t};f.prototype._getArrowButton=function(){var t=this.getAggregation("_arrowButton");if(!t){t=new r({icon:"sap-icon://slim-arrow-down",press:this._handleAction.bind(this,true),tooltip:sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("SPLIT_BUTTON_ARROW_TOOLTIP"),ariaHasPopup:a.aria.HasPopup.Menu}).addStyleClass("sapMSBArrow");this.setAggregation("_arrowButton",t)}return t};f.prototype.setProperty=function(t,o,i){if(t==="type"&&(o===y.Up||o===y.Back||o===y.Unstyled)){return this}var n=e.prototype.setProperty.apply(this,arguments);if(t==="activeIcon"||t==="iconDensityAware"||t==="textDirection"){r.prototype.setProperty.apply(this._getTextButton(),arguments)}else if(t==="text"||t==="type"||t==="icon"){var a="set"+g(t);r.prototype[a].call(this._getTextButton(),o);if(t==="type"){r.prototype[a].call(this._getArrowButton(),o)}}return n};function g(t){return t.charAt(0).toUpperCase()+t.slice(1)}f.prototype.onkeydown=function(t){if(t.which===l.SPACE){t.preventDefault()}if(t.which===l.ENTER){this._getTextButton().firePress({})}};f.prototype.onkeyup=function(t){if(t.which===l.SPACE){this._getTextButton().firePress({})}};f.prototype.onsapup=function(t){this._getArrowButton().firePress()};f.prototype.onsapdown=function(t){this._getArrowButton().firePress()};f.prototype.onsapupmodifiers=function(t){this._getArrowButton().firePress()};f.prototype.onsapdownmodifiers=function(t){this._getArrowButton().firePress()};f.prototype.onsapshow=function(t){this._getArrowButton().firePress();t.preventDefault()};f.prototype.getButtonTypeAriaLabelId=function(){var t=this._getTextButton().getType();return o.getButtonTypeAriaLabelId(t)};f.prototype.getTitleAttributeValue=function(){var t=this.getTooltip_AsString(),e=n.getIconInfo(this.getIcon()),r;if(t||e&&e.text&&!this.getText()){r=t||e.text}return r};f.prototype.getOverflowToolbarConfig=function(){var t={canOverflow:true,propsUnrelatedToSize:["enabled","type","icon","activeIcon"],autoCloseEvents:["press"]};return t};return f});