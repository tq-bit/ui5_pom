/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/Text"],function(e){"use strict";var t={apiVersion:2};var r=sap.ui.getCore().getLibraryResourceBundle("sap.m");t.render=function(r,n){var s=n._getControlsForBreadcrumbTrail(),a=n._getSelect(),o=n._sSeparatorSymbol;r.openStart("nav",n);r.class("sapMBreadcrumbs");r.attr("aria-label",t._getResourceBundleText("BREADCRUMB_LABEL"));r.openEnd();r.openStart("ol");r.openEnd();if(a.getVisible()){this._renderControlInListItem(r,a,o,false,"sapMBreadcrumbsSelectItem")}s.forEach(function(t){this._renderControlInListItem(r,t,o,t instanceof e)},this);r.close("ol");r.close("nav")};t._renderControlInListItem=function(e,t,r,n,s){e.openStart("li");e.class("sapMBreadcrumbsItem");e.class(s);e.openEnd();e.renderControl(t);if(!n){e.openStart("span").class("sapMBreadcrumbsSeparator").openEnd().text(r).close("span")}e.close("li")};t._getResourceBundleText=function(e){return r.getText(e)};return t},true);