/*1349187320,178142493*/

if (window.CavalryLogger) { CavalryLogger.start_js(["VYPFM"]); }

/** ads/units/js/whitespace_click.js */












function BassWhitespaceListener(a,b){
this.link=b;
Event.listen(a,'click',this.onclicked.bind(this));}


copyProperties
(BassWhitespaceListener.prototype,

{onclicked:function(a){
if(Parent.byTag(a.getTarget(),'A'))
return;

switch(this.link.getAttribute('rel')){
case 'async':
Bootloader.loadComponents
('async',
function(){
AsyncRequest.bootstrap
(this.link.getAttribute('ajaxify'),
this.link);}.
bind(this));

break;
case 'theater':
var b=Parent.byClass(a.getTarget(),'fbPhotoSnowlift');
Bootloader.loadComponents
('PhotoViewer',
function(){
PhotoViewer.bootstrap
(this.link.getAttribute('ajaxify'),
this.link);}.

bind(this));

if(b)
return false;


break;

default:goURI(this.link.getAttribute('href'));
}}});

/** js/modules/Toggler.js */
__d("Toggler",["array-extensions","event-extensions","Arbiter","ArbiterMixin","ContextualThing","CSS","DataStore","Dialog","DOM","copyProperties","createArrayFrom","emptyFunction","ge","getObjectValues"],function(a,b,c,d,e,f){









b('array-extensions');
b('event-extensions');

var g=b('Arbiter'),
h=b('ArbiterMixin'),
i=b('ContextualThing'),
j=b('CSS'),
k=b('DataStore'),
l=b('Dialog'),
m=b('DOM'),

n=b('copyProperties'),
o=b('createArrayFrom'),
p=b('emptyFunction'),
q=b('ge'),
r=b('getObjectValues'),

s=[],
t;




function u(){
u=p;




Event.listen(document.documentElement,'click',function(event){
var y=event.getTarget();
s.forEach(function(z){
z.clickedTarget=y;
z.active&&
!z.sticky&&
!i.containsIncludingLayers
(z.getActive(),
y)&&
!z.inTargetFlyout(y)&&
z.inActiveDialog()&&
z.hide();});},

Event.Priority.URGENT);}


var v=function(){
this.active=null;
this.togglers={};



this.setSticky(false);


s.push(this);


this.subscribe(['show','hide'],v.inform.bind(v));

return u();};


n(v.prototype,h,




{show:function(y){
var z=w(this,y),

aa=z.active;
if(y!==aa){

aa&&z.hide();


z.active=y;



j.addClass(y,'openToggler');


var ba=m.scry(y,'a[rel="toggle"]');


if(ba.length>0&&ba[0].getAttribute('data-target'))
j.removeClass
(q(ba[0].getAttribute('data-target')),
'toggleTargetClosed');




m.appendContent(y,z.getToggler('next'));
m.prependContent(y,z.getToggler('prev'));


z.inform('show',z);}},








hide:function(y){
var z=w(this,y),

aa=z.active;
if(aa&&(!y||y===aa)){

j.removeClass(aa,'openToggler');


var ba=m.scry(aa,'a[rel="toggle"]');


if(ba.length>0&&ba[0].getAttribute('data-target'))
j.addClass
(q(ba[0].getAttribute('data-target')),
'toggleTargetClosed');




r(z.togglers).forEach(m.remove);


z.inform('hide',z);


z.active=null;}},









toggle:function(y){
var z=w(this,y);
if(z.active===y){

z.hide();}else 


z.show(y);},







getActive:function(){
return w(this).active;},






isShown:function(){
return w(this).active&&
j.hasClass(w(this).active,'openToggler');},







inTargetFlyout:function(y){
var z=x(this.getActive());
return z&&
i.containsIncludingLayers(z,y);},






inActiveDialog:function(){
var y=l.getCurrent();
return !y||m.contains(y.getRoot(),this.getActive());},









getToggler:function(y){
var z=w(this);
if(!z.togglers[y]){
z.togglers[y]=m.create('button',
{className:'hideToggler',
onfocus:function(){
var aa=m.scry(z.active,'a[rel="toggle"]')[0];
aa&&aa.focus();
z.hide();}});


z.togglers[y].setAttribute('type','button');}

return this.togglers[y];},








setSticky:function(y){
var z=w(this);

y=y!==false;


if(y!==z.sticky){
z.sticky=y;


if(y){
z._pt&&z._pt.unsubscribe();}else 

z._pt=g.subscribe
('pre_page_transition',
z.hide.bind(z,null));}



return z;}});





n(v,v.prototype);


n(v,




{bootstrap:function(y){
var z=y.parentNode;
v.getInstance(z).toggle(z);},









createInstance:function(y){
var z=new v().setSticky(true);


k.set(y,'toggler',z);

return z;},










getInstance:function(y){


while(y){
var z=k.get(y,'toggler');
if(z)
return z;

if(j.hasClass(y,'uiToggleContext'))
return v.createInstance(y);

y=y.parentNode;}


return (t=t||new v());},









listen:function(y,z,aa){

return v.subscribe
(o(y),function(ba,ca){
if(ca.getActive()===z)
return aa(ba,ca);});},













subscribe:(function(y){
return function(z,aa){
z=o(z);




if(z.contains('show'))
s.forEach(function(ba){
if(ba.getActive())
aa.curry('show',ba).defer();});




return y(z,aa);};})

(v.subscribe.bind(v))});








function w(y,z){
if(y instanceof v)
return y;

return v.getInstance(z);}








function x(y){
var z=m.scry(y,'a[rel="toggle"]');
if(z.length>0&&z[0].getAttribute('data-target'))
return q(z[0].getAttribute('data-target'));}



e.exports=v;});

/** js/modules/Menu.js */
__d("Menu",["event-extensions","Arbiter","CSS","DataStore","DOM","HTML","Keys","Parent","Run","Style","UserAgent","copyProperties"],function(a,b,c,d,e,f){











b('event-extensions');

var g=b('Arbiter'),
h=b('CSS'),
i=b('DataStore'),
j=b('DOM'),
k=b('HTML'),
l=b('Keys'),
m=b('Parent'),
n=b('Run'),
o=b('Style'),
p=b('UserAgent'),

q=b('copyProperties'),

r=null,
s='menu:mouseover',
t=null;






function u(ca){
if(h.hasClass(ca,'uiMenuContainer'))
return ca;

return m.byClass(ca,'uiMenu');}








function v(ca){
return m.byClass(ca,'uiMenuItem');}








function w(ca){
if(document.activeElement){
var da=v(document.activeElement);
return ca.indexOf(da);}

return -1;}







function x(ca){
return j.find(ca,'a.itemAnchor');}







function y(ca){
return h.hasClass(ca,'checked');}







function z(ca){
return !h.hasClass(ca,'disabled')&&
o.get(ca,'display')!=='none';}







function aa(event){
var ca=document.activeElement;
if(!ca||
!m.byClass(ca,'uiMenu')||
!j.isNodeOfType(ca,['input','textarea'])){
var da=v(event.getTarget());
da&&r.focusItem(da);}}








function ba(ca){
p.firefox()&&x(ca).blur();
r.inform('select',{menu:u(ca),item:ca});}






n.onLoad(function(){
var ca={};


ca.click=function(event){
var da=v(event.getTarget());
if(da&&z(da)){
ba(da);





var ea=x(da),
fa=ea.href,
ga=ea.getAttribute('rel');
return (ga&&ga!=='ignore')||
(fa&&fa.charAt(fa.length-1)!=='#');}};





ca.keydown=function(event){
var da=event.getTarget();


if(event.getModifiers().any)
return;



if(!t||j.isNodeOfType(da,['input','textarea']))
return;


var ea=Event.getKeyCode(event),
fa;
switch(ea){
case l.UP:
case l.DOWN:

var ga=r.getEnabledItems(t);
fa=w(ga);
r.focusItem(ga[fa+(ea===l.UP?-1:1)]);
return false;
case l.SPACE:
var ha=v(da);
if(ha){
ba(ha);
event.prevent();}

break;





default:var ia=String.fromCharCode(ea).toLowerCase(),
ja=r.getEnabledItems(t);
fa=w(ja);
var ka=fa,
la=ja.length;



while((~fa&&(ka=++ka%la)!==fa)||(!~fa&&++ka<la)){
var ma=r.getItemLabel(ja[ka]);
if(ma&&ma.charAt(0).toLowerCase()===ia){
r.focusItem(ja[ka]);
return false;}}


}};



Event.listen(document.documentElement,ca);});


r=e.exports=q(new g(),




{focusItem:function(ca){
if(ca&&z(ca)){
this._removeSelected(u(ca));
h.addClass(ca,'selected');
x(ca).focus();}},








getEnabledItems:function(ca){
return r.getItems(ca).filter(z);},







getCheckedItems:function(ca){
return r.getItems(ca).filter(y);},







getItems:function(ca){
return j.scry(ca,'li.uiMenuItem');},







getItemLabel:function(ca){
return ca.getAttribute('data-label',2)||'';},






isItemChecked:function(ca){
return h.hasClass(ca,'checked');},













register:function(ca,da){
ca=u(ca);



if(!i.get(ca,s))
i.set(ca,s,
Event.listen(ca,'mouseover',aa));


if(da!==false)
t=ca;},








setItemEnabled:function(ca,da){



if(!da&&!j.scry(ca,'span.disabledAnchor')[0])
j.appendContent
(ca,
j.create
('span',
{className:j.find(ca,'a').className+' disabledAnchor'},
k(x(ca).innerHTML)));





h.conditionClass(ca,'disabled',!da);},






toggleItem:function(ca){
var da=!r.isItemChecked(ca);
r.setItemChecked(ca,da);},







setItemChecked:function(ca,da){
h.conditionClass(ca,'checked',da);
x(ca).setAttribute('aria-checked',da);},







unregister:function(ca){
ca=u(ca);

var da=i.remove(ca,s);
da&&da.remove();

t=null;

this._removeSelected(ca);},


_removeSelected:function(ca){
r.getItems(ca).
filter(function(da){return h.hasClass(da,'selected');}).
forEach(function(da){h.removeClass(da,'selected');});}});});

/** js/modules/ARIA.js */
__d("ARIA",["DOM","emptyFunction","ge"],function(a,b,c,d,e,f){



var g=b('DOM'),

h=b('emptyFunction'),
i=b('ge'),

j,
k,

l=function(){
j=i('ariaAssertiveAlert');
if(!j){
j=g.create
('div',
{id:'ariaAssertiveAlert',
className:'accessible_elem',
'aria-live':'assertive'});

g.appendContent(document.body,j);}


k=i('ariaPoliteAlert');
if(!k){
k=j.cloneNode(false);
k.setAttribute('id','ariaPoliteAlert');
k.setAttribute('aria-live','polite');
g.appendContent(document.body,k);}


l=h;};


function m(o,p){
l();
var q=p?j:k;
g.setContent(q,o);}


var n=



{owns:function(o,p){






o.setAttribute('aria-owns',g.getID(p));},


setPopup:function(o,p){
var q=g.getID(p);
o.setAttribute('aria-owns',q);
o.setAttribute('aria-controls',q);
o.setAttribute('aria-haspopup','true');
if(o.tabIndex==-1)
o.tabIndex=0;},



announce:function(o){
m(o,true);},


notify:function(o){
m(o);}};



e.exports=n;});

/** js/modules/BootloadedReact.js */
__d("BootloadedReact",["Bootloader"],function(a,b,c,d,e,f){



var g=b('Bootloader'),

h=function(j){
g.loadModules(['React'],j);},











i=






{isValidComponent:function(j){

return (j&&
typeof j.genMarkup==='function'&&
typeof j.handleUpdateProps==='function');},


initializeTouchEvents:function(j,k){
h(function(l){
l.initializeTouchEvents(j);
k&&k();});},


createComponent:function(j,k){
h(function(l){
var m=l.createComponent(j);
k&&k(m);});},


renderComponent:function(j,k,l){
h(function(m){
var n=m.renderComponent(j,k);
l&&l(n);});},


renderOrUpdateComponent:function(j,k,l){
h(function(m){
var n=m.renderOrUpdateComponent(j,k);
l&&l(n);});},


destroyAndReleaseReactRootNode:function(j,k){
h(function(l){
l.destroyAndReleaseReactRootNode(j);
k&&k();});}};




e.exports=i;});

/** js/modules/KeyEventController.js */
__d("KeyEventController",["event-extensions","DOM","Run","copyProperties","isEmpty"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('DOM'),
h=b('Run'),

i=b('event-extensions').$E,
j=b('copyProperties'),
k=b('isEmpty');
















































function l(){
this.handlers={};
document.onkeyup=this.onkeyevent.bind(this,'onkeyup');
document.onkeydown=this.onkeyevent.bind(this,'onkeydown');
document.onkeypress=this.onkeyevent.bind(this,'onkeypress');}


j(l,

{instance:null,

getInstance:function(){
return l.instance||
(l.instance=new l());},


defaultFilter:function(event,m){
event=i(event);
return l.filterEventTypes(event,m)&&
l.filterEventTargets(event,m)&&
l.filterEventModifiers(event,m);},


filterEventTypes:function(event,m){
if(m==='onkeydown')
return true;


return false;},


filterEventTargets:function(event,m){
var n=event.getTarget();







if(n.contentEditable==='true')
return false;


return !g.isNodeOfType(n,l._interactiveElements)||
(n.type in l._uninterestingTypes)||

(g.isNodeOfType(n,['input','textarea'])&&
n.value.length===0&&
event.keyCode in l._controlKeys);},


filterEventModifiers:function(event,m){
if(event.ctrlKey||event.altKey||event.metaKey||event.repeat)
return false;


return true;},







registerKey:function(m,n,o,p){
if(o===undefined)
o=l.defaultFilter;


var q=l.getInstance(),
r=q.mapKey(m);

if(k(q.handlers))





h.onLeave(q.resetHandlers.bind(q));


var s={};
for(var t=0;t<r.length;t++){
m=r[t];
if(!q.handlers[m]||p)
q.handlers[m]=[];


var u=
{callback:n,
filter:o};

s[m]=u;
q.handlers[m].push(u);}




return {remove:function(){
for(var v in s){
if(q.handlers[v]&&q.handlers[v].length){
var w=q.handlers[v].indexOf(s[v]);
w>=0&&q.handlers[v].splice(w,1);}

delete s[v];}}};},






keyCodeMap:
{BACKSPACE:[8],
TAB:[9],
RETURN:[13],
ESCAPE:[27],
LEFT:[37,63234],
UP:[38,63232],
RIGHT:[39,63235],
DOWN:[40,63233],
DELETE:[46],
COMMA:[188],
PERIOD:[190],
'`':[192],
'[':[219],
']':[221]},



_interactiveElements:['input','select','textarea','object','embed'],


_uninterestingTypes:{checkbox:1,radio:1,submit:1},


_controlKeys:
{8:1,
9:1,
13:1,
27:1,
37:1,63234:1,
38:1,63232:1,
39:1,63235:1,
40:1,63233:1,
46:1}});




j(l.prototype,

{mapKey:function(m){
if(m>=0&&m<=9){


if(typeof(m)!='number')

m=m.charCodeAt(0)-48;



return [48+m,96+m];}


var n=l.keyCodeMap[m.toUpperCase()];
if(n)
return n;



return [m.toUpperCase().charCodeAt(0)];},


onkeyevent:function(m,n){
n=i(n);

var o=this.handlers[n.keyCode]||this.handlers[n.which],
p,q,r;

if(o)
for(var s=0;s<o.length;s++){
p=o[s].callback;
q=o[s].filter;


try{if(!q||q(n,m)){
r=p(n,m);
if(r===false)
return Event.kill(n);}}catch(


t){
emptyFunction('Uncaught exception in key handler: %x',t);}}




return true;},


resetHandlers:function(){
this.handlers={};}});




e.exports=l;});

/** js/ui/layer/Layer.js */
__d("Layer",["event-extensions","function-extensions","ArbiterMixin","BehaviorsMixin","BootloadedReact","ContextualThing","CSS","DataStore","DOM","HTML","KeyEventController","Parent","Style","copyProperties","ge"],function(a,b,c,d,e,f){




b('event-extensions');
b('function-extensions');

var g=b('ArbiterMixin'),
h=b('BehaviorsMixin'),
i=b('BootloadedReact'),
j=b('ContextualThing'),
k=b('CSS'),
l=b('DataStore'),
m=b('DOM'),
n=b('HTML'),
o=b('KeyEventController'),
p=b('Parent'),
q=b('Style'),

r=b('copyProperties'),
s=b('ge'),



t=[];

function u(v,w){


this._config=v||{};
if(w){
this._configure(this._config,w);
var x=this._config.addedBehaviors||[];
this.enableBehaviors(this._getDefaultBehaviors().concat(x));}}



r(u,g);








r(u,
{init:function(v,w){
v.init(w);},

initAndShow:function(v,w){
v.init(w).show();},

show:function(v){
v.show();},








getTopmostLayer:function(){
return t[t.length-1];}});



r(u.prototype,g,h,
{_initialized:false,
_root:null,
_shown:false,
_hiding:false,
_causalElement:null,
_reactContainer:null,











init:function(v){






this._configure(this._config,v);

var w=this._config.addedBehaviors||[];
this.enableBehaviors(this._getDefaultBehaviors().concat(w));

this._initialized=true;
return this;},











_configure:function(v,w){
if(w){
var x=m.isNode(w),
y=typeof w==='string'||n.isHTML(w);
this.containsReactComponent=i.isValidComponent(w);







if(y){
w=n(w).getRootNode();}else
if(this.containsReactComponent){
var z=document.createElement('div');





i.renderComponent(w,z);
w=this._reactContainer=z;}}


this._root=this._buildWrapper(v,w);
if(v.attributes)
m.setAttributes(this._root,v.attributes);

if(v.classNames)
v.classNames.forEach(k.addClass.curry(this._root));

k.addClass(this._root,'uiLayer');
if(v.causalElement)
this._causalElement=s(v.causalElement);

l.set(this._root,'layer',this);},








_getDefaultBehaviors:function(){
return [];},






getCausalElement:function(){
return this._causalElement;},


setCausalElement:function(v){
this._causalElement=v;
return this;},









getInsertParent:function(){
return this._insertParent||document.body;},





getRoot:function(){








return this._root;},





_getContentRoot:function(){
return this._root;},





_buildWrapper:function(v,w){
return w;},












setInsertParent:function(v){
if(v){
if(this._shown&&v!==this.getInsertParent()){
m.appendContent(v,this.getRoot());
this.updatePosition();}

this._insertParent=v;}

return this;},


show:function(){
if(this._shown)
return this;


var v=this.getRoot();
this.inform('beforeshow');



q.set(v,'visibility','hidden');


q.set(v,'overflow','hidden');

k.show(v);
m.appendContent(this.getInsertParent(),v);
if(this.updatePosition()!==false){
this._shown=true;
this.inform('show');
u.inform('show',this);



!function(){
if(this._shown)
t.push(this);}.

bind(this).defer();}else 

k.hide(v);

q.set(v,'visibility','');
q.set(v,'overflow','');
this.inform('aftershow');
return this;},


hide:function(){

if(this._hiding||!this._shown||this.inform('beforehide')===false)
return this;




this._hiding=true;




if(this.inform('starthide')!==false)
this.finishHide();


return this;},








finishHide:function(){
if(this._shown){
t.remove(this);
this._hiding=false;
this._shown=false;
k.hide(this.getRoot());
this.inform('hide');
u.inform('hide',this);}},



isShown:function(){
return this._shown;},






updatePosition:function(){
return true;},









destroy:function(){
if(this.containsReactComponent)
i.destroyAndReleaseReactRootNode(this._reactContainer);

this.finishHide();
var v=this.getRoot();
m.remove(v);
this.destroyBehaviors();
this.inform('destroy');
u.inform('destroy',this);
l.remove(v,'layer');
this._root=this._causalElement=null;}});




Event.listen(document.documentElement,'keydown',function(event){



if(o.filterEventTargets(event,'keydown'))
for(var v=t.length-1;v>=0;v--)
if(t[v].inform('key',event)===false)
return false;},



Event.Priority.URGENT);


Event.listen(document.documentElement,'click',function(event){
var v=t.length;
if(!v)
return;


var w=event.getTarget();



if(!m.contains(document.documentElement,w))
return;






if(p.byClass(w,'generic_dialog'))
return;


var x,y;
while(v--){
x=t[v];
y=x.getContentRoot();


if(j.containsIncludingLayers(y,w))
return;


x.inform('blur');

if(x.isShown())
return;}});




e.exports=u;});

/** js/ui/layer/behaviors/LayerHideOnTransition.js */
__d("LayerHideOnTransition",["Arbiter","copyProperties"],function(a,b,c,d,e,f){






var g=b('Arbiter'),
h=b('copyProperties');

function i(j){
this._layer=j;}


h(i.prototype,
{_subscription:null,
enable:function(){
this._subscription=g.subscribe
('page_transition',
this._layer.hide.shield(this._layer),
g.SUBSCRIBE_NEW);},


disable:function(){
if(this._subscription){
this._subscription.unsubscribe();
this._subscription=null;}}});




e.exports=i;});

