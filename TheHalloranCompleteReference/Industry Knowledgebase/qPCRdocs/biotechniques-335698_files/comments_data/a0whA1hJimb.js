/*1349062958,173217057*/

if (window.CavalryLogger) { CavalryLogger.start_js(["ON+\/P"]); }

/** js/modules/curry.js */
__d("curry",["bind"],function(a,b,c,d,e,f){



var g=b('bind'),








h=g(null,g,null);

e.exports=h;});

/** js/modules/core/sprintf.js */
__d("sprintf",[],function(a,b,c,d,e,f){












function g(h,i){
i=Array.prototype.slice.call(arguments,1);
var j=0;
return h.replace(/%s/g,function(k){
return i[j++];});}



e.exports=g;});

/** js/modules/Log.js */
__d("Log",["sprintf"],function(a,b,c,d,e,f){













var g=b('sprintf'),

h=
{DEBUG:3,
INFO:2,
WARNING:1,
ERROR:0};


function i(k,l){
var m=Array.prototype.slice.call(arguments,2),
n=g.apply(null,m),
o=window.console;
if(o&&j.level>=k)
o[l in o?l:'log'](n);}



var j=



{level:-1,






Level:h,








debug:i.bind(null,h.DEBUG,'debug'),
info:i.bind(null,h.INFO,'debug'),
warn:i.bind(null,h.WARNING,'debug'),
error:i.bind(null,h.ERROR,'debug')};

e.exports=j;});

