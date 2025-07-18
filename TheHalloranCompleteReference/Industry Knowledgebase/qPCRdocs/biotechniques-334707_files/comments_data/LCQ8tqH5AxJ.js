/*1349062957,173213983*/

if (window.CavalryLogger) { CavalryLogger.start_js(["68cMW"]); }

/** js/modules/DataStore.js */
__d("DataStore",[],function(a,b,c,d,e,f){


















var g={},
h=1;







function i(l){
if(typeof l=='string'){
return 'str_'+l;}else 






return 'elem_'+
(l.__FB_TOKEN||
(l.__FB_TOKEN=[h++]))[0];}










function j(l){
var m=i(l);
return g[m]||(g[m]={});}


var k=









{set:function(l,m,n){
if(!l)
throw new TypeError
('DataStore.set: namespace is required, got '+(typeof l));

var o=j(l);
o[m]=n;
return l;},

















get:function(l,m,n){
if(!l)
throw new TypeError
('DataStore.get: namespace is required, got '+(typeof l));

var o=j(l),
p=o[m];



if(typeof p==='undefined'&&l.getAttribute)





if(l.hasAttribute&&!l.hasAttribute('data-'+m)){
p=undefined;}else{

var q=l.getAttribute('data-'+m);

p=(null===q)?undefined:q;}



if((n!==undefined)&&(p===undefined))
p=o[m]=n;

return p;},









remove:function(l,m){
if(!l)
throw new TypeError
('DataStore.remove: namespace is required, got '+(typeof l));

var n=j(l),
o=n[m];
delete n[m];
return o;},







purge:function(l){
delete g[i(l)];}};




e.exports=k;});

/** js/modules/UserAgent.js */
__d("UserAgent",[],function(a,b,c,d,e,f){









































var g=false,


h,i,j,k,l,


m,n,o,p,


q,


r,s,t,

u;

function v(){
if(g)
return;


g=true;






var x=navigator.userAgent,
y=/(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))/.exec(x),
z=/(Mac OS X)|(Windows)|(Linux)/.exec(x);

r=/\b(iPhone|iP[ao]d)/.exec(x);
s=/\b(iP[ao]d)/.exec(x);
p=/Android/i.exec(x);
t=/FBAN\/\w+;/i.exec(x);
u=/Mobile/i.exec(x);






q=!!(/Win64/.exec(x));

if(y){
h=y[1]?parseFloat(y[1]):NaN;

if(h&&document.documentMode)
h=document.documentMode;

i=y[2]?parseFloat(y[2]):NaN;
j=y[3]?parseFloat(y[3]):NaN;
k=y[4]?parseFloat(y[4]):NaN;
if(k){



y=/(?:Chrome\/(\d+\.\d+))/.exec(x);
l=y&&y[1]?parseFloat(y[1]):NaN;}else 

l=NaN;}else 


h=i=j=l=k=NaN;


if(z){
if(z[1]){





var aa=/(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(x);

m=aa?parseFloat(aa[1].replace('_','.')):true;}else 

m=false;

n=!!z[2];
o=!!z[3];}else 

m=n=o=false;}



var w=








{ie:function(){
return v()||h;},








ie64:function(){
return w.ie()&&q;},









firefox:function(){
return v()||i;},










opera:function(){
return v()||j;},










safari:function(){
return v()||k;},









chrome:function(){
return v()||l;},









windows:function(){
return v()||n;},










osx:function(){
return v()||m;},








linux:function(){
return v()||o;},









iphone:function(){
return v()||r;},


mobile:function(){
return v()||(r||s||p||u);},


nativeApp:function(){

return v()||t;},


android:function(){
return v()||p;},


ipad:function(){
return v()||s;}};



e.exports=w;});

/** js/modules/core/createObjectFrom.js */
__d("createObjectFrom",["hasArrayNature"],function(a,b,c,d,e,f){



var g=b('hasArrayNature');
























function h(i,j){






var k={},
l=g(j);
if(typeof j=='undefined')
j=true;


for(var m=i.length;m--;)
k[i[m]]=l?j[m]:j;

return k;}


e.exports=h;});