/** js/ui/layer/ContextualLayer.js */
__d("ContextualLayer",["array-extensions","event-extensions","Arbiter","ARIA","Class","ContextualThing","CSS","DataStore","DOM","Layer","LayerHideOnTransition","Locale","Parent","Style","Vector","copyProperties","getOverlayZIndex"],function(a,b,c,d,e,f){






b('array-extensions');
b('event-extensions');

var g=b('Arbiter'),
h=b('ARIA'),
i=b('Class'),
j=b('ContextualThing'),
k=b('CSS'),
l=b('DataStore'),
m=b('DOM'),
n=b('Layer'),
o=b('LayerHideOnTransition'),
p=b('Locale'),
q=b('Parent'),
r=b('Style'),
s=b('Vector'),

t=b('copyProperties'),
u=b('getOverlayZIndex');

function v(aa){
return aa.getPosition()==='left'||
(aa.isVertical()&&aa.getAlignment()==='right');}














function w(aa){
var ba=aa.parentNode;
if(ba){
var ca=r.get(ba,'position');
if(ca==='static'){
if(ba===document.body){


ba=document.documentElement;}else 

ba=w(ba);}else 


return ba;}else 


ba=document.documentElement;

return ba;}

































function x(aa,ba){
this.parent.construct(this,aa,ba);}



var y=[];





g.subscribe('reflow',function(){
y.forEach(function(aa){
if(aa.updatePosition()===false)
aa.hide();});});




i.extend(x,n);

t(x.prototype,
{_contentWrapper:null,

_content:null,
_contextNode:null,
_contextSelector:null,
_parentLayer:null,
_parentSubscription:null,
_orientation:null,
_orientationClass:null,

_configure:function(aa,ba){
this.parent._configure(aa,ba);
if(aa.context){
this.setContext(aa.context);}else
if(aa.contextID){
this._setContextID(aa.contextID);}else
if(aa.contextSelector)
this._setContextSelector(aa.contextSelector);

aa.position&&this.setPosition(aa.position);
aa.alignment&&this.setAlignment(aa.alignment);
aa.offsetX&&this.setOffsetX(aa.offsetX);
aa.offsetY&&this.setOffsetY(aa.offsetY);
this._content=ba;},


_getDefaultBehaviors:function(){
return this.parent._getDefaultBehaviors().concat
([o]);},



_buildWrapper:function(aa,ba){
this._contentWrapper=
m.create('div',{className:'uiContextualLayer'},ba);
return m.create
('div',
{className:'uiContextualLayerPositioner'},
this._contentWrapper);},











getInsertParent:function(){
var aa=this._insertParent;
if(!aa){
var ba=this.getContext();
if(ba)
aa=q.byClass(ba,'uiContextualLayerParent');}


return aa||this.parent.getInsertParent();},






setContent:function(aa){
this._content=aa;
m.setContent(this._contentWrapper,this._content);
this._shown&&this.updatePosition();
return this;},






setContext:function(aa){
this._contextNode=aa;
this._contextSelector=this._contextScrollParent=null;
if(this._shown){
j.register(this.getRoot(),this._contextNode);
this.updatePosition();}

this._setParentSubscription();
h.setPopup(this.getCausalElement(),this.getRoot());
return this;},







_setContextID:function(aa){
this._contextSelector='#'+aa;
this._contextNode=null;},







_setContextSelector:function(aa){
this._contextSelector=aa;
this._contextNode=null;},






getCausalElement:function(){
return this.parent.getCausalElement()||this.getContext();},







_setParentSubscription:function(){

var aa=this.getContext(),
ba=null;
while(aa!==null){
ba=l.get(aa,'layer');
if(ba)
break;

aa=aa.parentNode;}




if(ba===this._parentLayer)
return;




if(this._parentLayer&&this._parentSubscription){
this._parentLayer.unsubscribe(this._parentSubscription);
this._parentSubscription=null;}



if(ba)
this._parentSubscription=ba.subscribe
('hide',
this.hide.bind(this));



this._parentLayer=ba;},






setPosition:function(aa){
this._getOrientation().setDefaultPosition(aa);
this._shown&&this.updatePosition();
return this;},






setAlignment:function(aa){
this._getOrientation().setDefaultAlignment(aa);
this._shown&&this.updatePosition();
return this;},






setOffsetX:function(aa){
this._getOrientation().setDefaultOffsetX(aa);
this._shown&&this.updatePosition();
return this;},






setOffsetY:function(aa){
this._getOrientation().setDefaultOffsetY(aa);
this._shown&&this.updatePosition();
return this;},





_getOrientation:function(){
if(!this._orientation)
this._orientation=new z();

return this._orientation;},


getContentRoot:function(){
return this._contentWrapper;},





getContent:function(){
return this._content;},





getContext:function(){
if(!this._contextNode)





this._contextNode=m.find(document,this._contextSelector);

return this._contextNode;},





getContextScrollParent:function(){
if(!this._contextScrollParent)
this._contextScrollParent=r.getScrollParent(this.getContext());

return this._contextScrollParent;},


setInsertParent:function(aa){
this._insertScrollParent=null;
return this.parent.setInsertParent(aa);},





getInsertScrollParent:function(){
if(!this._insertScrollParent)
this._insertScrollParent=r.getScrollParent(this.getInsertParent());

return this._insertScrollParent;},






show:function(){
if(this._shown)
return this;

this.parent.show();


if(this._shown){
j.register(this.getRoot(),this.getContext());
y.push(this);
this._resizeListener=this._resizeListener||
Event.listen(window,'resize',this.updatePosition.bind(this));}

return this;},






hide:function(){
y.remove(this);
this._resizeListener&&this._resizeListener.remove();
this._resizeListener=null;
return this.parent.hide();},










updatePosition:function(){

var aa=this.getContext();
if(!aa)
return false;


var ba=
r.isFixed(aa)&&
!r.isFixed(this.getInsertParent());


if(!ba&&!aa.offsetParent)
return false;


var ca=this._getOrientation();

this.inform('adjust',ca.reset());
if(!ca.isValid())
return false;

this._updateWrapperPosition(ca);
this._updateWrapperClass(ca);

var da=this.getRoot();



k.conditionClass
(da,
'uiContextualLayerPositionerFixed',
ba);

var ea,fa,
ga=ba?'viewport':'document',
ha=ba?document.documentElement:w(da);
if(ha===document.documentElement){
ea=new s(0,0);


fa=document.documentElement.clientWidth;}else
if(!da.offsetParent){

return false;}else{

ea=s.getElementPosition(ha,ga);
fa=ha.offsetWidth;
if(ha!==document.body)
ea=ea.sub
(new s(ha.scrollLeft,ha.scrollTop));}



var ia=s.getElementPosition(aa,ga),

ja=ia.x-ea.x,
ka=ia.y-ea.y,

la=p.isRTL();


if(ca.getPosition()==='below')
ka+=aa.offsetHeight;




if((ca.getPosition()==='right'||
(ca.isVertical()&&
ca.getAlignment()==='right'))!=la)
ja+=aa.offsetWidth;


var ma=ca.getOffsetX();
if(ca.isVertical()&&ca.getAlignment()==='center')
ma+=(aa.offsetWidth-this._content.offsetWidth)/2;

if(la)
ma*=-1;





var na='left',
oa=ja+ma;
if(v(ca)!==la){
na='right';
oa=fa-oa;}

r.set(da,na,oa+'px');
r.set(da,na==='left'?'right':'left','');


var pa=this.getInsertScrollParent(),
qa;
if(pa!==window){
qa=pa.clientWidth;}else 

qa=document.documentElement.clientWidth;

var ra=s.getElementPosition(da).x;
if(na==='left'){
if(qa-ra>0){
r.set(da,'width',(qa-ra)+'px');}else 

r.set(da,'width','');}else 


r.set(da,'width',ra+da.offsetWidth+'px');


r.set(da,'top',(ka+ca.getOffsetY())+'px');

var sa=u(aa,this.getInsertParent());
r.set(da,'z-index',sa>200?sa:'');

this.inform('reposition',ca);
return true;},






_updateWrapperPosition:function(aa){

var ba=aa.getPosition()==='above';
r.set(this._contentWrapper,'bottom',ba?'0':null);


var ca=p.isRTL()?'left':'right',
da=v(aa);
r.set(this._contentWrapper,ca,da?'0':null);},





_updateWrapperClass:function(aa){
var ba=aa.getClassName();
if(ba===this._orientationClass)
return;

if(this._orientationClass)
k.removeClass(this._contentWrapper,this._orientationClass);

this._orientationClass=ba;
k.addClass(this._contentWrapper,ba);},











simulateOrientation:function(aa,ba){
var ca=aa.getClassName();
if(ca===this._orientationClass){
return ba();}else{

if(this._orientationClass)
k.removeClass(this._contentWrapper,this._orientationClass);

k.addClass(this._contentWrapper,ca);
var da=ba();
k.removeClass(this._contentWrapper,ca);
if(this._orientationClass)
k.addClass(this._contentWrapper,this._orientationClass);

return da;}},







destroy:function(){
this.parent.destroy();
this._contentWrapper=null;
this._content=null;
return this;}});










function z(){
this._default=
{_position:'above',
_alignment:'left',
_offsetX:0,
_offsetY:0,
_valid:true};

this.reset();}


z.OPPOSITE=
{above:'below',
below:'above',
left:'right',
right:'left'};


t(z.prototype,

{setPosition:function(aa){





this._position=aa;
return this;},


setAlignment:function(aa){





this._alignment=aa;
return this;},


getOppositePosition:function(){
return z.OPPOSITE[this.getPosition()];},


invalidate:function(){
this._valid=false;
return this;},


getPosition:function(){
return this._position||'above';},


getAlignment:function(){
return this._alignment||'left';},







getOffsetX:function(){
var aa=this._offsetX||0;
if(!this.isVertical()){
if(this._default._position!==this._position)
aa*=-1;}else

if(this._default._alignment!==this._alignment)
aa*=-1;

return aa;},


getOffsetY:function(){
var aa=this._offsetY||0;
if(this.isVertical()&&this._default._position!==this._position)
aa*=-1;

return aa;},


getClassName:function(){
var aa=this.getAlignment(),
ba=this.getPosition();
if(ba==='below'){
if(aa==='left'){
return 'uiContextualLayerBelowLeft';}else
if(aa==='right'){
return 'uiContextualLayerBelowRight';}else 

return 'uiContextualLayerBelowCenter';}else

if(ba==='above'){
if(aa==='left'){
return 'uiContextualLayerAboveLeft';}else
if(aa==='right'){
return 'uiContextualLayerAboveRight';}else 

return 'uiContextualLayerAboveCenter';}else

if(ba==='left'){
return 'uiContextualLayerLeft';}else 

return 'uiContextualLayerRight';},



isValid:function(){
return this._valid;},


isVertical:function(){
return this.getPosition()==='above'||this.getPosition()==='below';},


reset:function(aa,ba){
t(this,this._default);
return this;},






setDefaultPosition:function(aa){
this._default._position=aa;
return this;},


setDefaultAlignment:function(aa){
this._default._alignment=aa;
return this;},


setDefaultOffsetX:function(aa){
this._default._offsetX=aa;
return this;},


setDefaultOffsetY:function(aa){
this._default._offsetY=aa;
return this;}});




e.exports=x;});

/** js/home/SimpleDrag.js */
__d("SimpleDrag",["event-extensions","ArbiterMixin","Class","UserAgent","Vector","copyProperties","emptyFunction"],function(a,b,c,d,e,f){



















b('event-extensions');

var g=b('ArbiterMixin'),
h=b('Class'),
i=b('UserAgent'),
j=b('Vector'),

k=b('copyProperties'),
l=b('emptyFunction');

function m(n){
this.minDragDistance=0;
Event.listen(n,'mousedown',this._start.bind(this));}


k(m.prototype,g,
{setMinDragDistance:function(n){
this.minDragDistance=n;},


_start:function(event){
var n=false,
o=true,
p=null;




if(this.inform('mousedown',event))
o=false;


if(this.minDragDistance){
p=j.getEventPosition(event);}else{


n=true;
if(this.inform('start',event))
o=false;}





var q=i.ie()<9?document.documentElement:window,

r=Event.listen(q,
{selectstart:o?Event.prevent:l,

mousemove:function(event){
if(!n){
var s=j.getEventPosition(event);
if(p.distanceTo(s)<this.minDragDistance)
return;

n=true;
this.inform('start',event);}


this.inform('update',event);}.
bind(this),

mouseup:function(event){
for(var s in r)
r[s].remove();


if(n){
this.inform('end',event);}else 

this.inform('click',event);}.

bind(this)});


return !o;}});



e.exports=m;});

/** js/ui/xhp/layout/ScrollableArea.js */
__d("ScrollableArea",["array-extensions","event-extensions","throttle","Animation","ArbiterMixin","CSS","DataStore","DOM","Parent","Run","SimpleDrag","Style","UserAgent","Vector","copyProperties"],function(a,b,c,d,e,f){




b('array-extensions');
b('event-extensions');

var g=b('throttle'),
h=b('Animation'),
i=b('ArbiterMixin'),
j=b('CSS'),
k=b('DataStore'),
l=b('DOM'),
m=b('Parent'),
n=b('Run'),
o=b('SimpleDrag'),
p=b('Style'),
q=b('UserAgent'),
r=b('Vector'),

s=b('copyProperties'),

t=12;





function u(v,w){
if(!v)

return;

w=w||{};


this._elem=v;
this._wrap=l.find(v,'div.uiScrollableAreaWrap');
this._body=l.find(this._wrap,'div.uiScrollableAreaBody');
this._content=l.find(this._body,'div.uiScrollableAreaContent');
this._track=l.find(v,'div.uiScrollableAreaTrack');
this._gripper=l.find(this._track,'div.uiScrollableAreaGripper');

this._options=w;
this._throttledComputeHeights=g(this._computeHeights,250,this);
this.throttledAdjustGripper=g(this.adjustGripper,250,this);
this._throttledShowGripperAndShadows=
g(this._showGripperAndShadows,250,this);



this.adjustGripper.bind(this).defer();


this._listeners=
[Event.listen(v,'mousemove',this._handleMousemove.bind(this)),
Event.listen(this._wrap,'scroll',this._handleScroll.bind(this)),
Event.listen(this._track,'click',this._handleClickOnTrack.bind(this))];



if(w.fade!==false)
this._listeners.push
(Event.listen(v,'mouseenter',this.showScrollbar.shield(this)),
Event.listen(v,'mouseout',this.hideScrollbar.shield(this)));







if(q.safari()||q.chrome()){
this._listeners.push
(Event.listen(v,'mousedown',function(){
var x=Event.listen(window,'mouseup',function(){
if(v.scrollLeft)
v.scrollLeft=0;

x.remove();});}));}else


if(q.firefox())

this._wrap.addEventListener('DOMMouseScroll',function(event){
event.axis===event.HORIZONTAL_AXIS&&event.preventDefault();},
false);


this.initDrag();

k.set(this._elem,'ScrollableArea',this);


if(!w.persistent)
n.onLeave(this.destroy.bind(this));}



s(u,
{renderDOM:function(){
var v=l.create('div',{className:'uiScrollableAreaContent'}),
w=l.create('div',{className:'uiScrollableAreaBody'},v),
x=l.create('div',{className:'uiScrollableAreaWrap'},w),
y=l.create('div',{className:'uiScrollableArea native'},x);

return {root:y,
wrap:x,
body:w,
content:v};},








fromNative:function(v,w){
if(!j.hasClass(v,'uiScrollableArea')||
!j.hasClass(v,'native'))
return;


w=w||{};

j.removeClass(v,'native');

var x=l.create('div',
{className:'uiScrollableAreaTrack'},
l.create('div',{className:'uiScrollableAreaGripper'}));

if(w.fade!==false){
j.addClass(v,'fade');
j.addClass(x,'invisible_elem');}else 

j.addClass(v,'nofade');


l.appendContent(v,x);

var y=new u(v,w);
y.resize();
return y;},


getInstance:function(v){
var w=m.byClass(v,'uiScrollableArea');
return w?k.get(w,'ScrollableArea'):null;},


poke:function(v){
var w=u.getInstance(v);
w&&w.poke();}});



s(u.prototype,i,




{initDrag:function(){

var v=new o(this._gripper);


v.subscribe('start',function(w,event){

if(!((event.which&&event.which===1)||
(event.button&&event.button===1)))
return;



var x=r.getEventPosition(event).y,
y=this._gripper.offsetTop;


j.addClass(this._track,'uiScrollableAreaDragging');


var z=v.subscribe('update',function(ba,event){
var ca=r.getEventPosition(event).y-x;

this._throttledComputeHeights();


var da=this._contentHeight-this._containerHeight,


ea=y+ca,
fa=this._trackHeight-this._gripperHeight;
ea=Math.max(Math.min(ea,fa),0);

var ga=ea/fa*da;
this._wrap.scrollTop=ga;}.
bind(this)),

aa=v.subscribe('end',function(){
v.unsubscribe(z);
v.unsubscribe(aa);
j.removeClass(this._track,'uiScrollableAreaDragging');}.
bind(this));}.
bind(this));},





adjustGripper:function(){
if(this._needsGripper()){
p.set(this._gripper,'height',this._gripperHeight+'px');
this._slideGripper();}

this._throttledShowGripperAndShadows();
return this;},


_computeHeights:function(){
this._containerHeight=this._elem.clientHeight;
this._contentHeight=this._content.offsetHeight;
this._trackHeight=this._track.offsetHeight;
this._gripperHeight=Math.max
(this._containerHeight/this._contentHeight*this._trackHeight,
t);},



_needsGripper:function(){
this._throttledComputeHeights();
return this._gripperHeight<this._trackHeight;},


_slideGripper:function(){
var v=
this._wrap.scrollTop/
(this._contentHeight-this._containerHeight)*
(this._trackHeight-this._gripperHeight);
p.set(this._gripper,'top',v+'px');},





_showGripperAndShadows:function(){
j.conditionShow(this._gripper,this._needsGripper());
j.conditionClass(this._elem,'contentBefore',this._wrap.scrollTop>0);
j.conditionClass(this._elem,'contentAfter',!this.isScrolledToBottom());},





destroy:function(){
this._listeners.forEach(function(v){
v.remove();});

this._listeners.length=0;},


_handleClickOnTrack:function(event){
if(!this.lastMousePosition)
return;


var v=this._gripper.getBoundingClientRect();
if(this.lastMousePosition.y<v.top){
this.setScrollTop(this.getScrollTop()-this._elem.clientHeight);}else
if(this.lastMousePosition.y>v.bottom)
this.setScrollTop(this.getScrollTop()+this._elem.clientHeight);},








_handleMousemove:function(event){
var v=r.getEventPosition(event);


if(this._options.fade!==false){
var w=r.getElementPosition(this._track).x,
x=r.getElementDimensions(this._track).x;
if(Math.abs(w+x/2-v.x)<25){
this.showScrollbar(false);}else 

this.hideScrollbar();}



this.lastMousePosition=v.convertTo('viewport');},







_handleScroll:function(event){


if(this._needsGripper())
this._slideGripper();



this.throttledAdjustGripper();


if(this._options.fade!==false)
this.showScrollbar();

this.inform('scroll');},






hideScrollbar:function(v){
if(!this._scrollbarVisible)
return this;

this._scrollbarVisible=false;

if(this._hideTimeout){
clearTimeout(this._hideTimeout);
this._hideTimeout=null;}


if(v){
p.set(this._track,'opacity',0);
j.addClass.curry(this._track,'invisible_elem');}else 

this._hideTimeout=function(){
if(this._hideAnimation){
this._hideAnimation.stop();
this._hideAnimation=null;}

this._hideAnimation=
(new h(this._track)).
from('opacity',1).
to('opacity',0).
duration(250).
ondone(j.addClass.curry(this._track,'invisible_elem')).
go();}.
bind(this).defer(750);

return this;},





resize:function(){
var v=r.getElementDimensions(this._elem).x;


if(!this._options.fade)
v-=10;


v=Math.max(0,v);
p.set(this._body,'width',v+'px');
return this;},






showScrollbar:function(v){
this.throttledAdjustGripper();
if(this._scrollbarVisible)
return this;

this._scrollbarVisible=true;

if(this._hideTimeout){
clearTimeout(this._hideTimeout);
this._hideTimeout=null;}


if(this._hideAnimation){
this._hideAnimation.stop();
this._hideAnimation=null;}


p.set(this._track,'opacity',1);
j.removeClass(this._track,'invisible_elem');

if(v!==false)
this.hideScrollbar();

return this;},


isScrolledToBottom:function(){
return this._wrap.scrollTop>=this._contentHeight-this._containerHeight;},


scrollToBottom:function(v){
this.setScrollTop(this._wrap.scrollHeight,v);},


scrollToTop:function(v){
this.setScrollTop(0,v);},





scrollIntoView:function(v,w){
var x=this._wrap.clientHeight,
y=v.offsetHeight,
z=this._wrap.scrollTop,
aa=z+x,
ba=v.offsetTop,
ca=ba+y;

if(ba<z||x<y){
this.setScrollTop(ba,w);}else
if(ca>aa)
this.setScrollTop(z+(ca-aa),w);},






poke:function(){

var v=this._wrap.scrollTop;
this._wrap.scrollTop+=1;
this._wrap.scrollTop-=1;
this._wrap.scrollTop=v;

return this.showScrollbar(false);},


getScrollTop:function(){
return this._wrap.scrollTop;},


getScrollHeight:function(){
return this._wrap.scrollHeight;},


setScrollTop:function(v,w){
if(w!==false){
if(this._scrollTopAnimation)
this._scrollTopAnimation.stop();

this._scrollTopAnimation=
(new h(this._wrap)).
to('scrollTop',v).
ease(h.ease.end).
duration(250).
go();}else 

this._wrap.scrollTop=v;}});





e.exports=u;});