/** js/modules/resolveWindow.js */
__d("resolveWindow",[],function(a,b,c,d,e,f){














function g(h){
var i=window,
j=h.split('.');


try{for(var l=0;l<j.length;l++){
var m=j[l],

n=/^frames\[['"]?([a-zA-Z0-9\-_]+)['"]?\]$/.exec(m);

if(n){
i=i.frames[n[1]];}else
if(m==='opener'||m==='parent'||m==='top'){
i=i[m];}else 

return null;}}catch(


k){
return null;}


return i;}


e.exports=g;});

/** js/modules/XD.js */
__d("XD",["function-extensions","Arbiter","DOM","DOMDimensions","Log","URI","UserAgent","copyProperties","isInIframe","resolveWindow"],function(a,b,c,d,e,f){









b('function-extensions');

var g=b('Arbiter'),
h=b('DOM'),
i=b('DOMDimensions'),
j=b('Log'),
k=b('URI'),
l=b('UserAgent'),

m=b('copyProperties'),
n=b('isInIframe'),
o=b('resolveWindow'),

p='fb_xdm_frame_'+location.protocol.replace(':',''),

q=
{_callbacks:[],
_opts:
{autoResize:false,
allowShrink:true,
channelUrl:null,
hideOverflow:false,
resizeTimeout:100,
resizeWidth:false,
expectResizeAck:false,
resizeAckTimeout:6000},


_lastResizeAckId:0,
_resizeCount:0,
_resizeTimestamp:0,
_shrinker:null,




init:function(s){



this._opts=m(m({},this._opts),s);

if(this._opts.autoResize)
this._startResizeMonitor();



g.subscribe
('Connect.Unsafe.resize.ack',
function(t,u){
if(!u.id)
u.id=this._resizeCount;

if(u.id>this._lastResizeAckId)
this._lastResizeAckId=u.id;}.

bind(this));},








send:function(s,t){



t=t||this._opts.channelUrl;

if(!t)
return;


var u={},
v=new k(t);
m(u,s);
m(u,k.explodeQuery(v.getFragment()));
var w=new k(u.origin),
x=w.getDomain()+
(w.getPort()?':'+w.getPort():''),


y=o(u.relation.replace(/^parent\./,'')),
z=y.frames[p];
z?z.proxyMessage(k.implodeQuery(u),[x]):



j.warn('No such frame "'+p+'" to proxyMessage to');},







_computeSize:function(){
var s=i.getDocumentDimensions(),

t=0;
if(this._opts.resizeWidth){

var u=document.body;
if(u.clientWidth<u.scrollWidth){
t=s.width;}else{


var v=u.childNodes;
for(var w=0;w<v.length;w++){
var x=v[w],
y=x.offsetLeft+x.offsetWidth;
if(y>t)
t=y;}}




t=Math.max(t,q.forced_min_width);}

s.width=t;

if(this._opts.allowShrink){


if(!this._shrinker)
this._shrinker=h.create('div');

h.appendContent(document.body,this._shrinker);
s.height=Math.max(this._shrinker.offsetTop,0);}


return s;},






_startResizeMonitor:function(){

var s,
t=document.documentElement;


if(this._opts.hideOverflow){
t.style.overflow='hidden';
document.body.style.overflow='hidden';}



setInterval((function(){
var u=this._computeSize(),

v=Date.now(),
w=this._lastResizeAckId<this._resizeCount&&
(v-this._resizeTimestamp)>this._opts.resizeAckTimeout;

if(!s||
(this._opts.expectResizeAck&&w)||
(this._opts.allowShrink&&s.width!=u.width)||
(!this._opts.allowShrink&&s.width<u.width)||
(this._opts.allowShrink&&s.height!=u.height)||
(!this._opts.allowShrink&&s.height<u.height)){
s=u;
this._resizeCount++;
this._resizeTimestamp=v;

var x=
{type:'resize',
height:u.height,
ackData:
{id:this._resizeCount}};



if(u.width&&u.width!=0)
x.width=u.width;


try{if(k(document.referrer).isFacebookURI()&&
n()&&
window.name&&
window.parent.location&&
window.parent.location.toString&&
k(window.parent.location).isFacebookURI()){


var z=window.parent.document.getElementsByTagName('iframe');
for(var aa=0;aa<z.length;aa=aa+1)
if(z[aa].name==window.name){
if(this._opts.resizeWidth)
z[aa].style.width=x.width+'px';


z[aa].style.height=x.height+'px';}}






this.send(x);}catch(
y){
this.send(x);}}}).


bind(this),this._opts.resizeTimeout);}},







r=m({},q);

e.exports.UnverifiedXD=r;
e.exports.XD=q;



a.UnverifiedXD=r;
a.XD=q;});

/** js/connect_xd.js */
__d("legacy:connect-xd",["XD"],function(a,b,c,d){



a.UnverifiedXD=b('XD').UnverifiedXD;
a.XD=b('XD').XD;},

3);

/** js/lib/primer.js */
__d("legacy:primer",["Primer"],function(a,b,c,d){



b('Primer');},

3);

/** js/modules/DOMEventListener.js */
__d("DOMEventListener",[],function(a,b,c,d,e,f){


















var g,h;

if(window.addEventListener){


g=function(j,k,l){
j.addEventListener(k,l,false);};

h=function(j,k,l){
j.removeEventListener(k,l,false);};}else


if(window.attachEvent){


g=function(j,k,l){
j.attachEvent('on'+k,l);};

h=function(j,k,l){
j.detachEvent('on'+k,l);};}




var i=











{add:function(j,k,l){


g(j,k,l);




return {remove:function(){
h(j,k,l);
j=null;}};},











remove:h};


e.exports=i;});

/** js/modules/PopupWindow.js */
__d("PopupWindow",["DOMDimensions","DOMQuery","UserAgent","copyProperties"],function(a,b,c,d,e,f){






var g=b('DOMDimensions'),
h=b('DOMQuery'),
i=b('UserAgent'),

j=b('copyProperties'),

k=
{_opts:
{allowShrink:true,
strategy:'vector',
timeout:100,
widthElement:null},












init:function(l){
j(k._opts,l);
setInterval(k._resizeCheck,k._opts.timeout);},





_resizeCheck:function(){

var l=g.getViewportDimensions(),
m=k._getDocumentSize(),
n=m.height-l.height,
o=m.width-l.width;


if(o<0&&!k._opts.widthElement)
o=0;

o=o>1?o:0;

if(!k._opts.allowShrink&&n<0)
n=0;



if(n||o)

try{if(window.console&&window.console.firebug)
emptyFunction
('Resizing will not work in firefox with firebug enabled. '+
'See https://bugzilla.mozilla.org/show_bug.cgi?id=691693');

window.resizeBy(o,n);
if(o)
window.moveBy(o/-2,0);}catch(

p){




}},








_getDocumentSize:function(){
var l=g.getDocumentDimensions();


if(k._opts.strategy==='offsetHeight')
l.height=document.body.offsetHeight;



if(k._opts.widthElement){
var m=h.scry(document.body,k._opts.widthElement)[0];
if(m)
l.width=g.getElementDimensions(m).width;}



if(window.Dialog&&Dialog.max_bottom&&Dialog.max_bottom>l.height)
l.height=Dialog.max_bottom;


return l;},





open:function(l,m,n){


var o=typeof window.screenX!='undefined'?
window.screenX:
window.screenLeft,
p=typeof window.screenY!='undefined'?
window.screenY:
window.screenTop,
q=typeof window.outerWidth!='undefined'?
window.outerWidth:
document.body.clientWidth,
r=typeof window.outerHeight!='undefined'?
window.outerHeight:
(document.body.clientHeight-22),
s=parseInt(o+((q-n)/2),10),
t=parseInt(p+((r-m)/2.5),10),
u=
('width='+n+
',height='+m+
',left='+s+
',top='+t);

return window.open(l,'_blank',u);}};




e.exports=k;});

/** js/popup_resizer.js */
__d("legacy:popup-resizer",["PopupWindow"],function(a,b,c,d){



a.PopupResizer=b('PopupWindow');},

3);

/** js/widget_arbiter.js */








WidgetArbiter=
{_findSiblings:function(){

if(WidgetArbiter._siblings)
return;

WidgetArbiter._siblings=[];

for(var a=parent.frames.length-1;a>=0;a--)

try{if(parent.frames[a]&&
parent.frames[a].Arbiter&&
parent.frames[a].Arbiter.inform)
WidgetArbiter._siblings.push(parent.frames[a].Arbiter);}catch(

b){


}},










inform:function(){
WidgetArbiter._findSiblings();
var a=$A(arguments);
WidgetArbiter._siblings.forEach(function(b){
b.inform.apply(b,a);});}};

/** js/widgets/opt_in_popup.js */








var PlatformOptInPopup=function(){};

copyProperties(PlatformOptInPopup,
{DIALOG_URL:'/connect/uiserver.php',
DIALOG_WIDTH:420,
DIALOG_HEIGHT:450,
APP_ID:127760087237610,











open:function(a,b,c){
if(!a)
a='generic';

if(!b)
b='opt.in';


var d=new URI(PlatformOptInPopup.DIALOG_URL);
d.addQueryData
({social_plugin:a,
method:b,
display:'popup',
secure:URI.getRequestURI().isSecure(),
app_id:PlatformOptInPopup.APP_ID});


if(c)
d.addQueryData(c);


return PopupResizer.open(d.toString(),
PlatformOptInPopup.DIALOG_WIDTH,
PlatformOptInPopup.DIALOG_HEIGHT);}});

/** js/window-comm.js */









WindowComm=
{_callbacks:{},

makeHandler:function(a,b){
b=b||'opener';

var c='f'+(Math.random()*(1<<30)).toString(16).replace('.','');
WindowComm._callbacks[c]=a;


return new URI('/connect/window_comm.php').
setQueryData({_id:c,_relation:b}).
getQualifiedURI().
toString();},


_recv:function(a){
var b=new URI(a).getQueryData();
WindowComm._callbacks[b._id](b);}};

/** js/lib/dom/untrusted.js */
__d("legacy:dom-untrusted",["UntrustedLink"],function(a,b,c,d){



a.UntrustedLink=b('UntrustedLink');},

3);

/** js/connect_widget/connect_social_widgets.js */

































function ConnectSocialWidget(a,b){
ConnectSocialWidget.setInstance(b,this);


ConnectSocialWidget.delayUntilDisplayed(function(){
this.initializeObject.call(this,a,b);}.
bind(this));}



copyProperties(ConnectSocialWidget,

{OPT_IN_FACEBOOK_APP_ID:'127760087237610',

TYPE_ACTIVITY:'A',
TYPE_RECOMMENDATIONS:'R',
TYPE_LIKEBOX:'L',



instances:{},









setInstance:function(a,b){
ConnectSocialWidget.instances[a]=b;},









getInstance:function(a){
return ConnectSocialWidget.instances[a];},




popups:{},






login:function(a,b){
ConnectSocialWidget.popups[b]=
{popup:PlatformOptInPopup.open('login','opt.in')};},




aDelayedFunctions:[],

















delayUntilDisplayed:function(a){

ConnectSocialWidget.aDelayedFunctions.push(a);






if(ConnectSocialWidget.aDelayedFunctions.length===1){


if(!ConnectSocialWidget.ndTestDim){
var b=document.createElement('div'),
c=
{position:'absolute',
width:'1px',
height:'1px',
overflow:'hidden',
top:'0px'};


for(var d in c)
if(typeof c[d]==='string')
Style.set(b,d,c[d]);


document.body.appendChild(b);
ConnectSocialWidget.ndTestDim=b;}


ConnectSocialWidget.testForDisplay();}},












testForDisplay:function(){
var a=Vector2.getElementDimensions(ConnectSocialWidget.ndTestDim).y;
if(a!==0){
ConnectSocialWidget.aDelayedFunctions.forEach(function(b){
b();});

ConnectSocialWidget.aDelayedFunctions=[];}else 

ConnectSocialWidget.testForDisplay.defer(100);},












listenForLogin:function(){
if(!ConnectSocialWidget.listenerAttached){
Arbiter.subscribe('platform/socialplugins/login',function(a){
if(a.user!==Env.user)
document.location.reload();});


ConnectSocialWidget.listenerAttached=true;}}});




copyProperties(ConnectSocialWidget.prototype,
{initializeObject:function(a,b){
var c=DOM.scry(document.body,a.sOverflowContainerSelector)[0],
d=DOM.scry(c,'.fbConnectWidgetFooter')[0],
e=d?Vector2.getElementDimensions(d).y:0,
f=a.sOverflowItemsSelector,
g=DOM.scry(document.body,
a.sStreamContainerSelector)[0];
this.fRemoveOverflowElements=
this.removeOverflowElements.bind
(this,
c,
g,
f,
-e);


copyProperties(this,
{bInitialized:true,
sWidgetId:b,
iFooterHeight:e,
ndTop:c,
ndFooter:d,
ndContentContainer:g,
oQueryParams:new URI(window.location.href).getQueryData(),
bComboMode:a.bComboMode,
sOverflowItemsSelector:f});


this.oQueryParams.user=Env.user;

this.fRemoveOverflowElements();

Style.set(g,'visibility','visible');
animation(g).
from('opacity',0).
to('opacity',1).
duration(200).
go();

ConnectSocialWidget.listenForLogin();},










getElementTop:function(a){
var b=DOM.scry(a,'^'+this.sOverflowItemsSelector);
return b[0];},













getItemPosition:function(a){
var b=DOM.scry(this.ndContentContainer,
this.sOverflowItemsSelector),
c=b.length,
d=b.indexOf(a)+1;
return d+'/'+c;},















removeOverflowElements:function(a,
b,
c,
d,
e){
var f,
g=c?
DOM.scry(b,c):
$A(b.childNodes);

if(!e){
var d=d||0,
h=Vector2.getElementDimensions(a).y+
d,
i=Vector2.getElementPosition(a).y;
e=h+i;}


while(g.length>0&&
(f=$(g.pop()))&&
(Vector2.getElementDimensions(f).y+
Vector2.getElementPosition(f).y)>e)
DOM.remove(f);},



login:function(){
ConnectSocialWidget.login(this.appID,this.sWidgetId);},






toggleLogin:function(){
DOM.scry(this.ndTop,'.fbToggleLogin').forEach(function(a){
CSS.toggle(a);});

this.fRemoveOverflowElements();}});







function ActivityWidget(a,b){
this.parent.construct(this,a,b);}


Class.extend(ActivityWidget,'ConnectSocialWidget');



ActivityWidget.REQUEST_INTERVAL=15*1000;


ActivityWidget.ACTIVITY_HEIGHT=45;



ActivityWidget.MAX_INTERVAL=30;


ActivityWidget.MAX_ITEMS=24;

copyProperties(ActivityWidget.prototype,
{initializeObject:function(a,b){
this.parent.initializeObject.call(this,a,b);
this.oQueryParams.nb_activities=
Math.min
(ActivityWidget.MAX_ITEMS,
Math.round
((this.oQueryParams.height||300)/ActivityWidget.ACTIVITY_HEIGHT));


this.oQueryParams.newest=a.iNewestStoryTime||0;},


removeOverflowElements:function(){




if(this.bComboMode&&!this.bFirstRound){
this.bFirstRound=true;

var a=Vector2.getElementPosition(this.ndTop).y,
b=Vector2.getElementDimensions(document.body).y-
(a+this.iFooterHeight),
c=Math.round(b/2),
d=$A(arguments);
d[d.length]=c;

ConnectSocialWidget.prototype.removeOverflowElements.apply(this,d);}else 


ConnectSocialWidget.prototype.removeOverflowElements.
apply(this,arguments);},



hasFriendsActivity:function(){
return DOM.scry(this.ndContentContainer,'div.fbFriendsActivity')[0].
childNodes.length>0;},


hasContent:function(){
return DOM.scry(this.ndTop,this.sOverflowItemsSelector).length>0;},


getEmptyMessage:function(){
return DOM.find(this.ndContentContainer,'div.fbEmptyWidget');},


showEmptyMessage:function(){
var a=this.getEmptyMessage();
if(a)
CSS.show(a);}});










function RecommendationsWidget(a,b){
this.parent.construct(this,a,b);}


Class.extend(RecommendationsWidget,'ConnectSocialWidget');

copyProperties(RecommendationsWidget.prototype,
{initializeObject:function(a,b){
this.parent.initializeObject.call(this,a,b);
this.sActivityParent=a.sActivityParent;
this.cropImages(DOM.scry(this.ndContentContainer,
".fbImageContainer img"),
RecommendationsWidget.IMAGE_HEIGHT,
true);
this.cropImages(DOM.scry(this.ndContentContainer,
"img.fbGalleryImage"),
RecommendationsWidget.GALLERY_IMAGE_HEIGHT,
false);},


cropImages:function(a,b,c){



if(a.length>0){
var d=function(event){
RecommendationsWidget.image_resize
({image:event.getTarget(),
dimension:b,
centerimage:c});};


a.forEach(function(e){
if(e.complete){
RecommendationsWidget.image_resize
({image:e,
dimension:b,
centerimage:c});}else 

Event.listen(e,'load',d);});}},





hasContent:function(){
return this.ndContentContainer.childNodes.length>0;},


getParent:function(){
if(this.sActivityParent)
return ConnectSocialWidget.getInstance(this.sActivityParent);},








showRecommendationsSeparator:function(){
var a=this.getParent();
if(a&&a.hasContent()){
var b=
DOM.scry(this.ndTop,'div.fbRecommendationsSeparator')[0];
CSS.show(b);
Style.set(b,'visibility','visible');}

return this;},


removeOverflowElements:function(){
ConnectSocialWidget.prototype.removeOverflowElements.apply(this,arguments);
if(this.sActivityParent&&!this.hasContent()){
var a=
DOM.scry(this.ndTop,'div.fbRecommendationsSeparator')[0];
CSS.hide(a);}}});




RecommendationsWidget.IMAGE_HEIGHT=35;
RecommendationsWidget.GALLERY_IMAGE_HEIGHT=105;







function LikeBoxWidget(a,b){
this.parent.construct(this,a,b);}


Class.extend(LikeBoxWidget,'ConnectSocialWidget');

copyProperties(LikeBoxWidget.prototype,

{});







RecommendationsWidget.image_resize=function(a){
var b=a.image,
c=Vector2.getElementDimensions(b),
d=c.y,
e=c.x,
f=a.dimension,
g=f+'px',
h=a.centerimage;



if(d<=5||e<=5)
return;




var i=d/e;
if(i<.5||i>2)
return;


if(d===e){
Style.set(b,'width',g);}else
if(d<e){

var j=f/d,
k=-Math.round((e-d)*j/2);
Style.set(b,'height',g);
h&&Style.set(b,'marginLeft',k+'px');}else{



var j=f/e,
l=-Math.round((d-e)*j/2);
Style.set(b,'width',g);
h&&Style.set(b,'marginTop',l+'px');}



Style.set(b,'visibility','visible');
Style.set(b.parentNode,'background','transparent');
var m=Parent.byClass(b,'fbRecommendation');
if(m)
CSS.removeClass(m,'invisible_elem');};

/** js/lib/net/error_signal.js */
__d("legacy:error-signal",["ErrorSignal"],function(a,b,c,d){



var e=b('ErrorSignal');
a.send_error_signal=e.sendErrorSignal;
a.logJSError=e.logJSError;},

3);

/** js/plugins/PluginMessage.js */
__d("PluginMessage",["DOMEventListener"],function(a,b,c,d,e,f){



var g=b('DOMEventListener'),




h=
{listen:function(){
g.add(window,'message',function(event){
if((/\.facebook\.com$/).test(event.origin)&&
/^FB_POPUP:/.test(event.data)){
var i=JSON.parse(event.data.substring(9));
if('reload' in i)
document.location.replace(i.reload);}});}};






e.exports=h;});

/** js/plugins/PluginPerms.js */
__d("PluginPerms",["DOMEvent","DOMEventListener","PluginMessage","PopupWindow","URI","bind","copyProperties"],function(a,b,c,d,e,f){















































var g=b('DOMEvent'),
h=b('DOMEventListener'),
i=b('PluginMessage'),
j=b('PopupWindow'),
k=b('URI'),
l=b('bind'),
m=b('copyProperties');


function n(o,p){
m
(this,
{return_params:k.getRequestURI().getQueryData(),
login_params:{},
perms_params:{},
perms:[],
plugin:o,
app:p});

this.addReturnParams({ret:'perms'});





delete this.return_params.hash;}


m
(n.prototype,

{addReturnParams:function(o){
m(this.return_params,o);},


addLoginParams:function(o){
m(this.login_params,o);},


addPermsParams:function(o){
m(this.perms_params,o);},


addPerms:function(o){
this.perms.push.apply(this.perms,o);},


start:function(){
var o=k('/dialog/plugin.perms').
addQueryData(this.perms_params).addQueryData

({display:'popup',
app_id:this.app,
perms:this.perms.join(','),
secure:k.getRequestURI().isSecure(),
social_plugin:this.plugin,
return_params:JSON.stringify(this.return_params),
login_params:JSON.stringify(this.login_params)});

this.popup=j.open(o.toString(),210,450);
i.listen();}});



n.starter=function(o,p,q,r,s,t){
var u=new n(o,p);
u.addReturnParams(r||{});
u.addLoginParams(s||{});
u.addPermsParams(t||{});
u.addPerms(q||[]);
return l(u,u.start);};


n.listen=function(o,p,q,r,s,t,u){
h.add(o,'click',function(v){
new g(v).kill();
n.starter(p,q,r,s,t,u)();});};



e.exports=n;});

/** js/plugins/UnverifiedXD.js */
__d("UnverifiedXD",["XD","XDUnverifiedChannel"],function(a,b,c,d,e,f){








var g=b('XD').UnverifiedXD,
h=c('XDUnverifiedChannel').channel;

g.init({channelUrl:h});

e.exports=g;});

/** js/plugins/PluginResize.js */
__d("PluginResize",["Log","UnverifiedXD","bind","copyProperties","curry"],function(a,b,c,d,e,f){






































var g=b('Log'),
h=b('UnverifiedXD'),
i=b('bind'),
j=b('copyProperties'),
k=b('curry');

function l(o){
o=o||document.body;
return o.offsetWidth+o.offsetLeft;}


function m(o){
o=o||document.body;
return o.offsetHeight+o.offsetTop;}


function n(o,p,event){
this.calcWidth=o||l;
this.calcHeight=p||m;
this.width=undefined;
this.height=undefined;
this.event=event||'resize';}


j
(n.prototype,

{resize:function(){
var o=this.calcWidth(),p=this.calcHeight();
if(o!==this.width||p!==this.height){
g.debug('Resizing Plugin: (%s, %s, %s)',o,p,this.event);
this.width=o;
this.height=p;
h.send({type:this.event,width:o,height:p});}

return this;},


auto:function(o){
setInterval(i(this,this.resize),o||250);
return this;}});




n.auto=function(o,event,p){
return new n
(k(l,o),
k(m,o),
event).
resize().auto(p);};


n.autoHeight=function(o,p,event,q){
return new n
(function(){return o;},
k(m,p),
event).
resize().auto(q);};


e.exports=n;});

/** js/plugins/PluginShareButton.js */
__d("PluginShareButton",["DOMEvent","DOMEventListener","PluginResize","PopupWindow","UserAgent"],function(a,b,c,d,e,f){



var g=b('DOMEvent'),
h=b('DOMEventListener'),
i=b('PluginResize'),
j=b('PopupWindow'),
k=b('UserAgent'),

l=
{listen:function(m,n){
var o=m.href;
h.add(m,'click',function(p){
new g(p).kill();
j.open(o,340,670);});},



resize:function(m){
var n=k.firefox()||k.ie()>=9?1:0;
new i
(function(){return m.offsetWidth+m.offsetLeft+n;},
function(){return m.offsetHeight+m.offsetTop;}).
resize().auto();}};



e.exports=l;});

/** js/plugins/PluginXDReady.js */
__d("PluginXDReady",["Arbiter","UnverifiedXD"],function(a,b,c,d,e,f){



var g=b('Arbiter'),
h=b('UnverifiedXD'),

i=









{handleMessage:function(j){
if(!j.method)
return;


try{g.inform
('Connect.Unsafe.'+j.method,
JSON.parse(j.params),
g.BEHAVIOR_PERSISTENT);}catch(
k){

}}};




a.XdArbiter=i;

h.send({xd_action:'plugin_ready',name:window.name});



e.exports=null;});
