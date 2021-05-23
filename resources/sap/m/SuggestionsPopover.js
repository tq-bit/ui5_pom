/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/ui/base/EventProvider","sap/ui/core/InvisibleText","sap/ui/core/ListItem","sap/ui/core/ResizeHandler","sap/ui/core/ValueStateSupport","sap/m/library","sap/ui/core/library","sap/m/Bar","sap/m/Toolbar","sap/m/Button","sap/m/ToggleButton","sap/m/ColumnListItem","sap/m/GroupHeaderListItem","sap/ui/core/SeparatorItem","sap/m/Dialog","sap/m/List","sap/m/Popover","sap/m/StandardListItem","sap/m/Table","sap/m/Title","sap/ui/core/IconPool","sap/ui/events/KeyCodes","sap/m/ValueStateHeader","sap/m/inputUtils/highlightDOMElements","sap/m/inputUtils/scrollToItem"],function(e,t,s,o,i,a,n,r,u,p,l,h,d,_,c,g,f,S,v,I,m,P,y,b,V,C){"use strict";var L=n.ListMode;var T=n.PlacementType;var H=n.ListType;var w=n.ListSeparators;var A="sapMSuggestionsPopover",M="sapUiNoContentPadding";var x=r.ValueState;var F=t.extend("sap.m.SuggestionsPopover",{constructor:function(s){t.apply(this,arguments);this._oInput=s;this._bHasTabularSuggestions=false;this._bUseDialog=e.system.phone;this._iPopupListSelectedIndex=-1;this._sPopoverContentWidth=null;this._bEnableHighlighting=true;this._bIsInputIncrementalType=false;this._bAutocompleteEnabled=false;this._sTypedInValue="";this._sOldValueState=x.None;this._oInput.addEventDelegate({onsapup:function(e){if(!this._oInput.isComposingCharacter()){this._onsaparrowkey(e,"up",1)}},onsapdown:function(e){if(!this._oInput.isComposingCharacter()){this._onsaparrowkey(e,"down",1)}},onsappageup:function(e){this._onsaparrowkey(e,"up",5)},onsappagedown:function(e){this._onsaparrowkey(e,"down",5)},onsaphome:function(e){var t;if(this._oList){t=this._oList.getItems().length?this._oList.getItems().length-1:0;this._onsaparrowkey(e,"up",t)}},onsapend:function(e){if(this._oList){this._onsaparrowkey(e,"down",this._oList.getItems().length)}},onsapright:this._onsapright,onsaptabnext:this._handleValueStateLinkNav,onsaptabprevious:this._handleValueStateLinkNav},this)},destroy:function(){if(this._oPopover){this._oPopover.destroy();this._oPopover=null}if(this._oList){this._oList.destroy();this._oList=null}this._oProposedItem=null;this._oInputDelegate=null;this._oValueStateHeader=null;if(this._oPickerValueStateText){this._oPickerValueStateText.destroy();this._oPickerValueStateText=null}}});F.M_EVENTS={SELECTION_CHANGE:"selectionChange"};F.prototype.isOpen=function(){return this._oPopover&&this._oPopover.isOpen()};F.prototype.setInputLabels=function(e){this._fnInputLabels=e};F.prototype._getInputLabels=function(){return this._fnInputLabels()};F.prototype.updatePickerHeaderTitle=function(){var e=sap.ui.getCore().getLibraryResourceBundle("sap.m"),t=this.getPickerTitle(),s,o;if(!t){return}o=this._getInputLabels();if(o.length){s=o[0];if(s&&typeof s.getText==="function"){t.setText(s.getText())}}else{t.setText(e.getText("COMBOBOX_PICKER_TITLE"))}return t};F.prototype.getPickerTitle=function(){return this._oPopover.getCustomHeader().getContentMiddle()[0]};F.prototype.getOkButton=function(){var e=this._oPopover&&this._oPopover.getBeginButton();return e||null};F.prototype.getCancelButton=function(){var e=this._oPopover&&this._oPopover.getCustomHeader()&&this._oPopover.getCustomHeader().getContentRight&&this._oPopover.getCustomHeader().getContentRight()[0];return e||null};F.prototype.getFilterSelectedButton=function(){var e=this._oPopover&&this._oPopover.getSubHeader()&&this._oPopover.getSubHeader().getContent()[1];return e||null};F.prototype._createFilterSelectedButton=function(){var e=P.getIconURI("multiselect-all");return new h({icon:e})};F.prototype._createSuggestionPopup=function(e){e=e||[];var t=this._oInput,o=this,i=t._oRb;this._oPopover=!this._bUseDialog?new S(t.getId()+"-popup",{showArrow:false,placement:T.VerticalPreferredBottom,showHeader:true,initialFocus:t,horizontalScrolling:true,beforeClose:function(){if(o.bMessageValueStateActive){o._getValueStateHeader().removeStyleClass("sapMPseudoFocus");o.bMessageValueStateActive=false}}}):new g(t.getId()+"-popup",{beginButton:new l(t.getId()+"-popup-closeButton",{text:i.getText("SUGGESTIONSPOPOVER_CLOSE_BUTTON")}),stretch:true,customHeader:new u(t.getId()+"-popup-header",{contentMiddle:new m,contentRight:new l({icon:P.getIconURI("decline")})}),subHeader:this.createSubHeaderContent(e),horizontalScrolling:false,initialFocus:this._oPopupInput,beforeOpen:function(){o.updatePickerHeaderTitle()},afterClose:function(){t.focus();n.closeKeyboard()}});this._registerAutocomplete();this._oPopover.addStyleClass(A);this._oPopover.addStyleClass(M);this._oPopover.addAriaLabelledBy(s.getStaticId("sap.m","INPUT_AVALIABLE_VALUES"));if(!this._bUseDialog){this._overwritePopover()}if(this._oList){this._oPopover.addContent(this._oList)}};F.prototype.createSubHeaderContent=function(e){var t=[this._oPopupInput];if(e.showSelectedButton){t.push(this._createFilterSelectedButton())}return new p({content:t})};F.prototype._createSuggestionPopupContent=function(e){var t=this._oInput;this._bHasTabularSuggestions=e;if(!e){this._oList=new f(t.getId()+"-popup-list",{showNoData:false,mode:L.SingleSelectMaster,rememberSelections:false,width:"100%",showSeparators:w.None,busyIndicatorDelay:0});this._oList.addEventDelegate({onAfterRendering:function(){var e,t;if(!this._bEnableHighlighting){return}e=this._oList.$().find(".sapMSLIInfo, .sapMSLITitleOnly");t=(this._sTypedInValue||this._oInput.getValue()).toLowerCase();V(e,t)}.bind(this)})}else{this._oList=this._oInput._getSuggestionsTable()}if(this._oPopover){if(this._bUseDialog){this._oPopover.addAggregation("content",this._oList,true);var s=this._oPopover.$("scrollCont")[0];if(s){var o=sap.ui.getCore().createRenderManager();o.renderControl(this._oList);o.flush(s);o.destroy()}}else{this._oPopover.addContent(this._oList)}}};F.prototype._getValueStateHeader=function(){if(!this._oValueStateHeader){this._oValueStateHeader=new b;if(this._oPopover.isA("sap.m.Popover")){this._oPopover.setCustomHeader(this._oValueStateHeader)}else{this._oPopover.insertContent(this._oValueStateHeader,0)}this._oValueStateHeader.setPopup(this._oPopover)}return this._oValueStateHeader};F.prototype._destroySuggestionPopup=function(){if(this._oPopover){if(this._oList instanceof I){this._oPopover.removeAllContent()}this._oPopover.destroy();this._oPopover=null}if(this._oList instanceof f){this._oList.destroy();this._oList=null}if(this._oPickerValueStateText){this._oPickerValueStateText.destroy();this._oPickerValueStateText=null}if(this._oValueStateHeader){this._oValueStateHeader.destroy();this._oValueStateHeader=null}this._getInput().removeEventDelegate(this._oInputDelegate,this)};F.prototype._overwritePopover=function(){var e=this._oInput;this._oPopover.open=function(){this.openBy(e,false,true)};this._oPopover.oPopup.setAnimations(function(e,t,s){s()},function(e,t,s){s()})};F.prototype._resizePopup=function(){var e=this._oInput;if(this._oList&&this._oPopover){if(this._sPopoverContentWidth){this._oPopover.setContentWidth(this._sPopoverContentWidth)}else{this._oPopover.setContentWidth(e.$().outerWidth()+"px")}setTimeout(function(){if(this._oPopover&&this._oPopover.isOpen()&&this._oPopover.$().outerWidth()<e.$().outerWidth()){this._oPopover.setContentWidth(e.$().outerWidth()+"px")}}.bind(this),0)}};F.prototype._registerResize=function(){if(!this._bUseDialog){this._sPopupResizeHandler=i.register(this._oInput,this._resizePopup.bind(this))}};F.prototype._deregisterResize=function(){if(this._sPopupResizeHandler){this._sPopupResizeHandler=i.deregister(this._sPopupResizeHandler)}};F.prototype._handleValueStateLinkNav=function(e){this.bMessageValueStateActive=this._oInput.getFormattedTextFocused?this._oInput.getFormattedTextFocused():this.bMessageValueStateActive;if(!this.bMessageValueStateActive||!this.getValueStateLinks().length||this.bMessageValueStateActive&&document.activeElement.tagName==="A"){return}var t=this.getValueStateLinks(),s=t[t.length-1];e.preventDefault();this._iPopupListSelectedIndex=-1;t[0].focus();this._getValueStateHeader().removeStyleClass("sapMPseudoFocus");t.forEach(function(e){e.addDelegate({onsapup:function(e){this._oInput.getFocusDomRef().focus();this._onsaparrowkey(e,"up",1)},onsapdown:function(e){this._oInput.getFocusDomRef().focus();this._onsaparrowkey(e,"down",1)}},this)},this);s.addDelegate({onsaptabnext:function(e){this.bMessageValueStateActive=false;this._oInput.onsapfocusleave(e);this._oPopover.close();setTimeout(function(){this._oInput.closeValueStateMessage()}.bind(this),0)}},this);t[0].addDelegate({onsaptabprevious:function(e){e.preventDefault();this._oInput.getFocusDomRef().focus();this._getValueStateHeader().addStyleClass("sapMPseudoFocus");this._oInput.removeStyleClass("sapMFocus")}},this)};F.prototype._onsaparrowkey=function(t,s,o){var i=this._oInput,a,n=i.$("inner");if(t.isMarked()){return}if(!i.getEnabled()||!i.getEditable()){return}if(s!=="up"&&s!=="down"){return}if(this._bIsInputIncrementalType){t.setMarked()}if(!this._oPopover||!this._oPopover.isOpen()){return}t.preventDefault();t.stopPropagation();var r=false,u=this._oList,p=u.getItems(),l=u.getSelectedItem(),h=this._iPopupListSelectedIndex,_,c=this._getValueStateHeader(),g=c.getFormattedText(),f=e.browser.msie?g:c,S=h;if(s=="down"&&h===p.length-1){return}if(this.getValueStateLinks().length&&this.bMessageValueStateActive&&t.type==="sapend"){f.removeStyleClass("sapMPseudoFocus");this._oList.addStyleClass("sapMListFocus");S=0;h=p.length-1;p[h].addStyleClass("sapMLIBFocused");this.bMessageValueStateActive=false}var v;if(o>1){if(s=="down"&&h+o>=p.length){s="up";o=1;p[h].setSelected(false);p[h].removeStyleClass("sapMLIBFocused");v=h;h=p.length-1;r=true}else if(s=="up"&&h-o<0&&h>=0){s="down";o=1;p[h].setSelected(false);p[h].removeStyleClass("sapMLIBFocused");v=h;h=0;r=true}}i.removeStyleClass("sapMFocus");this._oList.addStyleClass("sapMListFocus");if(h===-1){h=0;if(this._isSuggestionItemSelectable(p[h])){S=h;r=true}else{s="down"}}if(s==="down"){while(h<p.length-1&&(!r||!this._isSuggestionItemSelectable(p[h]))){p[h].setSelected(false);p[h].removeStyleClass("sapMLIBFocused");h=h+o;r=true;o=1;if(v===h){break}}}else{while(h>0&&(!r||!p[h].getVisible()||!this._isSuggestionItemSelectable(p[h]))){p[h].setSelected(false);p[h].removeStyleClass("sapMLIBFocused");h=h-o;r=true;o=1;if(v===h){break}}}if(this.getValueStateLinks().length&&!this.bMessageValueStateActive&&t.type!=="sapend"&&(s==="up"&&(!this._isSuggestionItemSelectable(p[h])||S===0)||t.type==="saphome")){f.addStyleClass("sapMPseudoFocus");this._oList.removeStyleClass("sapMListFocus");n.attr("aria-activedescendant",g.getId());this.bMessageValueStateActive=true;this._iPopupListSelectedIndex=-1;C(p[0],this._oPopover);return}if(this.getValueStateLinks().length&&this.bMessageValueStateActive&&(s==="up"&&h===0||s==="down")){f.removeStyleClass("sapMPseudoFocus");this._oList.addStyleClass("sapMListFocus");this.bMessageValueStateActive=false}if(!this._isSuggestionItemSelectable(p[h])){if(S>=0){p[S].setSelected(true).updateAccessibilityState();n.attr("aria-activedescendant",p[S].getId());p[S].addStyleClass("sapMLIBFocused")}return}else{a=p[h];a.setSelected(true).updateAccessibilityState();a.addStyleClass("sapMLIBFocused");n.attr("aria-activedescendant",p[h].getId())}if(e.system.desktop){C(p[h],this._oPopover)}this._oLastSelectedHeader&&this._oLastSelectedHeader.removeStyleClass("sapMInputFocusedHeaderGroup");if(d&&p[h]instanceof d){_=i._getInputValue(i._fnRowResultFilter(p[h]))}else{if(p[h].isA("sap.m.GroupHeaderListItem")){_="";p[h].addStyleClass("sapMInputFocusedHeaderGroup");l&&l.setSelected(false);this._oLastSelectedHeader=p[h]}else{_=i._getInputValue(p[h].getTitle())}}this._iPopupListSelectedIndex=h;this._bSuggestionItemChanged=true;this.fireEvent(F.M_EVENTS.SELECTION_CHANGE,{newValue:_})};F.prototype.getValueStateLinks=function(){var e=this._getValueStateHeader(),t=e&&typeof e.getFormattedText==="function"&&e.getFormattedText(),s=t&&typeof t.getControls==="function"&&t.getControls();return s||[]};F.prototype._isSuggestionItemSelectable=function(e){var t=this._bHasTabularSuggestions||e.getType()!==H.Inactive||e.isA("sap.m.GroupHeaderListItem");return e.getVisible()&&t};F.prototype.setOkPressHandler=function(e){var t=this.getOkButton();t&&t.attachPress(e);return t};F.prototype.setCancelPressHandler=function(e){var t=this.getCancelButton();t&&t.attachPress(e)};F.prototype.setShowSelectedPressHandler=function(e){var t=this.getFilterSelectedButton();t&&t.attachPress(e);return t};F.prototype._registerAutocomplete=function(){var t=this._oPopover,s=this._getInput(),o=this._bUseDialog;if(o){t.addEventDelegate({ontap:function(){if(!this._bSuggestionItemTapped&&this._sProposedItemText){s.setValue(this._sProposedItemText);this._sProposedItemText=null}}},this)}else{t.attachAfterOpen(this._handleTypeAhead,this)}t.attachAfterOpen(this._setSelectedSuggestionItem,this);t.attachAfterClose(this._finalizeAutocomplete,this);this._oInputDelegate={onkeydown:function(t){this._bDoTypeAhead=!e.os.android&&this._bAutocompleteEnabled&&t.which!==y.BACKSPACE&&t.which!==y.DELETE},oninput:this._handleTypeAhead};s.addEventDelegate(this._oInputDelegate,this)};F.prototype._handleTypeAhead=function(){var t=this._getInput(),s=t.getValue();this._oProposedItem=null;this._sProposedItemText=null;this._sTypedInValue=s;if(!this._bDoTypeAhead||s===""){return}if(!this._oPopover.isOpen()||s.length<this._oInput.getStartSuggestion()){return}if(document.activeElement!==t.getFocusDomRef()){return}var o=s.toLowerCase(),i=this._bHasTabularSuggestions?this._oInput.getSuggestionRows():this._oInput.getSuggestionItems(),a,n,r,u;i=i.filter(function(e){return!(e.isA("sap.ui.core.SeparatorItem")||e.isA("sap.m.GroupHeaderListItem")||e.isA("sap.m.ColumnListItem")&&!e.getVisible())});a=i.length;for(u=0;u<a;u++){r=this._bHasTabularSuggestions?this._oInput._fnRowResultFilter(i[u]):i[u].getText();if(r.toLowerCase().indexOf(o)===0){this._oProposedItem=i[u];n=r;break}}this._sProposedItemText=n;if(n){n=this._formatTypedAheadValue(n);if(!t.isComposingCharacter()){t.updateDomValue(n)}if(e.system.desktop){t.selectText(s.length,n.length)}else{setTimeout(function(){t.selectText(s.length,n.length)},0)}}};F.prototype._setSelectedSuggestionItem=function(){var e;if(this._oList){e=this._oList.getItems();for(var t=0;t<e.length;t++){if((e[t]._oItem||e[t])===this._oProposedItem){e[t].setSelected(true);break}}}};F.prototype._getInput=function(){return this._bUseDialog?this._oPopupInput:this._oInput};F.prototype._finalizeAutocomplete=function(){if(this._oInput.isComposingCharacter()){return}if(!this._bAutocompleteEnabled){return}if(!this._bSuggestionItemTapped&&!this._bSuggestionItemChanged&&this._oProposedItem){if(this._bHasTabularSuggestions){this._oInput.setSelectionRow(this._oProposedItem,true)}else{this._oInput.setSelectionItem(this._oProposedItem,true)}}if(this._oProposedItem&&document.activeElement===this._oInput.getFocusDomRef()){var e=this._oInput.getValue().length;this._oInput.selectText(e,e)}this._resetTypeAhead()};F.prototype._resetTypeAhead=function(){this._oProposedItem=null;this._sProposedItemText=null;this._sTypedInValue="";this._bSuggestionItemTapped=false;this._bSuggestionItemChanged=false};F.prototype._formatTypedAheadValue=function(e){return this._sTypedInValue.concat(e.substring(this._sTypedInValue.length,e.length))};F.prototype._onsapright=function(){var e=this._oInput,t=e.getValue();if(!this._bAutocompleteEnabled){return}if(this._sTypedInValue!==t){this._sTypedInValue=t;e.fireLiveChange({value:t,newValue:t})}};F.prototype.updateValueState=function(e,t,s){var o=s&&e!==x.None;t=t||a.getAdditionalText(e);if(!this._oPopover){return this}if(this._oPopupInput){this._oPopupInput.setValueState(e)}this._getValueStateHeader().setValueState(e);if(this._oValueStateHeader&&typeof t==="string"){this._oValueStateHeader.setText(t)}else if(this._oValueStateHeader&&typeof t==="object"){this._oValueStateHeader.setFormattedText(t)}if(this._oValueStateHeader){this._oValueStateHeader.setVisible(o)}this._alignValueStateStyles(e);return this};F.prototype._alignValueStateStyles=function(e){var t=A+"ValueState",s=A+this._sOldValueState+"State",o=A+e+"State";this._oPopover.addStyleClass(t);this._oPopover.removeStyleClass(s);this._oPopover.addStyleClass(o);this._sOldValueState=e};F.prototype.addContent=function(e){this._oPopover.addContent(e)};return F});