/** js/modules/ScrollAwareDOM.js */
__d("ScrollAwareDOM",["ArbiterMixin","CSS","DOM","DOMDimensions","DOMPosition","DOMQuery","HTML","Vector","ViewportBounds","copyProperties"],function(a,b,c,d,e,f){



var g=b('ArbiterMixin'),
h=b('CSS'),
i=b('DOM'),
j=b('DOMDimensions'),
k=b('DOMPosition'),
l=b('DOMQuery'),
m=b('HTML'),
n=b('Vector'),
o=b('ViewportBounds'),

p=b('copyProperties');








function q(v,w){
return function(){
u.monitor(arguments[v],w.curry.apply(w,arguments));};}









function r(v){
if(!(v instanceof Array))
v=[v];

for(var w=0;w<v.length;w++){
var x=m.replaceJSONWrapper(v[w]);
if(x instanceof m){
return x.getRootNode();}else
if(i.isNode(x))
return x;}


return null;}





function s(v){
return k.getElementPosition(v).y>=o.getTop();}





function t(v){
var w=
k.getElementPosition(v).y+
j.getElementDimensions(v).height,
x=
j.getViewportDimensions().height-
o.getBottom();
return w>=x;}






var u=p








({monitor:function(v,w){
var x=r(v);
if(x){
var y=!!x.offsetParent;
if(y&&(s(x)||t(x)))

return w();

var z=n.getDocumentDimensions(),
aa=w();
if(y||(x.offsetParent&&!s(x))){

var ba=n.getDocumentDimensions().sub(z),

ca=
{delta:ba,
target:x};

if(u.inform('scroll',ca)!==false)
ba.scrollElementBy(l.getDocumentScrollElement());}


return aa;}else 

return w();},








replace:function(v,w){
var x=r(w);
if(!x||h.hasClass(x,'hidden_elem'))
x=v;

return u.monitor(x,function(){
i.replace(v,w);});},



prependContent:q(1,i.prependContent),
insertAfter:q(1,i.insertAfter),
insertBefore:q(1,i.insertBefore),
setContent:q(0,i.setContent),
appendContent:q(1,i.appendContent),
remove:q(0,i.remove),
empty:q(0,i.empty)},

g);

e.exports=u;});

/** js/lib/dom/scroll.js */
__d("legacy:dom-scroll",["DOMScroll"],function(a,b,c,d){



a.DOMScroll=b('DOMScroll');},

3);

/** js/lib/event/link_controller.js */
__d("legacy:link-controller",["LinkController"],function(a,b,c,d){



a.LinkController=b('LinkController');},

3);

/** js/lib/form/input.js */
__d("legacy:input-methods",["Input","copyProperties"],function(a,b,c,d){



var e=b('Input'),

f=b('copyProperties');

f(a.Input||(a.Input={}),e);},

3);

/** js/ui/layer/behaviors/AccessibleLayer.js */
__d("AccessibleLayer",["event-extensions","CSS","DOM","Input","copyProperties","csx","tx"],function(a,b,c,d,e,f){




b('event-extensions');

var g=b('CSS'),
h=b('DOM'),
i=b('Input'),

j=b('copyProperties'),
k=b('csx'),
l=b('tx');









function m(n){
this._layer=n;}


j(m.prototype,
{enable:function(){
var n=this._layer.getRoot();
if(n.tabIndex==-1)
n.tabIndex=0;

var o=h.create
('a',
{className:'accessible_elem',href:'#'},
["Close popup and return"]);

h.appendContent(n,o);

this._listener=
Event.listen(o,'click',this._closeListener.bind(this));
this._afterShowSubscription=
this._layer.subscribe('aftershow',this._onAfterShow.bind(this));},


disable:function(){
this._listener.remove();
this._afterShowSubscription.unsubscribe();
this._listener=this._afterShowSubscription=null;},


_closeListener:function(event){
var n=this._layer.getCausalElement();
if(n){
if(n.tabIndex==-1){
n.tabIndex=0;
g.addClass(n,"_h0");}




i.focus(n);}

this._layer.hide();},


_onAfterShow:function(){
var n=document.activeElement,
o=this._layer.getRoot();

if(!h.isNodeOfType(n,['input','textarea'])&&
!h.contains(o,n))



i.focus(o);}});




e.exports=m;});

/** js/ui/layer/contextual_dialog/behaviors/ContextualDialogFooterLink.js */
__d("ContextualDialogFooterLink",["event-extensions","copyProperties","CSS","DOM"],function(a,b,c,d,e,f){







b('event-extensions');

var g=b('copyProperties'),
h=b('CSS'),
i=b('DOM');

function j(k){
this._layer=k;}


g(j.prototype,
{_subscriptions:null,

enable:function(){
var k=this._layer.getRoot(),
l=i.scry(k,'.uiContextualDialogFooterLink')[0],








m='uiContextualDialogHoverFooterArrow';
this._subscriptions=
[Event.listen(l,'mouseenter',h.addClass.curry(k,m)),
Event.listen(l,'mouseleave',h.removeClass.curry(k,m))];},



disable:function(){
this._subscriptions.forEach(function(k){
k.remove();});

this._subscriptions=null;}});



e.exports=j;});

/** js/ui/layer/behaviors/LayerAutoFocus.js */
__d("LayerAutoFocus",["function-extensions","copyProperties","DOMQuery","Input"],function(a,b,c,d,e,f){



b('function-extensions');

var g=b('copyProperties'),
h=b('DOMQuery'),
i=b('Input');







function j(k){
this._layer=k;}


g(j.prototype,
{_subscription:null,

enable:function(){
this._subscription=
this._layer.subscribe('aftershow',this._focus.bind(this));},


disable:function(){
this._subscription.unsubscribe();
this._subscription=null;},


_focus:function(){
var k=h.scry(this._layer.getRoot(),'.autofocus')[0];

k&&i.focus(k);}});



e.exports=j;});

/** js/ui/layer/behaviors/LayerButtons.js */
__d("LayerButtons",["event-extensions","Parent","copyProperties"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('Parent'),

h=b('copyProperties');

function i(j){
this._layer=j;}


h(i.prototype,
{_listener:null,

enable:function(){
this._listener=Event.listen
(this._layer.getRoot(),
'click',
this._handle.bind(this));},



disable:function(){
this._listener.remove();
this._listener=null;},


_handle:function(j){
var k=j.getTarget(),
l=g.byClass(k,'layerConfirm');
if(l){
if(this._layer.inform('confirm',l)===false)
j.prevent();

return;}


var m=g.byClass(k,'layerCancel');
if(m){
if(this._layer.inform('cancel',m)!==false)

this._layer.hide();

j.prevent();
return;}


var n=g.byClass(k,'layerButton');
if(n)
if(this._layer.inform('button',n)===false)
j.prevent();}});





e.exports=i;});

/** js/ui/layer/behaviors/LayerDestroyOnHide.js */
__d("LayerDestroyOnHide",["function-extensions","copyProperties"],function(a,b,c,d,e,f){



b('function-extensions');

var g=b('copyProperties');

function h(i){
this._layer=i;}


g(h.prototype,
{_subscription:null,
enable:function(){
this._subscription=this._layer.subscribe
('hide',
Function.prototype.defer.shield(this._layer.destroy.bind(this._layer)));},


disable:function(){
if(this._subscription){
this._subscription.unsubscribe();
this._subscription=null;}}});




e.exports=h;});

/** js/ui/layer/behaviors/LayerFadeOnHide.js */
__d("LayerFadeOnHide",["Animation","Layer","Style","UserAgent","copyProperties"],function(a,b,c,d,e,f){



var g=b('Animation'),
h=b('Layer'),
i=b('Style'),
j=b('UserAgent'),

k=b('copyProperties');




function l(m){
this._layer=m;}


k(l.prototype,
{_subscription:null,

enable:function(){
if(j.ie()<9)
return;

this._subscription=this._layer.subscribe
('starthide',
this._handleStartHide.bind(this));},



disable:function(){
if(this._subscription){
this._subscription.unsubscribe();
this._subscription=null;}},



_handleStartHide:function(){
var m=true,

n=h.subscribe('show',function(){
n.unsubscribe();
m=false;});

(function(){
n.unsubscribe();
n=null;
if(m){
this._animate();}else 

this._layer.finishHide();}).

bind(this).defer();
return false;},


_animate:function(){
new g(this._layer.getRoot()).
from('opacity',1).
to('opacity',0).
duration(150).
ondone(this._finish.bind(this)).
go();},


_finish:function(){
i.set(this._layer.getRoot(),'opacity','');
this._layer.finishHide();}});



e.exports=l;});

/** js/ui/layer/behaviors/LayerFadeOnShow.js */
__d("LayerFadeOnShow",["Animation","Style","UserAgent","copyProperties"],function(a,b,c,d,e,f){



var g=b('Animation'),
h=b('Style'),
i=b('UserAgent'),

j=b('copyProperties');




function k(l){
this._layer=l;}


j(k.prototype,
{_subscriptions:null,
enable:function(){
if(i.ie()<9)
return;

this._subscriptions=
[this._layer.subscribe('beforeshow',function(){
h.set(this._layer.getRoot(),'opacity',0);}.
bind(this)),
this._layer.subscribe('show',this._animate.bind(this))];},



disable:function(){
if(this._subscriptions){
while(this._subscriptions.length)
this._subscriptions.pop().unsubscribe();

this._subscriptions=null;}},



_animate:function(){
var l=this._layer.getRoot();
new g(l).
from('opacity',0).
to('opacity',1).
duration(100).
ondone(h.set.curry(l,'opacity','')).
go();}});



e.exports=k;});

/** js/ui/layer/behaviors/LayerFormHooks.js */
__d("LayerFormHooks",["event-extensions","copyProperties"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('copyProperties');

function h(i){
this._layer=i;}


g(h.prototype,
{_subscriptions:null,

enable:function(){
var i=this._layer.getRoot();
this._subscriptions=
[Event.listen(i,'submit',this._onSubmit.bind(this)),
Event.listen(i,'success',this._onSuccess.bind(this)),
Event.listen(i,'error',this._onError.bind(this))];},



disable:function(){
this._subscriptions.forEach(function(i){
i.remove();});

this._subscriptions=null;},


_onSubmit:function(event){
if(this._layer.inform('submit',event)===false)

event.kill();},



_onSuccess:function(event){
if(this._layer.inform('success',event)===false)
event.kill();},



_onError:function(event){
var i=event.getData();
if(this._layer.inform('error',{response:i.response})===false)

event.kill();}});




e.exports=h;});

/** js/ui/layer/behaviors/LayerHideOnBlur.js */
__d("LayerHideOnBlur",["copyProperties"],function(a,b,c,d,e,f){



var g=b('copyProperties');





function h(i){
this._layer=i;}


g(h.prototype,
{_subscriptions:null,
_onBlur:null,

enable:function(){
this._subscriptions=
[this._layer.subscribe('show',this._attach.bind(this)),
this._layer.subscribe('hide',this._detach.bind(this))];

if(this._layer.isShown())
this._attach();},



disable:function(){
this._detach();
while(this._subscriptions.length)
this._subscriptions.pop().unsubscribe();

this._subscriptions=null;},


_detach:function(){
this._onBlur&&this._onBlur.unsubscribe();
this._onBlur=null;},


_attach:function(){
this._onBlur=this._layer.subscribe
('blur',
this._layer.hide.shield(this._layer));}});




e.exports=h;});

/** js/ui/layer/behaviors/LayerHideOnEscape.js */
__d("LayerHideOnEscape",["event-extensions","copyProperties","Input","Keys"],function(a,b,c,d,e,f){






b('event-extensions');

var g=b('copyProperties'),
h=b('Input'),
i=b('Keys');

function j(k){
this._layer=k;}


g(j.prototype,
{_subscription:null,

enable:function(){
this._subscription=this._layer.subscribe('key',this._handle.bind(this));},


disable:function(){
this._subscription.unsubscribe();
this._subscription=null;},


_handle:function(k,event){
if(Event.getKeyCode(event)===i.ESC){
var l=this._layer.getCausalElement();
if(l)
if(l.tabIndex!=-1)
h.focus(l);










this._layer.hide();
return false;}}});




e.exports=j;});

/** js/ui/layer/behaviors/LayerHideOnSuccess.js */
__d("LayerHideOnSuccess",["copyProperties"],function(a,b,c,d,e,f){




var g=b('copyProperties');

function h(i){
this._layer=i;}


g(h.prototype,
{_subscription:null,
enable:function(){
this._subscription=this._layer.subscribe
('success',
this._layer.hide.bind(this._layer));},


disable:function(){
if(this._subscription){
this._subscription.unsubscribe();
this._subscription=null;}}});




e.exports=h;});

/** js/modules/TabbableElements.js */
__d("TabbableElements",["Style","createArrayFrom"],function(a,b,c,d,e,f){



var g=b('Style'),

h=b('createArrayFrom'),

i=





{find:function(j){

function k(n){

if(n.tabIndex>0)
return true;



switch(n.tagName){
case "A":
return n.href&&n.rel!="ignore";
case "INPUT":
return n.type!="hidden"&&n.type!="file"&&!n.disabled;
case "SELECT":
return !n.disabled;
case "TEXTAREA":
return !n.disabled;

default:return false;
}}


function l(n){

if(n.offsetHeight===0&&n.offsetWidth===0)
return true;



var o=n;

while(o&&
o!=j&&
g.get(o,'visibility')!=='hidden')
o=o.parentNode;


return o!==j;}


var m=h(j.getElementsByTagName("*"));

return m.filter(function(n){
return k(n)&&!l(n);});}};




e.exports=i;});

/** js/ui/layer/behaviors/LayerTabIsolation.js */
__d("LayerTabIsolation",["event-extensions","copyProperties","TabbableElements","Keys","Input"],function(a,b,c,d,e,f){






b('event-extensions');

var g=b('copyProperties'),
h=b('TabbableElements'),
i=b('Keys'),
j=b('Input');

function k(l){
this._layer=l;}


g(k.prototype,
{_tabHandler:null,
_subscriptions:[],

enable:function(){
this._subscriptions=
[this._layer.subscribe('show',this._attachHandler.bind(this)),
this._layer.subscribe('hide',this._detachHandler.bind(this))];},



disable:function(){
while(this._subscriptions.length)
this._subscriptions.pop().unsubscribe();

this._detachHandler();},


_attachHandler:function(){
var l=this._layer.getRoot();

this._tabHandler=Event.listen(l,'keydown',function(m){
if(Event.getKeyCode(m)==i.TAB){
var n=m.getTarget();

if(n){
var o=h.find(l),
p=o[0],
q=o[o.length-1],
r=m.getModifiers().shift;

if(r&&n==p){
m.preventDefault();
j.focus(q);}else
if(!r&&n==q){
m.preventDefault();
j.focus(p);}}}});},






_detachHandler:function(){
if(this._tabHandler){
this._tabHandler.remove();
this._tabHandler=null;}}});




e.exports=k;});

/** js/ui/layer/behaviors/LayerMouseHooks.js */
__d("LayerMouseHooks",["event-extensions","function-extensions","DOM","Layer","copyProperties"],function(a,b,c,d,e,f){



b('event-extensions');
b('function-extensions');

var g=b('DOM'),
h=b('Layer'),

i=b('copyProperties');

function j(k){
this._layer=k;}


i(j.prototype,
{_mouseSubscriptions:[],
_layerSubscriptions:[],
_layerHideTimeout:null,

enable:function(){
var k=this._layer.getRoot();
this._mouseSubscriptions=
[Event.listen(k,'mouseenter',this._onMouseEnter.bind(this)),
Event.listen(k,'mouseleave',this._onMouseLeave.bind(this))];

this._layerSubscriptions=
[h.subscribe('show',this._onLayerShow.bind(this)),
h.subscribe('hide',this._onLayerHide.bind(this))];},



disable:function(){
this._mouseSubscriptions.forEach(function(k){
k.remove();});

this._mouseSubscriptions=[];
this._layerSubscriptions.forEach(function(k){
h.unsubscribe(k);});

this._layerSubscriptions=[];},


_onMouseEnter:function(k){
this._fireMouseLeaveOnLayerHide=false;
if(this._layerHideTimeout){
clearTimeout(this._layerHideTimeout);
this._layerHideTimeout=null;}else
if(!this._spawnedLayer)
this._layer.inform('mouseenter');},



_onMouseLeave:function(k){
if(!this._spawnedLayer)
this._layer.inform('mouseleave');

this._fireMouseLeaveOnLayerHide=!!this._spawnedLayer;
this._layerHideTimeout=null;},


_onLayerShow:function(k,l){
var m=l.getContext&&l.getContext();
if(m)
if(g.contains(this._layer.getRoot(),m))
this._spawnedLayer=l;},




_onLayerHide:function(k,l){
if(l===this._spawnedLayer){
this._spawnedLayer=null;
if(this._fireMouseLeaveOnLayerHide)


this._layerHideTimeout=this._onMouseLeave.bind(this).defer();}}});





e.exports=j;});

/** js/modules/Overlay.js */
__d("Overlay",["Class","CSS","DataStore","DOM","Layer","LayerAutoFocus","LayerButtons","LayerDestroyOnHide","LayerFadeOnHide","LayerFadeOnShow","LayerFormHooks","LayerHideOnBlur","LayerHideOnEscape","LayerHideOnSuccess","LayerHideOnTransition","LayerTabIsolation","LayerMouseHooks","copyProperties"],function(a,b,c,d,e,f){




var g=b('Class'),
h=b('CSS'),
i=b('DataStore'),
j=b('DOM'),
k=b('Layer'),
l=b('LayerAutoFocus'),
m=b('LayerButtons'),
n=b('LayerDestroyOnHide'),
o=b('LayerFadeOnHide'),
p=b('LayerFadeOnShow'),
q=b('LayerFormHooks'),
r=b('LayerHideOnBlur'),
s=b('LayerHideOnEscape'),
t=b('LayerHideOnSuccess'),
u=b('LayerHideOnTransition'),
v=b('LayerTabIsolation'),
w=b('LayerMouseHooks'),

x=b('copyProperties');

function y(z,aa){
z=x
({buildWrapper:true},
z||{});

this._shouldBuildWrapper=z.buildWrapper;
this.parent.construct(this,z,aa);}


g.extend(y,k);

x(y.prototype,







{_configure:function(z,aa){
this.parent._configure(z,aa);

var ba=this.getRoot();
this._overlay=j.scry(ba,'div.uiOverlay')[0]||ba;



h.hide(ba);
j.appendContent(this.getInsertParent(),ba);

i.set(this._overlay,'overlay',this);

var ca=i.get(this._overlay,'width');
ca&&this.setWidth(ca);


if(this.setFixed)
this.setFixed(i.get(this._overlay,'fixed')=='true');



if(i.get(this._overlay,'fadeonshow')!='false')
this.enableBehavior(p);



if(i.get(this._overlay,'fadeonhide')!='false')
this.enableBehavior(o);



if(i.get(this._overlay,'hideonsuccess')!='false')
this.enableBehavior(t);



if(i.get(this._overlay,'hideonblur')=='true')
this.enableBehavior(r);




if(i.get(this._overlay,'destroyonhide')!='false')
this.enableBehavior(n);


return this;},


_getDefaultBehaviors:function(){
return this.parent._getDefaultBehaviors().concat
([l,
m,
q,
w,
s,
u,
v]);},









initWithoutBuildingWrapper:function(){
this._shouldBuildWrapper=false;
return this.init.apply(this,arguments);},


_buildWrapper:function(z,aa){
aa=this.parent._buildWrapper(z,aa);
if(!this._shouldBuildWrapper){
this._contentRoot=aa;
return aa;}


this._contentRoot=
j.create('div',{className:'uiOverlayContent'},aa);
return j.create('div',{className:'uiOverlay'},this._contentRoot);},


getContentRoot:function(){
return this._contentRoot;},


destroy:function(){
i.remove(this.getRoot(),'overlay');
this.parent.destroy();}});



e.exports=y;});