/** js/modules/DOMQuery.js */
__d("DOMQuery",["CSS","UserAgent","createArrayFrom","createObjectFrom","ge"],function(a,b,c,d,e,f){





var g=b('CSS'),
h=b('UserAgent'),

i=b('createArrayFrom'),
j=b('createObjectFrom'),
k=b('ge'),

l=null,

m=














{find:function(n,o){
var p=m.scry(n,o);











return p[0];},










































































scry:function(n,o){



if(!n||!n.getElementsByTagName)



return [];


var p=o.split(' '),
q=[n];





for(var r=0;r<p.length;r++){

if(q.length===0)
break;



if(p[r]==='')
continue;



var s=p[r],
t=p[r],
u=[],


v=false;
if(s.charAt(0)=='^')
if(r===0){
v=true;
s=s.slice(1);}else 






return [];



s=s.replace(/\./g,' .');
s=s.replace(/\#/g,' #');
s=s.replace(/\[/g,' [');

var w=s.split(' '),
x=w[0]||'*',
y=x=='*',

z=w[1]&&w[1].charAt(0)=='#';











if(z){







var aa=k(w[1].slice(1),true);

if(aa&&(y||aa.tagName.toLowerCase()==x))


for(var ba=0;ba<q.length;ba++)
if(v&&m.contains(aa,q[ba])){
u=[aa];
break;}else
if(document==q[ba]||
m.contains(q[ba],aa)){

u=[aa];
break;}}else{








var ca=[],
da=q.length,
ea,


fa=!v&&
t.indexOf('[')<0&&
document.querySelectorAll;

for(var ga=0;ga<da;ga++){

if(v){
ea=[];
var ha=q[ga].parentNode;
while(m.isElementNode(ha)){
if(y||ha.tagName.toLowerCase()==x)
ea.push(ha);


ha=ha.parentNode;}}else


if(fa){
ea=q[ga].querySelectorAll(t);}else 

ea=q[ga].getElementsByTagName(x);


var ia=ea.length;
for(var ja=0;ja<ia;ja++)
ca.push(ea[ja]);}



if(!fa)
for(var ka=1;ka<w.length;ka++){
var la=w[ka],
ma=la.charAt(0)=='.',
na=la.substring(1);

for(ga=0;ga<ca.length;ga++){
var oa=ca[ga];
if(!oa)
continue;




if(ma){
if(!g.hasClass(oa,na))
delete ca[ga];

continue;}else{






var pa=
la.slice(1,la.length-1);
if(pa.indexOf('=')==-1){


if(oa.getAttribute(pa)===null){
delete ca[ga];
continue;}}else{




var qa=pa.split('='),
ra=qa[0],
sa=qa[1];
sa=sa.slice(1,sa.length-1);

if(oa.getAttribute(ra)!=sa){
delete ca[ga];
continue;}}}}}






for(ga=0;ga<ca.length;ga++)
if(ca[ga]){
u.push(ca[ga]);
if(v)









break;}}







q=u;}


return q;},










getText:function(n){
if(m.isTextNode(n)){
return n.data;}else
if(m.isElementNode(n)){
if(l===null){
var o=document.createElement('div');
l=o.textContent!=null?'textContent':'innerText';}

return n[l];}else 

return '';},







getSelection:function(){
var n=window.getSelection,
o=document.selection;
if(n){
return n()+'';}else
if(o)
return o.createRange().text;

return null;},











contains:function(n,o){

n=k(n);
o=k(o);

if(!n||!o){
return false;}else
if(n===o){
return true;}else
if(m.isTextNode(n)){
return false;}else
if(m.isTextNode(o)){
return m.contains(n,o.parentNode);}else
if(n.contains){
return n.contains(o);}else
if(n.compareDocumentPosition){
return !!(n.compareDocumentPosition(o)&16);}else 

return false;},






















getRootElement:function(){
var n=null;
if(window.Quickling&&Quickling.isActive())
n=k('content');

return n||document.body;},










isNode:function(n){
return !!(n&&
(typeof Node=='object'?n instanceof Node:
typeof n=="object"&&
typeof n.nodeType=='number'&&
typeof n.nodeName=='string'));},














isNodeOfType:function(n,o){





var p=i(o).join('|').toUpperCase().split('|'),
q=j(p);
return m.isNode(n)&&n.nodeName in q;},









isElementNode:function(n){
return m.isNode(n)&&n.nodeType==1;},








isTextNode:function(n){
return m.isNode(n)&&n.nodeType==3;},


getDocumentScrollElement:function(n){
n=n||document;
var o=h.chrome()||h.safari();
return !o&&n.compatMode==='CSS1Compat'?
n.documentElement:n.body;}};




e.exports=m;});

/** js/modules/DOMEvent.js */
__d("DOMEvent",["copyProperties"],function(a,b,c,d,e,f){





var g=b('copyProperties');

function h(i){
this.event=i||window.event;
this.target=this.event.target||this.event.srcElement;}


g(h.prototype,
{preventDefault:function(){
var i=this.event;
i.preventDefault?i.preventDefault():i.returnValue=false;
return this;},


stopPropagation:function(){
var i=this.event;
i.stopPropagation?i.stopPropagation():i.cancelBubble=true;
return this;},


kill:function(){
this.stopPropagation().preventDefault();
return this;}});




e.exports=h;});

/** js/modules/core/getObjectValues.js */
__d("getObjectValues",["hasArrayNature"],function(a,b,c,d,e,f){



var g=b('hasArrayNature');









function h(i){






var j=[];
for(var k in i)
j.push(i[k]);

return j;}


e.exports=h;});

/** js/lib/event/extensions.js */
__d("event-extensions",["event-form-bubbling","DataStore","DOMQuery","DOMEvent","ErrorUtils","Parent","UserAgent","$","copyProperties","getObjectValues"],function(a,b,c,d,e,f){



b('event-form-bubbling');

var g=b('DataStore'),
h=b('DOMQuery'),
i=b('DOMEvent'),
j=b('ErrorUtils'),
k=b('Parent'),
l=b('UserAgent'),

m=b('$'),
n=b('copyProperties'),
o=b('getObjectValues');




Event.DATASTORE_KEY='Event.listeners';
if(!Event.prototype)
Event.prototype={};


function p(y,z,aa){
this.target=y;
this.type=z;
this.data=aa;}


n(p.prototype,









{getData:function(){
this.data=this.data||{};
return this.data;},








stop:function(){
new i(this).stopPropagation();
return this;},








prevent:function(){
new i(this).preventDefault();
return this;},























kill:function(){
this.stop().prevent();
return false;},








getTarget:function(){
return new i(this).target||null;}});



function q(y){
if(y instanceof p)
return y;


if(!y)












if(!window.addEventListener&&document.createEventObject){
y=window.event?document.createEventObject(window.event):{};}else 

y={};







if(!y._inherits_from_prototype)


for(var z in Event.prototype)

try{y[z]=Event.prototype[z];}catch(
aa){

}


return y;}





n(Event.prototype,

{_inherits_from_prototype:true,








getRelatedTarget:function(){
var y=this.relatedTarget||
(this.fromElement===this.srcElement?this.toElement:this.fromElement);
return y?m(y):null;},













getModifiers:function(){
var y=
{control:!!this.ctrlKey,
shift:!!this.shiftKey,
alt:!!this.altKey,
meta:!!this.metaKey};

y.access=l.osx()?y.control:y.alt;
y.any=y.control||y.shift||y.alt||y.meta;
return y;},








isRightClick:function(){
if(this.which)
return this.which===3;

return this.button&&this.button===2;},







isMiddleClick:function(){
if(this.which)
return this.which===2;

return this.button&&this.button===4;},

























isDefaultRequested:function(){
return this.getModifiers().any||
this.isMiddleClick()||
this.isRightClick();}});





n(Event.prototype,p.prototype);




n(Event,

























{listen:function(y,z,aa,ba){
if(typeof y=='string')
y=m(y);


if(typeof ba=='undefined')
ba=Event.Priority.NORMAL;


if(typeof z=='object'){
var ca={};
for(var da in z)
ca[da]=Event.listen(y,da,z[da],ba);

return ca;}


if(z.match(/^on/i))
throw new TypeError("Bad event name `"+z+"': use `click', not `onclick'.");


if(y.nodeName=='LABEL'&&z=='click'){
var ea=y.getElementsByTagName('input');
y=ea.length==1?ea[0]:y;}else
if(y===window&&z==='scroll'){
var fa=h.getDocumentScrollElement();
if(fa!==document.documentElement&&
fa!==document.body)
y=fa;}



var ga=g.get(y,s,{});

if(u[z]){
var ha=u[z];
z=ha.base;
if(ha.wrap)
aa=ha.wrap(aa);}




v(y,z);

var ia=ga[z];
if(!(ba in ia))
ia[ba]=[];


var ja=ia[ba].length,
ka=new x(aa,ia[ba],ja);

ia[ba].push(ka);

return ka;},


stop:function(y){





new i(y).stopPropagation();
return y;},


prevent:function(y){





new i(y).preventDefault();
return y;},


kill:function(y){





new i(y).kill();
return false;},


getKeyCode:function(event){
event=new i(event).event;
if(!event)
return false;

switch(event.keyCode){
case 63232:
return 38;
case 63233:
return 40;
case 63234:
return 37;
case 63235:
return 39;
case 63272:
case 63273:
case 63275:
return null;
case 63276:
return 33;
case 63277:
return 34;}

if(event.shiftKey)
switch(event.keyCode){
case 33:
case 34:
case 37:
case 38:
case 39:
case 40:
return null;}



return event.keyCode;},


getPriorities:function(){
if(!r){
var y=o(Event.Priority);

y.sort(function(z,aa){return z-aa;});
r=y;}

return r;},

















fire:function(y,z,aa){
var ba=new p(y,z,aa),
ca;

do{var da=Event.__getHandler(y,z);
if(da)
ca=da(ba);

y=y.parentNode;}while(
y&&ca!==false&&!ba.cancelBubble);
return ca!==false;},










__fire:function(y,z,event){
var aa=Event.__getHandler(y,z);
if(aa)
return aa(q(event));},










__getHandler:function(y,z){
return g.get(y,Event.DATASTORE_KEY+z);},


getPosition:function(y){
y=new i(y).event;

var z=h.getDocumentScrollElement(),
aa=y.clientX+z.scrollLeft,
ba=y.clientY+z.scrollTop;
return {x:aa,y:ba};}});







var r=null,s=Event.DATASTORE_KEY,

t=function(y){
return function(z){
if(!h.contains(this,z.getRelatedTarget()))
return y.call(this,z);};},




u;
if(!window.navigator.msPointerEnabled){
u=
{mouseenter:{base:'mouseover',wrap:t},
mouseleave:{base:'mouseout',wrap:t}};}else 






u=
{mousedown:{base:'MSPointerDown'},
mousemove:{base:'MSPointerMove'},
mouseup:{base:'MSPointerUp'},
mouseover:{base:'MSPointerOver'},
mouseout:{base:'MSPointerOut'},
mouseenter:{base:'MSPointerOver',wrap:t},
mouseleave:{base:'MSPointerOut',wrap:t}};












var v=function(y,z){
var aa='on'+z,
ba=w.bind(y),
ca=g.get(y,s);

if(z in ca)
return;


ca[z]={};
if(y.addEventListener){
y.addEventListener(z,ba,false);}else
if(y.attachEvent)
y.attachEvent(aa,ba);



g.set(y,s+z,ba);





if(y[aa]){







var da=y===document.documentElement?
Event.Priority._BUBBLE:
Event.Priority.TRADITIONAL,
ea=y[aa];
y[aa]=null;
Event.listen(y,z,ea,da);}




if(y.nodeName==='FORM'&&z==='submit')
Event.listen
(y,
z,
Event.__bubbleSubmit.curry(y),
Event.Priority._BUBBLE);},














w=j.guard(function(event){
event=q(event);
var y=event.type;

if(!g.get(this,s))
throw new Error("Bad listenHandler context.");


var z=g.get(this,s)[y];
if(!z)
throw new Error("No registered handlers for `"+y+"'.");






if(y=='click'){
var aa=k.byTag(event.getTarget(),'a');


if(window.userAction){
var ba=window.userAction('evt_ext',aa,event,{mode:'DEDUP'}).
uai_fallback('click');
if(window.ArbiterMonitor)
window.ArbiterMonitor.initUA(ba,[aa]);}


if(window.clickRefAction)
window.clickRefAction('click',aa,event);}





var ca=Event.getPriorities();
for(var da=0;da<ca.length;da++){
var ea=ca[da];
if(ea in z){
var fa=z[ea];
for(var ga=0;ga<fa.length;ga++){
if(!fa[ga])

continue;

var ha=fa[ga].fire(this,event);


if(ha===false){
return event.kill();}else
if(event.cancelBubble)
event.stop();}}}





return event.returnValue;});












































Event.Priority=
{URGENT:-20,
TRADITIONAL:-10,
NORMAL:0,
_BUBBLE:1000};











function x(y,z,aa){
this._handler=y;
this._container=z;
this._index=aa;}


n(x.prototype,










{remove:function(){
delete this._handler;
delete this._container[this._index];},











fire:function(y,event){
return j.applyWithGuard(this._handler,y,[event],
function(z){
z.event_type=event.type;
z.dom_element=y.name||y.id;
z.category='eventhandler';});}});





a.$E=f.$E=q;});

/** js/modules/AsyncResponse.js */
__d("AsyncResponse",["Bootloader","Env","copyProperties","tx"],function(a,b,c,d,e,f){



var g=b('Bootloader'),
h=b('Env'),

i=b('copyProperties'),
j=b('tx');






















function k(l,m){

i(this,
{error:0,
errorSummary:null,
errorDescription:null,
onload:null,
replay:false,
payload:m||null,
request:l||null,
silentError:false,
is_last:true});


return this;}


i(k,









{defaultErrorHandler:function(l){


try{if(!l.silentError){


k.verboseErrorHandler(l);}else 










l.logErrorByGroup('silent',10);}catch(


m){
alert(l);}},











verboseErrorHandler:function(l){


try{var n=l.getErrorSummary(),
o=l.getErrorDescription();


l.logErrorByGroup('popup',10);


if(l.silentError&&o=='')
o="Something went wrong. We're working on getting this fixed as soon as we can. You may be able to try again.";


g.loadModules(['Dialog'],function(p){
new p().
setTitle(n).
setBody(o).
setButtons([p.OK]).
setModal(true).
setCausalElement(this.relativeTo).
show();});}catch(

m){
alert(l);}}});






i(k.prototype,





{getRequest:function(){
return this.request;},










getPayload:function(){
return this.payload;},
















getError:function(){
return this.error;},
















getErrorSummary:function(){
return this.errorSummary;},








setErrorSummary:function(l){
l=(l===undefined?null:l);
this.errorSummary=l;
return this;},














getErrorDescription:function(){
return this.errorDescription;},










getErrorIsWarning:function(){
return this.errorIsWarning;},







logError:function(l,m){
if(window.send_error_signal){
var n={err_code:this.error,vip:(h.vip||'-')};
if(m){
n.duration=m.duration;
n.xfb_ip=m.xfb_ip;}

var o=this.request.getURI();
n.path=o||'-';
n.aid=this.request.userActionID;


if(o&&o.indexOf('scribe_endpoint.php')!=-1)
l='async_error_double';


send_error_signal(l,JSON.stringify(n));}},


















logErrorByGroup:function(l,m){

if(Math.floor(Math.random()*m)==0)
if(this.error==1357010||
this.error<15000){

this.logError('async_error_oops_'+l);}else 



this.logError('async_error_logic_'+l);}});







e.exports=k;});

/** js/modules/HTTPErrors.js */
__d("HTTPErrors",["emptyFunction"],function(a,b,c,d,e,f){



var g=b('emptyFunction'),

h=
{get:g,
getAll:g};























































































































e.exports=h;});

/** js/modules/URI.js */
__d("URI",["copyProperties","goURI"],function(a,b,c,d,e,f){



var g=b('copyProperties'),
h=b('goURI');
































function i(j){
if(!(this instanceof i))
return new i(j||window.location.href);


this.parse(j||'');}


g(i,















{getRequestURI:function(j,
k){
j=
j===undefined||j;

var l=a.PageTransitions;
if(j&&l&&
l.isInitialized()){
return l.getCurrentURI(!!k).
getQualifiedURI();}else 

return new i(window.location.href);},










getMostRecentURI:function(){
var j=a.PageTransitions;
if(j&&j.isInitialized()){
return j.getMostRecentURI().getQualifiedURI();}else 

return new i(window.location.href);},







getNextURI:function(){
var j=a.PageTransitions;
if(j&&j.isInitialized()){
return j.getNextURI().getQualifiedURI();}else 

return new i(window.location.href);},










expression:
/(((\w+):\/\/)([^\/:]*)(:(\d+))?)?([^#?]*)(\?([^#]*))?(#(.*))?/,




arrayQueryExpression:/^(\w+)((?:\[\w*\])+)=?(.*)/,











explodeQuery:function(j){
if(!j)
return {};


var k={};





j=j.replace(/%5B/ig,'[').replace(/%5D/ig,']');

j=j.split('&');

var l=Object.prototype.hasOwnProperty;

for(var m=0,n=j.length;m<n;m++){
var o=j[m].match(i.arrayQueryExpression);

if(!o){
var p=j[m].split('=');
k[i.decodeComponent(p[0])]=
p[1]===undefined?null:i.decodeComponent(p[1]);}else{

var q=o[2].split(/\]\[|\[|\]/).slice(0,-1),
r=o[1],
s=i.decodeComponent(o[3]||'');
q[0]=r;



var t=k;
for(var u=0;u<q.length-1;u++)
if(q[u]){
if(!l.call(t,q[u])){
var v=q[u+1]&&!q[u+1].match(/^\d+$/)?
{}:[];
t[q[u]]=v;
if(t[q[u]]!==v)




return k;}



t=t[q[u]];}else{

if(q[u+1]&&!q[u+1].match(/^\d+$/)){
t.push({});}else 

t.push([]);

t=t[t.length-1];}



if(t instanceof Array&&q[q.length-1]===''){
t.push(s);}else 

t[q[q.length-1]]=s;}}



return k;},














implodeQuery:function(j,k,l){
k=k||'';
if(l===undefined)
l=true;


var m=[];

if(j===null||j===undefined){
m.push(l?i.encodeComponent(k):k);}else
if(j instanceof Array){
for(var n=0;n<j.length;++n)

try{if(j[n]!==undefined)
m.push(i.implodeQuery
(j[n],
k?(k+'['+n+']'):n,
l));}catch(


o){

}}else

if(typeof(j)=='object'){

if(('nodeName' in j)&&('nodeType' in j)){



m.push('{node}');}else 

for(var p in j)

try{if(j[p]!==undefined)
m.push(i.implodeQuery
(j[p],
k?(k+'['+p+']'):p,
l));}catch(


o){

}}else 



if(l){
m.push(i.encodeComponent(k)+'='+i.encodeComponent(j));}else 

m.push(k+'='+j);



return m.join('&');},













encodeComponent:function(j){
return encodeURIComponent(j).replace(/%5D/g,"]").replace(/%5B/g,"[");},













decodeComponent:function(j){
return decodeURIComponent(j.replace(/\+/g,' '));},


INVALID_DOMAIN:'invalid.invalid',




INVALID_URI:
{protocol:'',
domain:'',
port:'',
path:'',
query_s:'',
fragment:''},










sanitizeDomain:function(j){
var k=new RegExp


('[\\x00-\\x2c\\x2f\\x3b-\\x40\\x5c\\x5e\\x60\\x7b-\\x7f'+

'\\uFDD0-\\uFDEF\\uFFF0-\\uFFFF'+

'\\u2047\\u2048\\uFE56\\uFE5F\\uFF03\\uFF0F\\uFF1F]');
if(k.test(j)){
return i.INVALID_DOMAIN;}else 

return j;}});





g(i.prototype,











{parse:function(j){
var k=j.toString().match(i.expression);
g(this,
{protocol:k[3]||'',
domain:i.sanitizeDomain(k[4]||''),
port:k[6]||'',
path:k[7]||'',
query_s:k[9]||'',
fragment:k[11]||''});




if(!this.domain&&this.path.indexOf('\\')!==-1)
g(this,i.INVALID_URI);




var l=new RegExp

('^(?:[^/]*:|'+

'[\\x00-\\x1f]*/[\\x00-\\x1f]*/)');
if(!this.protocol&&l.test(j.toString()))
g(this,i.INVALID_URI);


return this;},












setProtocol:function(j){
this.protocol=j;
return this;},











getProtocol:function(){
return this.protocol;},












setQueryData:function(j){
this.query_s=i.implodeQuery(j);
return this;},















addQueryData:function(j){
return this.setQueryData(g(this.getQueryData(),j));},












removeQueryData:function(j){
if(!Array.isArray(j))
j=[j];


var k=this.getQueryData();
for(var l=0,m=j.length;l<m;++l)
delete k[j[l]];

return this.setQueryData(k);},












getQueryData:function(){








return i.explodeQuery(this.query_s);},












setFragment:function(j){
this.fragment=j;
return this;},











getFragment:function(){
return this.fragment;},












setDomain:function(j){
this.domain=i.sanitizeDomain(j);
return this;},











getDomain:function(){
return this.domain;},












setPort:function(j){
this.port=j;
return this;},













getPort:function(){
return this.port;},












setPath:function(j){
this.path=j;
return this;},











getPath:function(){
return this.path.replace(/^\/+/,'/');},







isEmpty:function(){

return !(this.path||
this.protocol||
this.domain||
this.port||
this.query_s||
this.fragment);},











toString:function(){

var j='';

this.protocol&&(j+=this.protocol+'://');
this.domain&&(j+=this.domain);
this.port&&(j+=':'+this.port);

if(this.domain&&!this.path)
j+='/';


this.path&&(j+=this.path);
this.query_s&&(j+='?'+this.query_s);
this.fragment&&(j+='#'+this.fragment);

return j;},






valueOf:function(){
return this.toString();},








isFacebookURI:function(){
if(!i._facebookURIRegex)


i._facebookURIRegex=new RegExp('(^|\\.)facebook\\.com([^.]*)$','i');

return (!this.isEmpty()&&
(!this.domain||i._facebookURIRegex.test(this.domain)));},







isQuicklingEnabled:function(){
var j=a.Quickling;
return j&&j.isActive()&&j.isPageActive(this);},























getRegisteredDomain:function(){
if(!this.domain)
return '';


if(!this.isFacebookURI())
return null;


var j=this.domain.split('.'),
k=j.indexOf('facebook');
return j.slice(k).join('.');},








getUnqualifiedURI:function(){
return new i(this).setProtocol(null).setDomain(null).setPort(null);},









getQualifiedURI:function(){
var j=new i(this);
if(!j.getDomain()){
var k=i();
j.setProtocol(k.getProtocol()).
setDomain(k.getDomain()).
setPort(k.getPort());}

return j;},

















isSameOrigin:function(j){
var k=j||window.location.href;
if(!(k instanceof i))
k=new i(k.toString());



if(this.isEmpty()||k.isEmpty())
return false;



if(this.getDomain()===i.INVALID_DOMAIN)
return false;


if(this.getProtocol()&&this.getProtocol()!=k.getProtocol())
return false;


if(this.getDomain()&&this.getDomain()!=k.getDomain())
return false;


if(this.getPort()&&this.getPort()!=k.getPort())
return false;


return true;},








go:function(j){
h(this,j);},
















setSubdomain:function(j){
var k=new i(this).getQualifiedURI(),
l=k.getDomain().split('.');
if(l.length<=2){
l.unshift(j);}else 

l[0]=j;

return k.setDomain(l.join('.'));},









getSubdomain:function(){
if(!this.getDomain())
return '';


var j=this.getDomain().split('.');
if(j.length<=2){
return '';}else 

return j[0];},












setSecure:function(j){
return this.setProtocol(j?'https':'http');},







isSecure:function(){
return this.getProtocol()=='https';}});




e.exports=i;});

/** js/modules/bind.js */
__d("bind",[],function(a,b,c,d,e,f){





































































































function g(h,i){
var j=Array.prototype.slice.call(arguments,2);

if(typeof i!='string')
return Function.prototype.bind.apply(i,[h].concat(j));


function k(){
var l=j.concat(Array.prototype.slice.call(arguments));
if(h[i])
return h[i].apply(h,l);}






k.toString=function(){
return 'bound lazily: '+h[i];};

return k;}


e.exports=g;});

/** js/modules/core/evalGlobal.js */
__d("evalGlobal",[],function(a,b,c,d,e,f){










function g(h){
if(typeof h!='string')
throw new TypeError
('JS sent to evalGlobal is not a string. Only strings are permitted.');


if(!h)
return;


var i=document.createElement('script');

try{i.appendChild(document.createTextNode(h));}catch(
j){
i.text=h;}

var k=document.getElementsByTagName('head')[0]||
document.documentElement;
k.appendChild(i);
k.removeChild(i);}


e.exports=g;});

/** js/modules/AsyncRequest.js */
__d("AsyncRequest",["event-extensions","Arbiter","AsyncResponse","Bootloader","CSS","Env","HTTPErrors","JSCC","Parent","Run","ServerJS","URI","UserAgent","XHR","bind","copyProperties","emptyFunction","evalGlobal","ge","goURI","isEmpty","tx"],function(a,b,c,d,e,f){










b('event-extensions');

var g=b('Arbiter'),
h=b('AsyncResponse'),
i=b('Bootloader'),
j=b('CSS'),
k=b('Env'),
l=b('HTTPErrors'),
m=b('JSCC'),
n=b('Parent'),
o=b('Run'),
p=b('ServerJS'),
q=b('URI'),
r=b('UserAgent'),
s=b('XHR'),

t=b('bind'),
u=b('copyProperties'),
v=b('emptyFunction'),
w=b('evalGlobal'),
x=b('ge'),
y=b('goURI'),
z=b('isEmpty'),
aa=b('tx');







function ba(){

try{return !window.loaded;}catch(
ka){
return true;}}







function ca(ka){
return ('upload' in ka)&&('onprogress' in ka.upload);}






function da(ka){
return 'withCredentials' in ka;}







function ea(ka){

return ka.status in {0:1,12029:1,12030:1,12031:1,12152:1};}








function fa(ka){
var la=!ka||typeof(ka)==='function';






return la;}


var ga=2,







ha=ga;
g.subscribe('page_transition',function(ka,la){
ha=la.id;});









































function ia(ka){
u(this,
{transport:null,
method:'POST',
uri:'',
timeout:null,
timer:null,
initialHandler:v,
handler:null,
uploadProgressHandler:null,
errorHandler:null,
transportErrorHandler:null,
timeoutHandler:null,
interceptHandler:v,
finallyHandler:v,
abortHandler:v,
serverDialogCancelHandler:null,
relativeTo:null,
statusElement:null,
statusClass:'',
data:{},
file:null,
context:{},
readOnly:false,
writeRequiredParams:[],
remainingRetries:0,
userActionID:'-'});


this.option=
{asynchronous:true,
suppressErrorHandlerWarning:false,
suppressEvaluation:false,
suppressErrorAlerts:false,
retries:0,
jsonp:false,
bundle:false,
useIframeTransport:false,
handleErrorAfterUnload:false};


this.errorHandler=h.defaultErrorHandler;

this.transportErrorHandler=t(this,'errorHandler');

if(ka!==undefined)
this.setURI(ka);}



u(ia,






{bootstrap:function(ka,la,ma){
var na='GET',
oa=true,
pa={};




if(ma||la&&(la.rel=='async-post'||
la.getAttribute&&la.getAttribute('forcemethod')=='post')){
na='POST';
oa=false;
if(ka){
ka=q(ka);
pa=ka.getQueryData();
ka.setQueryData({});}}


var qa=n.byClass(la,'stat_elem')||la;
if(qa&&j.hasClass(qa,'async_saving'))
return false;


var ra=new ia(ka).
setReadOnly(oa).
setMethod(na).
setData(pa).
setNectarModuleDataSafe(la).
setRelativeTo(la);

if(la){
ra.setHandler(function(ta){
Event.fire(la,'success',{response:ta});});

ra.setErrorHandler(function(ta){
if(Event.fire(la,'error',{response:ta})!==false)
h.defaultErrorHandler(ta);});}




if(qa){
ra.setStatusElement(qa);
var sa=qa.getAttribute('data-status-class');
sa&&ra.setStatusClass(sa);}


if(la)
Event.fire(la,'AsyncRequest/send',{request:ra});


ra.send();
return false;},


post:function(ka,la){
new ia(ka).
setReadOnly(false).
setMethod('POST').
setData(la).
send();
return false;},


getLastID:function(){
return ga;},


suppressOnloadToken:{},










_inflight:[],
_inflightCount:0,
_inflightAdd:v,
_inflightPurge:v,


getInflightCount:function(){
return this._inflightCount;},






_inflightEnable:function(){
if(r.ie()){
u(ia,
{_inflightAdd:function(ka){
this._inflight.push(ka);},


_inflightPurge:function(){
ia._inflight=ia._inflight.filter(function(ka){
return ka.transport&&ka.transport.readyState<4;});}});





o.onUnload(function(){
ia._inflight.forEach(function(ka){
if(ka.transport&&ka.transport.readyState<4){
ka.transport.abort();
delete ka.transport;}});});}}});








u(ia.prototype,







{_dispatchResponse:function(ka){

try{this.clearStatusIndicator();

if(!this._isRelevant()){

this._invokeErrorHandler(1010);
return;}

if(this.initialHandler(ka)===false)
return;


clearTimeout(this.timer);

if(ka.jscc_map){
var ma=(eval)(ka.jscc_map);
m.init(ma);}


var na;
if(this.handler)

try{na=this._shouldSuppressJS(this.handler(ka));}catch(
oa){
ka.is_last&&this.finallyHandler(ka);
throw oa;}


if(!na)
this._handleJSResponse(ka);


ka.is_last&&this.finallyHandler(ka);}catch(
la){
v
('The user supplied handler function for an AsyncRequest to URI %s '+
'threw an exception. (This is not a problem with AsyncRequest, it '+
'is a problem with the callback, which failed to catch the '+
'exception.)',
this.getURI(),
la);}},


















_shouldSuppressJS:function(ka){
return ka===ia.suppressOnloadToken;},









_handleJSResponse:function(ka){
var la=this.getRelativeTo(),
ma=ka.domops,
na=ka.jsmods,
oa=new p().setRelativeTo(la),








pa;
if(na&&na.require){
pa=na.require;
delete na.require;}


if(na)
oa.handle(na);


var qa=function(ra){
if(ma&&ra)
ra.invoke(ma,la);


if(pa)
oa.handle({require:pa});


this._handleJSRegisters(ka,'onload');

if(this.lid)
g.inform('tti_ajax',
{s:this.lid,
d:[this._sendTimeStamp||0,
(this._sendTimeStamp&&this._responseTime)?
(this._responseTime-this._sendTimeStamp):
0]},

g.BEHAVIOR_EVENT);


this._handleJSRegisters(ka,'onafterload');}.
bind(this);

if(ma){
i.loadModules(['AsyncDOM'],qa);}else 

qa(null);},










_handleJSRegisters:function(ka,la){
var ma=ka[la];
if(!ma)
return;

for(var na=0;na<ma.length;na++)

try{(new Function(ma[na])).apply(this);}catch(
oa){
v
('An %s hook in response to a request to URI %s threw an '+
'exception. (This is not a problem with AsyncRequest, it is a '+
'problem with the registered hook: %s)',
la,
this.getURI(),
ma[na],
oa);}},










invokeResponseHandler:function(ka){
if(typeof(ka.redirect)!=='undefined'){

(function(){
this.setURI(ka.redirect).send();}).
bind(this).defer();
return;}


if(!this.handler&&!this.errorHandler&&!this.transportErrorHandler)
return;


if(typeof(ka.asyncResponse)!=='undefined'){
if(!this._isRelevant()){
this._invokeErrorHandler(1010);
return;}


var la=ka.asyncResponse;
if(la.inlinejs)
w(la.inlinejs);


if(la.lid){
this._responseTime=Date.now();
if(a.CavalryLogger)
this.cavalry=a.CavalryLogger.getInstance(la.lid);

this.lid=la.lid;}


i.setResourceMap(la.resource_map);
if(la.bootloadable)
i.enableBootload(la.bootloadable);


var ma;
if(la.getError()&&!la.getErrorIsWarning()){
var na=this.errorHandler.bind(this);
ma=this._dispatchErrorResponse.bind(this,la,na);}else 

ma=this._dispatchResponse.bind(this,la);


ma=ma.defer.bind(ma);

var oa=false;
if(this.preBootloadHandler)

oa=this.preBootloadHandler(la);




la.css=la.css||[];
la.js=la.js||[];
i.loadResources
(la.css.concat(la.js),
ma,
oa,
this.getURI());}else

if(typeof(ka.transportError)!=='undefined'){
if(this._xFbServer){
this._invokeErrorHandler(1008);}else 

this._invokeErrorHandler(1012);}else 


this._invokeErrorHandler(1007);},









_invokeErrorHandler:function(ka){

if(ba()&&!this.getOption('handleErrorAfterUnload'))
return;


var la;
if(this.responseText===''){
la=1002;}else
if(this._requestAborted){
la=1011;}else{


try{la=ka||this.transport.status||1004;}catch(
ma){
la=1005;}






if(false===navigator.onLine)
la=1006;}



if(!this.transportErrorHandler){
v
('Async request to %s failed with a %d error, but there was no error '+
'handler available to deal with it.',
this.getURI(),
la);

return;}

var na=this.transportErrorHandler.bind(this),

oa,pa,
qa=true;





if(la===1006){

pa="No Network Connection";
oa="Your browser appears to be offline. Please check your internet connection and try again.";}else
if(la>=300&&la<=399){

pa="Redirection";
oa="Your access to Facebook was redirected or blocked by a third party at this time, please contact your ISP or reload. ";


var ra=this.transport.getResponseHeader("Location");
if(ra)
y(ra,true);




qa=true;}else{

pa="Oops";
oa="Something went wrong. We're working on getting this fixed as soon as we can. You may be able to try again.";}


if(!this.getOption('suppressErrorAlerts'))



v('%s',oa);


var sa=new h(this);
u(sa,
{error:la,
errorSummary:pa,
errorDescription:oa,
silentError:qa});

this._dispatchErrorResponse(sa,na);},









_dispatchErrorResponse:function(ka,la){
var ma=ka.getError();


try{this.clearStatusIndicator();



var oa=this._sendTimeStamp&&
{duration:Date.now()-this._sendTimeStamp,
xfb_ip:this._xFbServer||'-'};

ka.logError('async_error',oa);


if(!this._isRelevant()||ma===1010){
v
('Aborting AsyncRequest #%d, irrelevant due to page transition.',
this.id);

this.abort();
return;}


if(ma==1357008||
ma==1357007||
ma==1442002||
ma==1357001){
var pa=
ma==1357008||
ma==1357007;

this.interceptHandler(ka);
this._displayServerDialog(ka,pa);}else
if(this.initialHandler(ka)!==false){
clearTimeout(this.timer);

try{la(ka);}catch(
qa){
this.finallyHandler(ka);
throw qa;}

this.finallyHandler(ka);}}catch(

na){
v
('Async error handler threw an exception for %s, when processing a '+
'%d error.',
this.getURI(),
ma,
na);}},








_displayServerDialog:function(ka,la){
var ma=ka.getPayload();
if(ma.__dialog!==undefined){
this._displayServerLegacyDialog(ka,la);
return;}


var na=ma.__dialogx;
new p().handle(na);



i.loadModules
(['ConfirmationDialog'],
function(oa){
oa.setupConfirmation(ka,this);}.
bind(this));},



_displayServerLegacyDialog:function(ka,la){
var ma=ka.getPayload().__dialog;
i.loadModules(['Dialog'],function(na){
var oa=new na(ma);




if(la)
oa.setHandler(this._displayConfirmationHandler.bind(this,oa));


oa.
setCancelHandler(function(){


var pa=this.getServerDialogCancelHandler();

try{pa&&pa(ka);}catch(
qa){
throw qa;}finally{



this.finallyHandler(ka);}}.

bind(this)).
setCausalElement(this.relativeTo).
show();}.
bind(this));},





_displayConfirmationHandler:function(ka){
this.data.confirmed=1;
u(this.data,ka.getFormData());
this.send();},


setJSONPTransport:function(ka){
ka.subscribe('response',this._handleJSONPResponse.bind(this));
ka.subscribe('abort',this._handleJSONPAbort.bind(this));

this.transport=ka;},







_handleJSONPResponse:function(ka,la){
this.is_first=(this.is_first===undefined);

var ma=this._interpretResponse(la);
ma.asyncResponse.is_first=this.is_first;
ma.asyncResponse.is_last=this.transport.hasFinished();

this.invokeResponseHandler(ma);

if(this.transport.hasFinished())
delete this.transport;},



_handleJSONPAbort:function(){
this._invokeErrorHandler();
delete this.transport;},







_handleXHRResponse:function(ka){
var la;

if(this.getOption('suppressEvaluation')){
la=
{asyncResponse:new h(this,ka)};}else{


var ma=ka.responseText,
na=null;


try{var pa=this._unshieldResponseText(ma);

try{var qa=(eval)('('+pa+')');
la=this._interpretResponse(qa);}catch(
oa){
na='excep';
la=
{transportError:'eval() failed on async to '+this.getURI()};}}catch(


oa){
na='empty';
la=
{transportError:oa.message};}



if(na)

a.send_error_signal&&a.send_error_signal
('async_xport_resp',
[(this._xFbServer?'1008_':'1012_')+na,
this._xFbServer||'-',
this.getURI(),
ma.length,
ma.substr(0,1600)].
join(':'));}




this.invokeResponseHandler(la);},






_unshieldResponseText:function(ka){
var la="for (;;);",
ma=la.length;

if(ka.length<=ma)
throw new Error('Response too short on async to '+this.getURI());


var na=0;
while(ka.charAt(na)==" "||ka.charAt(na)=="\n")
na++;

if(na&&ka.substring(na,na+ma)==la)
v
('Response for request to endpoint %s seems to be valid, but was '+
'preceded by whitespace. (This probably means that someone '+
'committed whitespace in a header file.)',
this.getURI());



return ka.substring(na+ma);},






_interpretResponse:function(ka){
if(ka.redirect)
return {redirect:ka.redirect};


var la=new h(this);

if(ka.__ar!=1){
v
('AsyncRequest to endpoint %s returned a JSON response, but it is '+
'not properly formatted. The endpoint needs to provide a response '+
'using the AsyncResponse class in PHP.',
this.getURI());

la.payload=ka;}else 

u(la,ka);


return {asyncResponse:la};},





_onStateChange:function(){

try{if(this.transport.readyState==4){

ia._inflightCount--;
ia._inflightPurge();



try{if(typeof(this.transport.getResponseHeader)!=='undefined'&&
this.transport.getResponseHeader('X-FB-Debug'))
this._xFbServer=this.transport.getResponseHeader('X-FB-Debug');}catch(

la){}

if(this.transport.status>=200&&this.transport.status<300){

ia.lastSuccessTime=Date.now();

this._handleXHRResponse(this.transport);}else 

if(r.safari()&&
(typeof(this.transport.status)=='undefined')){


this._invokeErrorHandler(1002);}else

if(k.retry_ajax_on_network_error&&
ea(this.transport)&&
this.remainingRetries>0){

this.remainingRetries--;
delete this.transport;
this.send(true);
return;}else 

this._invokeErrorHandler();








if(this.getOption('asynchronous')!==false)
delete this.transport;}}catch(


ka){
if(ba())
return;

delete this.transport;



if(this.remainingRetries>0){
this.remainingRetries--;
this.send(true);}else{

if(!this.getOption('suppressErrorAlerts'))
v
('AsyncRequest exception when attempting to handle a state change.',
ka);



a.send_error_signal&&a.send_error_signal
('async_xport_resp',
[1007,
this._xFbServer||'-',
this.getURI(),
ka.message].
join(':'));

this._invokeErrorHandler(1007);}}},







_isMultiplexable:function(){
if(this.getOption('jsonp')||this.getOption('useIframeTransport')){
v
('You cannot bundle AsyncRequest that uses jsonp or iframe transport.');

return false;}

if(!this.uri.isFacebookURI()){
v
('You can not bundle AsyncRequest sent to non-facebook URIs');
return false;}

if(!this.getOption('asynchronous')){
v('We cannot bundle synchronous AsyncRequests');
return false;}

return true;},


handleResponse:function(ka){
var la=this._interpretResponse(ka);
this.invokeResponseHandler(la);},













setMethod:function(ka){
this.method=ka.toString().toUpperCase();
return this;},









getMethod:function(){
return this.method;},





















setData:function(ka){
this.data=ka;
return this;},










_setDataHash:function(){

if(this.method!='POST'||
this.data.phstamp)
return;


var ka=q.implodeQuery(this.data).length,

la='';
for(var ma=0;ma<this.data.fb_dtsg.length;ma++)
la+=this.data.fb_dtsg.charCodeAt(ma);


this.data.phstamp='1'+la+ka;},






setRawData:function(ka){
this.rawData=ka;
return this;},








getData:function(){
return this.data;},













setContextData:function(ka,la,ma){
ma=ma===undefined?true:ma;
if(ma)
this.context['_log_'+ka]=la;

return this;},








_setUserActionID:function(){
var ka=a.ArbiterMonitor&&a.ArbiterMonitor.getUE()||'-';
this.userActionID=
(a.EagleEye&&a.EagleEye.getSessionID()||'-')+'/'+ka;},















setURI:function(ka){

var la=q(ka);

if(this.getOption('useIframeTransport')&&
!la.isFacebookURI()){
v
('IframeTransport requests should only be used when going between '+
'different Facebook subdomains.  This probably won\'t do what you '+
'want if you\'re going to a non-Facebook URI.  Check out JSONP for '+
'that, but that\'s also a bad idea to use.');

return this;}


if(!this._allowCrossOrigin&&
!this.getOption('jsonp')&&
!this.getOption('useIframeTransport')&&
!la.isSameOrigin()){
v
('Asynchronous requests must specify relative URIs (like %s); this '+
'ensures they conform to the Same Origin Policy (see %s). The '+
'provided absolute URI (%s) is invalid, use a relative URI instead. '+
'If you need to dispatch cross-domain requests, you can use JSONP, '+
'but consider this decision carefully because there are tradeoffs and '+
'JSONP is completely insecure.',
'/path/to/endpoint.php',
'http://www.mozilla.org/projects/security/components/same-origin.html',
la.toString());
return this;}


this._setUserActionID();



if(!ka||la.isEmpty()){
v('Asynchronous requests must specify non-empty URIs');

if(a.send_error_signal&&a.get_error_stack){
var ma=
{err_code:1013,
vip:'-',
duration:0,
xfb_ip:'-',
path:window.location.href,
aid:this.userActionID};

a.send_error_signal('async_error',JSON.stringify(ma));
a.send_error_signal
('async_xport_stack',
[1013,
window.location.href,
null,
a.get_error_stack()].
join(':'));}


return this;}


this.uri=la;

return this;},









getURI:function(){
return this.uri.toString();},















setInitialHandler:function(ka){
this.initialHandler=ka;
return this;},






























setHandler:function(ka){
if(fa(ka))
this.handler=ka;

return this;},









getHandler:function(){
return this.handler;},









setUploadProgressHandler:function(ka){
if(fa(ka))
this.uploadProgressHandler=ka;

return this;},


















setErrorHandler:function(ka){
if(fa(ka))
this.errorHandler=ka;

return this;},











setTransportErrorHandler:function(ka){
this.transportErrorHandler=ka;
return this;},









getErrorHandler:function(){
return this.errorHandler;},








getTransportErrorHandler:function(){
return this.transportErrorHandler;},














setTimeoutHandler:function(ka,la){
if(fa(la)){
this.timeout=ka;
this.timeoutHandler=la;}

return this;},












resetTimeout:function(ka){
if(this.timeoutHandler===null){
v
("The timeout handler hasn't been set yet");}else
if(ka===null){
this.timeout=null;
clearTimeout(this.timer);
this.timer=null;}else{

var la=!this._allowCrossPageTransition;

this.timeout=ka;
clearTimeout(this.timer);
this.timer=this._handleTimeout.bind(this).defer
(this.timeout,
la);}

return this;},







_handleTimeout:function(){
this.abandon();
this.timeoutHandler(this);},







setNewSerial:function(){
this.id=++ga;
return this;},








setInterceptHandler:function(ka){
this.interceptHandler=ka;
return this;},













setFinallyHandler:function(ka){
this.finallyHandler=ka;
return this;},









setAbortHandler:function(ka){
this.abortHandler=ka;
return this;},










getServerDialogCancelHandler:function(){
return this.serverDialogCancelHandler;},











setServerDialogCancelHandler:function(ka){
this.serverDialogCancelHandler=ka;
return this;},

















setPreBootloadHandler:function(ka){
this.preBootloadHandler=ka;
return this;},













































setReadOnly:function(ka){
if(typeof(ka)!='boolean'){
v
('AsyncRequest readOnly value must be a boolean.');}else 


this.readOnly=ka;


return this;},

















setFBMLForm:function(){
this.writeRequiredParams=["fb_sig"];
return this;},











getReadOnly:function(){
return this.readOnly;},













setRelativeTo:function(ka){
this.relativeTo=ka;
return this;},








getRelativeTo:function(){
return this.relativeTo;},









setStatusClass:function(ka){
this.statusClass=ka;
return this;},













setStatusElement:function(ka){
this.statusElement=ka;
return this;},









getStatusElement:function(){
return x(this.statusElement);},






_isRelevant:function(){
if(this._allowCrossPageTransition)
return true;

if(!this.id)


return true;

return this.id>ha;},








clearStatusIndicator:function(){
var ka=this.getStatusElement();
if(ka){
j.removeClass(ka,'async_saving');
j.removeClass(ka,this.statusClass);}},









addStatusIndicator:function(){
var ka=this.getStatusElement();
if(ka){
j.addClass(ka,'async_saving');
j.addClass(ka,this.statusClass);}},












specifiesWriteRequiredParams:function(){
return this.writeRequiredParams.every(function(ka){
this.data[ka]=
this.data[ka]||
k[ka]||
(x(ka)||{}).value;

if(this.data[ka]!==undefined)
return true;

return false;},
this);},

































































































setOption:function(ka,la){

if(typeof(this.option[ka])!='undefined'){
this.option[ka]=la;}else 

v
('AsyncRequest option %s does not exist; request to set it was ignored.',
ka);


return this;},










getOption:function(ka){

if(typeof(this.option[ka])=='undefined')
v
('AsyncRequest option %s does not exist, get request failed.',
ka);


return this.option[ka];},







abort:function(){
if(this.transport){
var ka=this.getTransportErrorHandler();


this.setOption('suppressErrorAlerts',true);
this.setTransportErrorHandler(v);
this._requestAborted=true;
this.transport.abort();


this.setTransportErrorHandler(ka);}


this.abortHandler();},









abandon:function(){
clearTimeout(this.timer);
this.setOption('suppressErrorAlerts',true).
setHandler(v).
setErrorHandler(v).
setTransportErrorHandler(v);
if(this.transport){
this._requestAborted=true;
this.transport.abort();}},












setNectarData:function(ka){
if(ka){
if(this.data.nctr===undefined)
this.data.nctr={};

u(this.data.nctr,ka);}

return this;},











setNectarModuleDataSafe:function(ka){
if(this.setNectarModuleData)
this.setNectarModuleData(ka);

return this;},










setNectarImpressionIdSafe:function(){
if(this.setNectarImpressionId)
this.setNectarImpressionId();

return this;},















setAllowCrossPageTransition:function(ka){
this._allowCrossPageTransition=!!ka;










if(this.timer)
this.resetTimeout(this.timeout);


return this;},





setAllowCrossOrigin:function(ka){
this._allowCrossOrigin=!!ka;
return this;},












send:function(ka){
ka=ka||false;

if(!this.uri){
v
('Attempt to dispatch an AsyncRequest without an endpoint URI! This is '+
'all sorts of silly and impossible, so the request failed.');

return false;}


if(!this.errorHandler&&!this.getOption('suppressErrorHandlerWarning'))
v
('Dispatching an AsyncRequest that does not have an error handler. '+
'You SHOULD supply one, or use AsyncSignal). If this '+
'omission is intentional and well-considered, set the %s option to '+
'suppress this warning.',
'suppressErrorHandlerWarning');


if(this.getOption('jsonp')&&this.method!='GET')


this.setMethod('GET');

if(this.getOption('useIframeTransport')&&this.method!='GET'){
v('Iframe transport currently works only with GET.');
this.setMethod('GET');}


if(this.timeoutHandler!==null&&
(this.getOption('jsonp')||this.getOption('useIframeTransport')))
v('Timeouts aren\'t currently supported with JSONP or '+
'iframe transport requests.');


if(!this.getReadOnly()){
this.specifiesWriteRequiredParams();

if(this.method!='POST'){
v
('You are making a GET request which modifies data; this violates '+
'the HTTP spec and is generally a bad idea. Either change this '+
'request to use POST or use setReadOnly() to mark the request as '+
'idempotent and appropriate for HTTP GET. Consult the setReadOnly() '+
'documentation for more information.');
return false;}}




u(this.data,s.getAsyncParams(this.method));

if(!z(this.context)){
u(this.data,this.context);
this.data.ajax_log=1;}


if(k.force_param)
u(this.data,k.force_param);




this._setUserActionID();

if(this.getOption('bundle')&&this._isMultiplexable()){
ja.schedule(this);
return true;}



this.setNewSerial();


if(!this.getOption('asynchronous'))
this.uri.addQueryData({__s:1});










this.finallyHandler=a.async_callback(this.finallyHandler,'final');
var la,ma;

if(this.method=='GET'||this.rawData){



la=this.uri.addQueryData(this.data).toString();
ma=this.rawData||'';}else{

la=this.uri.toString();

this._setDataHash();
ma=q.implodeQuery(this.data);}


if(this.transport){
v
('You must wait for an AsyncRequest to complete before sending '+
'another request with the same object. To send two simultaneous '+
'requests, create a second AsyncRequest object.');
return false;}


if(this.getOption('jsonp')||this.getOption('useIframeTransport')){
d(['JSONPTransport'],function(qa){
var ra=new qa
(this.getOption('jsonp')?'jsonp':'iframe',
this.uri);

this.setJSONPTransport(ra);
ra.send();}.
bind(this));

return true;}


var na=s.create();

if(!na){
v('Unable to build XMLHTTPRequest transport.');
return false;}


na.onreadystatechange=
a.async_callback(this._onStateChange.bind(this),'xhr');

if(this.uploadProgressHandler&&ca(na))
na.upload.onprogress=this.uploadProgressHandler.bind(this);


if(!ka)

this.remainingRetries=this.getOption('retries');




if(a.send_error_signal||a.ArbiterMonitor)
this._sendTimeStamp=this._sendTimeStamp||Date.now();


this.transport=na;


try{this.transport.open(this.method,la,this.getOption('asynchronous'));}catch(
oa){
v
('Exception when opening Async transport to %s.',
la,
oa);

return false;}


var pa=k.svn_rev;
if(pa)
this.transport.setRequestHeader('X-SVN-Rev',String(pa));


if(!this.uri.isSameOrigin()&&
!this.getOption('jsonp')&&
!this.getOption('useIframeTransport')){
if(!da(this.transport)){
v
('Unable to send cross-origin request (to %s) because the client '+
'does not support the protocol.',
this.uri.toString());

return false;}

if(this.uri.isFacebookURI())

this.transport.withCredentials=true;}



if(this.method=='POST'&&!this.rawData)
this.transport.setRequestHeader
('Content-Type',
'application/x-www-form-urlencoded');



this.addStatusIndicator();

this.transport.send(ma);

if(this.timeout!==null)
this.resetTimeout(this.timeout);



ia._inflightCount++;
ia._inflightAdd(this);

return true;}});








function ja(){
this._requests=[];}


u(ja,

{multiplex:null,





schedule:function(ka){
if(!ja.multiplex){
ja.multiplex=new ja();
(function(){
ja.multiplex.send();
ja.multiplex=null;}).
defer();}

ja.multiplex.add(ka);}});




u(ja.prototype,




{add:function(ka){
this._requests.push(ka);},





send:function(){
var ka=this._requests;
if(!ka.length)
return;

var la;
if(ka.length===1){

la=ka[0];}else{

var ma=ka.map(function(na){

return [na.uri.getPath(),q.implodeQuery(na.data)];});

la=new ia('/ajax/proxy.php').

setAllowCrossPageTransition(true).
setData({data:ma}).
setHandler(this._handler.bind(this)).
setTransportErrorHandler(this._transportErrorHandler.bind(this));}


la.setOption('bundle',false).send();},





_handler:function(ka){
var la=ka.getPayload().responses;
if(la.length!==this._requests.length){

v
('Response number from proxy.php mismatches request number.');
return;}

for(var ma=0;ma<this._requests.length;ma++){
var na=this._requests[ma],
oa=na.uri.getPath();


na.id=this.id;

if(la[ma][0]!==oa){

na.invokeResponseHandler
({transportError:
'Wrong response order in bundled request to '+oa});

continue;}

na.handleResponse(la[ma][1]);}},






_transportErrorHandler:function(ka){
var la={transportError:ka.errorDescription},
ma=this._requests.map(function(na){

na.id=this.id;
na.invokeResponseHandler(la);
return na.uri.getPath();});

v
('Transport error occurred for bundled requests to '+ma.join(', '));}});





e.exports=ia;});

/** js/lib/net/async.js */
__d("legacy:async",["AsyncRequest","AsyncResponse"],function(a,b,c,d){



a.AsyncRequest=b('AsyncRequest');
a.AsyncResponse=b('AsyncResponse');},

3);

/** js/modules/HTML.js */
__d("HTML",["function-extensions","Bootloader","UserAgent","copyProperties","createArrayFrom","emptyFunction","evalGlobal"],function(a,b,c,d,e,f){



b('function-extensions');

var g=b('Bootloader'),
h=b('UserAgent'),

i=b('copyProperties'),
j=b('createArrayFrom'),
k=b('emptyFunction'),
l=b('evalGlobal');





















function m(n){
if(n&&n.__html)







n=n.__html;

if(!(this instanceof m)){
if(n instanceof m)
return n;

return new m(n);}











this._content=n;
this._defer=false;
this._extra_action='';
this._nodes=null;
this._inline_js=k;
this._rootNode=null;
return this;}








m.isHTML=function(n){
return n&&(n instanceof m||n.__html!==undefined);};






m.replaceJSONWrapper=function(n){
return n&&n.__html!==undefined?new m(n.__html):n;};


i(m.prototype,







{toString:function(){
var n=this._content||'';
if(this._extra_action)
n+='<script type="text/javascript">'+this._extra_action+
'</scr'+'ipt>';

return n;},









setAction:function(n){
this._extra_action=n;
return this;},








getAction:function(){
this._fillCache();

var n=function(){
this._inline_js();
l(this._extra_action);}.
bind(this);

if(this.getDeferred()){
return n.defer.bind(n);}else 

return n;},










setDeferred:function(n){
this._defer=!!n;
return this;},







getDeferred:function(){
return this._defer;},







getContent:function(){
return this._content;},












getNodes:function(){
this._fillCache();
return this._nodes;},










getRootNode:function(){










var n=this.getNodes();

if(n.length===1){

this._rootNode=n[0];}else{


var o=document.createDocumentFragment();
for(var p=0;p<n.length;p++)
o.appendChild(n[p]);

this._rootNode=o;}


return this._rootNode;},







_fillCache:function(){
if(null!==this._nodes)
return;


var n=this._content;

if(!n){
this._nodes=[];
return;}




n=n.replace(/(<(\w+)[^>]*?)\/>/g,
function(y,z,aa){
return aa.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i)?
y:
z+'></'+aa+'>';});



var o=n.trim().toLowerCase(),
p=document.createElement('div'),
q=false,

r=

(!o.indexOf('<opt')&&
[1,'<select multiple="multiple" class="__WRAPPER">','</select>'])||

(!o.indexOf('<leg')&&
[1,'<fieldset class="__WRAPPER">','</fieldset>'])||

(o.match(/^<(thead|tbody|tfoot|colg|cap)/)&&
[1,'<table class="__WRAPPER">','</table>'])||

(!o.indexOf('<tr')&&
[2,'<table><tbody class="__WRAPPER">','</tbody></table>'])||


((!o.indexOf('<td')||!o.indexOf('<th'))&&
[3,'<table><tbody><tr class="__WRAPPER">','</tr></tbody></table>'])||

(!o.indexOf('<col')&&
[2,'<table><tbody></tbody><colgroup class="__WRAPPER">','</colgroup></table>'])||

null;

if(null===r){
p.className='__WRAPPER';

if(h.ie()){



r=[0,'<span style="display:none">&nbsp;</span>',''];
q=true;}else 

r=[0,'',''];}




p.innerHTML=r[1]+n+r[2];


while(r[0]--)
p=p.lastChild;


if(q)

p.removeChild(p.firstChild);








if(p.className!='__WRAPPER')
k('HTML._fillCache: HTML markup is not well formed.');



if(h.ie()){


var s;
if(!o.indexOf('<table')&&-1==o.indexOf('<tbody')){
s=p.firstChild&&p.firstChild.childNodes;}else
if(r[1]=='<table>'&&-1==o.indexOf('<tbody')){

s=p.childNodes;}else 

s=[];


for(var t=s.length-1;t>=0;--t)
if(s[t].nodeName&&
s[t].nodeName.toLowerCase()=='tbody'&&
s[t].childNodes.length==0)


s[t].parentNode.removeChild(s[t]);}







var u=p.getElementsByTagName('script'),
v=[];
for(var w=0;w<u.length;w++)
if(u[w].src){
v.push(g.requestResource.bind(g,
'js',
u[w].src));}else 

v.push(l.bind(null,u[w].innerHTML));






for(var w=u.length-1;w>=0;w--)
u[w].parentNode.removeChild(u[w]);


var x=function(){
for(var y=0;y<v.length;y++)
v[y]();};



this._nodes=j(p.childNodes);
this._inline_js=x;}});



e.exports=m;});

/** js/modules/core/isScalar.js */
__d("isScalar",[],function(a,b,c,d,e,f){











function g(h){
return (/string|number|boolean/).test(typeof h);}


e.exports=g;});

/** js/modules/core/requestAnimationFrame.js */
__d("requestAnimationFrame",[],function(a,b,c,d,e,f){



var g=
window.requestAnimationFrame||
window.webkitRequestAnimationFrame||
window.mozRequestAnimationFrame||
window.oRequestAnimationFrame||
window.msRequestAnimationFrame||
function(h){



window.setTimeout(h,33);};


e.exports=g;});

/** js/modules/DOM.js */
__d("DOM",["event-extensions","function-extensions","DOMQuery","HTML","UserAgent","$","copyProperties","createArrayFrom","isScalar","requestAnimationFrame","tx"],function(a,b,c,d,e,f){



b('event-extensions');
b('function-extensions');

var g=b('DOMQuery'),
h=b('HTML'),
i=b('UserAgent'),

j=b('$'),
k=b('copyProperties'),
l=b('createArrayFrom'),
m=b('isScalar'),
n=b('requestAnimationFrame'),
o=b('tx'),

p='js_',
q=0,

r={};

k(r,g);
k(r,











{create:function(aa,ba,ca){
var da=document.createElement(aa);
if(ba)
r.setAttributes(da,ba);

if(ca!=null)
r.setContent(da,ca);

return da;},














setAttributes:function(aa,ba){

if(ba.type)
aa.type=ba.type;


for(var ca in ba){
var da=ba[ca],
ea=(/^on/i).test(ca);









if(ca=='type'){
continue;}else
if(ca=='style'){
if(typeof da=='string'){
aa.style.cssText=da;}else 

k(aa.style,da);}else

if(ea){
Event.listen(aa,ca.substr(2),da);}else
if(ca in aa){
aa[ca]=da;}else
if(aa.setAttribute)
aa.setAttribute(ca,da);}},











prependContent:function(aa,ba){






return x(ba,aa,function(ca){
aa.firstChild?
aa.insertBefore(ca,aa.firstChild):
aa.appendChild(ca);});},










insertAfter:function(aa,ba){









var ca=aa.parentNode;
return x(ba,ca,function(da){
aa.nextSibling?
ca.insertBefore(da,aa.nextSibling):
ca.appendChild(da);});},


















insertBefore:function(aa,ba){









var ca=aa.parentNode;
return x(ba,ca,function(da){
ca.insertBefore(da,aa);});},













setContent:function(aa,ba){






r.empty(aa);
return r.appendContent(aa,ba);},









appendContent:function(aa,ba){






return x(ba,aa,function(ca){
aa.appendChild(ca);});},











replace:function(aa,ba){









var ca=aa.parentNode;
return x(ba,ca,function(da){
ca.replaceChild(da,aa);});},









remove:function(aa){
aa=j(aa);
if(aa.parentNode)
aa.parentNode.removeChild(aa);},








empty:function(aa){
aa=j(aa);
while(aa.firstChild)
r.remove(aa.firstChild);},








shallowClone:function(aa){
y(aa,false);},







deepClone:function(aa){
y(aa,true);},








getID:function(aa){
var ba=aa.id;
if(!ba){
ba=p+q++;
aa.id=ba;}

return ba;},












queryThenMutate:function(aa,ba,ca){
if(!aa&&!ba)



return;


if(ca&&s.hasOwnProperty(ca)){
return;}else
if(ca)
s[ca]=1;


w();

ba&&t.push(ba);
aa&&u.push(aa);}});



var s={},
t=[],
u=[];


function v(){
var aa=u;
u=[];

var ba=t;
t=[];

s={};

var ca;
for(ca=0;ca<aa.length;++ca)
aa[ca]();


for(ca=0;ca<ba.length;++ca)
ba[ca]();}





function w(){
if(!u.length&&!t.length)
n(n.curry
(v));}



















function x(aa,ba,ca){
aa=h.replaceJSONWrapper(aa);


if(aa instanceof h&&
''===ba.innerHTML&&
-1===aa.toString().indexOf('<scr'+'ipt')){
var da=i.ie();

if(!da||(da>7&&!g.isNodeOfType(ba,
['table','tbody','thead','tfoot','tr','select','fieldset']))){




var ea=da?'<em style="display:none;">&nbsp;</em>':'';
ba.innerHTML=ea+aa;
da&&ba.removeChild(ba.firstChild);
return l(ba.childNodes);}}else

if(g.isTextNode(ba)){
ba.data=aa;
return [aa];}




var fa=document.createDocumentFragment(),
ga,
ha=[],
ia=[];

if(!Array.isArray(aa))
aa=[aa];


for(var ja=0;ja<aa.length;ja++){
ga=h.replaceJSONWrapper(aa[ja]);
if(ga instanceof h){
ia.push(ga.getAction());
var ka=ga.getNodes();
for(var la=0;la<ka.length;la++){
ha.push(ka[la]);
fa.appendChild(ka[la]);}}else

if(m(ga)){
var ma=document.createTextNode(ga);
ha.push(ma);
fa.appendChild(ma);}else
if(g.isNode(ga)){
ha.push(ga);
fa.appendChild(ga);}}













ca(fa);


ia.forEach(function(na){na();});

return ha;}


function y(aa,ba){
var ca=aa.cloneNode(ba);


delete ca.__FB_TOKEN;
return ca;}


function z(aa){
function ba(ca){
return r.create('div',{},ca).innerHTML;}

return function(ca,da){
var ea={};
if(da)
for(var fa in da)
ea[fa]=ba(da[fa]);


return h(aa(ca,ea));};}



r.tx=z(o);
r.tx._=r._tx=z(o._);

e.exports=r;});

/** js/lib/event/legacy-extensions.js */
__d("legacy:event-extensions",["event-extensions"],function(a,b,c,d){



b('event-extensions');},

3);

/** js/modules/DOMPosition.js */
__d("DOMPosition",["DOMQuery"],function(a,b,c,d,e,f){



var g=b('DOMQuery'),

h=








{getScrollPosition:function(){
var i=g.getDocumentScrollElement();

return {x:i.scrollLeft,
y:i.scrollTop};},












getElementPosition:function(i){
if(!i)return;



if(!('getBoundingClientRect' in i))
return {x:0,y:0};






var j=i.getBoundingClientRect(),
k=document.documentElement,
l=Math.round(j.left)-k.clientLeft,
m=Math.round(j.top)-k.clientTop;

return {x:l,y:m};}};




e.exports=h;});

/** js/modules/DOMControl.js */
__d("DOMControl",["DataStore","$","copyProperties"],function(a,b,c,d,e,f){



var g=b('DataStore'),

h=b('$'),
i=b('copyProperties');

function j(k){





this.root=h(k);
this.updating=false;
g.set(k,'DOMControl',this);}


i(j.prototype,

{getRoot:function(){
return this.root;},


beginUpdate:function(){
if(this.updating)
return false;

this.updating=true;
return true;},


endUpdate:function(){
this.updating=false;},


update:function(k){
if(!this.beginUpdate())
return this;

this.onupdate(k);
this.endUpdate();},


onupdate:function(k){

}});



j.getInstance=function(k){
return g.get(k,'DOMControl');};


e.exports=j;});

/** js/modules/Input.js */
__d("Input",["CSS","DOMQuery","DOMControl"],function(a,b,c,d,e,f){



var g=b('CSS'),
h=b('DOMQuery'),
i=b('DOMControl'),

j=function(l){
var m=l.getAttribute('maxlength');
if(m&&m>0)
d(['enforceMaxLength'],function(n){
n(l,m);});},




k=

{focus:function(l){
try{l.focus();}catch(m){}},


isEmpty:function(l){
return !(/\S/).test(l.value||'')||
g.hasClass(l,'DOMControl_placeholder');},


getValue:function(l){
return k.isEmpty(l)?'':l.value;},


setValue:function(l,m){





g.removeClass(l,'DOMControl_placeholder');
l.value=m||'';
j(l);
var n=i.getInstance(l);
n&&n.resetHeight&&n.resetHeight();},


setPlaceholder:function(l,m){





l.setAttribute('aria-label',m);
l.setAttribute('placeholder',m);
if(l==document.activeElement)return;
if(k.isEmpty(l)){
g.conditionClass(l,'DOMControl_placeholder',m);
l.value=m||'';}},



reset:function(l){
var m=l!==document.activeElement?
(l.getAttribute('placeholder')||''):'';
l.value=m;
g.conditionClass(l,'DOMControl_placeholder',m);
l.style.height='';},


setSubmitOnEnter:function(l,m){
g.conditionClass(l,'enter_submit',m);},


getSubmitOnEnter:function(l){
return g.hasClass(l,'enter_submit');},


setMaxLength:function(l,m){






if(m>0){
l.setAttribute('maxlength',m);
j(l);}else 

l.removeAttribute('maxlength');}};





e.exports=k;});

/** js/modules/cx.js */
__d("cx",[],function(a,b,c,d,e,f){


















function g(h){
throw new Error('cx'+'(...): Unexpected class transformation.');}


e.exports=g;});

/** js/modules/Style.js */
__d("Style",["DOMQuery","ErrorUtils","$"],function(a,b,c,d,e,f){



var g=b('DOMQuery'),
h=b('ErrorUtils'),
i=b('$');











function j(m){
return m.replace(/([A-Z])/g,'-$1').toLowerCase();}


function k(m,n){
var o=l.get(m,n);
return (o==='auto'||o==='scroll');}


var l=

{set:function(m,n,o){


















switch(n){
case 'opacity':
m.style.opacity=o;
m.style.filter=
o!==''?'alpha(opacity='+o*100+')':'';
break;
case 'float':
m.style.cssFloat=m.style.styleFloat=o;
break;
case 'width':
case 'height':
if(parseInt(o,10)<0)






h.applyWithGuard(function(q,r){
throw new Error
('Style.set: "'+q+'" argument is invalid: "'+r+'"');},
l,[n,o]);




default:n=n.replace(/-(.)/g,function(q,r){
return r.toUpperCase();});





try{m.style[n]=o;}catch(
p){
throw new Error
('Style.set: "'+n+'" argument is invalid: "'+o+'"');}

}
return m;},












get:function(m,n){
m=i(m);








n=n.replace(/-(.)/g,function(p,q){
return q.toUpperCase();});


var o;

if(window.getComputedStyle){


o=window.getComputedStyle(m,null);
if(o)
return o.getPropertyValue(j(n));}




if(document.defaultView&&document.defaultView.getComputedStyle){
o=document.defaultView.getComputedStyle(m,null);






if(o)
return o.getPropertyValue(j(n));

if(n=="display")
return "none";}




if(m.currentStyle){
if(n==='float')
return m.currentStyle.cssFloat||m.currentStyle.styleFloat;

return m.currentStyle[n];}



return m.style&&m.style[n];},





getFloat:function(m,n){
return parseFloat(l.get(m,n),10);},


getOpacity:function(m){
m=i(m);
var n=l.get(m,'filter'),
o=null;
if(n&&(o=/(\d+(?:\.\d+)?)/.exec(n))){
return parseFloat(o.pop())/100;}else
if(n=l.get(m,'opacity')){
return parseFloat(n);}else 

return 1;},








isFixed:function(m){
while(m&&m!==document.documentElement){
if(l.get(m,'position')==='fixed')
return true;

m=m.parentNode;}

return false;},








getScrollParent:function(m){
if(!m)
return null;

while(m!==document.body){
if(k(m,'overflow')||
k(m,'overflowY')||
k(m,'overflowX'))
return m;

m=m.parentNode;}

return window;}};




e.exports=l;});

/** js/modules/Cookie.js */
__d("Cookie",["Env"],function(a,b,c,d,e,f){



var g=b('Env'),

h=

{set:function(i,j,k,l,m){




if(g.no_cookies&&i!='tpa')
return;






document.cookie=i+"="+encodeURIComponent(j)+
"; "+(k?"expires="+
(new Date(Date.now()+k)).toGMTString()+"; ":"")+
"path="+(l||'/')+"; domain="+
window.location.hostname.replace(/^.*(\.facebook\..*)$/i,'$1')+
(m?"; secure":"");},


clear:function(i,j){
j=j||'/';
document.cookie=
i+"=; expires=Thu, 01-Jan-1970 00:00:01 GMT; "+
"path="+j+"; domain="+
window.location.hostname.replace(/^.*(\.facebook\..*)$/i,'$1');},


get:function(i){



var j=document.cookie.match('(?:^|;\\s*)'+i+'=(.*?)(?:;|$)');
return (j?decodeURIComponent(j[1]):j);}};













e.exports=h;});

/** js/lib/ua/cookie.js */
__d("legacy:cookie",["Cookie"],function(a,b,c,d){



var e=b('Cookie');

a.getCookie=e.get;
a.setCookie=e.set;
a.clearCookie=e.clear;},

3);

/** js/modules/AsyncSignal.js */
__d("AsyncSignal",["Env","ErrorUtils","QueryString","URI","XHR","copyProperties"],function(a,b,c,d,e,f){



var g=b('Env'),
h=b('ErrorUtils'),
i=b('QueryString'),
j=b('URI'),
k=b('XHR'),
l=b('copyProperties');




















































function m(n,o){
this.data=o||{};
if(g.tracking_domain&&n.charAt(0)=='/')
n=g.tracking_domain+n;

this.uri=n;}

















m.prototype.setHandler=function(n){
this.handler=n;

return this;};









m.prototype.send=function(){
var n=this.handler,
o=this.data,
p=new Image();

if(n)
p.onload=p.onerror=function(){
h.applyWithGuard(n,null,[p.height==1]);};



o.asyncSignal=(Math.random()*10000|0)+1;



var q=new j(this.uri).isFacebookURI();
l(o,k.getAsyncParams(q?'POST':'GET'));

p.src=i.appendToUrl(this.uri,o);

return this;};


e.exports=m;});

/** js/lib/net/async_signal.js */
__d("legacy:async-signal",["AsyncSignal"],function(a,b,c,d){



a.AsyncSignal=b('AsyncSignal');},

3);

/** js/lib/string/uri.js */
__d("legacy:uri",["URI"],function(a,b,c,d){



a.URI=b('URI');},

3);

/** js/detect_broken_proxy_cache.js */
















function detect_broken_proxy_cache(a,b){
var c=getCookie(b);
if((c!=a)&&(c!=null)&&
(a!='0')){
var d={c:'si_detect_broken_proxy_cache',
m:b+' '+a+' '+c},
e=new URI('/common/scribe_endpoint.php').
getQualifiedURI().toString();
new AsyncSignal(e,d).send();}}

/** js/modules/core/Keys.js */
__d("Keys",[],function(a,b,c,d,e,f){



e.exports=
{BACKSPACE:8,
TAB:9,
RETURN:13,
ESC:27,
SPACE:32,
PAGE_UP:33,
PAGE_DOWN:34,
END:35,
HOME:36,
LEFT:37,
UP:38,
RIGHT:39,
DOWN:40,
DELETE:46,
COMMA:188};});

/** js/modules/DOMDimensions.js */
__d("DOMDimensions",["DOMQuery","Style"],function(a,b,c,d,e,f){



var g=b('DOMQuery'),
h=b('Style'),

i=














{getElementDimensions:function(j){

return {width:j.offsetWidth||0,
height:j.offsetHeight||0};},














getViewportDimensions:function(){

var j=
(window&&window.innerWidth)||
(document&&document.documentElement&&
document.documentElement.clientWidth)||
(document&&document.body&&document.body.clientWidth)||
0,

k=
(window&&window.innerHeight)||
(document&&document.documentElement&&
document.documentElement.clientHeight)||
(document&&document.body&&document.body.clientHeight)||
0;

return {width:j,height:k};},








getViewportWithoutScrollbarDimensions:function(){

var j=
(document&&document.documentElement&&
document.documentElement.clientWidth)||
(document&&document.body&&document.body.clientWidth)||
0,

k=
(document&&document.documentElement&&
document.documentElement.clientHeight)||
(document&&document.body&&document.body.clientHeight)||
0;

return {width:j,height:k};},










getDocumentDimensions:function(j){
j=j||document;
var k=g.getDocumentScrollElement(j),
l=k.scrollWidth||0,
m=k.scrollHeight||0;

return {width:l,height:m};},































measureElementBox:function(j,k,l,m,n){
var o;
switch(k){
case 'left':
case 'right':
case 'top':
case 'bottom':
o=[k];
break;

case 'width':
o=['left','right'];
break;

case 'height':
o=['top','bottom'];
break;


default:throw Error('Invalid plane: '+k);
}

var p=function(q,r){
var s=0;
for(var t=0;t<o.length;t++)
s+=parseInt
(h.get(j,q+'-'+o[t]+r),10)||0;

return s;};


return (l?p('padding',''):0)+
(m?p('border','-width'):0)+
(n?p('margin',''):0);}};




e.exports=i;});

/** js/modules/collectDataAttributes.js */
__d("collectDataAttributes",["ge"],function(a,b,c,d,e,f){




var g=b('ge');
















function h(i,j){
var k={},
l={},
m=j.length,
n,
o;
for(n=0;n<m;++n){
k[j[n]]={};
l[j[n]]='data-'+j[n];}


var p={tn:'',"tn-debug":','};

while(i){
if(i.getAttribute)
for(n=0;n<m;++n){
var q=i.getAttribute(l[j[n]]);
if(q){
var r=JSON.parse(q);
for(var s in r)
if(p[s]!==undefined){
if(k[j[n]][s]===undefined)
k[j[n]][s]=[];

k[j[n]][s].push(r[s]);}else
if(k[j[n]][s]===undefined)
k[j[n]][s]=r[s];}}





if(i.getAttribute&&
(o=i.getAttribute('data-ownerid'))){
i=g(o);}else 

i=i.parentNode;}



for(var t in k)
for(var u in p)
if(k[t][u]!==undefined)
k[t][u]=
k[t][u].join(p[u]);



return k;}


e.exports=h;});

/** js/logging/JSLogger.js */
__d("JSLogger",[],function(a,b,c,d,e,f){











var g=

{MAX_HISTORY:500,


counts:{},


categories:{},


seq:0,


pageId:(Math.random()*2147483648|0).toString(36),


forwarding:false};





function h(l){

if(l instanceof Error&&a.ErrorUtils)
l=a.ErrorUtils.normalizeError(l);



try{return JSON.stringify(l);}catch(
m){



return '{}';}}






function i(l,event,m){
if(!g.counts[l])g.counts[l]={};
if(!g.counts[l][event])g.counts[l][event]=0;
m=m==null?1:Number(m);
g.counts[l][event]+=isFinite(m)?m:0;}











g.logAction=function(event,l,m){
if(this.type=='bump'){
i(this.cat,event,l);}else
if(this.type=='rate'){
(l&&i(this.cat,event+'_n',m));
i(this.cat,event+'_d',m);}else{



var n=
{cat:this.cat,
type:this.type,
event:event,
data:l!=null?h(l):null,
date:Date.now(),
seq:g.seq++};



g.head=g.head?(g.head.next=n):(g.tail=n);


while(g.head.seq-g.tail.seq>g.MAX_HISTORY)
g.tail=g.tail.next;

return n;}};






function j(l){
if(!g.categories[l]){
g.categories[l]={};

var m=function(n){
var o={cat:l,type:n};
g.categories[l][n]=function(){
g.forwarding=false;
var p=null;

if(document.domain!='facebook.com')return;

p=g.logAction;
if(/^\/+(dialogs|plugins?)\//.test(location.pathname)){

g.forwarding=false;}else 


try{p=a.top.require('JSLogger')._.logAction;
g.forwarding=p!==g.logAction;}catch(
q){}


(p&&p.apply(o,arguments));};};



m('debug');
m('log');
m('warn');
m('error');
m('bump');
m('rate');}


return g.categories[l];}







function k(l,m){
var n=[];
for(var o=m||g.tail;o;o=o.next)
if(!l||l(o)){
var p=
{type:o.type,
cat:o.cat,
date:o.date,
event:o.event,
seq:o.seq};


if(o.data)

p.data=JSON.parse(o.data);


n.push(p);}


return n;}



e.exports=
{_:g,
DUMP_EVENT:'jslogger/dump',
create:j,
getEntries:k};});

/** js/modules/core/htmlSpecialChars.js */
__d("htmlSpecialChars",[],function(a,b,c,d,e,f){











function g(h){
if(typeof h=='undefined'||h===null||!h.toString)
return '';


if(h===false){
return '0';}else
if(h===true)
return '1';


return h.
toString().
replace(/&/g,'&amp;').
replace(/"/g,'&quot;').
replace(/'/g,'&#039;').
replace(/</g,'&lt;').
replace(/>/g,'&gt;');}


e.exports=g;});

/** js/modules/core/htmlize.js */
__d("htmlize",["htmlSpecialChars"],function(a,b,c,d,e,f){




var g=b('htmlSpecialChars');

function h(i){
return g(i).replace(/\r\n|[\r\n]/g,'<br />');}


e.exports=h;});

/** js/modules/core/areObjectsEqual.js */
__d("areObjectsEqual",[],function(a,b,c,d,e,f){



function g(h,i){
return JSON.stringify(h)==JSON.stringify(i);}


e.exports=g;});

/** js/modules/core/startsWith.js */
__d("startsWith",[],function(a,b,c,d,e,f){






function g(h,i,j){
var k=String(h);
j=Math.min(Math.max(j||0,0),k.length);
return k.lastIndexOf(String(i),j)===j;}


e.exports=g;});

/** js/modules/utils/throttle.js */
__d("throttle",[],function(a,b,c,d,e,f){

























function g(h,i,j,k){
if(i==null)
i=100;


var l,m,n,o,p,

q,
r,
s,
t=0,
u=Math.min(i,100);


function v(){
r&&h.call(j,l,m,n,o,p);
r=false;}


return function w(x,y,z,aa,ba){
r=true;
l=x;
m=y;
n=z;
o=aa;
p=ba;
q=Date.now();

var ca=s?i:u;
if(q-t-i>ca){
s=null;
v();}


if(!s){
t=q;

s=setTimeout(function(){
s=null;
v();},
i,!k);}};}




e.exports=g;});

/** js/lib/link_rel_preload.js */


















function link_rel_preload(){

var a=/async(?:-post)?|dialog(?:-pipe|-post)?|theater|toggle/;

document.documentElement.onmousedown=function(b){
b=b||window.event;
var c=b.target||b.srcElement,

d=Parent.byTag(c,'A');
if(!d)return;

var e=d.getAttribute('ajaxify'),
f=d.href,
g=e||f;


if(e&&f&&!(/#$/).test(f)){
var h=b.which&&b.which!=1,
i=b.altKey||b.ctrlKey||b.metaKey||b.shiftKey;
if(h||i)
return;}



var j=d.rel&&d.rel.match(a);
j=j&&j[0];

switch(j){
case 'dialog':
case 'dialog-post':
Bootloader.loadComponents('dialog');
break;
case 'dialog-pipe':
Bootloader.loadComponents(['ajaxpipe','dialog']);
break;
case 'async':
case 'async-post':
Bootloader.loadComponents('async');
break;
case 'theater':
Bootloader.loadComponents('PhotoSnowlift',function(){
PhotoSnowlift.preload(g,d);});

break;
case 'toggle':
Bootloader.loadComponents('Toggler');
break;}


return;};}

/** js/logging/Nectar.js */
__d("Nectar",["Env","startsWith"],function(a,b,c,d,e,f){



var g=b('Env'),

h=b('startsWith');

function i(l){
if(!l.nctr)
l.nctr={};}



function j(l){
if(g.module||!l)
return g.module;



var m=
{fbpage_fan_confirm:true},


n;
while(l&&l.getAttributeNode){
var o=(l.getAttributeNode('id')||{}).value;
if(h(o,'pagelet_'))
return o;

if(n&&m[o])
n=o;

l=l.parentNode;}

return n;}


var k=
{addModuleData:function(l,m){
var n=j(m);
if(n){
i(l);
l.nctr._mod=n;}},



addImpressionID:function(l){
if(g.impid){
i(l);
l.nctr._impid=g.impid;}}};




e.exports=k;});

/** js/modules/utils/debounce.js */
__d("debounce",[],function(a,b,c,d,e,f){

























function g(h,i,j,k){
if(i==null)
i=100;

var l;

function m(n,o,p,q,r){
m.reset();

l=setTimeout(function(){
h.call(j,n,o,p,q,r);},
i,!k);}


m.reset=function(){
clearTimeout(l);};


return m;}


e.exports=g;});

/** js/modules/LiveTimer.js */
__d("LiveTimer",["CSS","DOM","UserAgent","emptyFunction","tx"],function(a,b,c,d,e,f){





var g=b('CSS'),
h=b('DOM'),
i=b('UserAgent'),

j=b('emptyFunction'),
k=b('tx'),

l=
{restart:function(m){
this.serverTime=m;
this.localStartTime=Date.now()/1000;

this.updateTimeStamps();},







getApproximateServerTime:function(){
return (this.serverTime-this.localStartTime)*1000+Date.now();},


getServerTimeOffset:function(){
return (this.serverTime-this.localStartTime)*1000;},


updateTimeStamps:function(){
l.timestamps=h.scry(document.body,'abbr.livetimestamp');
l.startLoop(20000);},




addTimeStamps:function(m){

if(!m)
return;


l.timestamps=l.timestamps||[];

if(h.isNodeOfType(m,'abbr')&&
g.hasClass(m,'livetimestamp')){

l.timestamps.push(m);}else{


var n=h.scry(m,'abbr.livetimestamp');
for(var o=0;o<n.length;++o)
l.timestamps.push(n[o]);}




l.startLoop(0);},


startLoop:function(m){
this.stop();
this.timeout=setTimeout(function(){
l.loop();},
m);},


stop:function(){
clearTimeout(this.timeout);},



updateNode:function(m,n){
l.updateNode=i.ie()<7?j:h.setContent;
l.updateNode(m,n);},


loop:function(m){

if(m)
l.updateTimeStamps();


var n=Math.floor(l.getApproximateServerTime()/1000),

o=-1;
l.timestamps&&l.timestamps.forEach(function(q){
var r=q.getAttribute('data-utime'),
s=l.renderRelativeTime(n,r);

if(s.text)
l.updateNode(q,s.text);

if(s.next!=-1&&(s.next<o||o==-1))
o=s.next;});


if(o!=-1){
var p=Math.max(20000,o*1000);
l.timeout=setTimeout(function(){
l.loop();},
p);}},



renderRelativeTime:function(m,n){
var o={text:"",next:-1};
if(m-n>(12*3600))
return o;

var p=m-n,
q=Math.floor(p/60),
r=Math.floor(q/60);
if(q<1){
o.text="a few seconds ago";
o.next=60-p%60;
return o;}

if(r<1){
if(q==1){
o.text="about a minute ago";}else 

o.text=k._("{number} minutes ago",{number:q});

o.next=60-p%60;
return o;}

if(r!=11)
o.next=3600-p%3600;

if(r==1){
o.text="about an hour ago";
return o;}

o.text=k._("{number} hours ago",{number:r});
return o;},


renderRelativeTimeToServer:function(m){
return l.renderRelativeTime
(Math.floor(l.getApproximateServerTime()/1000),
m);}};




e.exports=l;});

/** js/live_timer.js */
__d("legacy:live-timer",["LiveTimer"],function(a,b,c,d){


a.LiveTimer=b('LiveTimer');},

3);

/** js/modules/isInIframe.js */
__d("isInIframe",[],function(a,b,c,d,e,f){








function g(){



return window!=window.top;}


e.exports=g;});

/** js/modules/ScriptPathState.js */
__d("ScriptPathState",["Arbiter"],function(a,b,c,d,e,f){




















var g=b('Arbiter'),

h,
i,
j,
k,
l=100,

m=




{setIsUIPageletRequest:function(n){
j=n;},


setUserURISampleRate:function(n){
k=n;},



reset:function(){
h=null;
i=false;
j=false;},


_shouldUpdateScriptPath:function(){


return (i&&!j);},


_shouldSendURI:function(){

return (Math.random()<k);},







getParams:function(){
var n={};
if(m._shouldUpdateScriptPath()){
if(m._shouldSendURI()&&
h!==null)
n.user_uri=h.substring(0,l);}else 



n.no_script_path=1;

return n;}};



g.subscribe("pre_page_transition",function(n,o){
i=true;
h=o.to.getUnqualifiedURI().toString();});


e.exports=a.ScriptPathState=m;});

/** js/modules/TypeaheadUtil.js */
__d("TypeaheadUtil",["function-extensions"],function(a,b,c,d,e,f){



b('function-extensions');











var g=/[ ]+/g,
h=/[^ ]+/g,
i=/[.,+*?$|#{}()\^\-\[\]\\\/!@%'"~=<>_:;\u2010\u2011\u2012\u2013\u2014\u2015\u30fb\uff1a]/g,


j={},
k=
{a:"\u0430 \u00e0 \u00e1 \u00e2 \u00e3 \u00e4 \u00e5",
b:"\u0431",
c:"\u0446 \u00e7 \u010d",
d:"\u0434 \u00f0 \u010f \u0111",
e:"\u044d \u0435 \u00e8 \u00e9 \u00ea \u00eb \u011b",
f:"\u0444",
g:"\u0433 \u011f",
h:"\u0445 \u0127",
i:"\u0438 \u00ec \u00ed \u00ee \u00ef \u0131",
j:"\u0439",
k:"\u043a \u0138",
l:"\u043b \u013e \u013a \u0140 \u0142",
m:"\u043c",
n:"\u043d \u00f1 \u0148 \u0149 \u014b",
o:"\u043e \u00f8 \u00f6 \u00f5 \u00f4 \u00f3 \u00f2",
p:"\u043f",
r:"\u0440 \u0159 \u0155",
s:"\u0441 \u015f \u0161 \u017f",
t:"\u0442 \u0165 \u0167 \u00fe",
u:"\u0443 \u044e \u00fc \u00fb \u00fa \u00f9 \u016f",
v:"\u0432",
y:"\u044b \u00ff \u00fd",
z:"\u0437 \u017e",
ae:"\u00e6",
oe:"\u0153",
ts:"\u0446",
ch:"\u0447",
ij:"\u0133",
sh:"\u0448",
ss:"\u00df",
ya:"\u044f"};


for(var l in k){
var m=k[l].split(' ');
for(var n=0;n<m.length;n++)
j[m[n]]=l;}




var o={};


function p(v){
return v?v.replace(i,' '):'';}



function q(v){
v=(''+v).toLowerCase();
var w='',
x='';
for(var y=v.length;y--;){
x=v.charAt(y);
w=(j[x]||x)+w;}

return w.replace(g,' ');}



function r(v){
var w=[],
x=h.exec(v);

while(x){
x=x[0];
w.push(x);
x=h.exec(v);}

return w;}





function s(v,w){
v=''+v;
if(!o.hasOwnProperty(v)){
var x=q(v),
y=p(x);
o[v]=
{value:v,
flatValue:x,
tokens:r(y),
isPrefixQuery:y&&y[y.length-1]!=' '};}




if(w&&typeof o[v].sortedTokens=='undefined'){
o[v].sortedTokens=o[v].tokens.slice();
o[v].sortedTokens.sort(function(z,aa){
return aa.length-z.length;});}


return o[v];}


function t(v,w,x){

var y=s(w,v=='prefix'),
z=v=='prefix'?y.sortedTokens:
y.tokens,
aa=s(x).tokens,

ba={},
ca=
y.isPrefixQuery&&v=='query'?
z.length-1:null,


da=function(ea,fa){
for(var ga=0;ga<aa.length;++ga){
var ha=aa[ga];
if(!ba[ga]&&
(ha==ea||
((v=='query'&&fa===ca||
v=='prefix')&&
ha.indexOf(ea)===0)))
return (ba[ga]=true);}


return false;};


return z.length&&z.every(da);}












var u=
{parse:s,
isExactMatch:t.curry('exact'),
isQueryMatch:t.curry('query'),
isPrefixMatch:t.curry('prefix')};









































e.exports=u;});

/** js/modules/DataSource.js */
__d("DataSource",["array-extensions","ArbiterMixin","AsyncRequest","TypeaheadUtil","copyProperties","createArrayFrom","createObjectFrom","emptyFunction"],function(a,b,c,d,e,f){



b('array-extensions');

var g=b('ArbiterMixin'),
h=b('AsyncRequest'),
i=b('TypeaheadUtil'),

j=b('copyProperties'),
k=b('createArrayFrom'),
l=b('createObjectFrom'),
m=b('emptyFunction');




























































function n(o){
this._maxResults=o.maxResults||10;

this.token=o.token;
this.queryData=o.queryData||{};
this.queryEndpoint=o.queryEndpoint||'';
this.bootstrapData=o.bootstrapData||{};
this.bootstrapEndpoint=o.bootstrapEndpoint||'';
this._exclusions=o.exclusions||[];
this._indexedFields=o.indexedFields||['text','tokens'];
this._titleFields=o.titleFields||[];
this._alwaysPrefixMatch=o.alwaysPrefixMatch||false;
this._deduplicationKey=o.deduplicationKey||null;
this._minExactMatchLength=4;
this._filters=[];}


j(n.prototype,g,



{events:['bootstrap','query','respond'],





init:function(){
this.init=m;
this._fields=l(this._indexedFields);
this._activeQueries=0;
this.dirty();},







dirty:function(){
this.value='';
this._bootstrapped=false;
this._bootstrapping=false;

this._data={};
this.localCache={};
this.queryCache={};
this.inform('dirty',{});
return this;},







bootstrap:function(){
if(this._bootstrapped)return;
this.bootstrapWithoutToken();
this._bootstrapped=true;
this._bootstrapping=true;
this.inform('bootstrap',{bootstrapping:true});},


bootstrapWithoutToken:function(){
this.fetch(this.bootstrapEndpoint,this.bootstrapData,
{bootstrap:true,
token:this.token});},



bootstrapWithToken:function(){
var o=j({},this.bootstrapData);
o.token=this.token;
this.fetch(this.bootstrapEndpoint,o,
{bootstrap:true,
replaceCache:true});},





















query:function(o,p,q){
this.inform('beforeQuery',{value:o});

var r=this.buildUids(o,[],q),
s=this.respond(o,r);

this.value=o;
this.inform('query',{value:o,results:s});

var t=i.parse(o).flatValue;
if(p||
!t||
!this.queryEndpoint||
this.getQueryCache().hasOwnProperty(t)||
!this.shouldFetchMoreResults(s))
return false;


this.inform('queryEndpoint',{value:o});

this.fetch
(this.queryEndpoint,
this.getQueryData(o,r),
{value:o,exclusions:q});


return true;},


shouldFetchMoreResults:function(o){
return o.length<this._maxResults;},












getQueryData:function(o,p){
var q=j({value:o},this.queryData||{});
p=p||[];
if(p.length)
q.existing_ids=p.join(',');

if(this._bootstrapping)

q.bsp=true;

return q;},










setQueryData:function(o,p){
if(p)
this.queryData={};

j(this.queryData,o);
return this;},










setBootstrapData:function(o,p){
if(p)
this.bootstrapData={};

j(this.bootstrapData,o);
return this;},








getExclusions:function(){
return k(this._exclusions);},














setExclusions:function(o){
this._exclusions=o||[];},












addFilter:function(o){
var p=this._filters;
p.push(o);

return {remove:function(){
p.splice(p.indexOf(o),1);}};},







clearFilters:function(){
this._filters=[];},














respond:function(o,p,q){
var r=this.buildData(p);
this.inform('respond',
{value:o,
results:r,
isAsync:!!q});

return r;},






asyncErrorHandler:m,










fetch:function(o,p,q){
if(!o)return;
var r=new h().
setURI(o).
setData(p).
setMethod('GET').
setReadOnly(true).
setHandler(function(s){
this.fetchHandler(s,q||{});}.
bind(this));

if(o===this.queryEndpoint)

r.setFinallyHandler(function(){
this._activeQueries--;
if(!this._activeQueries)
this.inform('activity',{activity:false});}.

bind(this));


r.setErrorHandler(this.asyncErrorHandler);

this.inform('beforeFetch',{request:r,fetch_context:q});

r.send();

if(o===this.queryEndpoint){
if(!this._activeQueries)
this.inform('activity',{activity:true});

this._activeQueries++;}},











fetchHandler:function(o,p){
var q=p.value,
r=p.exclusions;

if(!q&&p.replaceCache)

this.localCache={};

this.addEntries(o.getPayload().entries,q);
this.inform('fetchComplete',
{response:o,
value:q,
fetch_context:p});



var s=(!q&&this.value)?this.value:q;
this.respond(s,this.buildUids(s,[],r),true);


if(!q){
if(this._bootstrapping){
this._bootstrapping=false;
this.inform('bootstrap',{bootstrapping:false});}

if(p.token&&
o.getPayload().token!==p.token)
this.bootstrapWithToken();}},












addEntries:function(o,p){
var q=this.processEntries
(k(o||[]),
p),

r=this.buildUids(p,q);

if(p){
var s=this.getQueryCache();
s[i.parse(p).flatValue]=r;}else 

this.fillCache(r);},













processEntries:function(o,p){
return o.map(function(q,r){
var s=(q.uid=q.uid+''),
t=this.getEntry(s);
if(!t){
t=q;
t.query=p;
this.setEntry(s,t);}else 

j(t,q);


t.index===undefined&&(t.index=r);
return s;},
this);},







getAllEntries:function(){
return this._data||{};},








getEntry:function(o){
return this._data[o]||null;},









setEntry:function(o,p){
this._data[o]=p;},










fillCache:function(o){
var p=this.localCache;

o.forEach(function(q){
var r=this.getEntry(q);
if(!r)return;
r.bootstrapped=true;
var s=i.parse(this.getTextToIndex(r)).tokens;
for(var t=0,u=s.length;t<u;++t){
var v=s[t];
if(!p.hasOwnProperty(v))
p[v]={};

p[v][q]=true;}},

this);},











getTextToIndex:function(o){
if(o.textToIndex&&!o.needs_update)
return o.textToIndex;


o.needs_update=false;
o.textToIndex=this.getTextToIndexFromFields(o,this._indexedFields);
return o.textToIndex;},


getTextToIndexFromFields:function(o,p){
var q=[];
for(var r=0;r<p.length;++r){
var s=o[p[r]];
if(s)
q.push(s.join?s.join(' '):s);}


return q.join(' ');},













mergeUids:function(o,p,q,r){
var s=function(t,u){
var v=this.getEntry(t),
w=this.getEntry(u);


if(v.extended_match!==w.extended_match)
return v.extended_match?1:-1;






if(v.index!==w.index)
return v.index-w.index;



if(v.text.length!==w.text.length)
return v.text.length-w.text.length;

return v.uid<w.uid;}.
bind(this);

this._checkExtendedMatch(r,o);
return this.deduplicateByKey
(o.sort(s).concat(p,q));},






_checkExtendedMatch:function(o,p){
var q=this._alwaysPrefixMatch?
i.isPrefixMatch:
i.isQueryMatch;

for(var r=0;r<p.length;++r){
var s=this.getEntry(p[r]);
s.extended_match=s.tokens?!q(o,s.text):false;}},
















buildUids:function(o,p,q){
if(!p)
p=[];


if(!o)
return p;


if(!q)
q=[];


var r=this.buildCacheResults(o,this.localCache),
s=this.buildQueryResults(o),
t=this.mergeUids(r,s,p,o),
u=l(q.concat(this._exclusions)),

v=t.filter(function(w){
if(u.hasOwnProperty(w)||!this.getEntry(w))
return false;

for(var x=0;x<this._filters.length;++x)
if(!this._filters[x](this.getEntry(w),o))
return false;


return (u[w]=true);},
this);
return this.uidsIncludingExact(o,v,u);},

















uidsIncludingExact:function(o,p,q){
var r=p.length;

if(o.length<this._minExactMatchLength||r<=this._maxResults)
return p;


for(var s=0;s<r;++s){
var t=this.getEntry(p[s]);
t.text_lower||(t.text_lower=t.text.toLowerCase());
if(t.text_lower===i.parse(o).flatValue){

if(s>=this._maxResults){
var u=p.splice(s,1);
p.splice(this._maxResults-1,0,u);}

break;}}



return p;},











buildData:function(o){
var p=[],
q=Math.min(o.length,this._maxResults);
for(var r=0;r<q;++r)
p.push(this.getEntry(o[r]));

return p;},












findQueryCache:function(o){
var p=0,
q=null,
r=this.getQueryCache();

for(var s in r)
if(o.indexOf(s)===0&&s.length>p){
p=s.length;
q=s;}


return r[q]||[];},







buildQueryResults:function(o){
var p=i.parse(o).flatValue,
q=this.findQueryCache(p);


if(this.getQueryCache().hasOwnProperty(p))
return q;

return this.filterQueryResults(o,q);},








filterQueryResults:function(o,p){
var q=this._alwaysPrefixMatch?
i.isPrefixMatch:
i.isQueryMatch;
return p.filter(function(r){
return q(o,this.getTextToIndex(this.getEntry(r)));},
this);},
















buildCacheResults:function(o,p){
var q=i.parse(o,this._alwaysPrefixMatch),
r=this._alwaysPrefixMatch?
q.sortedTokens:
q.tokens,
s=r.length,
t=q.isPrefixQuery?s-1:null,
u={},
v={},
w={},
x=[],
y=false,
z={},
aa=0;

for(var ba=0;ba<s;++ba){
var ca=r[ba];

if(!z.hasOwnProperty(ca)){
aa++;
z[ca]=true;}else 

continue;


for(var da in p)


if((!u.hasOwnProperty(da)&&da===ca)||
((this._alwaysPrefixMatch||t===ba)&&
da.indexOf(ca)===0)){

if(da===ca){
if(v.hasOwnProperty(da))
y=true;

u[da]=true;}else{

if(u.hasOwnProperty(da)||
v.hasOwnProperty(da))
y=true;

v[da]=true;}


for(var ea in p[da])
if(ba===0||(w.hasOwnProperty(ea)&&
w[ea]==aa-1))
w[ea]=aa;}}







for(var fa in w)
if(w[fa]==aa)
x.push(fa);




if(y||aa<s)
x=this.filterQueryResults(o,x);


if(this._titleFields&&this._titleFields.length>0)
x=this.filterNonTitleMatchQueryResults(o,x);

return x;},








filterNonTitleMatchQueryResults:function(o,p){
return p.filter(function(q){
var r=i.parse(o),
s=r.tokens.length;
if(s===0)
return true;

var t=this.getTitleTerms(this.getEntry(q)),

u=r.tokens[0];
return ((s===1)||this._alwaysPrefixMatch)?
i.isPrefixMatch(u,t):
i.isQueryMatch(u,t);},
this);},


getTitleTerms:function(o){
if(o.titleToIndex)
return o.titleToIndex;

return (o.titleToIndex=
this.getTextToIndexFromFields(o,this._titleFields));},


deduplicateByKey:function(o){
if(!this._deduplicationKey)
return o;


var p=l
(o.map(this._getDeduplicationKey.bind(this)),
o);

return o.filter
(function(q){
return p[this._getDeduplicationKey(q)]==q;}.
bind(this));},



_getDeduplicationKey:function(o){
var p=this.getEntry(o);
return p[this._deduplicationKey]||'__'+o+'__';},


getQueryCache:function(){
return this.queryCache;},


setMaxResults:function(o){
this._maxResults=o;
this.value&&this.respond(this.value,this.buildUids(this.value));},


updateToken:function(o){
this.token=o;
this.dirty();
return this;}});




e.exports=n;});

/** js/modules/DimensionTracking.js */
__d("DimensionTracking",["event-extensions","AsyncSignal","Cookie","DOMDimensions","isInIframe"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('AsyncSignal'),
h=b('Cookie'),
i=b('DOMDimensions'),

j=b('isInIframe');

function k(){
var l=i.getViewportDimensions();

h.set('wd',l.width+'x'+l.height);


if(Math.random()<.01)
new g('/ajax/dimension_context.php',
{x:l.width,y:l.height}).
send();}




if(!j()){

setTimeout(k,100);
Event.listen(window,'resize',k);
Event.listen(window,'focus',k);}});

/** js/modules/Emote.js */
__d("Emote",["DOM","Env","htmlize"],function(a,b,c,d,e,f){




var g=b('DOM'),
h=b('Env'),
i=b('htmlize'),

j=40,




k=e.exports=

{_initialized:false,
_imageBase:null,
_emoteMap:null,
_emoteOrderMap:null,
_fbidEmoticonPattern:'\\[\\[([A-Za-z0-9\\.]+)\\]\\]',
_fbidEmoticonRegex:null,
_nonNumericRegex:/^\D+$/,
_imageURLs:null,
_regex:null,
_regexWithoutFBIDs:null,


_init:function(){


var l=h.static_base;
k._imageBase=l+'images/emote/';
k._blankImgSrc=l+'images/blank.gif';

var m=
['smile','frown','tongue','grin','gasp','wink','glasses',
'sunglasses','grumpy','unsure','cry','devil','angel','kiss',
'heart','kiki','squint','confused','upset','pacman','colonthree',
'like','confused_rev'];














k._emoteMap=
{':-)':['\\:\\-\\)','smile'],
':)':['\\:\\)','smile'],
':]':['\\:\\]','smile'],
'=)':['=\\)','smile'],
':-(':['\\:\\-\\(','frown'],
':(':['\\:\\(','frown'],
':[':['\\:\\[','frown'],
'=(':['=\\(','frown'],
':-P':['\\:\\-P','tongue'],
':P':['\\:P','tongue'],
':-p':['\\:\\-p','tongue'],
':p':['\\:p','tongue'],
'=P':['=P','tongue'],
':-D':['\\:\\-D','grin'],
':D':['\\:D','grin'],
'=D':['=D','grin'],
':-O':['\\:\\-O','gasp'],
':O':['\\:O','gasp'],
':-o':['\\:\\-o','gasp'],
':o':['\\:o','gasp'],
';-)':['\\;\\-\\)','wink'],
';)':['\\;\\)','wink'],
'8-)':['8\\-\\)','glasses'],
'8)':['8\\)','glasses'],
'B-)':['B\\-\\)','glasses'],
'B)':['B\\)','glasses'],
'8-|':['8\\-\\|','sunglasses'],
'8|':['8\\|','sunglasses'],
'B-|':['B\\-\\|','sunglasses'],
'B|':['B\\|','sunglasses'],
'>:(':['>\\:\\(','grumpy'],
'>:-(':['>\\:\\-\\(','grumpy'],
':/':['\\:/','unsure'],
':-/':['\\:\\-/','unsure'],
':\\':['\\:\\\\','unsure'],
':-\\':['\\:\\-\\\\','unsure'],
":'(":["\\:'\\(",'cry'],
'3:)':['3\\:\\)','devil'],
'3:-)':['3\\:\\-\\)','devil'],
'O:)':['O\\:\\)','angel'],
'O:-)':['O\\:\\-\\)','angel'],
':-*':['\\:\\-\\*','kiss'],
':*':['\\:\\*','kiss'],
'<3':['<3','heart'],
'&lt;3':['&lt\\;3','heart'],
'\u2665':['\u2665','heart'],
'^_^':['\\^_\\^','kiki'],
'-_-':['\\-_\\-','squint'],
'o.O':['o\\.O','confused'],
'O.o':['O\\.o','confused_rev'],
'>:O':['>\\:O','upset'],
'>:-O':['>\\:\\-O','upset'],
'>:o':['>\\:o','upset'],
'>:-o':['>\\:\\-o','upset'],
'>_<':['>_<','upset'],
'>.<':['>\\.<','upset'],
':v':['\\:v','pacman'],
':|]':['\\:\\|\\]','robot'],
':3':['\\:3','colonthree'],
'<(")':['<\\(\\"\\)','penguin'],
':putnam:':['\\:putnam\\:','putnam'],
'(^^^)':['\\(\\^\\^\\^\\)','shark'],
':42:':['\\:42\\:','42'],
':like:':['\\:like\\:','like'],
'(y)':['\\(y\\)','like'],
'(Y)':['\\(Y\\)','like']};





var n=[],
o=[];




if(h.fbid_emoticons){
k._fbidEmoticonRegex=new RegExp(k._fbidEmoticonPattern);
n.push(k._fbidEmoticonPattern);}


for(var p in k._emoteMap){
var q=k._emoteMap[p][0];
n.push(q);
o.push(q);}


var r=
'(?:^|\\s|\'|"|\\.)('+
n.join('|')+
')(?:\\s|\'|"|\\.|,|!|\\?|<br>|$)',

s=
'(?:^|\\s|\'|"|\\.)('+
o.join('|')+
')(?:\\s|\'|"|\\.|,|!|\\?|<br>|$)';

k._regex=new RegExp(r);
k._regexWithoutFBIDs=new RegExp(s);

k._emoteOrderMap={};
for(var t=0;t<m.length;t++)
k._emoteOrderMap[m[t]]=t;


k._initialized=true;},

























htmlEmote:function(l,m){

return k._htmlEmote(l,m,true);},


htmlEmoteWithoutFBID:function(l,m){
return k._htmlEmote(l,m,false);},


_getRegex:function(l){
return l?
k._regex:
k._regexWithoutFBIDs;},


_htmlEmote:function(l,m,n){
if(typeof m!='function')
m=i;



if(!k._initialized)
k._init();


var o=l,
p=[],








q=j;
while(q--){
var r=k._getRegex(n),

s=r.exec(o);
if(!s||!s.length)
break;


var t=s[1],
u=o.indexOf(t),


v=o.substring(0,u);
if(v)
p.push(m(v));



p.push('<span class="emote_text">');
p.push(t);
p.push('</span>');
var w,








x=k._fbidEmoticonRegex&&
(k._fbidEmoticonRegex.exec(t)||[])[1];
if(x){
w={alt:t};
w.className='emote_custom';
w.src=
window.location.protocol+'//graph.facebook.com/'+
encodeURIComponent(x)+'/picture';
if(k._nonNumericRegex.test(x))

w.title=x;}else{


var y=k._emoteMap[t][1],
z=k._emoteOrderMap[y];
w={title:t,alt:y};

if(z===undefined){

w.className='emote_custom';
w.src=k._imageBase+y+'.gif';}else{


var aa=z*-16;
w.className='emote_img';
w.src=k._blankImgSrc;
w.style={backgroundPosition:aa+'px 0'};}}



var ba=g.create('img',w);
p.push(g.create('span',{},ba).innerHTML);


o=o.substring(u+t.length);}



if(o)
p.push(m(o));


return p.join('');}};});

/** js/modules/SupportedEmoji.js */
__d("SupportedEmoji",["cx"],function(a,b,c,d,e,f){

























var g=b('cx');

e.exports=
{utf16Regex:/[\u203C\u2049\u2100-\u21FF\u2300-\u27FF\u2900-\u29FF\u2B00-\u2BFF\u3000-\u30FF\u3200-\u32FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF]/,

emoji:
{127744:"_2b_",
127746:"_2c0",
127754:"_2c1",
127769:"_2c2",
127775:"_2c3",
127793:"_2c4",
127796:"_2c5",
127797:"_2c6",
127799:"_2c7",
127800:"_2c8",
127801:"_2c9",
127802:"_2ca",
127803:"_2cb",
127806:"_2cc",
127808:"_2cd",
127809:"_2ce",
127810:"_2cf",
127811:"_2cg",
127818:"_2ch",
127822:"_2ci",
127827:"_2cj",
127828:"_2ck",
127864:"_2cl",
127866:"_2cm",
127873:"_2cn",
127875:"_2co",
127876:"_2cp",
127877:"_2cq",
127880:"_2cr",
127881:"_2cs",
127885:"_2ct",
127886:"_2cu",
127887:"_2cv",
127888:"_2cw",
127891:"_2cx",
127925:"_2cy",
127926:"_2cz",
127932:"_2c-",
128013:"_2c_",
128014:"_2d0",
128017:"_2d1",
128018:"_2d2",
128020:"_2d3",
128023:"_2d4",
128024:"_2d5",
128025:"_2d6",
128026:"_2d7",
128027:"_2d8",
128031:"_2d9",
128032:"_2da",
128033:"_2db",
128037:"_2dc",
128038:"_2dd",
128039:"_2de",
128040:"_2df",
128041:"_2dg",
128043:"_2dh",
128044:"_2di",
128045:"_2dj",
128046:"_2dk",
128047:"_2dl",
128048:"_2dm",
128049:"_2dn",
128051:"_2do",
128052:"_2dp",
128053:"_2dq",
128054:"_491",
128055:"_2dr",
128056:"_2ds",
128057:"_2dt",
128058:"_2du",
128059:"_2dv",
128062:"_2dw",
128064:"_2dx",
128066:"_2dy",
128067:"_2dz",
128068:"_2d-",
128069:"_2d_",
128070:"_2e0",
128071:"_2e1",
128072:"_2e2",
128073:"_2e3",
128074:"_2e4",
128075:"_2e5",
128076:"_2e6",
128077:"_2e7",
128078:"_2e8",
128079:"_2e9",
128080:"_2ea",
128102:"_2eb",
128103:"_2ec",
128104:"_2ed",
128105:"_2ee",
128107:"_2ef",
128110:"_2eg",
128111:"_2eh",
128113:"_2ei",
128114:"_2ej",
128115:"_2ek",
128116:"_2el",
128117:"_2em",
128118:"_2en",
128119:"_2eo",
128120:"_2ep",
128123:"_2eq",
128124:"_2er",
128125:"_2es",
128126:"_2et",
128127:"_2eu",
128128:"_2ev",
128130:"_2ew",
128131:"_2ex",
128133:"_2ey",
128139:"_2ez",
128143:"_2e-",
128144:"_2e_",
128145:"_2f0",
128147:"_2f1",
128148:"_2f2",
128150:"_2f3",
128151:"_2f4",
128152:"_2f5",
128153:"_2f6",
128154:"_2f7",
128155:"_2f8",
128156:"_2f9",
128157:"_2fa",
128162:"_2fb",
128164:"_2fc",
128166:"_2fd",
128168:"_2fe",
128169:"_2ff",
128170:"_2fg",
128187:"_2fh",
128189:"_2fi",
128190:"_2fj",
128191:"_2fk",
128192:"_2fl",
128222:"_2fm",
128224:"_2fn",
128241:"_2fo",
128242:"_2fp",
128250:"_2fq",
128276:"_2fr",
128293:"_492",
128513:"_2fs",
128514:"_2ft",
128515:"_2fu",
128516:"_2fv",
128518:"_2fw",
128521:"_2fx",
128523:"_2fy",
128524:"_2fz",
128525:"_2f-",
128527:"_2f_",
128530:"_2g0",
128531:"_2g1",
128532:"_2g2",
128534:"_2g3",
128536:"_2g4",
128538:"_2g5",
128540:"_2g6",
128541:"_2g7",
128542:"_2g8",
128544:"_2g9",
128545:"_2ga",
128546:"_2gb",
128547:"_2gc",
128548:"_2gd",
128549:"_2ge",
128552:"_2gf",
128553:"_2gg",
128554:"_2gh",
128555:"_2gi",
128557:"_2gj",
128560:"_2gk",
128561:"_2gl",
128562:"_2gm",
128563:"_2gn",
128565:"_2go",
128567:"_2gp",
128568:"_2gq",
128569:"_2gr",
128570:"_2gs",
128571:"_2gt",
128572:"_2gu",
128573:"_2gv",
128575:"_2gw",
128576:"_2gx",
128587:"_2gy",
128588:"_2gz",
128589:"_2g-",
128591:"_2g_",
9757:"_2h0",
9786:"_2h1",
9889:"_2h2",
9924:"_2h3",
9994:"_2h4",
9995:"_2h5",
9996:"_2h6",
9728:"_2h7",
9729:"_2h8",
9748:"_2h9",
9749:"_2ha",
10024:"_2hb",
10084:"_2hc"}};});

/** js/modules/Utf16.js */
__d("Utf16",[],function(a,b,c,d,e,f){



var g=




{decode:function(h){
switch(h.length){
case 1:
return h.charCodeAt(0);
case 2:
return 65536|
((h.charCodeAt(0)-55296)*1024)|
(h.charCodeAt(1)-56320);}},







encode:function(h){
if(h<65536){
return String.fromCharCode(h);}else 

return String.fromCharCode(55296+((h-65536)>>10))+
String.fromCharCode(56320+(h%1024));}};




e.exports=g;});

/** js/modules/Emoji.js */
__d("Emoji",["cx","DOM","Emote","SupportedEmoji","htmlize","Utf16"],function(a,b,c,d,e,f){





var g=b('cx'),
h=b('DOM'),
i=b('Emote'),
j=b('SupportedEmoji'),
k=b('htmlize'),
l=b('Utf16'),

m=40,

n=e.exports=
{htmlEmojiAndEmote:function(o,p){
return n.htmlEmoji(o,function(q){
return i.htmlEmote(q,p);});},



htmlEmoji:function(o,p){
if(typeof p!='function')
p=k;


var q=o,
r=[],
s=m;
while(s--){
var t=j.utf16Regex.exec(q);
if(!t||!t.length)
break;

var u=t[0],
v=q.indexOf(u);
r.push(p(q.substring(0,v)));

var w=l.decode(u);

if(j.emoji[w]){
var x="_1az _1a-"+' '+
j.emoji[w],
y=h.create('span',{className:x});


r.push(h.create('span',{},y).innerHTML);}else 

r.push(p(u));


q=q.substring(v+u.length);}


r.push(p(q));

return r.join('');}};});

/** js/modules/MultiBootstrapDataSource.js */
__d("MultiBootstrapDataSource",["Class","DataSource"],function(a,b,c,d,e,f){



var g=b('Class'),
h=b('DataSource');

function i(j){
this._bootstrapEndpoints=j.bootstrapEndpoints;
this.parent.construct(this,j);}


g.extend(i,h);

i.prototype.bootstrapWithoutToken=function(){
for(var j=0;j<this._bootstrapEndpoints.length;j++)
this.fetch
(this._bootstrapEndpoints[j].endpoint,
this._bootstrapEndpoints[j].data||{},
{bootstrap:true});};




e.exports=i;});

/** js/modules/UntrustedLink.js */
__d("UntrustedLink",["DOM","event-extensions","URI","UserAgent","copyProperties"],function(a,b,c,d,e,f){







var g=b('DOM'),
h=b('event-extensions'),
i=b('URI'),
j=b('UserAgent'),

k=b('copyProperties');

function l(m,n,o,p){


this.dom=m;
this.url=m.href;
this.hash=n;
this.func_get_params=p||function(){return {};};


Event.listen(this.dom,'click',this.onclick.bind(this));
Event.listen(this.dom,'mousedown',this.onmousedown.bind(this));
Event.listen(this.dom,'mouseup',this.onmouseup.bind(this));
Event.listen(this.dom,'mouseout',this.onmouseout.bind(this));

this.onmousedown(h.$E(o));}





l.bootstrap=function(m,n,o,p){
if(m.__untrusted)
return;

m.__untrusted=true;
new l(m,n,o,p);};



l.prototype.getRewrittenURI=function(){
var m=k({u:this.url,
h:this.hash},
this.func_get_params(this.dom)),
n=new i('/l.php');




return n.setQueryData(m).setSubdomain('www').setProtocol('http');};



l.prototype.onclick=function(){
(function(){
this.setHref(this.url);}).
bind(this).defer(100);
this.setHref(this.getRewrittenURI());};












l.prototype.onmousedown=function(m){
if(m.button==2)
this.setHref(this.getRewrittenURI());};



l.prototype.onmouseup=function(){
this.setHref(this.getRewrittenURI());};





l.prototype.onmouseout=function(){
this.setHref(this.url);};





l.prototype.setHref=function(m){
if(j.ie()<9){

var n=g.create('span');
g.appendContent(this.dom,n);
this.dom.href=m;
g.remove(n);}else 

this.dom.href=m;};



e.exports=l;});

/** js/modules/XHPTemplate.js */
__d("XHPTemplate",["event-extensions","DataStore","DOM","HTML","copyProperties"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('DataStore'),
h=b('DOM'),
i=b('HTML'),

j=b('copyProperties');

function k(m){
this._model=m;}


j(k.prototype,




{render:function(){

if(i.isHTML(this._model))
this._model=h.setContent
(document.createDocumentFragment(),
this._model)[
0];

return this._model.cloneNode(true);},


build:function(){
return new l(this.render());}});




j(k,







{getNode:function(m,n){
return k.getNodes(m)[n];},







getNodes:function(m){
var n=g.get(m,'XHPTemplate:nodes');
if(!n){
n={};

var o=h.scry(m,'[data-jsid]');
o.push(m);
var p=o.length;
while(p--){
var q=o[p];
n[q.getAttribute('data-jsid')]=q;
q.removeAttribute('data-jsid');}

g.set(m,'XHPTemplate:nodes',n);}

return n;}});





function l(m){
this._root=m;
this._populateNodes();}


j(l.prototype,

{_populateNodes:function(){
this._nodes={};
this._leaves={};
var m=this._root.getElementsByTagName('*');
for(var n=0,o=m.length;n<o;n++){
var p=m[n],
q=p.getAttribute('data-jsid');
if(q){
p.removeAttribute('data-jsid');
this._nodes[q]=p;
this._leaves[q]=!p.childNodes.length;}}},




getRoot:function(){
return this._root;},


getNode:function(m){
return this._nodes[m];},


setNodeProperty:function(m,n,o){
this.getNode(m)[n]=o;
return this;},


setNodeContent:function(m,n){
if(!this._leaves[m])
throw new Error("Can't setContent on non-leaf node: "+m);

h.setContent(this.getNode(m),n);
return this;}});




e.exports=k;});

/** js/modules/randomInt/randomInt.js */
__d("randomInt",[],function(a,b,c,d,e,f){












function g(h,i){
if(arguments.length===1){
i=h;
h=0;}











var j=this.random||Math.random;
return Math.floor(h+j()*(i-h));}


e.exports=g;});

/** js/modules/utils/debounceAcrossTransitions.js */
__d("debounceAcrossTransitions",["debounce"],function(a,b,c,d,e,f){



var g=b('debounce');

function h(i,j,k){
return g(i,j,k,true);}


e.exports=h;});

/** js/ui/layer/behaviors/LayerRemoveOnHide.js */
__d("LayerRemoveOnHide",["function-extensions","DOM","copyProperties"],function(a,b,c,d,e,f){



b('function-extensions');

var g=b('DOM'),

h=b('copyProperties');

function i(j){
this._layer=j;}


h(i.prototype,
{_subscription:null,

enable:function(){
this._subscription=this._layer.subscribe
('hide',
g.remove.curry(this._layer.getRoot()));},



disable:function(){
if(this._subscription){
this._subscription.unsubscribe();
this._subscription=null;}}});




e.exports=i;});

/** js/timezone.js */





















function tz_calculate(a){
var b=new Date(),
c=b.getTimezoneOffset()/30,

d=b.getTime()/1000,


e=Math.round((a-d)/1800),

f=Math.round(c+e)%48;


if(f==0){
return 0;}else
if(f>24){
f-=Math.ceil(f/48)*48;}else
if(f<-28)
f+=Math.ceil(f/-48)*48;


return f*30;}













function tz_autoset(a,b){
if(!a||undefined==b)
return;



if(window.tz_autoset.calculated)
return;

window.tz_autoset.calculated=true;

var c=-tz_calculate(a);

if(c!=b){
var d='/ajax/autoset_timezone_ajax.php';
new AsyncRequest().
setURI(d).
setData({gmt_off:c}).
setErrorHandler(emptyFunction).
setTransportErrorHandler(emptyFunction).
setOption('suppressErrorAlerts',true).
send();}}

/** js/channel2/AjaxRequest.js */
__d("AjaxRequest",["ErrorUtils","Keys","URI","UserAgent","XHR","copyProperties"],function(a,b,c,d,e,f){



var g=b('ErrorUtils'),
h=b('Keys'),
i=b('URI'),
j=b('UserAgent'),
k=b('XHR'),

l=b('copyProperties');














































































































function m(q,r,s){
this.xhr=k.create();

if(!(r instanceof i))
r=new i(r);


if(s&&q=='GET'){
r.setQueryData(s);}else 

this._params=s;


this.method=q;
this.uri=r;

this.xhr.open(q,r);}


var n=window.XMLHttpRequest&&
('withCredentials' in new XMLHttpRequest());
m.supportsCORS=function(){return n;};



m.ERROR='ar:error';
m.TIMEOUT='ar:timeout';
m.PROXY_ERROR='ar:proxy error';
m.TRANSPORT_ERROR='ar:transport error';
m.SERVER_ERROR='ar:http error';
m.PARSE_ERROR='ar:parse error';

m._inflight=[];


function o(){
var q=m._inflight;
m._inflight=[];
q.forEach(function(r){
r.abort();});}




function p(q){

q.onJSON=q.onError=q.onSuccess=null;


clearTimeout(q._timer);


if(q.xhr&&q.xhr.readyState<4){
q.xhr.abort();
q.xhr=null;}



m._inflight=m._inflight.filter(function(r){
return r&&r!=q&&r.xhr&&r.xhr.readyState<4;});}



l(m.prototype,
{timeout:60000,

streamMode:true,

prelude:/^for \(;;\);/,


status:null,


_eol:-1,




_call:function(q){
if(this[q])
this[q](this);},








_parseStatus:function(){
var q;

try{this.status=this.xhr.status;
q=this.xhr.statusText;}catch(
r){

if(this.xhr.readyState>=4){
this.errorType=m.TRANSPORT_ERROR;
this.errorText=r.message;}

return;}


if(this.status===0&&!(/^(file|ftp)/.test(this.uri))){




this.errorType=m.TRANSPORT_ERROR;}else
if(this.status>=100&&this.status<200){
this.errorType=m.PROXY_ERROR;}else
if(this.status>=200&&this.status<300){
return;}else
if(this.status>=300&&this.status<400){




this.errorType=m.PROXY_ERROR;}else
if(this.status>=400&&this.status<500){
this.errorType=m.SERVER_ERROR;}else
if(this.status>=500&&this.status<600){
this.errorType=m.PROXY_ERROR;}else
if(this.status==1223){

return;}else
if(this.status>=12001&&this.status<=12156){










this.errorType=m.TRANSPORT_ERROR;}else{

q='unrecognized status code: '+this.status;
this.errorType=m.ERROR;}


if(!this.errorText)
this.errorText=q;},







_parseResponse:function(){
var q,
r=this.xhr.readyState;


try{q=this.xhr.responseText||'';}catch(
s){

if(r>=4){
this.errorType=m.ERROR;
this.errorText='responseText not available - '+s.message;}

return;}



while(this.xhr){
var t=this._eol+1,
u=this.streamMode?q.indexOf('\n',t):q.length;
if(u<0&&r==4)

u=q.length;



if(u<=this._eol)
break;


var v=q;
if(this.streamMode)

v=q.substr(t,u-t).replace(/^\s*|\s*$/g,'');



if(t===0&&this.prelude)
if(this.prelude.test(v))
v=v.replace(this.prelude,'');









this._eol=u;


if(v){

try{this.json=JSON.parse(v);}catch(
s){

var w=(/(<body[\S\s]+?<\/body>)/i).test(q)&&RegExp.$1,
x=
{message:s.message,
'char':t,
excerpt:((t===0&&w)||v).substr(512)};

this.errorType=m.PARSE_ERROR;
this.errorText='parse error - '+JSON.stringify(x);
return;}


g.applyWithGuard(this._call,this,['onJSON']);}}},







_onReadyState:function(){
var q=this.xhr&&this.xhr.readyState||0;

if(this.status==null&&q>=2)
this._parseStatus();


if(!this.errorType&&this.status!=null)


if((q==3&&this.streamMode)||q==4)
this._parseResponse();




if(this.errorType||q==4){
this._time=Date.now()-this._sentAt;
this._call(!this.errorType?'onSuccess':'onError');
p(this);}},






send:function(q){
this.xhr.onreadystatechange=function(){
g.applyWithGuard(this._onReadyState,this,arguments);}.
bind(this);

var r=this.timeout;
if(r)
this._timer=setTimeout
((function(){
this.errorType=m.TIMEOUT;
this.errorText='timeout';
this._time=Date.now()-this._sentAt;
this._call('onError');
p(this);}).
bind(this),
r,
false);




m._inflight.push(this);

if(this.method=='POST')
this.xhr.setRequestHeader('Content-Type',
'application/x-www-form-urlencoded');


this._sentAt=Date.now();
this.xhr.send(q?i.implodeQuery(q):'');},





abort:function(){
p(this);},





toString:function(){
var q='[AjaxRequest readyState='+this.xhr.readyState;
if(this.errorType)
q+=' errorType='+this.errorType+' ('+this.errorText+')';

return q+']';},





toJSON:function(){
var q=
{json:this.json,
status:this.status,
errorType:this.errorType,
errorText:this.errorText,
time:this._time};



if(this.errorType)
q.uri=this.uri;



for(var r in q)
if(q[r]==null)
delete q[r];



return q;}});




if(window.addEventListener&&j.firefox())
window.addEventListener('keydown',function(event){
if(event.keyCode===h.ESC)
event.prevent();},

false);


if(window.attachEvent)


window.attachEvent('onunload',o);


e.exports=m;});

/** js/channel2/ChannelConstants.js */
__d("ChannelConstants",[],function(a,b,c,d,e,f){



var g='channel/',

h=






{ON_SHUTDOWN:g+'shutdown',


ON_INVALID_HISTORY:g+'invalid_history',


ON_CONFIG:g+'config',






ON_ENTER_STATE:g+'enter_state',






ON_EXIT_STATE:g+'exit_state',


OK:'ok',
ERROR:'error',
ERROR_MAX:'error_max',
ERROR_MISSING:'error_missing',
ERROR_MSG_TYPE:'error_msg_type',
ERROR_SHUTDOWN:'error_shutdown',




ERROR_STALE:'error_stale',


SYS_OWNER:'sys_owner',
SYS_NONOWNER:'sys_nonowner',
SYS_ONLINE:'sys_online',
SYS_OFFLINE:'sys_offline',
SYS_TIMETRAVEL:'sys_timetravel',


HINT_AUTH:'shutdown auth',
HINT_CONN:'shutdown conn',
HINT_DISABLED:'shutdown disabled',
HINT_INVALID_STATE:'shutdown invalid state',
HINT_MAINT:'shutdown maint',
HINT_UNSUPPORTED:'shutdown unsupported',


reason_Unknown:0,
reason_AsyncError:1,
reason_TooLong:2,
reason_Refresh:3,
reason_RefreshDelay:4,
reason_UIRestart:5,
reason_NeedSeq:6,
reason_PrevFailed:7,
reason_IFrameLoadGiveUp:8,
reason_IFrameLoadRetry:9,
reason_IFrameLoadRetryWorked:10,
reason_PageTransitionRetry:11,
reason_IFrameLoadMaxSubdomain:12,
reason_NoChannelInfo:13,
reason_NoChannelHost:14,




getArbiterType:function(i){
return g+'message:'+i;}};



e.exports=h;});

/** js/channel2/FBAjaxRequest.js */
__d("FBAjaxRequest",["$","AjaxRequest","copyProperties","XHR"],function(a,b,c,d,e,f){



var g=b('$'),
h=b('AjaxRequest'),
i=b('copyProperties'),
j=b('XHR');





function k(l,m,n){


n=i(j.getAsyncParams(l),n);

var o=new h(l,m,n);

o.streamMode=false;


var p=o._call;
o._call=function(q){
if(q=='onJSON'&&this.json){
if(this.json.error){
this.errorType=h.SERVER_ERROR;
this.errorText='AsyncResponse error: '+this.json.error;}

this.json=this.json.payload;}

p.apply(this,arguments);};


return o;}


e.exports=k;});

/** js/mercury/callback_manager/CallbackManagerController.js */
__d("CallbackManagerController",["ErrorUtils","copyProperties"],function(a,b,c,d,e,f){



var g=b('ErrorUtils'),
h=b('copyProperties'),













i=function(j){

this._pendingIDs=[];


this._allRequests=[undefined];
this._callbackArgHandler=j;};


h(i.prototype,










{executeOrEnqueue:function(j,k,l){
l=l||{};

var m=this._attemptCallback(k,j,l);

if(m)
return 0;


this._allRequests.push({fn:k,request:j,options:l});
var n=this._allRequests.length-1;
this._pendingIDs.push(n);

return n;},








unsubscribe:function(j){
delete this._allRequests[j];},





reset:function(){
this._allRequests=[];},





getRequest:function(j){
return this._allRequests[j];},


runPossibleCallbacks:function(){





var j=this._pendingIDs;
this._pendingIDs=[];
var k=[];

j.forEach(function(l){
var m=this._allRequests[l];
if(!m)

return;


if(this._callbackArgHandler(m.request,m.options)){
k.push(l);}else 

this._pendingIDs.push(l);}.

bind(this));

k.forEach(function(l){
var m=this._allRequests[l];
delete this._allRequests[l];
this._attemptCallback(m.fn,m.request,m.options);}.
bind(this));},






_attemptCallback:function(j,k,l){
var m=this._callbackArgHandler(k,l);
if(m){
var n=
{ids:k};

g.applyWithGuard(j,n,m);}

return !!m;}});



e.exports=i;});

/** js/mercury/callback_manager/KeyedCallbackManager.js */
__d("KeyedCallbackManager",["CallbackManagerController","ErrorUtils","copyProperties"],function(a,b,c,d,e,f){







var g=b('CallbackManagerController'),
h=b('ErrorUtils'),
i=b('copyProperties'),

j=function(){
this._resources={};
this._controller=new g
(this._constructCallbackArg.bind(this));};



i(j.prototype,















{executeOrEnqueue:function(k,l){
if(!(k instanceof Array)){
var m=k,
n=l;

k=[k];
l=function(o){
n(o[m]);};}



k=k.filter(function(o){
var p=(o!==null&&o!==undefined);

if(!p)

h.applyWithGuard(function(){
throw new Error
('KeyedCallbackManager.executeOrEnqueue: key '+
JSON.stringify(o)+
' is invalid');});




return p;});


return this._controller.executeOrEnqueue(k,l);},








unsubscribe:function(k){
this._controller.unsubscribe(k);},





reset:function(){
this._controller.reset();
this._resources={};},






getUnavailableResources:function(k){
var l=this._controller.getRequest(k),
m=[];
if(l)
m=l.request.filter(function(n){
return !this._resources[n];}.
bind(this));

return m;},








addResourcesAndExecute:function(k){
i(this._resources,k);
this._controller.runPossibleCallbacks();},





setResource:function(k,l){
this._resources[k]=l;
this._controller.runPossibleCallbacks();},







getResource:function(k){
return this._resources[k];},





getAllResources:function(){
return this._resources;},





dumpResources:function(){
var k={};
for(var l in this._resources){
var m=this._resources[l];
if(typeof m==='object')
m=i({},m);

k[l]=m;}

return k;},






_constructCallbackArg:function(k){
var l={};
for(var m=0;m<k.length;m++){
var n=k[m],
o=this._resources[n];

if(typeof o=='undefined')
return false;


l[n]=o;}


return [l];}});



e.exports=j;});

/** js/mercury/callback_manager/BaseAsyncLoader.js */
__d("BaseAsyncLoader",["KeyedCallbackManager","copyProperties"],function(a,b,c,d,e,f){


















var g=b('KeyedCallbackManager'),

h=b('copyProperties'),

i={};

function j(l,m,n){
var o=new g(),
p=false,
q=[];





function r(){
if(!q.length||p)
return;



p=true;

t.defer();}


function s(w){
p=false;



w.forEach(o.unsubscribe.bind(o));

r();}


function t(){
var w={},
x=[];
q=q.filter(function(z){
var aa=o.getUnavailableResources(z);
if(aa.length){
aa.forEach(function(ba){w[ba]=true;});
x.push(z);
return true;}

return false;});


var y=Object.keys(w);
if(y.length){
n
(l,
y,
x,
u.curry(x),
v.curry(x));}else 

p=false;}



function u(w,x){

var y=x.payload[m]||x.payload;
o.addResourcesAndExecute(y);

s(w);}


function v(w){
s(w);}







return {get:function(w,x){
var y=o.executeOrEnqueue(w,x),
z=o.getUnavailableResources(y);
if(z.length){
q.push(y);
r();}},






getCachedKeys:function(){
return Object.keys(o.getAllResources());},





getNow:function(w){
return o.getResource(w)||null;},





set:function(w){
o.addResourcesAndExecute(w);}};}





function k(l,m){



throw ('BaseAsyncLoader can\'t be instantiated');}


h(k.prototype,

{_getLoader:function(){
if(!i[this._endpoint])
i[this._endpoint]=
j
(this._endpoint,
this._type,
this.send);

return i[this._endpoint];},


get:function(l,m){
return this._getLoader().get(l,m);},


getCachedKeys:function(){
return this._getLoader().getCachedKeys();},


getNow:function(l){
return this._getLoader().getNow(l);},


reset:function(){
i[this._endpoint]=null;},


set:function(l){
this._getLoader().set(l);}});




e.exports=k;});

/** js/mercury/callback_manager/AjaxLoader.js */
__d("AjaxLoader",["copyProperties","FBAjaxRequest","BaseAsyncLoader"],function(a,b,c,d,e,f){







var g=b('copyProperties'),

h=b('FBAjaxRequest'),
i=b('BaseAsyncLoader');

function j(k,l){
this._endpoint=k;
this._type=l;}


g(j.prototype,i.prototype);

j.prototype.send=
function(k,l,m,n,o){
var p=new h('GET',k,{ids:l});
p.onJSON=function(q){
n({payload:q.json});};

p.onError=o;
p.send();};


e.exports=j;});

/** js/chat/ShortProfiles.js */
__d("ShortProfiles",["ArbiterMixin","AjaxLoader","Env","FBAjaxRequest","JSLogger","copyProperties"],function(a,b,c,d,e,f){



var g=b('ArbiterMixin'),
h=b('AjaxLoader'),
i=b('Env'),
j=b('FBAjaxRequest'),
k=b('JSLogger'),

l=b('copyProperties'),

m='/ajax/chat/user_info.php',
n='/ajax/chat/user_info_all.php',

o=new h(m,'profiles'),
p=false,

q=k.create('short_profiles');




function r(){
if(!p){
q.log('fetch_all');

p=true;
var u=new j('GET',n,{viewer:i.user});
u.onJSON=function(v){
o.set(v.json);
t.inform('updated');};

u.send();}}



function s(u){
return JSON.parse(JSON.stringify(u));}


var t={};

l(t,g,





{get:function(u,v){
this.getMulti([u],function(w){
v(w[u],u);});},



getMulti:function(u,v){
function w(x){
v(s(x));}

o.get(u,w);},


getNow:function(u){
return s(o.getNow(u)||null);},





getCachedProfileIDs:function(){
return o.getCachedKeys();},


hasAll:function(){
return p;},


fetchAll:function(){
r();},


set:function(u,v){
var w={};
w[u]=v;
this.setMulti(w);},


setMulti:function(u){
o.set(s(u));}});



e.exports=t;});

/** js/mercury/models/MercuryServerDispatcher.js */
__d("MercuryServerDispatcher",["AsyncRequest","JSLogger","URI","areObjectsEqual","copyProperties","debounceAcrossTransitions"],function(a,b,c,d,e,f){


var g=b('AsyncRequest'),
h=b('JSLogger'),
i=b('URI'),

j=b('areObjectsEqual'),
k=b('copyProperties'),
l=b('debounceAcrossTransitions'),

m={},

n=h.create('mercury_dispatcher'),

o=false,

p=
{IMMEDIATE:'immediate',
IDEMPOTENT:'idempotent',
BATCH_SUCCESSIVE:'batch-successive',
BATCH_SUCCESSIVE_UNIQUE:'batch-successive-unique',
BATCH_SUCCESSIVE_PIGGYBACK_ON_ERROR:'batch-successive-piggyback-retry',
BATCH_DEFERRED_MULTI:'batch-deferred-multi',
BATCH_CONDITIONAL:'batch-conditional',

registerEndpoints:function(r){
for(var s in r){
var t=r[s];
m[s]=new q(s,t);}},



trySend:function(r,s,t){
m[r].trySend(s,t);}};



function q(r,s){
var t=s.mode||p.IMMEDIATE;

switch(t){
case p.IMMEDIATE:
case p.IDEMPOTENT:
case p.BATCH_SUCCESSIVE:
case p.BATCH_SUCCESSIVE_UNIQUE:
case p.BATCH_SUCCESSIVE_PIGGYBACK_ON_ERROR:
case p.BATCH_DEFERRED_MULTI:
case p.BATCH_CONDITIONAL:
break;

default:throw new Error('Invalid MercuryServerDispatcher mode '+t);
}

this._endpoint=r;
this._mode=t;
this._combineData=s.batch_function;
this._combineDataIf=s.batch_if;
this._handler=s.handler;

this._errorHandler=s.error_handler;
this._transportErrorHandler=
s.transport_error_handler||s.error_handler;
this._serverDialogCancelHandler=
s.server_dialog_cancel_handler||s.error_handler;

this._deferredSend=l(this._batchSend,0,this);}


k(q.prototype,
{_inFlight:0,
_handler:null,
_errorHandler:null,
_transportErrorHandler:null,
_serverDialogCancelHandler:null,
_combineData:null,













trySend:function(r,s){
if(o)
return;


if(typeof r=='undefined')
r=null;


var t=s||this._mode;
if(t==p.IMMEDIATE){
this._send(r);}else
if(t==p.IDEMPOTENT){
if(!this._inFlight)
this._send(r);}else

if(t==p.BATCH_SUCCESSIVE||
t==p.BATCH_SUCCESSIVE_UNIQUE){
if(!this._inFlight){
this._send(r);}else 

this._batchData(r);}else

if(t==p.BATCH_CONDITIONAL){





if(this._inFlight&&
(this._combineDataIf(this._pendingRequestData,r)||
this._combineDataIf(this._batchedData,r))){
this._batchData(r);}else 

this._send(r);}else

if(t==p.BATCH_DEFERRED_MULTI){
this._batchData(r);
this._deferredSend();}else
if(t==p.BATCH_SUCCESSIVE_PIGGYBACK_ON_ERROR){


this._batchData(r);
if(!this._inFlight)
this._batchSend();}},




_send:function(r){
this._inFlight++;
this._pendingRequestData=k({},r);

n.log('send',{endpoint:this._endpoint,
data:r,
inflight_count:this._inFlight});

new g(this._endpoint).
setData(r).
setHandler(this._handleResponse.bind(this)).
setErrorHandler(this._handleError.bind(this)).
setTransportErrorHandler(this._handleTransportError.bind(this)).
setServerDialogCancelHandler(this._handleServerDialogCancel.bind(this)).
setAllowCrossPageTransition(true).
send();},


_batchData:function(r){
if(this._mode==p.BATCH_SUCCESSIVE_UNIQUE&&
typeof this._pendingRequestData!='undefined'&&
j(r,this._pendingRequestData)){



return;}else
if(typeof this._batchedData=='undefined'){
this._batchedData=r;}else 

this._batchedData=this._combineData(this._batchedData,r);},



_batchSend:function(){
if(typeof this._batchedData!='undefined'){
this._send(this._batchedData);
delete this._batchedData;}},



_handleResponse:function(r){
this._inFlight--;
n.log('response',{endpoint:this._endpoint,
inflight_count:this._inFlight});

var s=r.getPayload();
o=s&&s.kill_chat;
if(o)
n.log('killswitch_enabled',
{endpoint:this._endpoint,inflight_count:this._inFlight});


if(s&&s.error_payload){
if(this._errorHandler)
this._errorHandler(r);}else 






this._handler&&this._handler(s);


if(this._mode==p.BATCH_SUCCESSIVE||
this._mode==p.BATCH_SUCCESSIVE_UNIQUE||
this._mode==p.BATCH_SUCCESSIVE_PIGGYBACK_ON_ERROR||
this._mode==p.BATCH_CONDITIONAL)
this._batchSend();


delete this._pendingRequestData;},


_handleErrorCommon:function(r,s){
n.error('error',{endpoint:this._endpoint,
inflight_count:this._inFlight-1});
s&&s(r);
this._inFlight--;

var t=this._mode;
if(t==p.BATCH_SUCCESSIVE||
t==p.BATCH_SUCCESSIVE_UNIQUE||
t==p.BATCH_CONDITIONAL){
this._batchSend();}else
if(t==p.BATCH_SUCCESSIVE_PIGGYBACK_ON_ERROR)



if(typeof this._batchedData=='undefined'){
this._batchedData=this._pendingRequestData;}else{

this._batchedData=this._combineData
(this._pendingRequestData,
this._batchedData);

this._batchSend();}



delete this._pendingRequestData;},


_handleError:function(r){
this._handleErrorCommon(r,this._errorHandler);},


_handleTransportError:function(r){
this._handleErrorCommon(r,this._transportErrorHandler);},


_handleServerDialogCancel:function(r){
this._handleErrorCommon(r,this._serverDialogCancelHandler);}});




e.exports=p;});

/** js/react/utils/objMap.js */
__d("objMap",[],function(a,b,c,d,e,f){













var g=function(h,i,j){
var k,
l=0,
m={};
if(!h)
return h;

for(k in h){
if(!h.hasOwnProperty(k))
continue;

m[k]=i.call(j,k,h[k],l++);}

return m;};


e.exports=g;});

/** js/components/Hovercard/HovercardLink.js */
__d("HovercardLink",["URI"],function(a,b,c,d,e,f){



var g=b('URI'),

h=



{getBaseURI:function(){
return g('/ajax/hovercard/hovercard.php');},


constructEndpoint:function(i){
return new g(h.getBaseURI()).
setQueryData({id:i.id});}};



e.exports=h;});

/** js/react/utils/keyMirror.js */
__d("keyMirror",[],function(a,b,c,d,e,f){
















var g=function(h){
var i={},
j;
if(!h)
return h;

for(j in h){
if(!h.hasOwnProperty(j))
continue;

i[j]=j;}

return i;};


e.exports=g;});

/** js/react/utils/throwIf.js */
__d("throwIf",[],function(a,b,c,d,e,f){



var g=function(h,i){
if(h)
throw new Error(i);};



e.exports=g;});

/** js/react/utils/mergeHelpers.js */
__d("mergeHelpers",["keyMirror","throwIf"],function(a,b,c,d,e,f){





var g=b('keyMirror'),
h=b('throwIf'),





i=36,

j=g
({MERGE_ARRAY_FAIL:null,
MERGE_CORE_FAILURE:null,
MERGE_TYPE_USAGE_FAILURE:null,
MERGE_DEEP_MAX_LEVELS:108}),
































k=function(n){
return typeof n!=='object'||n===null;},










l=function(n,o){
h(Array.isArray(n)||Array.isArray(o),j.MERGE_ARRAY_FAIL);},


m=

{MAX_MERGE_DEPTH:i,

isTerminal:k,







normalizeMergeArg:function(n){
return n===undefined||n===null?{}:n;},









checkMergeArgs:function(n,o){
l(n,o);
h(k(n)||k(o),j.MERGE_CORE_FAILURE);},








checkMergeLevel:function(n){
h(n>=i,j.MERGE_DEEP_MAX_LEVELS);}};



e.exports=m;});

/** js/react/utils/merge.js */
__d("merge",["mergeHelpers"],function(a,b,c,d,e,f){



var g=b('mergeHelpers'),

h=g.checkMergeArgs,
i=g.normalizeMergeArg,








j=function(k,l){
var m=i(k),
n=i(l);
h(m,n);
var o,
p,
q={};
for(o in m)
if(m.hasOwnProperty(o))
q[o]=m[o];


for(p in n)
if(n.hasOwnProperty(p))
q[p]=n[p];


return q;};


e.exports=j;});

/** js/ui/xhp/form/mentions/MentionsInputUtils.js */
__d("MentionsInputUtils",[],function(a,b,c,d,e,f){



var g=





{generateDataFromTextWithEntities:function(h){
var i=h.text,
j={};
(h.ranges||[]).forEach(function(k){
var l=k.entities[0];

if(!l.external)
j[l.id]=i.substr(k.offset,k.length);});



return {flattened:i,
mention_data:j};}};




e.exports=g;});
