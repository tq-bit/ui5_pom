/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Renderer","sap/ui/core/library","sap/ui/core/Core","sap/ui/Device","sap/base/Log","./library","./ListItemBaseRenderer"],function(e,t,n,a,r,i,s){"use strict";var l=i.PopinDisplay;var o=t.VerticalAlign;var d=i.PopinLayout;var p=e.extend(s);p.apiVersion=2;p.render=function(e,t){var n=t.getTable();if(!n){return}s.render.apply(this,arguments);if(t.getVisible()&&n.hasPopin()){this.renderPopin(e,t,n)}};p.renderHighlight=function(e,t){e.openStart("td");e.class("sapMListTblHighlightCell");e.attr("role","presentation");e.attr("aria-hidden","true");e.openEnd();s.renderHighlight.apply(this,arguments);e.close("td")};p.renderNavigated=function(e,t){e.openStart("td");e.class("sapMListTblNavigatedCell");e.attr("role","presentation");e.attr("aria-hidden","true");e.openEnd();s.renderNavigated.apply(this,arguments);e.close("td")};p.renderType=function(e,t){e.openStart("td");e.class("sapMListTblNavCol");e.attr("role","presentation");e.attr("aria-hidden","true");e.openEnd();s.renderType.apply(this,arguments);e.close("td")};p.renderModeContent=function(e,t){e.openStart("td");e.class("sapMListTblSelCol");e.attr("role","presentation");e.attr("aria-hidden","true");e.openEnd();s.renderModeContent.apply(this,arguments);e.close("td")};p.renderCounter=function(e,t){};p.getAriaRole=function(e){return""};p.renderLIAttributes=function(e,t){e.class("sapMListTblRow");var n=t.getVAlign();if(n!=o.Inherit){e.class("sapMListTblRow"+n)}var a=t.getTable();if(a&&a.getAlternateRowColors()){var r=a.indexOfItem(t);if(r%2==0){e.class("sapMListTblRowAlternate")}}if(a&&a.shouldRenderDummyColumn()){e.class("sapMListTblRowHasDummyCell")}};p.renderLIContentWrapper=function(e,t){var a=t.getTable();if(!a){return}var i=a.getColumns(true),s=t.getCells();t._destroyClonedHeaders();i.forEach(function(i,l){var o,d=true,p=s[i.getInitialOrder()];if(!p||!i.getVisible()||i.isPopin()){i.setIndex(-1);return}e.openStart("td",t.getId()+"_cell"+l);e.class("sapMListTblCell");e.attr("data-sap-ui-column",i.getId());if(i){var u=i.getStyleClass(true).split(" ");u&&u.forEach(function(t){e.class(t)});o=i.getHeader();if(o){e.attr("headers",i.getId())}if(!a.hasPopin()&&i.getMergeDuplicates()){var c=i.getMergeFunctionName(),g=c.split("#"),b=g[1],f=g[0];if(typeof p[f]!="function"){r.warning("mergeFunctionName property is defined on "+i+" but this is not function of "+p)}else if(a._bRendering||!p.bOutput){var C=i.getLastValue(),L=p[f](b);if(C===L){d=n.getConfiguration().getAccessibility();p.addStyleClass("sapMListTblCellDupCnt");e.class("sapMListTblCellDup")}else{i.setLastValue(L)}}else if(p.hasStyleClass("sapMListTblCellDupCnt")){e.class("sapMListTblCellDup")}}i.getVAlign()!="Inherit"&&e.style("vertical-align",i.getVAlign().toLowerCase());e.style("text-align",i.getCssAlign());if(i.isHidden()){e.style("display","none");e.attr("aria-hidden","true")}}e.openEnd();if(d){this.applyAriaLabelledBy(o,p);e.renderControl(p)}e.close("td")},this)};p.renderDummyCell=function(e,t){e.openStart("td");e.class("sapMListTblDummyCell");e.attr("role","presentation");e.attr("aria-hidden","true");e.openEnd();e.close("td")};p.applyAriaLabelledBy=function(e,t){if(e&&e.getText&&e.getVisible()&&t.getAriaLabelledBy&&(t.getAriaLabelledBy()||[]).indexOf(e.getId())==-1){t.addAriaLabelledBy(e)}};p.renderPopin=function(e,t,r){t.removePopin();e.openStart("tr",t.getPopin());e.class("sapMListTblSubRow");e.attr("tabindex","-1");if(t.isSelectable()){e.attr("aria-selected",t.getSelected())}e.openEnd();this.renderHighlight(e,t);e.openStart("td",t.getId()+"-subcell");e.class("sapMListTblSubRowCell");e.attr("colspan",r.shouldRenderDummyColumn()?r.getColSpan()+1:r.getColSpan());var i=r.getPopinLayout();if(a.browser.msie||a.browser.edge&&a.browser.version<16){i=d.Block}e.attr("aria-labelledby",this.getAriaAnnouncement(null,"TABLE_POPIN_ROLE_DESCRIPTION"));e.openEnd();e.openStart("div");e.class("sapMListTblSubCnt");e.class("sapMListTblSubCnt"+i);e.openEnd();var s=t.getCells(),o=r.getColumns(true);o.forEach(function(a){if(!a.getVisible()||!a.isPopin()){return}var r=s[a.getInitialOrder()],i=a.getHeader();if(!i&&!r){return}var o=a.getStyleClass().split(" "),d=a.getPopinDisplay();e.openStart("div");e.class("sapMListTblSubCntRow");o&&o.forEach(function(t){e.class(t)});e.openEnd();if(i&&d!=l.WithoutHeader){e.openStart("div").class("sapMListTblSubCntHdr").openEnd();i=i.clone();a.addDependent(i);t._addClonedHeader(i);e.renderControl(i);e.close("div");e.openStart("div").class("sapMListTblSubCntSpr").openEnd();e.text(n.getLibraryResourceBundle("sap.m").getText("TABLE_POPIN_LABEL_COLON"));e.close("div")}if(r){e.openStart("div");e.class("sapMListTblSubCntVal");e.class("sapMListTblSubCntVal"+d);e.openEnd();this.applyAriaLabelledBy(i,r);e.renderControl(r);e.close("div")}e.close("div")},this);e.close("div");e.close("td");this.renderNavigated(e,t);e.close("tr")};p.addLegacyOutlineClass=function(e,t){};p.renderContentLatter=function(e,t){var n=t.getTable();if(n&&n.shouldRenderDummyColumn()){if(!n.hasPopin()){s.renderContentLatter.apply(this,arguments);this.renderDummyCell(e,t)}else{this.renderDummyCell(e,t);s.renderContentLatter.apply(this,arguments)}}else{s.renderContentLatter.apply(this,arguments)}};return p},true);