/** js/modules/ContextualDialogX.js */
__d("ContextualDialogX",["event-extensions","ARIA","Arbiter","ArbiterMixin","Bootloader","Class","ContextualDialogFooterLink","ContextualThing","CSS","DataStore","DOM","Locale","Overlay","Parent","Style","Vector","$","copyProperties","getOverlayZIndex"],function(a,b,c,d,e,f){




b('event-extensions');

var g=b('ARIA'),
h=b('Arbiter'),
i=b('ArbiterMixin'),
j=b('Bootloader'),
k=b('Class'),
l=b('ContextualDialogFooterLink'),
m=b('ContextualThing'),
n=b('CSS'),
o=b('DataStore'),
p=b('DOM'),
q=b('Locale'),
r=b('Overlay'),
s=b('Parent'),
t=b('Style'),
u=b('Vector'),

v=b('$'),
w=b('copyProperties'),
x=b('getOverlayZIndex');

function y(z,aa){
this.parent.construct(this,z,aa);}


k.extend(y,r);

w(y,i,
{ARROW_OFFSET:15,
ARROW_LENGTH:16,
ARROW_INSET:22,
TOP_MARGIN:8,
BOTTOM_MARGIN:30,
LEFT_MARGIN:15,
RIGHT_MARGIN:30,

POSITION_TO_CLASS:
{above:'uiContextualDialogAbove',
below:'uiContextualDialogBelow',
left:'uiContextualDialogLeft',
right:'uiContextualDialogRight'},

RIGHT_ALIGNED_CLASS:'uiContextualDialogRightAligned',


ARROW_CLASS:
{bottom:'uiContextualDialogArrowBottom',
top:'uiContextualDialogArrowTop',
right:'uiContextualDialogArrowRight',
left:'uiContextualDialogArrowLeft'},


POSITION_TO_ARROW:
{above:'bottom',
below:'top',
left:'right',
right:'left'},











getInstance:function(z){
var aa=o.get(z,'ContextualDialogX');
if(!aa){
var ba=s.byClass(z,'uiOverlay');
if(ba)
aa=o.get(ba,'overlay');}


return aa;}});




w(y.prototype,

{_scrollListener:null,
_scrollParent:null,
_width:null,
_fixed:false,
_hasCustomArrow:false,
_hasFooter:false,
_showSubscription:null,
_hideSubscription:null,
_hovercardSubscription:null,
_setContextSubscription:null,
_resizeListener:null,
_reflowSubscription:null,

_configure:function(z,aa){
this.parent._configure(z,aa);

var ba=this.getRoot(),
ca=o.get.curry(ba);
this.setAlignH(ca('alignh','left'));
this.setOffsetX(ca('offsetx',0));
this.setOffsetY(ca('offsety',0));
this.setPosition(ca('position','above'));
this._hasCustomArrow=ca('hascustomarrow',false);
this._hasFooter=ca('hasfooter',false);

if(this._hasFooter){
var da=p.scry(ba,'.uiContextualDialogFooterLink')[0];
da&&this.enableBehavior(l);}



this._setContextSubscription=this.subscribe('beforeshow',function(){
this.unsubscribe(this._setContextSubscription);
this._setContextSubscription=null;
var ea=ca('context');
if(ea){
this.setContext(v(ea));}else{

ea=ca('contextselector');
if(ea)
this.setContext(p.find(document,ea));}}.


bind(this));

this._content=p.scry(ba,'.uiContextualDialogContent')[0];

this._showSubscription=this.subscribe('show',function(){
var ea=this.updatePosition.shield(this);
this._resizeListener=Event.listen(window,'resize',ea);
this._reflowSubscription=h.subscribe('reflow',ea);
this._setupScrollListener(this._scrollParent);
m.register(ba,this.context);
h.inform('layer_shown',{type:'ContextualDialog'});}.
bind(this));
this._hideSubscription=this.subscribe('hide',function(){
this._teardownResizeAndReflowListeners();
this._teardownScrollListener();
h.inform('layer_hidden',{type:'ContextualDialog'});}.
bind(this));

this._hovercardSubscription=
h.subscribe('Hovercard/hide',function(ea,fa){



if(a.Hovercard.contains(this.getContext()))
this.hide();}.

bind(this));
return this;},


_buildWrapper:function(z,aa){
var ba=this.parent._buildWrapper(z,aa);
if(!this._shouldBuildWrapper)return ba;

n.addClass(ba,'uiContextualDialog');
return p.create
('div',
{className:'uiContextualDialogPositioner'},
ba);},


setWidth:function(z){
this._width=Math.floor(z);
return this;},


setFixed:function(z){
z=!!z;
n.conditionClass(this.getRoot(),'uiContextualDialogFixed',z);
this._fixed=z;
return this;},









setAlignH:function(z){
this.alignH=z;
this._updateAlignmentClass();
this._shown&&this.updatePosition();
this.position&&this._updateArrow();
return this;},













getContent:function(){
return this._content;},







getContext:function(){
return this.context;},








setContext:function(z){
if(this._setContextSubscription){
this.unsubscribe(this._setContextSubscription);
this._setContextSubscription=null;}


z=v(z);

if(this.context&&this.context!=z)
o.remove(this.context,'ContextualDialogX');


this.context=z;

g.setPopup(this.getCausalElement(),this.getRoot());




var aa=s.byClass(z,'fbPhotoSnowlift');
this.setInsertParent(aa||document.body);



if(this._scrollListener&&this._scrollParent!==aa){
this._teardownScrollListener();
this._setupScrollListener(aa);}


this._scrollParent=aa;


var ba=x(z,this._insertParent);
t.set(this.getRoot(),'z-index',ba>200?ba:'');

o.set(this.context,'ContextualDialogX',this);
return this;},






getCausalElement:function(){
return this.parent.getCausalElement()||this.context;},










listen:function(z,aa){
return Event.listen(this.getRoot(),z,aa);},








setOffsetX:function(z){
this.offsetX=parseInt(z,10)||0;
this._shown&&this.updatePosition();
return this;},








setOffsetY:function(z){
this.offsetY=parseInt(z,10)||0;
this._shown&&this.updatePosition();
return this;},









setPosition:function(z){
this.position=z;
for(var aa in y.POSITION_TO_CLASS)
n.conditionClass
(this.getRoot(),
y.POSITION_TO_CLASS[aa],
z==aa);

this._updateAlignmentClass();
this._shown&&this.updatePosition();
this._updateArrow();
return this;},







updatePosition:function(){
if(!this.context)return false;

if(this._width)
t.set(this._overlay,'width',this._width+'px');



var z=this._fixed?'viewport':'document',
aa=u.getElementPosition(this.context,z),


ba=this._scrollParent;
if(ba)
aa=aa.
sub(u.getElementPosition(ba,'document')).
add(ba.scrollLeft,ba.scrollTop);


var ca=u.getElementDimensions(this.context),
da=this.position=='above'||this.position=='below',
ea=q.isRTL();



if((this.position=='right'||
(da&&this.alignH=='right'))!=ea)
aa=aa.add(ca.x,0);



if(this.position=='below')
aa=aa.add(0,ca.y);


var fa=new u(0,0);

if(da&&this.alignH=='center'){
fa=fa.add((ca.x-this._width)/2,0);}else{



var ga=da?ca.x:ca.y,
ha=2*y.ARROW_INSET;
if(ga<ha){
var ia=ga/2-y.ARROW_INSET;
if(da&&(this.alignH=='right'!=ea))
ia=-ia;

fa=fa.add(da?ia:0,da?0:ia);}}




fa=fa.add(this.offsetX,this.offsetY);

if(ea)
fa=fa.mul(-1,1);


aa=aa.add(fa);





if(this._fixed)
aa=new u(aa.x,aa.y,'document');



aa.setElementPosition(this.getRoot());


this._adjustVerticalPosition();
this._adjustHorizontalPosition();

return true;},





scrollTo:function(){
if(this.context)
j.loadModules(['DOMScroll'],
function(z){
z.scrollTo
(this.context,
true,
true);}.
bind(this));},








destroy:function(){
this.unsubscribe(this._showSubscription);
this.unsubscribe(this._hideSubscription);
this._hovercardSubscription.unsubscribe();
if(this._setContextSubscription){
this.unsubscribe(this._setContextSubscription);
this._setContextSubscription=null;}

this._teardownScrollListener();
this._teardownResizeAndReflowListeners();
this.context&&o.remove(this.context,'ContextualDialogX');
this.parent.destroy();},








_adjustVerticalPosition:function(){

if(this.position!='left'&&this.position!='right'){
t.set(this._overlay,'top','');
return;}


var z=this.getRoot(),
aa=u.getElementPosition(z,'viewport').y,
ba=u.getElementDimensions(this._overlay).y,
ca=u.getViewportDimensions().y,
da=y.TOP_MARGIN,

ea=
Math.min



(Math.max(0,
aa+
ba+
y.BOTTOM_MARGIN-
ca),




Math.max(-da,aa-da),






ba-2*y.ARROW_INSET);


t.set(this._overlay,'top',(-1*ea)+'px');
t.set(this._arrow,'top',y.ARROW_OFFSET+'px');
t.set(this._arrow,'marginTop',ea+'px');},


_adjustHorizontalPosition:function(){

if((this.position!='above'&&this.position!='below')||
this.alignH!='left'){
t.set(this._overlay,'left','');
t.set(this._overlay,'right','');
return;}


var z=this.getRoot(),
aa=u.getElementPosition(z,'viewport').x,
ba=u.getElementDimensions(this._overlay).x,
ca=u.getViewportDimensions().x,

da=q.isRTL(),
ea;


if(!da){
ea=aa+
ba+
y.RIGHT_MARGIN-
ca;}else 

ea=y.LEFT_MARGIN+
ba-
aa;


ea=Math.min

(Math.max(0,ea),


ba-2*y.ARROW_INSET);


t.set
(this._overlay,
da?'right':'left',-1*ea+'px');

t.set
(this._arrow,
da?'right':'left',y.ARROW_OFFSET+'px');

t.set
(this._arrow,
da?'marginRight':'marginLeft',ea+'px');},






_updateArrow:function(){
var z=0;
if(this.position=='above'||this.position=='below')
switch(this.alignH){
case 'center':
z=50;
break;
case 'right':
z=100;
break;}



this._renderArrow
(y.POSITION_TO_ARROW[this.position],
z);},









_renderArrow:function(z,aa){
for(var ba in y.ARROW_CLASS)
n.conditionClass
(this._overlay,
y.ARROW_CLASS[ba],
z==ba);



n.conditionClass
(this._overlay,
'uiContextualDialogWithFooterArrowBottom',
z=='bottom'&&this._hasFooter);


if(z=='none')
return;



if(!this._arrow){
this._arrow=p.create('i',{className:'uiContextualDialogArrow'});
p.appendContent(this._overlay,this._arrow);}



t.set(this._arrow,'top','');
t.set(this._arrow,'left','');
t.set(this._arrow,'right','');
t.set(this._arrow,'margin','');


var ca=z=='top'||z=='bottom',
da=ca?(q.isRTL()?'right':'left'):'top';

aa=aa||0;
t.set(this._arrow,da,aa+'%');
var ea=
y.ARROW_LENGTH+
y.ARROW_OFFSET*2,
fa=
-(ea*aa/100-y.ARROW_OFFSET);
t.set
(this._arrow,
'margin-'+da,
fa+'px');


if(this._hasCustomArrow)



y.inform('arrow_rendered',
{type:'ContextualDialog',
root:this._root,
position:z,
side:da,
offset_percent:aa,
side_margin:fa});},




_updateAlignmentClass:function(){
n.conditionClass
(this.getRoot(),
y.RIGHT_ALIGNED_CLASS,
(this.position=='above'||this.position=='below')&&
this.alignH=='right');},







_setupScrollListener:function(z){
this._scrollListener=Event.listen
(z||window,
'scroll',
this._adjustVerticalPosition.shield(this));},





_teardownScrollListener:function(){
if(this._scrollListener){
this._scrollListener.remove();
this._scrollListener=null;}},



_teardownResizeAndReflowListeners:function(){
if(this._resizeListener){
this._resizeListener.remove();
this._resizeListener=null;}

if(this._reflowSubscription){
this._reflowSubscription.unsubscribe();
this._reflowSubscription=null;}}});





e.exports=y;});

/** js/modules/Rect.js */
__d("Rect",["Vector","$","copyProperties"],function(a,b,c,d,e,f){



var g=b('Vector'),

h=b('$'),
i=b('copyProperties');

















function j(k,l,m,n,o){
if(arguments.length===1){
if(k instanceof j)
return k;

if(k instanceof g)
return new j(k.y,k.x,k.y,k.x,k.domain);

return j.getElementBounds(h(k));}


i(this,
{t:k,
r:l,
b:m,
l:n,
domain:o||'pure'});}




i(j.prototype,

{w:function(){return this.r-this.l;},
h:function(){return this.b-this.t;},

toString:function(){
return '(('+this.l+', '+this.t+'), ('+this.r+', '+this.b+'))';},





contains:function(k){
k=new j(k).convertTo(this.domain);
var l=this;

return (l.l<=k.l&&l.r>=k.r&&l.t<=k.t&&l.b>=k.b);},






add:function(k,l){
if(arguments.length==1){
if(k.domain!='pure')
k=k.convertTo(this.domain);

return this.add(k.x,k.y);}

var m=parseFloat(k),
n=parseFloat(l);
return new j
(this.t+n,
this.r+m,
this.b+n,
this.l+m,
this.domain);},






sub:function(k,l){
if(arguments.length==1){
return this.add(k.mul(-1));}else 

return this.add(-k,-l);},

















boundWithin:function(k){
var l=0,m=0;

if(this.l<k.l){
l=k.l-this.l;}else
if(this.r>k.r)
l=k.r-this.r;


if(this.t<k.t){
m=k.t-this.t;}else
if(this.b>k.b)
m=k.b-this.b;


return this.add(l,m);},


getCenter:function(){
return new g
(this.l+this.w()/2,
this.t+this.h()/2,
this.domain);},



getPositionVector:function(){
return new g(this.l,this.t,this.domain);},


getDimensionVector:function(){
return new g(this.w(),this.h(),'pure');},


convertTo:function(k){
if(this.domain==k)
return this;


if(k=='pure')
return new j(this.t,this.r,this.b,this.l,'pure');


if(this.domain=='pure'){
emptyFunction
('Unable to convert a pure rect to %s coordinates.',
k);
return new j(0,0,0,0);}


var l=new g(this.l,this.t,this.domain).convertTo(k);

return new j(l.y,l.x+this.w(),l.y+this.h(),l.x,k);}});




i(j,

{deserialize:function(k){
var l=k.split(':');
return new j
(parseFloat(l[1]),
parseFloat(l[2]),
parseFloat(l[3]),
parseFloat(l[0]));},



newFromVectors:function(k,l){
return new j(k.y,k.x+l.x,k.y+l.y,k.x,k.domain);},


getElementBounds:function(k){
return j.newFromVectors
(g.getElementPosition(k),
g.getElementDimensions(k));},


getViewportBounds:function(){
return j.newFromVectors
(g.getScrollPosition(),
g.getViewportDimensions());},


minimumBoundingBox:function(k){
var l=new j
(Math.min(),
Math.max(),
Math.max(),
Math.min()),


m;
for(var n=0;n<k.length;n++){
m=k[n];
l.t=Math.min(l.t,m.t);
l.r=Math.max(l.r,m.r);
l.b=Math.max(l.b,m.b);
l.l=Math.min(l.l,m.l);}

return l;}});




e.exports=j;});

/** js/lib/ui/hovercard/Hovercard.js */
__d("Hovercard",["event-extensions","function-extensions","AccessibleLayer","Arbiter","AsyncRequest","AsyncSignal","ContextualDialogX","CSS","DOM","DOMQuery","LayerDestroyOnHide","LayerFadeOnHide","LayerFadeOnShow","Parent","Rect","Style","URI","UserAgent","Vector","ViewportBounds","clickRefAction","tx","userAction"],function(a,b,c,d,e,f){




















b('event-extensions');
b('function-extensions');

var g=b('AccessibleLayer'),
h=b('Arbiter'),
i=b('AsyncRequest'),
j=b('AsyncSignal'),
k=b('ContextualDialogX'),
l=b('CSS'),
m=b('DOM'),
n=b('DOMQuery'),
o=b('LayerDestroyOnHide'),
p=b('LayerFadeOnHide'),
q=b('LayerFadeOnShow'),
r=b('Parent'),
s=b('Rect'),
t=b('Style'),
u=b('URI'),
v=b('UserAgent'),
w=b('Vector'),
x=b('ViewportBounds'),

y=b('clickRefAction'),
z=b('tx'),
aa=b('userAction'),

ba=450,
ca=385,

da={},
ea={},
fa=null,
ga=null,

ha=null,

ia=150,
ja=700,
ka=1000,
la=250,

ma=null,
na=null,
oa=null,
pa=null;


function qa(){
if(v.ie()<7)return;
Event.listen(document.documentElement,'mouseover',ra);


Event.listen(window,'scroll',function(){
if(fa&&t.isFixed(fa))
mb.hide(true);});





h.subscribe('page_transition',function(){
xa();
mb.dirtyAll();},
h.SUBSCRIBE_NEW);




h.subscribe
('layer_shown',
function(nb,ob){

if(ob.type!='Hovercard'&&ob.type!='ContextualDialog')
xa();},


h.SUBSCRIBE_NEW);


k.subscribe
('arrow_rendered',
za,
h.SUBSCRIBE_NEW);}









function ra(event){
var nb=r.byTag(event.getTarget(),'a');
mb.processNode(nb)&&event.stop();}














function sa(nb){
ga=nb;
if(!ta(nb)){
var ob;
if(!nb||!(ob=ua(nb))){
ea.moveToken&&ea.moveToken.remove();
ea={};
return false;}

if(ea.node!=nb){
ea.moveToken&&ea.moveToken.remove();
ea={node:nb,endpoint:ob,pos:null};}}


return true;}








function ta(nb){
return nb&&fa&&ea.node==nb;}









function ua(nb){
return nb.getAttribute('data-hovercard');}









function va(nb){
var ob=Event.listen(nb,'mouseout',function(){
clearTimeout(ma);
clearTimeout(na);
ob.remove();
ga=null;
mb.hide();});




if(!ea.moveToken)
ea.moveToken=Event.listen(nb,'mousemove',function(event){
ea.pos=w.getEventPosition(event);});



clearTimeout(ma);
clearTimeout(na);
clearTimeout(pa);

var pb=ia,


qb=fa?la:ja;

if(nb.getAttribute('data-hovercard-instant'))


pb=qb=50;


ma=setTimeout(ib.curry(nb),pb);
na=setTimeout(wa.curry(nb),qb);}




















function wa(nb,ob){

if(ea.node!=nb)
return;


var pb=da[ua(nb)];
if(pb){
ya(pb);}else
if(ob){
ya(kb());}else{

var qb=fa?la:ja;
oa=setTimeout
(wa.curry(nb,true),
ka-qb);}}









function xa(){
mb.hide(true);
clearTimeout(na);}


function ya(nb){
var ob=ea.node,
pb=fa,
qb=pb!=ob;
if(fa){
var rb=k.getInstance(fa);
rb&&rb.hide();}



if(!m.contains(document.body,ob)){
mb.hide(true);
return;}


fa=ob;
ha=nb;
eb();
nb.setContext(ob).show();



if(qb){

(function(){

new j('/ajax/hovercard/shown.php').send();


y('himp',fa,null,'FORCE',{ft:{evt:39}});
aa('hovercard',fa).uai('show');}).
defer();

if(pb){
h.inform('Hovercard/hide',{node:pb});}else 

h.inform('layer_shown',{type:'Hovercard'});

h.inform('Hovercard/show',{node:ob});}}







function za(nb,ob){
var pb=da[ea.endpoint];
if(ob.type!=='ContextualDialog'||
!pb||
!ob.root||
ob.position!=='top')

return;


var qb=
n.scry(ob.root,'.CustomArrow')[0];
if(!qb)
return;

var rb=
n.scry(qb,'.ArrowShadow')[0];
if(!rb)
return;


var sb=null;
if(qb.style.webkitMaskPosition!==undefined){
sb=cb;}else
if(ab(qb))
sb=db;


if(sb){
l.addClass(ob.root,'withCustomArrow');

setTimeout(function(){
sb(qb,rb,ob);},
0);}}






function ab(nb){
if(!nb)
nb=document.body;

var ob=
['transform',
'WebkitTransform',
'msTransform',
'MozTransform',
'OTransform'],

pb;
while(pb=ob.shift())
if(nb.style[pb]!==undefined)
return pb;


return null;}





function bb(nb,ob,pb){

var qb=nb.parentNode.offsetWidth,
rb=Math.round(qb*pb.offset_percent/100);
if(pb.side==='left'){
rb=rb+pb.side_margin;}else
if(pb.side==='right')
rb=
qb-rb-pb.side_margin-18;

return rb;}





function cb(nb,ob,pb){
l.addClass(pb.root,'usingMask');

var qb=bb(nb,ob,pb);
nb.style.webkitMaskPositionX=qb+'px';
ob.style.left=qb+'px';}





function db(nb,ob,pb){
var qb=n.scry(nb,'.CoverPhoto')[0];
if(!qb)
return;

var rb=ab(nb);
if(!rb)
return;


l.addClass(pb.root,'usingRotate');


var sb=bb(nb,ob,pb)+9,

tb=Math.ceil(sb/Math.SQRT2);

qb.style[rb]=
'translate('+(-tb)+'px, '+tb+'px) rotate(-45deg)';

nb.style[rb]=
'translate('+sb+'px, 0) rotate(45deg)';}











function eb(){
var nb=w.getViewportDimensions(),
ob=w.getElementPosition(fa,'viewport'),
pb=ob.convertTo('document'),
qb=hb(fa),

rb='above',
sb='left',


tb=gb(pb,qb,'above');

if(ob.y+tb<=ca){
var ub=gb(pb,qb,'below');

if(ob.y+ub+fa.offsetHeight+
ca<nb.y){
rb='below';
tb=ub;}}



var vb=nb.x-x.getRight(),


wb=fb(pb,qb,'left');

if(ob.x+wb+ba>=vb){
var xb=fb(pb,qb,'right');

if(ob.x+xb+fa.offsetWidth>
ba){
sb='right';
wb=xb;}}



ha.
setPosition(rb).
setAlignH(sb).
setOffsetX(wb).
setOffsetY(tb);}


function fb(nb,ob,pb){
if(pb=='left')
return ob.l-nb.x;

return ob.r-(nb.x+fa.offsetWidth);}


function gb(nb,ob,pb){
if(pb=='above')
return ob.t-nb.y;

return ob.b-(nb.y+fa.offsetHeight);}










function hb(nb){
var ob=ea.pos,
pb=nb.getClientRects();
if(!ob||pb.length===0)

return s.getElementBounds(nb);


var qb,
rb=false;
for(var sb=0;sb<pb.length;sb++){
var tb=new s
(Math.round(pb[sb].top),Math.round(pb[sb].right),
Math.round(pb[sb].bottom),Math.round(pb[sb].left),
'viewport').convertTo('document'),
ub=tb.getPositionVector(),
vb=ub.add(tb.getDimensionVector());


if(!qb||(ub.x<=qb.l&&ub.y>qb.t)){
if(rb)break;
qb=new s(ub.y,vb.x,vb.y,ub.x,'document');}else{

qb.t=Math.min(qb.t,ub.y);
qb.b=Math.max(qb.b,vb.y);
qb.r=vb.x;}


if(tb.contains(ob))


rb=true;}



return qb;}














function ib(nb){


if(nb.id&&da[nb.id]!=null)
return;





var ob=ua(nb);
if(da[ob]!=null)
return;


jb(ob);

var pb=function(){
mb.dirty(ob);
xa();};


new i(ob).
setData({endpoint:ob}).
setMethod('GET').
setReadOnly(true).
setErrorHandler(pb).
setTransportErrorHandler(pb).
send();}









function jb(nb){


da[nb]=false;}





var kb=function(){
var nb=new k({},m.create
('div',
{className:'HovercardLoading'},
"Loading..."));

nb.
disableBehavior(g).
disableBehavior(o).
disableBehavior(q).
disableBehavior(p);
lb(nb);
kb=bagof(nb);
return nb;};


function lb(nb){
nb.subscribe('mouseenter',function(){
clearTimeout(pa);


ga=ea.node;});

nb.subscribe('mouseleave',function(){
mb.hide(false);
ga=null;});}




var mb=

















{hide:function(nb){
if(!fa)
return;

if(nb){
if(ha){
h.inform('layer_hidden',{type:'Hovercard'});
h.inform('Hovercard/hide',{node:fa});
ha.hide();}


ga=null;
fa=null;
ha=null;}else 

pa=setTimeout(mb.hide.curry(true),la);},



setDialog:function(nb,ob){

ob.disableBehavior(g);
da[nb]=ob;
lb(ob);
if(ea.endpoint==nb&&
ga==ea.node)
ya(ob);},



getDialog:function(nb){
return da[nb];},








contains:function(nb){
if(ha)
return m.contains(ha.getRoot(),nb);

return false;},









dirty:function(nb){
var ob=da[nb];
if(ob){
ob.destroy();
delete da[nb];}},







dirtyAll:function(){
for(var nb in da){
var ob=da[nb];
ob&&mb.dirty(nb);}

h.inform('Hovercard/dirty');},











processNode:function(nb){
if(nb&&sa(nb)){
va(nb);
return true;}

return false;}};




if(!a.Hovercard){
qa();}else 

mb=a.Hovercard;


e.exports=mb;


a.Hovercard=e.exports;});

