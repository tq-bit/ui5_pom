/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../_AnnotationHelperBasics","sap/base/Log","sap/ui/base/BindingParser","sap/ui/base/ManagedObject","sap/ui/base/SyncPromise","sap/ui/performance/Measurement"],function(e,t,n,r,a,i){"use strict";var s="sap.ui.model.odata.v4.AnnotationHelper",o=[s],u=s+"/getExpression",l,p=/^\{@i18n>[^\\\{\}:]+\}$/,c={And:"&&",Eq:"===",Ge:">=",Gt:">",Le:"<=",Lt:"<",Ne:"!==",Not:"!",Or:"||"},f=false,m={"Edm.Boolean":"boolean","Edm.Byte":"number","Edm.Date":"Date","Edm.DateTimeOffset":"DateTimeOffset","Edm.Decimal":"Decimal","Edm.Double":"number","Edm.Guid":"string","Edm.Int16":"number","Edm.Int32":"number","Edm.Int64":"Decimal","Edm.SByte":"number","Edm.Single":"number","Edm.String":"string","Edm.TimeOfDay":"TimeOfDay"},d={Bool:"Edm.Boolean",Float:"Edm.Double",Date:"Edm.Date",DateTimeOffset:"Edm.DateTimeOffset",Decimal:"Edm.Decimal",Guid:"Edm.Guid",Int:"Edm.Int64",Int32:"Edm.Int32",String:"Edm.String",TimeOfDay:"Edm.TimeOfDay"},y={boolean:false,Date:false,DateTimeOffset:true,Decimal:true,number:false,string:false,TimeOfDay:false};function g(e,t){return a.resolve().then(function(){E(e,t)})}function E(t,n){e.error(t,n,s)}l={adjustOperands:function(e,t){if(e.result!=="constant"&&e.category==="number"&&t.result==="constant"&&t.type==="Edm.Int64"){t.category="number"}if(e.result!=="constant"&&e.category==="Decimal"&&t.result==="constant"&&t.type==="Edm.Int32"){t.category="Decimal";t.type=e.type}},apply:function(t,n){var r=e.descend(t,"$Function","string");switch(r.value){case"odata.concat":return l.concat(n);case"odata.fillUriTemplate":return l.fillUriTemplate(n);case"odata.uriEncode":return l.uriEncode(n);default:return g(r,"unknown function: "+r.value)}},collection:function(t){var n;e.expectType(t,"array");n=t.value.map(function(n,r){return l.expression(e.descend(t,r,true),true)});return a.all(n).then(function(t){t=t.map(function(t){return e.resultToString(t,true)});return{result:"expression",value:"odata.collection(["+t.join(",")+"])"}})},concat:function(t){var n;e.expectType(t,"array");n=t.value.map(function(e,n){return l.parameter(t,n)});return a.all(n).then(function(n){var r,a,i;r=t.asExpression||n.some(function(e){return e.result==="expression"});a=n.filter(function(e){return e.type!=="edm:Null"}).map(function(n){if(r){l.wrapExpression(n)}return e.resultToString(n,r,t.complexBinding)});i=r?{result:"expression",value:a.join("+")}:{result:"composite",value:a.join("")};i.type="Edm.String";return i})},conditional:function(t,n){var r=t.complexBinding,i=r?Object.assign({},t,{complexBinding:false}):t;function s(t,n){return e.resultToString(l.wrapExpression(t),true,n)}return a.all([l.parameter(i,0,"Edm.Boolean"),l.parameter(t,1),n&&t.value.length===2?{result:"constant",type:"edm:Null",value:undefined}:l.parameter(t,2)]).then(function(e){var n=e[0],a=e[1],i=e[2],o=a.type;if(a.type==="edm:Null"){o=i.type}else if(i.type!=="edm:Null"&&a.type!==i.type){E(t,"Expected same type for second and third parameter, types are '"+a.type+"' and '"+i.type+"'")}return{result:"expression",type:o,value:s(n,false)+"?"+s(a,r)+":"+s(i,r)}})},constant:function(e,t){var n=e.value;if(t==="String"){if(p.test(n)){return{ignoreTypeInPath:true,result:"binding",type:"Edm.String",value:n.slice(1,-1)}}}return{result:"constant",type:d[t],value:n}},expression:function(t,n){var r=t.value,i=t,s;if(r===null){s="Null"}else if(typeof r==="boolean"){s="Bool"}else if(typeof r==="number"){s=isFinite(r)&&Math.floor(r)===r?"Int32":"Float"}else if(typeof r==="string"){s="String"}else if(Array.isArray(r)){return l.collection(t)}else{e.expectType(t,"object");if(r.$kind==="Property"){t.value=t.model.getObject(t.path+"@sapui.name");return l.path(t)}["$And","$Apply","$Date","$DateTimeOffset","$Decimal","$Float","$Eq","$Ge","$Gt","$Guid","$If","$Int","$Le","$Lt","$Name","$Ne","$Not","$Null","$Or","$Path","$PropertyPath","$TimeOfDay","$LabeledElement"].forEach(function(n){if(r.hasOwnProperty(n)){s=n.slice(1);i=e.descend(t,n)}})}switch(s){case"Apply":return l.apply(t,i);case"If":return l.conditional(i,n);case"Name":case"Path":case"PropertyPath":return l.path(i);case"Date":case"DateTimeOffset":case"Decimal":case"Guid":case"Int":case"String":case"TimeOfDay":e.expectType(i,"string");case"Bool":case"Float":case"Int32":return a.resolve(l.constant(i,s));case"And":case"Eq":case"Ge":case"Gt":case"Le":case"Lt":case"Ne":case"Or":return l.operator(i,s);case"Not":return l.not(i);case"Null":return a.resolve({result:"constant",type:"edm:Null",value:null});default:return g(t,"Unsupported OData expression")}},fetchCurrencyOrUnit:function(t,n,r,a){var i="sap.ui.model.odata.type.Unit",s="@@requestUnitsOfMeasure",o=t.model,u=t.path+"@Org.OData.Measures.V1.Unit/$Path",l=o.getObject(u);function p(n,r,a){return e.resultToString({constraints:n,result:"binding",type:r,value:t.prefix+a},false,true)}if(!l){i="sap.ui.model.odata.type.Currency";s="@@requestCurrencyCodes";u=t.path+"@Org.OData.Measures.V1.ISOCurrency/$Path";l=o.getObject(u)}if(!l){return undefined}return o.fetchObject(u+"/$").then(function(e){return{result:"composite",type:i,value:(m[r]==="number"?"{formatOptions:{parseAsString:false},":"{")+"mode:'TwoWay',parts:["+p(a,r,n)+","+p(o.getConstraints(e,u),e.$Type,l)+",{mode:'OneTime',path:'/##"+s+"',targetType:'any'}"+"],type:'"+i+"'}"}})},fillUriTemplate:function(t){var n,r=[],i;t.complexBinding=false;i=[l.parameter(t,0,"Edm.String")];for(n=1;n<t.value.length;n+=1){r[n]=e.descend(t,n,"object");i.push(l.expression(e.descend(r[n],"$LabeledElement",true)))}return a.all(i).then(function(a){var i,s=[],o="";s.push("odata.fillUriTemplate(",e.resultToString(a[0],true,false),",{");for(n=1;n<t.value.length;n+=1){i=e.property(r[n],"$Name","string");s.push(o,e.toJSON(i),":",e.resultToString(a[n],true,false));o=","}s.push("})");return{result:"expression",type:"Edm.String",value:s.join("")}})},formatOperand:function(t,n){if(t.result==="constant"){switch(t.category){case"boolean":case"number":return String(t.value)}}if(n){l.wrapExpression(t)}return e.resultToString(t,true,false)},getExpression:function(a){if(a.value===undefined){return undefined}i.average(u,"",o);if(!f&&r.bindingParser===n.simpleParser){t.warning("Complex binding syntax not active",null,s);f=true}return l.expression(a).then(function(t){return e.resultToString(t,false,a.complexBinding)},function(t){if(t instanceof SyntaxError){return"Unsupported: "+n.complexParser.escape(e.toErrorString(a.value))}throw t}).finally(function(){i.end(u)}).unwrap()},not:function(t){t.asExpression=true;t.complexBinding=false;return l.expression(t).then(function(t){return{result:"expression",type:"Edm.Boolean",value:"!"+e.resultToString(l.wrapExpression(t),true,false)}})},operator:function(e,t){var n=t==="And"||t==="Or"?"Edm.Boolean":undefined;e.complexBinding=false;return a.all([l.parameter(e,0,n),l.parameter(e,1,n)]).then(function(n){var r,a=n[0],i=n[1],s="",o,u;if(a.type!=="edm:Null"&&i.type!=="edm:Null"){a.category=m[a.type];i.category=m[i.type];l.adjustOperands(a,i);l.adjustOperands(i,a);if(a.category!==i.category){E(e,"Expected two comparable parameters but instead saw "+a.type+" and "+i.type)}switch(a.category){case"Decimal":s=",'Decimal'";break;case"DateTimeOffset":s=",'DateTime'";break}r=y[a.category]}o=l.formatOperand(a,!r);u=l.formatOperand(i,!r);return{result:"expression",type:"Edm.Boolean",value:r?"odata.compare("+o+","+u+s+")"+c[t]+"0":o+c[t]+u}})},parameter:function(t,n,r){var a=e.descend(t,n,true);return l.expression(a).then(function(e){if(r&&r!==e.type){E(a,"Expected "+r+" but instead saw "+e.type)}return e})},path:function(t){var n=t.ignoreAsPrefix,r=t.model,i,s=t.value;if(n&&s.startsWith(n)){s=s.slice(n.length)}e.expectType(t,"string");i=r.fetchObject(t.path+"/$");if(i.isPending()&&!t.$$valueAsPromise){i.caught();i=a.resolve()}return i.then(function(e){var n,a,i=e&&e.$Type;if(e&&t.complexBinding){n=r.getConstraints(e,t.path);a=l.fetchCurrencyOrUnit(t,s,i,n)}return a||{constraints:n,formatOptions:i==="Edm.String"&&!(t.formatOptions&&"parseKeepsEmptyString"in t.formatOptions)?Object.assign({parseKeepsEmptyString:true},t.formatOptions):t.formatOptions,parameters:t.parameters,result:"binding",type:i,value:t.prefix+s}})},uriEncode:function(t){return l.parameter(t,0).then(function(t){return{result:"expression",type:"Edm.String",value:t.type==="Edm.String"?"odata.uriEncode("+e.resultToString(t,true,false)+","+e.toJSON(t.type)+")":"String("+e.resultToString(t,true,false)+")"}})},wrapExpression:function(e){if(e.result==="expression"){e.value="("+e.value+")"}return e}};return l},false);