/** js/modules/KeyStatus.js */
__d("KeyStatus",["event-extensions"],function(a,b,c,d,e,f){









b('event-extensions');

var g=null,
h=null;





function i(){
if(!h)
h=Event.listen(window,'blur',function(){
g=null;
j();});}




function j(){
if(h){
h.remove();
h=null;}}







Event.listen(document.documentElement,'keydown',function(l){
g=Event.getKeyCode(l);
i();},
Event.Priority.URGENT);
Event.listen(document.documentElement,'keyup',function(l){
g=null;
j();},
Event.Priority.URGENT);

var k=
{isKeyDown:function(){
return !!g;},


getKeyDownCode:function(){
return g;}};



e.exports=k;});

/** js/ui/layer/behaviors/ContextualLayerDimensions.js */
__d("ContextualLayerDimensions",["DOM","Locale","Rect","Vector","ViewportBounds","ge","getOverlayZIndex"],function(a,b,c,d,e,f){



var g=b('DOM'),
h=b('Locale'),
i=b('Rect'),
j=b('Vector'),
k=b('ViewportBounds'),

l=b('ge'),
m=b('getOverlayZIndex'),

n=




{getViewportRect:function(o){
var p=l('globalContainer'),
q=o.getContext(),
r=
(p&&g.contains(p,q))||
m(q)<300,

s=i.getViewportBounds();
if(r){
s.t+=k.getTop();
if(h.isRTL()){
s.l+=k.getRight();}else 

s.r-=k.getRight();}


return s;},








getLayerRect:function(o,p){
var q=o.getContext(),
r=j.getElementPosition(q,'viewport'),
s=o.simulateOrientation(p,function(){
return j.getElementDimensions(o.getContent());}),


t=r.y+p.getOffsetY();
if(p.getPosition()==='above'){
t-=s.y;}else
if(p.getPosition()==='below')
t+=q.offsetHeight;


var u=r.x+p.getOffsetX();
if(p.isVertical()){
var v=p.getAlignment();
if(v==='center'){
u+=(q.offsetWidth-s.x)/2;}else
if((v==='right')!==h.isRTL())
u+=q.offsetWidth-s.x;}else 


if((p.getPosition()==='right')!==h.isRTL()){
u+=q.offsetWidth;}else 

u-=s.x;



return new i
(t,
u+s.x,
t+s.y,
u,
'viewport');}};




e.exports=n;});

/** js/ui/layer/behaviors/ContextualLayerAutoFlip.js */
__d("ContextualLayerAutoFlip",["array-extensions","event-extensions","ContextualLayerDimensions","DOM","Vector","copyProperties"],function(a,b,c,d,e,f){



b('array-extensions');
b('event-extensions');

var g=b('ContextualLayerDimensions'),
h=b('DOM'),
i=b('Vector'),

j=b('copyProperties');












function k(l){
this._layer=l;}


j(k.prototype,
{_subscription:null,

enable:function(){
this._subscription=this._layer.subscribe
('adjust',
this._adjustOrientation.bind(this));

if(this._layer.isShown())
this._layer.updatePosition();},



disable:function(){
this._subscription.unsubscribe();
this._subscription=null;
if(this._layer.isShown())
this._layer.updatePosition();},










_adjustOrientation:function(l,m){
var n=this._getValidPositions(m);
if(!n.length){
m.invalidate();
return;}

var o=g.getViewportRect(this._layer),
p=this._getValidAlignments(m);
for(var q=0;q<p.length;q++){
m.setAlignment(p[q]);
for(var r=0;r<n.length;r++){
m.setPosition(n[r]);
var s=g.getLayerRect
(this._layer,
m);

if(o.contains(s))
return;}}





m.setPosition
(n.contains('below')?'below':n[0]).
setAlignment(p[0]);},








_getValidPositions:function(l){
var m=
[l.getPosition(),
l.getOppositePosition()],

n=this._layer.getContextScrollParent();
if(n===window||
n===h.getDocumentScrollElement())

return m;

var o=this._layer.getContext(),
p=i.getElementPosition(n,'viewport').y,
q=i.getElementPosition(o,'viewport').y;

if(l.isVertical()){
return m.filter(function(s){
if(s==='above'){

return q>=p;}else{


var t=p+n.offsetHeight,
u=q+o.offsetHeight;
return u<=t;}});}else{




var r=p+n.offsetHeight;
if(q>=p&&
q+o.offsetHeight<=r){
return m;}else 

return [];}},







_getValidAlignments:function(l){
var m=['left','center','right'],
n=l.getAlignment(),
o=m.indexOf(n);
if(o>0){
m.splice(o,1);
m.unshift(n);}

return m;}});




e.exports=k;});

/** js/modules/Tooltip.js */
__d("Tooltip",["event-extensions","ARIA","AsyncRequest","ContextualLayer","ContextualLayerAutoFlip","CSS","DataStore","DOM","Style","URI","copyProperties","emptyFunction","tx"],function(a,b,c,d,e,f){




b('event-extensions');

var g=b('ARIA'),
h=b('AsyncRequest'),
i=b('ContextualLayer'),
j=b('ContextualLayerAutoFlip'),
k=b('CSS'),
l=b('DataStore'),
m=b('DOM'),
n=b('Style'),
o=b('URI'),

p=b('copyProperties'),
q=b('emptyFunction'),
r=b('tx'),


s=null,


t=null,


u=null,


v=[];

function w(){
if(!t){
u=m.create('div',{className:'tooltipContent'});
var da=m.create('i',{className:'arrow'}),
ea=
m.create('div',{className:'uiTooltipX'},[u,da]);

t=new i({},ea);
t.enableBehavior(j);}}






function x(da){
return p
({position:da.getAttribute('data-tooltip-position')||'above',
alignH:da.getAttribute('data-tooltip-alignh')||'left'},
l.get(da,'tooltip'));}






function y(da,ea){
var fa=x(da);
l.set(da,'tooltip',
{content:ea.content||fa.content,
position:ea.position||fa.position,
alignH:ea.alignH||fa.alignH});

da.setAttribute('data-hover','tooltip');}





function z(da,ea){

ca.set(da,"Loading...");

new h(ea).
setHandler(function(fa){
ca.set(da,fa.getPayload());}).

setErrorHandler(q).
send();}



var aa=/(\r\n|[\r\n])/;
function ba(da){
return da.split(aa).map(function(ea){
return aa.test(ea)?m.create('br'):ea;});}



var ca=






{process:function(da,ea){

if(!m.contains(da,ea))return;
if(da!==s){

var fa=da.getAttribute('data-tooltip-uri');
if(fa){
da.removeAttribute('data-tooltip-uri');
z(da,fa);}



var ga=da.getAttribute('title');
if(ga){
da.setAttribute('title','');

var ha=x(da);
!ha.content&&ca.set(da,ga);}

ca.show(da);}},







remove:function(da){







l.remove(da,'tooltip');
da.removeAttribute('data-hover');
da.removeAttribute('data-tooltip-position');
da.removeAttribute('data-tooltip-alignh');


da===s&&ca.hide();},





hide:function(){
if(s){
t.hide();
s=null;

while(v.length)
v.pop().remove();}},















set:function(da,ea,fa,ga){









if(fa||ga)
y(da,{position:fa,alignH:ga});


if(ea instanceof o){
if(da===s){

z(da,ea);}else 


da.setAttribute('data-tooltip-uri',ea);}else{



if(typeof ea!=='string')
ea=m.create('div',{},ea);

y(da,{content:ea});


da===s&&ca.show(da);}},







show:function(da){






w();
ca.hide();


var ea=x(da);
if(!ea.content)
return;





var fa=0,
ga=0;
if(ea.position==='left'||ea.position==='right'){
ga=(da.offsetHeight-20)/2;}else
if(ea.alignH!=='center'){
var ha=da.offsetWidth;
if(ha<18)
fa=(ha-18)/2*(ea.alignH==='right'?-1:1);}




t.
setContext(da).
setOffsetX(fa).
setOffsetY(ga).
setPosition(ea.position).
setAlignment(ea.alignH);

if(typeof ea.content==='string'){
k.addClass(t,'invisible_elem');


var ia=m.create('span',{},ba(ea.content)),
ja=m.create('div',{className:'tooltipText'},ia);
m.setContent(u,ja);
t.show();
g.notify(ea.content);


var ka;
if(ja.getClientRects){


var la=ja.getClientRects()[0];
ka=Math.round(la.right-la.left);}else 

ka=ja.offsetWidth;

if(ka<ia.offsetWidth){
k.addClass(ja,'tooltipWrap');
t.updatePosition();}


k.removeClass(t,'invisible_elem');}else{

m.setContent(u,ea.content);
t.show();
g.notify(m.getText(u));}



var ma=function(oa){
if(!m.contains(s,oa.getTarget()))
ca.hide();};


v.push
(Event.listen(document.documentElement,'mouseover',ma));

v.push
(Event.listen(document.documentElement,'focusin',ma));



var na=n.getScrollParent(da);
if(na!==window)
v.push(Event.listen(na,'scroll',ca.hide));



v.push(Event.listen(da,'click',ca.hide));

s=da;}};



Event.listen(window,'scroll',ca.hide);

e.exports=ca;});

/** js/modules/Selector.js */
__d("Selector",["event-extensions","Arbiter","Button","ContextualLayer","CSS","DataStore","DOM","HTML","Input","Keys","KeyStatus","Menu","Parent","Style","Toggler","Tooltip","Vector","copyProperties","emptyFunction"],function(a,b,c,d,e,f){







b('event-extensions');

var g=b('Arbiter'),
h=b('Button'),
i=b('ContextualLayer'),
j=b('CSS'),
k=b('DataStore'),
l=b('DOM'),
m=b('HTML'),
n=b('Input'),
o=b('Keys'),
p=b('KeyStatus'),
q=b('Menu'),
r=b('Parent'),
s=b('Style'),
t=b('Toggler'),
u=b('Tooltip'),
v=b('Vector'),

w=b('copyProperties'),
x=b('emptyFunction'),

y,


z,
aa=[],
ba;







function ca(na){
return r.byClass(na,'uiSelector');}








function da(na){
return r.byClass(na,'uiSelectorButton');}


function ea(){
if(!z){
z=new i({position:'below'},l.create('div'));
j.addClass(z.getRoot(),'uiSelectorContextualLayer');}

return z;}







function fa(na){
return l.scry(na,'select')[0];}







function ga(na){
return l.find(na,'div.uiSelectorMenuWrapper');}






function ha(){
ha=x;


q.subscribe('select',function(na,oa){

if(!y||!oa||
oa.menu!==ma.getSelectorMenu(y))
return;


var pa=ia(y),
qa=ja(oa.item);

if(qa){
var ra=y,
sa=ma.isOptionSelected(oa.item),


ta=ma.inform
('select',
{selector:ra,option:oa.item,clone:ba});


if(ta===false)
return;




if(pa||!sa){
ma.setSelected
(ra,
ma.getOptionValue(oa.item),
!sa);



ma.inform('toggle',{selector:ra,option:oa.item});


ma.inform('change',{selector:ra});
g.inform('Form/change',{node:ra});




if(ka(ra))
k.set(ra,'dirty',true);}}





if(!pa||!qa)
y&&ma.toggle(y);});}








function ia(na){
return !!na.getAttribute('data-multiple');}







function ja(na){
return j.hasClass(na,'uiSelectorOption');}







function ka(na){
return !!na.getAttribute('data-autosubmit');}







var la=


{keydown:function(event){
var na=event.getTarget();


if(l.isNodeOfType(na,['input','textarea']))
return;


switch(Event.getKeyCode(event)){
case o.DOWN:
case o.SPACE:
case o.UP:
if(da(na)){
var oa=ca(na);
ma.toggle(oa);
return false;}

break;
case o.ESC:
if(y){
ma.toggle(y);
return false;}

break;}},




mouseover:function(event){
var na=r.byAttribute(event.getTarget(),'ajaxify');
if(na&&j.hasClass(na,'uiSelectorButton'))
ma.loadMenu(ca(na));}};





Event.listen(document.documentElement,la);


t.subscribe(['show','hide'],function(na,oa){
var pa=ca(oa.getActive());
if(pa){

ha();

var qa=ma.getSelectorButton(pa),
ra=ma.getSelectorMenu(pa),

sa=na==='show';
qa.setAttribute('aria-expanded',sa?'true':'false');
if(sa){
y=pa;


if(j.hasClass(qa,'uiButtonDisabled')){
ma.setEnabled(pa,false);
return false;}


ra=ra||ma.loadMenu(pa);


var ta=s.getScrollParent(pa),
ua=ta!==window&&
ta!==l.getDocumentScrollElement();
if(ua||
j.hasClass(pa,'uiSelectorUseLayer')){

if(ua)

aa.push
(Event.listen(ta,'scroll',function(){
oa.hide();}));






ba=l.create('div',{className:pa.className});
j.addClass(ba,'invisible_elem');
v.
getElementDimensions(pa).
setElementDimensions(ba);

l.replace(pa,ba);


var va=j.hasClass(pa,'uiSelectorRight'),
wa=j.hasClass(pa,'uiSelectorBottomUp');
ea().
setContext(ba).
setContent(pa).
setPosition(wa?'above':'below').
setAlignment(va?'right':'left').
show();}



q.register(ra);

if(p.isKeyDown()){


var xa=q.getCheckedItems(ra);
if(!xa.length)
xa=q.getEnabledItems(ra);

q.focusItem(xa[0]);}}else{


y=null;


if(ba){

while(aa.length)
aa.pop().remove();



l.replace(ba,pa);
ea().hide();

ba=null;}



ra&&q.unregister(ra);

if(ka(pa)&&k.get(pa,'dirty')){
var ya=l.scry(pa,'input.submitButton')[0];
ya&&ya.click();

k.remove(pa,'dirty');}}




j.conditionClass
(ma.getSelectorButton(pa),'selected',sa);


ma.inform
(sa?'open':'close',
{selector:pa,clone:ba});}});


























var ma=w(new g(),







{attachMenu:function(na,oa,pa){
na=ca(na);
if(na){
y&&q.unregister(ma.getSelectorMenu(y));
l.setContent(ga(na),oa);
y&&q.register(ma.getSelectorMenu(na));

ba&&ea().updatePosition();

if(pa){

var qa=na.getAttribute('data-name');
qa&&pa.setAttribute('name',qa);
if(!ia(na))
pa.setAttribute('multiple',false);



var ra=fa(na);
if(ra){
l.replace(ra,pa);}else 

l.insertAfter(na.firstChild,pa);}


return true;}},










getOption:function(na,oa){
var pa=ma.getOptions(na),qa=pa.length;
while(qa--)
if(oa===ma.getOptionValue(pa[qa]))
return pa[qa];


return null;},







getOptions:function(na){
var oa=q.getItems(ma.getSelectorMenu(na));
return oa.filter(ja);},







getEnabledOptions:function(na){
var oa=q.getEnabledItems(ma.getSelectorMenu(na));
return oa.filter(ja);},







getSelectedOptions:function(na){
return q.getCheckedItems(ma.getSelectorMenu(na));},







getOptionText:function(na){
return q.getItemLabel(na);},








getOptionValue:function(na){
var oa=ca(na),
pa=fa(oa),
qa=ma.getOptions(oa).indexOf(na);
return qa>=0?pa.options[qa+1].value:'';},







getSelectorButton:function(na){
return l.find(na,'a.uiSelectorButton');},







getSelectorMenu:function(na){
return l.scry(na,'div.uiSelectorMenu')[0];},









getValue:function(na){
var oa=fa(na);
if(!oa)
return null;



if(!ia(na))
return oa.value;


var pa=[],
qa=oa.options;
for(var ra=1,sa=qa.length;ra<sa;ra++)
if(qa[ra].selected)
pa.push(qa[ra].value);


return pa;},







isOptionSelected:function(na){
return q.isItemChecked(na);},











listen:function(na,oa,pa){
return this.subscribe(oa,function(qa,ra){
if(ra.selector===na)
return pa(ra,qa);});},











loadMenu:function(na){
var oa=ma.getSelectorMenu(na);
if(!oa){

var pa=ma.getSelectorButton(na),
qa=pa.getAttribute('ajaxify');
if(qa){


d(['AsyncRequest'],function(sa){
sa.bootstrap(qa,pa);});




var ra=
m
('<div class="uiSelectorMenuWrapper uiToggleFlyout">'+
'<div class="uiMenu uiSelectorMenu loading">'+
'<ul class="uiMenuInner">'+
'<li><span></span></li>'+
'</ul>'+
'</div>'+
'</div>');


l.appendContent(pa.parentNode,ra);

oa=ma.getSelectorMenu(na);


pa.removeAttribute('onmouseover');}}


return oa;},







setButtonLabel:function(na,oa){
var pa=ma.getSelectorButton(na),
qa=parseInt(pa.getAttribute('data-length'),10);

oa=oa||pa.getAttribute('data-label')||'';
h.setLabel(pa,oa);

if(typeof oa==='string'){


j.conditionClass
(pa,
'uiSelectorBigButtonLabel',
oa.length>qa);


if(qa&&oa.length>qa){
pa.setAttribute('title',oa);}else 

pa.removeAttribute('title');}},









setButtonTooltip:function(na,oa){
var pa=ma.getSelectorButton(na),
qa=r.byTag(pa,'a');
qa&&u.set
(qa,
oa||pa.getAttribute('data-tooltip')||'');},








updateButtonARIALabel:function(na,oa){
var pa=ma.getSelectorButton(na),
qa=r.byTag(pa,'a');
if(qa){
var ra=pa.getAttribute('data-ariaprefix');
if(ra)
pa.setAttribute
('aria-label',
ra+': '+oa);}},










setEnabled:function(na,oa){

if(!oa&&y&&ca(na)===y)
ma.toggle(na);

h.setEnabled(ma.getSelectorButton(na),oa);},







setOptionEnabled:function(na,oa){
q.setItemEnabled(na,oa);},









setSelected:function(na,oa,pa){
pa=pa!==false;

var qa=ma.getOption(na,oa);
if(!qa)
return;


var ra=ma.isOptionSelected(qa);
if(pa!==ra){
if(!ia(na)&&!ra){

var sa=ma.getSelectedOptions(na)[0];
sa&&q.toggleItem(sa);}



q.toggleItem(qa);}



ma.updateSelector(na);},






toggle:function(na){
t.toggle(l.scry(ca(na),'div.wrap')[0]);},







updateSelector:function(na){
var oa=ma.getOptions(na),
pa=ma.getSelectedOptions(na),
qa=fa(na).options,
ra=[],
sa=[];


for(var ta=0,ua=oa.length;ta<ua;ta++){
var va=pa.contains(oa[ta]);


qa[ta+1].selected=va;

if(va){
var wa=ma.getOptionText(oa[ta]);
ra.push(wa);
sa.push(oa[ta].getAttribute('data-tooltip')||wa);}}




qa[0].selected=!pa.length;


var xa=j.hasClass(na,'uiSelectorDynamicLabel'),
ya=j.hasClass(na,'uiSelectorDynamicTooltip');
if(xa||ya){
var za='';
if(ia(na)){
var ab=ma.getSelectorButton(na);
za=ab.getAttribute('data-delimiter')||', ';}

ra=ra.join(za);
sa=sa.join(za);
if(xa){
ma.setButtonLabel(na,ra);
ma.updateButtonARIALabel(na,ra);}

ya&&ma.setButtonTooltip(na,sa);}}});




e.exports=ma;});

/** js/ui/layer/behaviors/ContextualLayerHideOnScroll.js */
__d("ContextualLayerHideOnScroll",["event-extensions","copyProperties"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('copyProperties');













function h(i){
this._layer=i;}


g(h.prototype,
{_subscriptions:[],

enable:function(){
this._subscriptions=
[this._layer.subscribe
('contextchange',
this._handleContextChange.bind(this)),
this._layer.subscribe('show',this.attach.bind(this)),
this._layer.subscribe('hide',this.detach.bind(this))];},



disable:function(){
while(this._subscriptions.length)
this._subscriptions.pop().unsubscribe();

this.detach();},


attach:function(){
if(this._listener)
return;

var i=this._layer.getContextScrollParent();
if(i===window)
return;

this._listener=Event.listen
(i,
'scroll',
this._layer.hide.bind(this._layer));},



detach:function(){
this._listener&&this._listener.remove();
this._listener=null;},


_handleContextChange:function(){
this.detach();
if(this._layer.isShown())
this.attach();}});





e.exports=h;});

/** js/ui/xhp/typeahead/renderers/BasicTypeaheadRenderer.js */
__d("BasicTypeaheadRenderer",["DOM"],function(a,b,c,d,e,f){




var g=b('DOM');







function h(i,j){
var k=[];

if(i.icon)
k.push(g.create('img',{alt:'',src:i.icon}));


if(i.text)
k.push(g.create('span',{className:'text'},[i.text]));


if(i.subtext)
k.push(g.create('span',{className:'subtext'},[i.subtext]));


var l=g.create('li',{className:i.type||''},k);
if(i.text)
l.setAttribute('aria-label',i.text);

return l;}


h.className='basic';

e.exports=h;});

/** js/modules/TypeaheadView.js */
__d("TypeaheadView",["event-extensions","ArbiterMixin","BasicTypeaheadRenderer","CSS","DOM","Parent","$","copyProperties","emptyFunction"],function(a,b,c,d,e,f){




b('event-extensions');

var g=b('ArbiterMixin'),
h=b('BasicTypeaheadRenderer'),
i=b('CSS'),
j=b('DOM'),
k=b('Parent'),

l=b('$'),
m=b('copyProperties'),
n=b('emptyFunction');













function o(p,q){
this.element=this.content=l(p);
m(this,q);}


m(o.prototype,g,



{events:
['highlight',
'render',
'reset',
'select',
'beforeRender',
'next',
'prev'],







renderer:h,






autoSelect:false,

ignoreMouseover:false,










init:function(){
this.init=n;
this.initializeEvents();
this.reset();},






initializeEvents:function(){
Event.listen(this.element,
{mouseup:this.mouseup.bind(this),
mouseover:this.mouseover.bind(this)});},






setTypeahead:function(p){
this.typeahead=p;},





setAccessibilityControlElement:function(p){
this.accessibilityElement=p;},





getElement:function(){
return this.element;},







mouseup:function(event){



if(event.button!=2){
this.select(true);
event.kill();}},








mouseover:function(event){
if(this.ignoreMouseover){
this.ignoreMouseover=false;
return;}

if(this.visible)
this.highlight(this.getIndex(event));},









reset:function(p){
if(!p)
this.disableAutoSelect=false;

this.justRendered=false;
this.justShown=false;
this.index=-1;
this.items=[];
this.results=[];
this.value='';
this.content.innerHTML='';
this.inform('reset');
return this;},










getIndex:function(event){
return this.items.indexOf(k.byTag(event.getTarget(),'li'));},










getSelection:function(){
var p=this.results[this.index]||null;
return this.visible?p:null;},







isEmpty:function(){
return !this.results.length;},







isVisible:function(){
return this.visible;},







show:function(){
i.show(this.element);
if(this.results&&this.results.length)


if(this.autoSelect&&this.accessibilityElement)
this.accessibilityElement.setAttribute
('aria-activedescendant',
j.getID(this.selected));



this.accessibilityElement&&
this.accessibilityElement.setAttribute('aria-expanded','true');
this.visible=true;
return this;},





hide:function(){
i.hide(this.element);
if(this.accessibilityElement){
this.accessibilityElement.setAttribute('aria-expanded','false');
this.accessibilityElement.removeAttribute('aria-activedescendant');}

this.visible=false;
return this;},














render:function(p,q,r){
this.value=p;

if(!q.length){
this.accessibilityElement&&
this.accessibilityElement.removeAttribute('aria-activedescendant');
this.reset(true);
return;}


this.justRendered=true;
if(!this.results.length)
this.justShown=true;


var s={results:q,value:p};
this.inform('beforeRender',s);
q=s.results;
var t=this.getDefaultIndex(q);

if(this.index>0&&this.index!==this.getDefaultIndex(this.results)){


var u=this.results[this.index];
for(var v=0,w=q.length;v<w;++v)
if(u.uid==q[v].uid){
t=v;break;}}




this.results=q;
j.setContent(this.content,this.buildResults(q));
this.items=this.getItems();



this.highlight(t,false);
this.inform('render',q);},








getItems:function(){
return j.scry(this.content,'li');},












buildResults:function(p){
var q,
r=null;
if(typeof this.renderer=='function'){
q=this.renderer;
r=this.renderer.className||'';}else{

q=a.TypeaheadRenderers[this.renderer];
r=this.renderer;}


q=q.bind(this);
var s=p.map(function(u,v){
var w=u.node||q(u,v);
w.setAttribute('role','option');
return w;}),


t=
j.create
('ul',

{className:r,
id:'typeahead_list_'+
(this.typeahead?
j.getID(this.typeahead):j.getID(this.element))},

s);

t.setAttribute('role','listbox');
return t;},





getDefaultIndex:function(p){
var q=(this.autoSelect&&!this.disableAutoSelect);

return this.index<0&&!q?-1:0;},





next:function(){
this.highlight(this.index+1);
this.inform('next',this.selected);},





prev:function(){
this.highlight(this.index-1);
this.inform('prev',this.selected);},


getItemText:function(p){
var q='';
if(p){
q=p.getAttribute('aria-label');
if(!q){





q=j.getText(p);
p.setAttribute('aria-label',q);}}


return q;},






setIsViewingSelectedItems:function(p){
this.viewingSelected=p;
return this;},

getIsViewingSelectedItems:function(){
return this.viewingSelected;},










highlight:function(p,q){
var r=true;
if(this.selected){
i.removeClass(this.selected,'selected');
this.selected.setAttribute('aria-selected','false');}

if(p>this.items.length-1){p=-1;}else
if(p<-1)p=this.items.length-1;
if(p>=0&&p<this.items.length){
if(this.selected&&
this.getItemText(this.items[p])===
this.getItemText(this.selected))
r=false;

this.selected=this.items[p];
i.addClass(this.selected,'selected');
this.selected.setAttribute('aria-selected','true');
this.accessibilityElement&&this.accessibilityElement.setAttribute
('aria-activedescendant',
j.getID(this.selected));}else 


this.accessibilityElement&&
this.accessibilityElement.removeAttribute('aria-activedescendant');

this.index=p;
this.disableAutoSelect=(p==-1);









var s=(p!==-1),
t=this.getItemText(this.selected);
if(p!==-1&&this.isVisible()&&t&&this.autoSelect)
if(this.justShown){
this.justRendered=false;
this.justShown=false;
s=false;}else
if(r&&this.justRendered){
this.justRendered=false;
s=false;}



if(q!==false)
this.inform
('highlight',
{index:p,selected:this.results[p],element:this.selected});},














select:function(p){
var q=this.index,
r=this.results[q],
s=this.element.getAttribute('id');

if(r){
this.inform('select',
{index:q,
clicked:!!p,
selected:r,
id:s});

this.inform('afterSelect');}}});





e.exports=o;});

/** js/ui/xhp/typeahead/BucketedTypeaheadView.js */
__d("BucketedTypeaheadView",["Class","DOM","TypeaheadView","copyProperties"],function(a,b,c,d,e,f){




var g=b('Class'),
h=b('DOM'),
i=b('TypeaheadView'),

j=b('copyProperties');





function k(l,m){
this.parent.construct(this,l,m);}


g.extend(k,i);

j(k.prototype,

{render:function(l,m,n){
m=this.buildBuckets(l,m);
return this.parent.render(l,m,n);},












highlight:function(l,m){



if(l==-1&&this.index!==0)
l=this.index;




if(l>=0&&l<this.items.length&&
this.results[l].type=='header')


l=l+1;

this.parent.highlight(l,m);},


buildBuckets:function(l,m){
if(!this.typeObjects)
return m;


var n=[],
o={};

for(var p=0;p<m.length;++p){
var q=m[p],
r=q.render_type||q.type;

if(!o.hasOwnProperty(r)){

o[r]=n.length;
n.push([this.buildBucketHeader(r)]);}


q.classNames=r;
q.groupIndex=o[r];
q.indexInGroup=n[q.groupIndex].length-1;
n[q.groupIndex].push(q);}



var s=[];
for(var t=0;t<n.length;++t)
s=s.concat(n[t]);

return s;},


buildBucketHeader:function(l){
var m=this.typeObjects[l];

if(m.markup){
m.text=m.markup;
delete m.markup;}

return this.typeObjects[l];},


buildResults:function(l){
var m=this.parent.buildResults(l);
if(this.typeObjects){
return h.create('div',{className:'bucketed'},[m]);}else 

return m;},



select:function(l){
var m=this.results[this.index];
if(m&&m.type!='header')
this.parent.select(l);},






getDefaultIndex:function(l){
var m=(this.autoSelect&&!this.disableAutoSelect),
n=l.length===0?-1:
(l[0].type=='header'?1:0);
return this.index<0&&!m?-1:n;},


prev:function(){
var l=this.results[this.index-1];
if(l&&l.type=='header')
this.index--;

return this.parent.prev();},


next:function(){
var l=this.results[this.index+1];
if(l&&l.type=='header')
this.index++;

return this.parent.next();}});




e.exports=k;});

/** js/modules/ContextualTypeaheadView.js */
__d("ContextualTypeaheadView",["event-extensions","Class","ContextualLayer","ContextualLayerAutoFlip","ContextualLayerHideOnScroll","CSS","DOM","Style","BucketedTypeaheadView","Vector","copyProperties"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('Class'),
h=b('ContextualLayer'),
i=b('ContextualLayerAutoFlip'),
j=b('ContextualLayerHideOnScroll'),
k=b('CSS'),
l=b('DOM'),
m=b('Style'),
n=b('BucketedTypeaheadView'),
o=b('Vector'),

p=b('copyProperties');









function q(r,s){
this.parent.construct(this,r,s);}


g.extend(q,n);

p(q.prototype,






{init:function(){
this.initializeLayer();
this.parent.init();},






initializeLayer:function(){
this.context=this.getContext();



this.wrapper=l.create('div');
l.appendContent(this.wrapper,this.element);

k.addClass(this.element,'uiContextualTypeaheadView');

this.layer=new h
({context:this.context,
position:'below',
causalElement:this.causalElement},
this.wrapper);
this.layer.enableBehavior(j);

if(m.isFixed(this.context))
this.layer.enableBehavior(i);


this.subscribe('render',this.renderLayer.bind(this));},







show:function(){
this.layer.show();
o.getElementDimensions(this.context).setElementWidth(this.wrapper);
return this.parent.show();},





hide:function(){
this.layer.hide();
return this.parent.hide();},


renderLayer:function(){
if(!this.isVisible())
return;

if(this.layer.isShown()){
this.layer.updatePosition();}else 


this.layer.show();},



getContext:function(){
return this.element.parentNode;}});




e.exports=q;});

/** js/modules/core/flattenArray.js */
__d("flattenArray",[],function(a,b,c,d,e,f){














function g(h){





var i=[];
while(h.length){
var j=h.pop();
if(Array.isArray(j)){
Array.prototype.push.apply(h,j);}else 

i.push(j);}


return i.reverse();}


e.exports=g;});

/** js/modules/JSXDOM.js */
__d("JSXDOM",["DOM","flattenArray"],function(a,b,c,d,e,f){

































var g=b('DOM'),

h=b('flattenArray'),


i=
['a',
'br',
'button',
'checkbox',
'dd',
'div',
'dl',
'dt',
'form',
'h1',
'h2',
'h3',
'h4',
'h5',
'h6',
'hr',
'i',
'iframe',
'img',
'input',
'label',
'li',
'option',
'p',
'pre',
'select',
'span',
'strong',
'table',
'td',
'textarea',
'th',
'tr',
'ul'],


j={};
i.forEach(function(k){
var l=function(m){
var n;
if(m.children){
n=Array.isArray(m.children)?
h(m.children):
h([m.children]);
delete m.children;}

return g.create(k,m,n);};

j[k]=l;});


e.exports=j;});

/** js/modules/TextInputControl.js */
__d("TextInputControl",["event-extensions","function-extensions","Class","DOMControl","Input","copyProperties","debounce"],function(a,b,c,d,e,f){



b('event-extensions');
b('function-extensions');

var g=b('Class'),
h=b('DOMControl'),
i=b('Input'),

j=b('copyProperties'),
k=b('debounce');

function l(m){
this.parent.construct(this,m);
var n=this.getRoot(),

o=k(this.update.bind(this),0);
Event.listen(n,{input:o,keydown:o,paste:o});}


g.extend(l,h);

j(l.prototype,

{setMaxLength:function(m){
i.setMaxLength(this.getRoot(),m);
return this;},


getValue:function(){
return i.getValue(this.getRoot());},


isEmpty:function(){
return i.isEmpty(this.getRoot());},


setValue:function(m){
i.setValue(this.getRoot(),m);
this.update();
return this;},


clear:function(){
return this.setValue('');},


setPlaceholderText:function(m){
i.setPlaceholder(this.getRoot(),m);
return this;}});




e.exports=l;});

/** js/modules/TextMetrics.js */
__d("TextMetrics",["array-extensions","event-extensions","DOM","Style","UserAgent","debounce"],function(a,b,c,d,e,f){




b('array-extensions');
b('event-extensions');

var g=b('DOM'),
h=b('Style'),
i=b('UserAgent'),

j=b('debounce'),


k;
function l(){
if(typeof k==='undefined'){
var n=g.create('div',{className:'webkitZoomTest'}),
o=function(){
g.appendContent(document.body,n);
k=100/n.clientHeight;
g.remove(n);};

Event.listen(window,'resize',j(o,100));
o();}

return k;}


function m(n,o){
this._node=n;
this._flexible=!!o;

var p='textarea',
q='textMetrics';
if(this._flexible){
p='div';
q+=' textMetricsInline';}

this._shadow=g.create(p,{className:q});

var r=
['fontSize',
'fontStyle',
'fontWeight',
'fontFamily',
'wordWrap'];


r.forEach(function(t){
h.set(this._shadow,t,h.get(n,t));}.
bind(this));

var s=h.get(n,'lineHeight');

if(i.chrome()||i.safari())
s=Math.round(parseInt(s,10)*l())+'px';

h.set(this._shadow,'lineHeight',s);

document.body.appendChild(this._shadow);}


m.prototype.measure=function(n){
var o=this._node,
p=this._shadow;

n=(n||o.value)+'...';




if(!this._flexible){
var q=o.clientWidth-
h.getFloat(o,'paddingLeft')-
h.getFloat(o,'paddingRight');
h.set(p,'width',Math.max(q,0)+'px');}

g.setContent(p,n);


return {width:p.scrollWidth,
height:p.scrollHeight};};



m.prototype.destroy=function(){
g.remove(this._shadow);};


e.exports=m;});

/** js/modules/TextAreaControl.js */
__d("TextAreaControl",["event-extensions","Arbiter","ArbiterMixin","Class","CSS","DOMControl","Style","TextInputControl","TextMetrics","copyProperties"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('Arbiter'),
h=b('ArbiterMixin'),
i=b('Class'),
j=b('CSS'),
k=b('DOMControl'),
l=b('Style'),
m=b('TextInputControl'),
n=b('TextMetrics'),

o=b('copyProperties');

function p(r,s){




return l.getFloat(r,s)||0;}


function q(r){
this.autogrow=j.hasClass(r,'uiTextareaAutogrow');
this.parent.construct(this,r);
this.width=null;

Event.listen(r,'focus',this._handleFocus.bind(this));}


i.extend(q,m);

o(q.prototype,h,

{setAutogrow:function(r){
this.autogrow=r;
return this;},


onupdate:function(){
this.parent.onupdate();
if(this.autogrow){
var r=this.getRoot();
if(!this.metrics)
this.metrics=new n(r);

if(typeof this.initialHeight==='undefined'){
this.isBorderBox=
l.get(r,'box-sizing')==='border-box'||
l.get(r,'-moz-box-sizing')==='border-box'||
l.get(r,'-webkit-box-sizing')==='border-box';

this.borderBoxOffset=
p(r,'padding-top')+
p(r,'padding-bottom')+
p(r,'border-top-width')+
p(r,'border-bottom-width');

this.initialHeight=r.offsetHeight-this.borderBoxOffset;}

var s=this.metrics.measure(),

t=Math.max(this.initialHeight,s.height);

if(this.isBorderBox)
t+=this.borderBoxOffset;


if(t!==this.height){
this.height=t;
l.set(r,'height',t+'px');
g.inform('reflow');
this.inform('resize');}}else

if(this.metrics){
this.metrics.destroy();
this.metrics=null;}},



resetHeight:function(){
this.height=-1;
this.update();},


_handleFocus:function(){
this.width=null;}});



q.getInstance=function(r){
return k.getInstance(r)||new q(r);};


e.exports=q;});

/** js/modules/Typeahead.js */
__d("Typeahead",["array-extensions","event-extensions","ArbiterMixin","BehaviorsMixin","DataStore","DOM","Parent","Run","copyProperties","emptyFunction","ge"],function(a,b,c,d,e,f){




b('array-extensions');
b('event-extensions');

var g=b('ArbiterMixin'),
h=b('BehaviorsMixin'),
i=b('DataStore'),
j=b('DOM'),
k=b('Parent'),
l=b('Run'),

m=b('copyProperties'),
n=b('emptyFunction'),
o=b('ge');



























function p(q,r,s,t){
this.args={data:q,view:r,core:s};
i.set(t,'Typeahead',this);
this.element=t;}


p.getInstance=function(q){
var r=k.byClass(q,'uiTypeahead');
return r?i.get(r,'Typeahead'):null;};


m(p.prototype,g,h,

{init:function(q){

this.init=n;





this.getCore();
this.getView().setAccessibilityControlElement(this.getCore().getElement());
this.proxyEvents();
this.initBehaviors(q||[]);
this.inform('init',this);
this.data.bootstrap();
this.core.focus();},


getData:function(){
if(!this.data){
var q=this.args.data;
this.data=q;
this.data.init();}

return this.data;},


getView:function(){
if(!this.view){
var q=this.args.view,
r=o(q.node_id);
if(!r){
r=j.create('div',{className:'uiTypeaheadView'});
j.appendContent(this.element,r);}

if(typeof q.ctor==='string'){
this.view=new window[q.ctor](r,q.options||{});}else 

this.view=new q.ctor(r,q.options||{});

this.view.init();
this.view.setTypeahead(this.element);}

return this.view;},


getCore:function(){
if(!this.core){
var q=this.args.core;
if(typeof q.ctor==='string'){
this.core=new window[q.ctor](q.options||{});}else 

this.core=new q.ctor(q.options||{});

this.core.init(this.getData(),this.getView(),this.getElement());}

return this.core;},


getElement:function(){
return this.element;},





swapData:function(q){
var r=this.core;
this.data=this.args.data=q;
q.init();
if(r){
r.data=q;
r.initData();
r.reset();}

q.bootstrap();
return q;},


proxyEvents:function(){
[this.data,this.view,this.core].forEach(function(q){
q.subscribe(q.events,this.inform.bind(this));},
this);},


initBehaviors:function(q){



q.forEach(function(r){


if(typeof r==='string'){
if(a.TypeaheadBehaviors&&a.TypeaheadBehaviors[r]){
a.TypeaheadBehaviors[r](this);}else 

l.onLoad(function(){
if(a.TypeaheadBehaviors)
(a.TypeaheadBehaviors[r]||n)(this);}.

bind(this));}else 


this.enableBehavior(r);},

this);}});




p.initNow=function(q,r,s){
if(s)
s.init(q);

q.init(r);};


p.init=function(q,r,s,t){

if(!j.isNodeOfType(q,['input','textarea']))
q=
j.scry(q,'input')[0]||
j.scry(q,'textarea')[0];


var u=false;



try{u=document.activeElement===q;}catch(
v){}

if(u){
p.initNow(r,s,t);}else 

var w=Event.listen(q,'focus',function(){
p.initNow(r,s,t);
w.remove();});};




e.exports=p;});

/** js/modules/TypeaheadCore.js */
__d("TypeaheadCore",["event-extensions","Arbiter","ArbiterMixin","CSS","DOM","Input","InputSelection","Keys","UserAgent","bind","copyProperties","emptyFunction"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('Arbiter'),
h=b('ArbiterMixin'),
i=b('CSS'),
j=b('DOM'),
k=b('Input'),
l=b('InputSelection'),
m=b('Keys'),
n=b('UserAgent'),

o=b('bind'),
p=b('copyProperties'),
q=b('emptyFunction');



















function r(s){
p(this,s);}


p(r.prototype,h,



{events:['blur','focus','click','unselect','loading'],











keepFocused:true,







resetOnSelect:false,







resetOnKeyup:true,






setValueOnSelect:false,











queryTimeout:250,









preventFocusChangeOnTab:false,










init:function(s,t,u){
this.init=q;
this.data=s;
this.view=t;
this.root=u;
this.initInput();

this.inputWrap=j.find(u,'div.wrap');
this.hiddenInput=j.find(u,'input.hiddenInput');

this.value='';
this.nextQuery=null;

this.selectedText=null;
if(this.setValueOnSelect&&i.hasClass(this.inputWrap,'selected'))
this.selectedText=this.getValue();


this.initView();
this.initData();
this.initEvents();
this.initToggle();

this._exclusions=[];},





initInput:function(){
this.element=j.find(this.root,'.textInput');


var s=j.scry(this.element,'input')[0];
if(s)
this.element=s;},







initView:function(){
this.view.subscribe('highlight',function(s,t){
this.element.focus();
this.element.setAttribute
('aria-activedescendant',
(t.index!==-1)?j.getID(t.element):'');}.

bind(this));
this.view.subscribe('select',function(s,t){
this.select(t.selected);}.
bind(this));
this.view.subscribe('afterSelect',function(){
this.afterSelect();}.
bind(this));},






initData:function(){
this.data.subscribe('respond',function(s,t){


if(t.forceDisplay||
t.value==this.getValue()&&!this.element.disabled)
this.view.render(t.value,t.results,t.isAsync);}.

bind(this));
this.data.subscribe('activity',function(s,t){
this.fetching=t.activity;
if(!this.fetching)
this.nextQuery&&this.performQuery();





if(this.loading!=this.fetching){
this.loading=this.fetching;
this.inform('loading',{loading:this.loading});}}.

bind(this));},






initEvents:function(){
Event.listen(this.view.getElement(),
{mouseup:this.viewMouseup.bind(this),
mousedown:this.viewMousedown.bind(this)});


var s=
{blur:o(this,'blur'),
focus:o(this,'focus'),
click:o(this,'click'),
keyup:o(this,'keyup'),
keydown:o(this,'keydown')};


if(n.firefox())

s.text=s.keyup;


if(n.firefox()<4){

s.keypress=s.keydown;

delete s.keydown;}


Event.listen(this.element,s);


Event.listen(this.element,'keypress',o(this,'keypress'));},






initToggle:function(){
this.subscribe('blur',this.view.hide.bind(this.view));
this.subscribe('focus',this.view.show.bind(this.view));},







viewMousedown:function(){
this.selecting=true;},






viewMouseup:function(){
this.selecting=false;},







blur:function(){
if(this.selecting){
this.selecting=false;
return;}

this.inform('blur');},






click:function(){
var s=l.get(this.element);
if(s.start==s.end)
this.element.select();

this.inform('click');},






focus:function(){
this.checkValue();
this.inform('focus');},






keyup:function(){
if(this.resetOnKeyup&&!this.getValue())
this.view.reset();

this.checkValue();},







keydown:function(event){
if(!this.view.isVisible()||this.view.isEmpty()){
this.checkValue.bind(this).defer();
return;}


switch(Event.getKeyCode(event)){
case m.TAB:
this.handleTab(event);
return;
case m.UP:
this.view.prev();
break;
case m.DOWN:
this.view.next();
break;
case m.ESC:
this.view.reset();
break;

default:this.checkValue.bind(this).defer();
return;
}


event.kill();},







keypress:function(event){
if(this.view.getSelection()&&Event.getKeyCode(event)==m.RETURN){
this.view.select();
event.kill();}},






handleTab:function(event){
if(this.preventFocusChangeOnTab)
if(this.view.getSelection()){
event.kill();}else 

event.prevent();


this.view.select();},








select:function(s){
if(s&&this.setValueOnSelect){
this.setValue(s.text);
this.setHiddenValue(s.uid);
this.selectedText=s.text;
i.addClass(this.inputWrap,'selected');}},



afterSelect:function(){
this.keepFocused?this.element.focus():this.element.blur();
this.resetOnSelect?this.reset():this.view.reset();},







unselect:function(){
if(this.setValueOnSelect){
this.selectedText=null;
i.removeClass(this.inputWrap,'selected');}


this.setHiddenValue();
this.inform('unselect',this);},







setEnabled:function(s){
var t=s===false;
this.element.disabled=t;
i.conditionClass(this.root,'uiTypeaheadDisabled',t);},








reset:function(){
this.unselect();
this.setValue();
!this.keepFocused&&k.reset(this.element);
this.view.reset();
this.inform('reset');},





getElement:function(){
return this.element;},







setExclusions:function(s){
this._exclusions=s;},






getExclusions:function(){
return this._exclusions;},









setValue:function(s){
this.value=this.nextQuery=s||'';
k.setValue(this.element,this.value);},







setHiddenValue:function(s){
this.hiddenInput.value=(s||s===0)?s:'';
g.inform('Form/change',{node:this.hiddenInput});},










getValue:function(){
return k.getValue(this.element);},








getHiddenValue:function(){
return this.hiddenInput.value||'';},






checkValue:function(){
var s=this.getValue();
if(s==this.value)
return;


if(this.selectedText&&this.selectedText!=s)
this.unselect();


var t=Date.now(),
u=t-this.time;

this.time=t;
this.value=this.nextQuery=s;
this.performQuery(u);},








performQuery:function(s){

if(this.selectedText)return;




s=s||0;
if(this.fetching&&s<this.queryTimeout){

this.data.query(this.nextQuery,true,this._exclusions);}else{

this.data.query(this.nextQuery,false,this._exclusions);
this.nextQuery=null;}}});





e.exports=r;});

/** js/modules/URLScraper.js */
__d("URLScraper",["event-extensions","ArbiterMixin","Class","copyProperties"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('ArbiterMixin'),
h=b('Class'),

i=b('copyProperties');

function j(ga){
this.input=ga;
this.enable();}


i(j.prototype,g,

{reset:function(){
this.lastPermissiveMatch=null;},


enable:function(){
if(this.events)return;
var ga=function(ha){
setTimeout(this.check.bind(this,ha),30);};

this.events=Event.listen(this.input,
{paste:ga.bind(this,false),
keydown:ga.bind(this,true)});},



disable:function(){
if(!this.events)return;
for(var event in this.events)
this.events[event].remove();

this.events=null;},


check:function(ga){
var ha=this.input.value;
if(ga&&j.trigger(ha))return;
var ia=j.match(ha),
ja=j.permissiveMatch(ha);



if(ja&&
(ja!=this.lastPermissiveMatch)){
this.lastPermissiveMatch=ja;
this.inform('match',{url:ia,alt_url:ja});}}});











var k='!"#%&\'()*,-./:;<>?@[\\]^_`{|}',
l='\u2000-\u206F\u00ab\u00bb',


m='(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])',






n='(?:(?:ht|f)tps?)://',
o='(?:(?:'+m+'[.]){3}'+m+')',
p='(?:\\b)www\\d{0,3}[.]',
q='[^\\s'+k+l+']',
r='(?:(?:[.:\\-_%@]|'+q+')*'+q+')',
s='(?:[.][a-z]{2,4})',
t='(?::\\d+){0,1}',
u='(?=[\/?#])',

v=
'(?:'+
'(?:'+n+r+t+')|'+
'(?:'+o+t+')|'+
'(?:'+p+r+s+t+')|'+
'(?:'+r+s+t+u+')'+
')',


w='[\/#?]',
x='\\([^\\s()<>]+\\)',
y='[^\\s()<>?#]+',
z='[^\\s'+k+l+']',

aa=
'(?:'+
'(?:'+w+')'+
'(?:'+
'(?:'+x+'|'+y+')*'+
'(?:'+x+'|'+z+')'+
')*'+
')*',

ba=new RegExp
('('+
'(?:'+v+')'+
'(?:'+aa+')'+
')','im'),



ca=
'(?:'+
'(?:'+w+')'+
'(?:'+
'(?:'+x+'|'+y+')*'+
')*'+
')*',

da=new RegExp
('('+
'(?:'+v+')'+
'(?:'+ca+')'+
')','im'),


ea=new RegExp
('('+
'(?:'+n+r+t+')|'+
'(?:'+p+r+s+t+')'+
')'),



fa=/[\s'";]/;

j.match=function(ga){
return j.matchToPattern(ga,ba);};



j.permissiveMatch=function(ga){
return j.matchToPattern(ga,da);};


j.matchToPattern=function(ga,ha){
var ia=(ha.exec(ga)||[])[1]||null;
if(ia&&ia.indexOf('@')!=-1){
return (ea.exec(ia))?ia:null;}else 


return ia;};



j.trigger=function(ga){
return !fa.test(ga.charAt(ga.length-1));};


e.exports=j;});

/** js/stream/UIIntentionalStreamMessage.js */
__d("UIIntentionalStreamMessage",[],function(a,b,c,d,e,f){






var g=

{SET_AUTO_INSERT:'UIIntentionalStream/setAutoInsert',

UPDATE_STREAM:'UIIntentionalStreamRefresh/updateStream',

REFRESH_STREAM:'UIIntentionalStreamRefresh/refreshStream',

UPDATE_AUTOREFRESH_CONFIG:'UIIntentionalStream/updateAutoRefreshConfig',

UPDATE_HTML_CONTENT:'UIIntentionalStream/updateHtmlContent',


UPDATE_LAST_REFRESH_TIME:'UIIntentionalStream/updateLastRefreshTime',


INSERT_STORIES:'UIIntentionalStream/updateLastRefreshTime',


UNLOAD:'UIIntentionalStream/unload'};


e.exports=g;});

/** js/modules/reportData.js */
__d("reportData",["EagleEye","userAction"],function(a,b,c,d,e,f){


















var g=b('EagleEye'),
h=b('userAction');


function i(j,k){
k=k||{};
var l=
{ft:(k.ft||{}),
gt:(k.gt||{})},

m='-',
n=a.ArbiterMonitor,
o=(!!n)?n.getActFields():[],
p=(!n)?'r':'a',
q=
[Date.now(),
h.getCurrentUECount(),
m,
j,
m,
m,
p,
a.URI?
a.URI.getRequestURI(true,true).getUnqualifiedURI().toString():
location.pathname+location.search+location.hash,
l,
0,0,0,0].
concat(o);

g.log('act',q);}


e.exports=i;});

/** js/onvisible.js */
__d("legacy:onvisible",["OnVisible"],function(a,b,c,d){



a.OnVisible=b('OnVisible');},

3);

/** js/ui/xhp/overlay/layer-destroy-on-hide.js */
__d("legacy:LayerDestroyOnHide",["LayerDestroyOnHide"],function(a,b,c,d){



a.LayerDestroyOnHide=b('LayerDestroyOnHide');},

3);

/** js/ui/layer/behaviors/ModalLayer.js */
__d("ModalLayer",["event-extensions","function-extensions","Arbiter","CSS","DataStore","DOM","DOMDimensions","DOMQuery","ScrollAwareDOM","Style","URI","UserAgent","Vector","copyProperties","csx","cx","throttleAcrossTransitions"],function(a,b,c,d,e,f){




b('event-extensions');
b('function-extensions');

var g=b('Arbiter'),
h=b('CSS'),
i=b('DataStore'),
j=b('DOM'),
k=b('DOMDimensions'),
l=b('DOMQuery'),
m=b('ScrollAwareDOM'),
n=b('Style'),
o=b('URI'),
p=b('UserAgent'),
q=b('Vector'),

r=b('copyProperties'),
s=b('csx'),
t=b('cx'),
u=b('throttleAcrossTransitions'),

v=[],
w=null,
x=null,

y=null;

function z(){
if(!y)
y=l.scry(document.body,"._li")[0];

return y;}








function aa(fa){
var ga=
{position:q.getScrollPosition()},


ha=fa.offsetTop-ga.position.y;
h.addClass(fa,"_31e");
n.set(fa,'top',ha+'px');





g.inform('reflow');

ga.listener=m.subscribe('scroll',function(ia,ja){
if(l.contains(fa,ja.target)){
var ka=fa.offsetTop-ja.delta.y;
n.set(fa,'top',ka+'px');

ga.position=ga.position.add(ja.delta);

return false;}});



i.set(fa,'ModalLayerData',ga);









if(p.firefox()<13)
ba.curry(fa).defer();}






function ba(fa){
l.scry(fa,'div.swfObject').forEach(function(ga){
var ha=ga.getAttribute('data-swfid');

if(ha&&window[ha]){
var ia=window[ha];



ia.addParam('autostart','false');
ia.addParam('autoplay','false');
ia.addParam('play','false');
ia.addVariable('video_autoplay','0');
ia.addVariable('autoplay','0');
ia.addVariable('play','0');

var ja=o(ia.getAttribute('swf'));
ja.addQueryData({autoplay:'0'});



ja.setPath(ja.getPath().replace('autoplay=1','autoplay=0'));
ia.setAttribute('swf',ja.toString());


ia.write(ga);}});}








function ca(fa,ga){
var ha=i.get(fa,'ModalLayerData');
if(ha){
var ia=function(){
h.removeClass(fa,"_31e");
n.set(fa,'top','');

if(ga){
var la=l.getDocumentScrollElement();
la.scrollTop=ha.position.y;}






g.inform('reflow');

ha.listener.unsubscribe();
ha.listener=null;

i.remove(fa,'ModalLayerData');};








if(ga&&
p.osx()>=10.8&&
p.safari()>=536.25&&
!p.chrome()){
var ja=j.create('div',{className:"_42w"});
n.set(ja,'height',fa.offsetHeight+'px');
j.appendContent(document.body,ja);

var ka=l.getDocumentScrollElement();
ka.scrollTop=ha.position.y;
ga=false;

!function(){
ia();
j.remove(ja);}.
defer();}else 

ia();}



if(p.ie()<7)
n.set(fa,'height','');}












function da(){



var fa;
if(p.ie()<7){
var ga=v[v.length-1].getLayerRoot(),
ha=Math.max(ga.offsetHeight,ga.scrollHeight);

fa=function(na){
n.set(na,'height',(-na.offsetTop+ha)+'px');};}



var ia=v.length;
while(ia--){
var ja=v[ia],
ka=ja.getLayerRoot(),

la=ja.getLayerContentRoot(),
ma=
la.offsetWidth+
k.measureElementBox(la,'width',0,0,1);

if(p.ie()<7){
n.set
(ka,
'width',
ma>document.body.clientWidth?ma+'px':'');}else 


n.set(ka,'min-width',ma+'px');


if(fa&&ia<v.length-1)
fa(ka);}


fa&&fa(z());}


function ea(fa){
this._layer=fa;}


r(ea.prototype,
{_subscription:null,

enable:function(){
if(!z())
return;


this._subscription=this._layer.subscribe
(['show','hide'],
function(fa){
fa=='show'?this._addModal():this._removeModal();}.
bind(this));



if(this._layer.isShown())
this._addModal();},



disable:function(){

if(!z())
return;


this._subscription.unsubscribe();
this._subscription=null;



if(this._layer.isShown())
this._removeModal();},



_addModal:function(){
h.addClass(this.getLayerRoot(),"_3qw");

var fa=v[v.length-1],
ga=fa?fa.getLayerRoot():z();
aa(ga);


var ha=l.getDocumentScrollElement();
ha.scrollTop=0;

if(!v.length){
if(p.ie()<7)
h.addClass(document.documentElement,"_31d");


var ia=u(da,100);
w=Event.listen(window,'resize',ia);
x=g.subscribe('reflow',ia);}


v.push(this);

da.defer();},


_removeModal:function(){
h.removeClass(this.getLayerRoot(),"_3qw");

var fa=this===v[v.length-1];

v.remove(this);

var ga=v[v.length-1];

if(!ga){
w.remove();
w=null;
x.unsubscribe();
x=null;}












var ha=ga?ga.getLayerRoot():z();
!function(){
ca(ha,fa);

if(v.length){
da.defer();}else
if(p.ie()<7)
h.removeClass(document.documentElement,"_31d");}.

defer(200,false);},


getLayerRoot:function(){
return this._layer.getRoot();},


getLayerContentRoot:function(){
return this._layer.getContentRoot();}});



e.exports=ea;});

/** js/ui/layer/dialog/DialogX.js */
__d("DialogX",["event-extensions","function-extensions","AccessibleLayer","Arbiter","ArbiterMixin","Class","ContextualThing","DOM","Layer","LayerButtons","LayerFormHooks","LayerTabIsolation","ModalLayer","Style","UserAgent","Vector","copyProperties","cx","debounce","getOverlayZIndex"],function(a,b,c,d,e,f){




b('event-extensions');
b('function-extensions');

var g=b('AccessibleLayer'),
h=b('Arbiter'),
i=b('ArbiterMixin'),
j=b('Class'),
k=b('ContextualThing'),
l=b('DOM'),
m=b('Layer'),
n=b('LayerButtons'),
o=b('LayerFormHooks'),
p=b('LayerTabIsolation'),
q=b('ModalLayer'),
r=b('Style'),
s=b('UserAgent'),
t=b('Vector'),

u=b('copyProperties'),
v=b('cx'),
w=b('debounce'),
x=b('getOverlayZIndex');







function y(aa,ba){
this.parent.construct(this,aa,ba);}


j.extend(y,m);
u(y,i);

u(y.prototype,
{_modal:false,
_ie:null,
_wrapper:null,

_configure:function(aa,ba){
this.parent._configure(aa,ba);
if(aa.modal){
this._modal=true;
this.enableBehaviors([q,p]);}

if(aa.autohide)
var ca=this.subscribe('show',function(){
ca.unsubscribe();
this.hide.shield(this).defer(aa.autohide);}.
bind(this));},



_getDefaultBehaviors:function(){
return this.parent._getDefaultBehaviors().concat
([z,
g,
n,
o]);},



_buildWrapper:function(aa,ba){
var ca=l.create('div',{className:"_t"},ba),
da;

this._ie=s.ie();
if(this._ie>6&&this._ie<9){
da=
[l.create('div',{className:"_u"}),
l.create('div',{className:"_v"}),
l.create('div',{className:"_w"}),
l.create('div',{className:"_x"}),
l.create('div',{className:"_y"}),
l.create('div',{className:"_z"}),
ca];}else 


da=l.create
('div',
{className:"_1yu"},
ca);


this._wrapper=l.create
('div',
{className:"_1yv"},
da);

this.setWidth(aa.width);

var ea=l.create('div',
{className:"_10",
role:'dialog'},
this._wrapper);

if(aa.titleID)
ea.setAttribute('aria-labelledby',aa.titleID);


return ea;},


getContentRoot:function(){
return this._wrapper;},


updatePosition:function(){
var aa=
t.getViewportDimensions().y-
t.getElementDimensions(this._wrapper).y,

ba;
if(aa<250){
if(aa>80){
ba=aa/2;}else 

ba=40;}else 


ba=125;




if(!this._modal&&(!this._ie||this._ie<7))
if(ba<=40){
this.enableBehavior(q);}else 

this.disableBehavior(q);






if(this._ie<7){
var ca=t.getScrollPosition().y;
r.set(this._wrapper,'top',ba+ca+'px');}else 

r.set(this._wrapper,'margin-top',ba+'px');


if(this._causalElement){
var da=x
(this._causalElement,
this.getInsertParent()),

ea=this._causalElement;
while(!da&&(ea=k.getContext(ea)))
da=x(ea,this.getInsertParent());


r.set(this.getRoot(),'z-index',da>200?da:'');}},










setWidth:function(aa){
aa=Math.floor(aa);
if(this._ie>6&&this._ie<9)


aa-=20;

r.set(this._wrapper,'width',aa+'px');}});








function z(aa){
this._layer=aa;}


u(z.prototype,
{_subscription:null,
_resize:null,
enable:function(){
this._subscription=this._layer.subscribe
(['show','hide'],
function(aa){
if(aa==='show'){
this._attach();
h.inform('layer_shown',{type:'DialogX'});}else{

this._detach();
h.inform('layer_hidden',{type:'DialogX'});}}.

bind(this));},



disable:function(){
this._subscription.unsubscribe();
this._subscription=null;
this._resize&&this._detach();},


_attach:function(){
this._layer.updatePosition();
this._resize=Event.listen
(window,
'resize',
w(this._layer.updatePosition.bind(this._layer)));},



_detach:function(){
this._resize.remove();
this._resize=null;}});



e.exports=y;});

/** js/ui/layer/dialog/AsyncDialog.js */
__d("AsyncDialog",["AsyncRequest","Bootloader","CSS","DialogX","DOM","Env","Parent","URI","copyProperties","cx","emptyFunction","tx"],function(a,b,c,d,e,f){



var g=b('AsyncRequest'),
h=b('Bootloader'),
i=b('CSS'),
j=b('DialogX'),
k=b('DOM'),
l=b('Env'),
m=b('Parent'),
n=b('URI'),

o=b('copyProperties'),
p=b('cx'),
q=b('emptyFunction'),
r=b('tx'),

s=new j
({width:465},
k.create('div',{className:"_r"},"Loading...")),



t=1,
u=[],



v=0;

function w(){
v--;

if(!v)
s.hide();}



function x(z,aa){
var ba=t++;
u[ba]=aa;

o(z.getData(),{__asyncDialog:ba});


var ca=false;

v++;
s.setCausalElement(z.getRelativeTo()).show();

function da(){


if(!ca)
w();}



z.setInterceptHandler(function(ea){
ca=true;
w();});


z.setFinallyHandler(function(ea){
var fa=ea.getPayload();





if(fa&&fa.asyncURL)
y.send(new g(fa.asyncURL));


da();});


z.setAbortHandler(da);

z.send();}


var y=



















{send:function(z,aa){





x(z,aa||q);},










bootstrap:function(z,aa,ba){

if(!z)
return;


var ca=m.byClass(aa,'stat_elem')||aa;
if(ca&&i.hasClass(ca,'async_saving'))
return false;


var da=new n(z).getQueryData(),

ea=ba==='dialog',

fa=new g().
setURI(z).
setData(da).
setMethod(ea?'GET':'POST').
setReadOnly(ea).
setRelativeTo(aa).
setStatusElement(ca).
setNectarModuleDataSafe(aa);

if(l.is_desktop){
h.loadModules(['FbdDialogProvider'],
function(ga){
ga.sendDialog(fa,y.send);});

return;}


y.send(fa);},







respond:function(z,aa){
var ba=u[z];










if(ba){



ba(aa);
delete u[z];}},



getLoadingDialog:function(){
return s;}};



e.exports=y;});

/** js/ui/xhp/form/selector.js */
__d("legacy:Selector",["Selector"],function(a,b,c,d){



a.Selector=b('Selector');},

3);

/** js/search/typeahead/behaviors/TypeaheadBestName.js */
__d("TypeaheadBestName",["TypeaheadUtil","copyProperties"],function(a,b,c,d,e,f){



var g=b('TypeaheadUtil'),

h=b('copyProperties');




function i(j){
this._typeahead=j;}


h(i.prototype,

{_subscription:null,

enable:function(){
var j=this._typeahead.getView();
this._subscription=j.subscribe('beforeRender',function(k,l){
var m=l.value;
for(var n=0;n<l.results.length;++n){
var o=l.results[n];


if(o.alternate_names==null)
continue;




if(g.isQueryMatch(m,o.default_name)){
o.text=o.default_name;
return;}


for(var p=0;p<o.alternate_names.length;p++)


if(g.isQueryMatch(m,o.alternate_names[p])){
o.text=o.alternate_names[p];
return;}





o.text=o.default_name;}});},




disable:function(){
this._typeahead.getView().unsubscribe(this._subscription);
this._subscription=null;}});




e.exports=i;});

/** js/search/typeahead/behaviors/LegacyBestNameTypeaheadBehavior.js */
__d("legacy:BestNameTypeaheadBehavior",["TypeaheadBestName"],function(a,b,c,d){



var e=b('TypeaheadBestName');

if(!a.TypeaheadBehaviors)a.TypeaheadBehaviors={};
a.TypeaheadBehaviors.buildBestAvailableNames=function(f){
f.enableBehavior(e);};},


3);

/** js/ui/behavior/Scrollable.js */
__d("Scrollable",["event-extensions","Parent","UserAgent"],function(a,b,c,d,e,f){







b('event-extensions');

var g=b('Parent'),
h=b('UserAgent'),

i=function(event){
var k=g.byClass(event.getTarget(),'scrollable');
if(!k)
return;



if((typeof event.axis!=='undefined'&&
event.axis===event.HORIZONTAL_AXIS)||
(event.wheelDeltaX&&!event.wheelDeltaY))
return;









var l=event.wheelDelta?event.wheelDelta:-event.detail,

m=k.scrollHeight,
n=k.clientHeight;
if(m>n){
var o=k.scrollTop;
if((l>0&&o===0)||
(l<0&&o>=m-n)){
event.prevent();}else
if(h.ie()<9)
if(k.currentStyle){



var p=k.currentStyle.fontSize;
if(p.indexOf('px')<0){

var q=document.createElement('div');
q.style.fontSize=p;
q.style.height='1em';
p=q.style.pixelHeight;}else 

p=parseInt(p,10);

k.scrollTop=o-Math.round(l/120*p);
event.prevent();}}},





j=document.documentElement;
if(h.firefox()){
j.addEventListener('DOMMouseScroll',i,false);}else 

Event.listen(j,'mousewheel',i);});

/** js/ui/layer/behaviors/ContextualLayerUpdateOnScroll.js */
__d("ContextualLayerUpdateOnScroll",["event-extensions","copyProperties"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('copyProperties');













function h(i){
this._layer=i;}


g(h.prototype,
{_subscriptions:[],

enable:function(){
this._subscriptions=
[this._layer.subscribe('show',this._attachScrollListener.bind(this)),
this._layer.subscribe('hide',this._removeScrollListener.bind(this))];},



disable:function(){
while(this._subscriptions.length)
this._subscriptions.pop().unsubscribe();

this.detach();},


_attachScrollListener:function(){
if(this._listener)
return;

var i=this._layer.getContextScrollParent();
this._listener=Event.listen
(i,
'scroll',
this._layer.updatePosition.bind(this._layer));},



_removeScrollListener:function(){
this._listener&&this._listener.remove();
this._listener=null;}});




e.exports=h;});

/** js/ui/xhp/Toggler.js */
__d("legacy:Toggler",["Toggler"],function(a,b,c,d){



a.Toggler=b('Toggler');},

3);

/** js/ui/xhp/layout/scrollable-area.js */
__d("legacy:ScrollableArea",["ScrollableArea"],function(a,b,c,d){



a.ScrollableArea=b('ScrollableArea');},


3);

/** js/ui/xhp/overlay/legacy/contextual-dialog.js */
__d("legacy:ContextualDialogX",["ContextualDialogX"],function(a,b,c,d){



a.ContextualDialogX=b('ContextualDialogX');},

3);

/** js/ui/xhp/overlay/tooltip.js */
__d("legacy:Tooltip",["Tooltip"],function(a,b,c,d){



a.Tooltip=b('Tooltip');},

3);

/** js/ui/xhp/typeahead/ClearableTypeahead.js */
__d("ClearableTypeahead",["event-extensions"],function(a,b,c,d,e,f){



b('event-extensions');

var g=
{resetOnCloseButtonClick:function(h,i){
Event.listen(i,'click',function(){
var j=h.getCore();



j.getElement().focus();
j.reset();});}};




e.exports=g;});

/** js/ui/xhp/typeahead/behaviors/TypeaheadShowLoadingIndicator.js */
__d("TypeaheadShowLoadingIndicator",["CSS","copyProperties"],function(a,b,c,d,e,f){



var g=b('CSS'),

h=b('copyProperties');

function i(j){
this._typeahead=j;}


h(i.prototype,
{_subscription:null,

enable:function(){
this._subscription=
this._typeahead.subscribe('loading',function(j,k){
g.conditionClass
(this._typeahead.getElement(),
'typeaheadLoading',
k.loading);

g.conditionClass
(this._typeahead.getView().getElement(),
'typeaheadViewLoading',
k.loading);}.

bind(this));},


disable:function(){
this._typeahead.unsubscribe(this._subscription);
this._subscription=null;}});




e.exports=i;});

/** js/ui/xhp/typeahead/behaviors/LegacyShowLoadingIndicatorTypeaheadBehavior.js */
__d("legacy:ShowLoadingIndicatorTypeaheadBehavior",["TypeaheadShowLoadingIndicator"],function(a,b,c,d){



var e=b('TypeaheadShowLoadingIndicator');

if(!a.TypeaheadBehaviors)a.TypeaheadBehaviors={};
a.TypeaheadBehaviors.showLoadingIndicator=function(f){
f.enableBehavior(e);};},


3);

/** js/ui/xhp/typeahead/renderers/CompactTypeaheadRenderer.js */
__d("CompactTypeaheadRenderer",["DOM"],function(a,b,c,d,e,f){




var g=b('DOM');








function h(i,j){
var k=[],

l=i.photo;
if(l){
if(l instanceof Array){
var m=
[g.create('span',{className:'splitpic leftpic'},
[g.create('img',{alt:'',src:l[0]})]),

g.create
('span',
{className:'splitpic'+(l[2]?' toppic':'')},
[g.create('img',{alt:'',src:l[1]})])];


if(l[2])
m.push(g.create('span',{className:'splitpic bottompic'},
[g.create('img',{alt:'',src:l[2]})]));


l=g.create('span',{className:'splitpics clearfix'},m);}else 

l=g.create('img',{alt:'',src:l});

k.push(l);}


if(i.text)
k.push(g.create('span',{className:'text'},[i.text]));


var n=i.subtext,
o=i.category;
if(n||o){
var p=[];
n&&p.push(n);
n&&o&&p.push(" \u00b7 ");
o&&p.push(o);
k.push(g.create('span',{className:'subtext'},p));}


var q=g.create('li',{className:i.type||''},k);
if(i.text)
q.setAttribute('aria-label',i.text);

return q;}


h.className='compact';

e.exports=h;});

/** js/modules/core/coalesce.js */
__d("coalesce",[],function(a,b,c,d,e,f){













function g(){
for(var h=0;h<arguments.length;++h)
if(arguments[h]!=null)
return arguments[h];


return null;}


e.exports=g;});

/** js/stream/UIIntentionalStream-message.js */
__d("legacy:UIIntentionalStream-message",["UIIntentionalStreamMessage"],function(a,b,c,d){








a.UIIntentionalStreamMessage=b('UIIntentionalStreamMessage');},

3);

/** js/modules/MenuXItemInterface.js */
__d("MenuXItemInterface",["copyProperties","emptyFunction"],function(a,b,c,d,e,f){



var g=b('copyProperties'),
h=b('emptyFunction');

function i(){}

g(i.prototype,
{_root:null,

getRoot:function(){
if(!this._root)
this._root=this.render();

return this._root;},


render:h,

getAccessKey:h,

hasAction:h.thatReturnsFalse,

focus:h.thatReturnsFalse,

blur:h.thatReturnsFalse,

handleClick:h.thatReturnsFalse});


e.exports=i;});

/** js/modules/MenuXItemBase.js */
__d("MenuXItemBase",["Class","copyProperties","CSS","DOM","HTML","MenuXItemInterface"],function(a,b,c,d,e,f){




var g=b('Class'),
h=b('copyProperties'),
i=b('CSS'),
j=b('DOM'),
k=b('HTML'),
l=b('MenuXItemInterface');

function m(n){
this.parent.construct(this);
this._data=n;}


g.extend(m,l);

h(m.prototype,
{render:function(){
var n='uiMenuXItem';
if(this._data.className)
n+=' '+this._data.className;

var o={className:n,'aria-selected':'false'};

for(var p in this._data)
if(p.indexOf('data-')===0)
o[p]=this._data[p];


return j.create('li',o,this._renderItemContent());},


_renderItemContent:function(){
return k(this._data.markup).getNodes();}});



e.exports=m;});

/** js/modules/MenuXItem.js */
__d("MenuXItem",["event-extensions","Class","CSS","DOM","KeyStatus","MenuXItemBase","copyProperties","emptyFunction"],function(a,b,c,d,e,f){




b('event-extensions');

var g=b('Class'),
h=b('CSS'),
i=b('DOM'),
j=b('KeyStatus'),
k=b('MenuXItemBase'),

l=b('copyProperties'),
m=b('emptyFunction');

function n(o){
this.parent.construct(this,o);}


g.extend(n,k);

l(n.prototype,
{getValue:function(){
return this._data.value;},


getAccessKey:function(){
return this._data.label&&this._data.label.charAt(0);},


hasAction:m.thatReturnsTrue,

focus:function(){

if(!this._root.offsetParent)
return false;

h.addClass(this._anchor,'highlighted');
h.addClass(this._root,'selected');
this._root.setAttribute('aria-selected','true');
if(j.isKeyDown())
this._anchor.focus();},



blur:function(){
h.removeClass(this._anchor,'highlighted');
h.removeClass(this._root,'selected');
this._root.setAttribute('aria-selected','false');},


handleClick:function(){
if(typeof this._onclickHandler==='function')
return this._onclickHandler();





return !!((this._data.rel&&this._data.rel!=='ignore')||
this._data.href);},


setOnClickHandler:function(o){
this._onclickHandler=o;},


_renderItemContent:function(){
this._anchor=i.create('a',
{className:'itemAnchor'},
i.create
('span',
{className:'itemLabel'},
this._data.markup||this._data.label));



if(this._data.icon){
i.prependContent(this._anchor,this._data.icon);
h.addClass(this._anchor,'hasIcon');}


this._anchor.setAttribute('href',this._data.href||'#');
if(this._data.rel){
this._anchor.setAttribute('rel',this._data.rel);}else
if(!this._data.href)
this._anchor.setAttribute('rel','ignore');

if(this._data.ajaxify)
this._anchor.setAttribute('ajaxify',this._data.ajaxify);

if(this._data.target)
this._anchor.setAttribute('target',this._data.target);


this._anchor.setAttribute('role','menuitem');








this._anchor.setAttribute('title',this._data.title);
return this._anchor;}});



e.exports=n;});

/** js/profile/timeline/modules/TimelineSideAds.js */
__d("TimelineSideAds",["event-extensions","function-extensions","Arbiter","cx","csx","CSS","DOM","StickyController","TimelineConstants","TimelineController","UIPagelet","URI","Vector","debounce","ge"],function(a,b,c,d,e,f){



b('event-extensions');
b('function-extensions');

var g=b('Arbiter'),
h=b('cx'),
i=b('csx'),
j=b('CSS'),
k=b('DOM'),
l=b('StickyController'),
m=b('TimelineConstants'),
n=b('TimelineController'),
o=b('UIPagelet'),
p=b('URI'),
q=b('Vector'),

r=b('debounce'),
s=b('ge'),

t=2,
u=3,
v=75,
w='data-height',


x=30000,
y=0,

z=false,
aa,
ba,
ca,
da,
ea=[],
fa,
ga=false,
ha,
ia=Infinity,
ja=5,



ka=false,
la,
ma,
na,
oa,
pa,


qa=false,

ra=[],
sa,




ta=false,
ua=
{about:true};













function va(nb,ob,pb){
var qb=0;
if(ob)
qb+=ob.getHeight();


if(!ab()&&!qb)
return;


nb-=qb;

var rb=0;
for(var sb=0;sb<pb;sb++)
rb+=fb(sb);


if(ob)
if(nb<rb){
nb+=ob.fold(rb-nb);}else
if(nb>rb)
nb-=ob.unfold(nb-rb);



return nb;}


function wa(){


var nb=ba.cloneNode(true);
nb.id='';


var ob=true;
k.scry(nb,'div.ego_unit').forEach(function(pb){
if(ob){
ob=false;}else 

k.remove(pb);});


j.addClass(nb,'fixed_elem');

return nb;}


function xa(){

if(!n.pageHasScrubber(fa)){
bb(ja);
db();}else 

if(ma){
cb(ba,false);



var nb=na;
na&&k.remove(na);
na=wa();


if(nb)
kb();


bb
(n.sidebarInitialized()&&ga?
u:
t);

db();







if(!ha){
var ob=n.getCurrentScrubber();
if(ob)
jb(ob.getRoot(),ob.getOffset());}


ha&&ha.start();}else 

mb.adjustAdsToFit();}




function ya(){


if(na){
k.remove(na);
na=null;}


if(ha){
ha.stop();
ha=null;}


if(ab()){

j.conditionClass
(ba,
'fixed_elem',
!ma);


j.conditionClass
(ba,
"_22s",
!n.pageHasScrubber(fa));}else 



j.conditionClass
(ba,
'fixed_elem',
!ma&&n.pageHasScrubber(fa));}









function za(nb){
var ob=q.getViewportDimensions().y,
pb=n.getCurrentScrubber(),
qb=pb?pb.getOffset():
m.SCRUBBER_DEFAULT_OFFSET,
rb=ob-qb-v;
if(pb||
ab())
return va(rb,pb,nb);}







function ab(){
if(ta)
return fa in ua;


return n.fixedAds();}











function bb(nb){
da=Math.min(nb,ea.length);

for(var ob=0;ob<ea.length;ob++)
cb(ea[ob],ob>=da);



cb(ba,da===0);}


function cb(nb,ob){
j.conditionClass(nb,"_22r",ob);
nb.setAttribute('aria-hidden',ob?'true':'false');}









function db(){
if(!oa)
return;






for(var nb=da-1;nb>=0;--nb){



if(ha&&ha.isFixed()&&
((nb!==0)||(na&&!j.shown(na))))
continue;


var ob=k.find(ea[nb],"div._4u8"),


pb=ob.getAttribute('data-ad'),
qb=JSON.parse(pb).adid;


if(!oa[qb])
return;


var rb=k.create('iframe',
{src:p('/ai.php').addQueryData({aed:oa[qb]}),
width:0,
height:0,
frameborder:0,
scrolling:'no',
className:'fbEmuTracking'});

rb.setAttribute('aria-hidden','true');

k.appendContent(ba,rb);


delete oa[qb];}}







function eb(nb){
var ob=0;

while(nb>0&&ob<ja){
nb-=fb(ob);

if(nb>=0)
ob++;}



return ob;}





function fb(nb){
var ob=ea[nb];


if(!ob)
return 0;


if(!ob.getAttribute(w))
gb(ob);


return parseInt(ob.getAttribute(w),10);}


function gb(nb){
nb.setAttribute(w,nb.offsetHeight);}


function hb(){
for(var nb=0;nb<ea.length;nb++){
var ob=ea[nb];
if(!ob)
continue;

gb(ob);}}



function ib(){
ea=k.scry(ba,'div.ego_unit');

var nb=ea.length;

if(!nb)
return;



ka=nb;

xa();



var ob=function(pb){
gb(pb);
ka=--nb;

mb.adjustAdsToFit();


if(!ka)
ia=Date.now();};



ea.forEach(function(pb){
function qb(){
ob.curry(pb).defer();}




var rb=k.scry(pb,'img.img')[0];
if(!rb)
return;




if(rb.complete){
qb();}else 







Event.listen(rb,{load:qb,error:qb,abort:qb});});}




function jb(nb,ob){
ha=new l
(nb,
ob,
function(pb){

if(pb){
kb();}else{

k.remove(na);
db();}});




if(na)
ha.start();}



function kb(){
k.insertAfter(ba,na);
lb();}


function lb(){
j.conditionShow
(na,
fb(0)<=za(1)&&
!j.hasClass(document.documentElement,'tinyViewport'));}



var mb=
{init:function(nb,ob,pb){
if(z)
return;

ja=pb.max_ads;
aa=pb.refresh_delay;
x=pb.refresh_threshold;

z=true;
ca=ob;
ba=nb;

ta=pb.is_standalone;
if(ta){
ma=false;
fa=pb.page_key;
ya();}


mb.adjustAdsType(n.shouldShowWideAds());

pa=g.subscribe

(['UFI/CommentAddedActive',
'UFI/CommentDeletedActive',
'UFI/LikeActive',
'Curation/Action',
'ProfileBrowser/LoadMoreContent',
'Ads/NewContentDisplayed'],

mb.loadAdsIfEnoughTimePassed);


sa=r
(mb.loadAdsIfEnoughTimePassed,
aa,
this,
true);


if(pb.mouse_move){
ra.push
(Event.listen(window,'mousemove',sa));


ra.push
(Event.listen(window,'scroll',sa));

ra.push
(Event.listen(window,'resize',sa));}



n.register(n.ADS,mb);},


setShortMode:function(nb){
ma=nb;},



start:function(nb){
oa=nb;
la=null;
ib();},


updateCurrentKey:function(nb){
if(nb==fa)
return;

fa=nb;
ya();},


loadAds:function(nb){
if(ka||la)


return;


ia=Infinity;

la=o.loadFromEndpoint
('WebEgoPane',
ba.id,

{pid:33,
data:
[ca,
false,
'timeline_'+nb,
ma?u:ja,
++y]},



{crossPage:true,
bundle:false});},






registerScrubber:function(nb){
if(ma)
jb(nb.getRoot(),nb.getOffset());




!la&&mb.adjustAdsToFit();},


loadAdsIfEnoughTimePassed:function(){





if(x&&
(Date.now()-ia>=x)&&
!j.hasClass(document.documentElement,'tinyViewport')&&
(!ha||ha.isFixed())&&
(!oa||!oa[ea[0]]))
mb.loadAds(fa);

mb.adjustAdsToFit();},


adjustAdsType:function(nb){
if(nb!=ga){
j.conditionClass(ba,"_22q",!nb);
j.conditionClass(ba,"_35q",!nb);
na&&j.conditionClass
(na,"_22q",!nb);
na&&j.conditionClass
(na,"_35q",!nb);
ga=nb;
hb();
mb.adjustAdsToFit();

var ob=s('rightColContent');
if(ob)
j.conditionClass(ob,'fbTimelineWideRightCol',nb);}},




adjustAdsToFit:function(){
if(!ba||qa)
return;

qa=true;




var nb=ga?u:t;

if(ma){


if(ha&&na){


ha.handleScroll();


if(ha.isFixed()){

j.conditionShow
(na,
fb(0)<=za(1)&&
!j.hasClass(document.documentElement,'tinyViewport'));}else 






bb(nb);

db();}}else{


var ob=za(nb);


if(typeof ob!=='undefined'){

bb(eb(ob));




if(!ka)
db();}}




qa=false;},


reset:function(){
ha&&ha.stop();
la&&la.cancel();
ea=[];
ga=false;
ba=null;
ha=null;
la=null;
y=0;
ka=null;
ma=null;
na=null;
fa=null;
ia=Infinity;
z=false;
pa&&g.unsubscribe(pa);
pa=null;

ra.forEach(function(nb){
nb.remove();});

ra=[];
sa&&
sa.reset();}};



e.exports=a.TimelineSideAds||mb;});
