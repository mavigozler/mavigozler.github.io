/*1349114813,178142493*/

if (window.CavalryLogger) { CavalryLogger.start_js(["obJM8"]); }

/** js/composerx/ComposerXAttachmentBootstrap.js */
__d("ComposerXAttachmentBootstrap",["CSS","Form","Parent","URI","cx"],function(a,b,c,d,e,f){



var g=b('CSS'),
h=b('Form'),
i=b('Parent'),
j=b('URI'),

k=b('cx'),

l=[],

m=




{bootstrap:function(n){
m.load
(i.byTag(n,'form'),
n.getAttribute('data-endpoint'));},


load:function(n,o,p){
var q=j(o).addQueryData
({composerurihash:m.getURIHash(o)});

g.conditionClass
(n,
"_fu",
p);


var r=i.byClass(n,"_2_4");
g.removeClass(r,'async_saving');
h.setDisabled(n,false);

n.action=q.toString();
h.bootstrap(n);},





getURIHash:function(n){
if(n==='initial')
return 'initial';

var o=l.indexOf(n);
if(o!==-1){
return o+'';}else{

o=l.length;
l[o]=n;
return o+'';}}};




e.exports=m;});

/** js/composerx/ComposerXStore.js */
__d("ComposerXStore",["function-extensions","Arbiter","ge"],function(a,b,c,d,e,f){








b('function-extensions');

var g=b('Arbiter'),

h=b('ge'),

i={};

function j(l,m){
return 'ComposerX/'+l+'/'+m;}


var k=
{set:function(l,m,n){
if(!i[l])
i[l]={};

i[l][m]=n;
g.inform
(j(l,m),
{},
g.BEHAVIOR_STATE);},


get:function(l,m){
if(i[l])
return i[l][m];

return null;},


getAllForComposer:function(l){
return i[l]||{};},






waitForComponents:function(l,m,n){
g.registerCallback
(n,
m.map(j.curry(l)));}};







g.subscribe('page_transition',function(){
for(var l in i)
if(!h(l))
delete i[l];});




e.exports=k;});

/** js/composerx/ComposerX.js */
__d("ComposerX",["Arbiter","ComposerXAttachmentBootstrap","ComposerXStore","CSS","DOM","DOMQuery","copyProperties","csx","cx","getObjectValues"],function(a,b,c,d,e,f){



var g=b('Arbiter'),
h=b('ComposerXAttachmentBootstrap'),
i=b('ComposerXStore'),
j=b('CSS'),
k=b('DOM'),
l=b('DOMQuery'),

m=b('copyProperties'),
n=b('csx'),
o=b('cx'),
p=b('getObjectValues');

function q(r){
this._root=r;
this._composerID=r.id;
this._attachments={};

this._attachmentFetchForm=
l.find(r,"._2_4");
this._resetSubscription=
g.subscribe('composer/publish',function(s,t){
if(t.composer_id===this._composerID)
this.reset();}.

bind(this));}


m(q.prototype,
{_lastEndpointHash:'beforeinit',
_lastFetchEndpoint:'',
_initialAttachmentAlias:null,

getAttachment:function(r,s){
var t=h.getURIHash(r);
this._lastEndpointHash=t;

var u=this._attachments[t];
if(u){
i.waitForComponents
(this._composerID,
u.required_components,
this._initAttachment.bind(this,
u.instance,
t,
u.placeholders));
return;}


if(r!==this._lastFetchEndpoint&&r!=='initial'){
h.load
(this._attachmentFetchForm,r,s);
this._lastFetchEndpoint=r;}},



setAttachment:
function(r,s,t,u){
s.setComposerID(this._composerID);

this._attachments[r]=
{instance:s,
placeholders:t,
required_components:u};


if(r==='initial'){

if(this._initialAttachmentAlias){
var v=
h.getURIHash(this._initialAttachmentAlias);
this._attachments[v]=
this._attachments.initial;}



if(this._currentInstance)
return;}



var w=l.find(this._root,"div._118"),



x=s.getRoot();
if(x.parentNode!==w){
j.hide(x);
k.appendContent(w,x);}



i.waitForComponents
(this._composerID,
u,
this._initAttachment.bind(this,s,r,t));},


setComponent:function(r,s){

if(!i.get(this._composerID,r)){
i.set(this._composerID,r,s);


k.appendContent
(this._attachmentFetchForm,
k.create('input',
{type:'hidden',
name:'loaded_components[]',
value:r}));}},





reset:function(){
if(this._currentInstance){
this._currentInstance.cleanup();
this._currentInstance=null;}

for(var r in this._attachments)
this._attachments[r].instance.reset();

var s=i.getAllForComposer(this._composerID);
p(s).forEach(function(t){
if(t.reset)
t.reset(t);});


this.getAttachment('initial');
g.inform('composer/reset');},


destroy:function(){
if(this._resetSubscription){
this._resetSubscription.unsubscribe();
this._resetSubscription=null;}},







addPlaceholders:function(r,s){
var t;
for(var u in this._attachments){
t=this._attachments[u];
if(t.instance===r){
s.forEach(function(v){
t.placeholders.push(v);
t.required_components.push(v.component_name);});

break;}}


if(this._currentInstance===r)
this._fillPlaceholders(s);},



setInitialAttachmentAlias:function(r){
this._initialAttachmentAlias=r;
if(this._attachments.initial){
var s=
h.getURIHash(r);
this._attachments[s]=this._attachments.initial;}},



_initAttachment:function(r,s,t){
if(this._currentInstance===r||
(this._lastEndpointHash!=='beforeinit'&&
this._lastEndpointHash!==s))
return;


if(this._currentInstance){
if(!this._currentInstance.canSwitchAway())
return;

this._currentInstance.cleanup();}

this._currentInstance=r;

var u=l.find(this._root,"div._118"),
v=u.childNodes,
w=r.getRoot();
for(var x=0;x<v.length;x++)
if(v[x]!==w)
j.hide(v[x]);


j.show(w);

this._fillPlaceholders(t);
r.initWithComponents(s==='initial');

this._setAttachmentSelectedClass(r.attachmentClassName);

g.inform
('composer/initializedAttachment',

{composerRoot:this._root,
isInitial:s==='initial'});},




_fillPlaceholders:function(r){
r.forEach(function(s){
var t=
i.get(this._composerID,s.component_name);
if(s.element!==t.element.parentNode)
k.setContent(s.element,t.element);}.

bind(this));},


_setAttachmentSelectedClass:function(r){
var s=
l.scry(this._root,"._4n")[0];
if(s)
j.removeClass(s,"_4n");

if(r){
var t=
l.scry(this._root,'.'+r)[0];
if(t)
j.addClass(t,"_4n");}}});





e.exports=q;});

/** js/composerx/ComposerXAttachment.js */
__d("ComposerXAttachment",["ComposerXStore","copyProperties","emptyFunction"],function(a,b,c,d,e,f){



var g=b('ComposerXStore'),

h=b('copyProperties'),
i=b('emptyFunction');












function j(){}

h(j.prototype,



{getRoot:i,
initWithComponents:function(k){},


cleanup:i,


reset:i,





attachmentClassName:'',







getComponent:function(k){
return g.get(this._composerID,k);},







canSwitchAway:i.thatReturnsTrue,




setComposerID:function(k){
this._composerID=k;}});



e.exports=j;});

/** js/composerx/ComposerXController.js */
__d("ComposerXController",["Arbiter","ComposerX","ComposerXAttachmentBootstrap","Parent","$","cx","emptyFunction","ge"],function(a,b,c,d,e,f){



var g=b('Arbiter'),
h=b('ComposerX'),
i=b('ComposerXAttachmentBootstrap'),
j=b('Parent'),

k=b('$'),
l=b('cx'),
m=b('emptyFunction'),
n=b('ge'),

o={};

function p(r){
var s=j.byClass(k(r),"_119"),
t=s.id;
if(!o[t])
o[t]=new h(s);

return o[t];}


var q=
{getAttachment:function(r,s,t){
var u=p(r);
u.getAttachment(s,t);},


setAttachment:
function(r,s,t,u,v){
var w=p(r);
w.setAttachment
(s,t,u,v);},


setComponent:function(r,s,t){
var u=p(r);
u.setComponent(s,t);},


reset:function(r){
var s=p(r);
s.reset();},


setInitialAttachmentAlias:function(r,s){
var t=p(r);
t.setInitialAttachmentAlias(s);},


holdTheMarkup:m,


getEndpoint:function(r,s,t){
var u=p(r);

i.load
(u._attachmentFetchForm,
s,
t);},


addPlaceholders:function(r,s,t){
var u=p(r);
u.addPlaceholders(s,t);}};








i.bootstrap=function(r){
q.getAttachment(r,r.getAttribute('data-endpoint'));};


g.subscribe('page_transition',function(){
for(var r in o)
if(!n(r)){
o[r].destroy();
delete o[r];}});




e.exports=q;});

/** js/modules/AsyncUploadBase.js */
__d("AsyncUploadBase",["ArbiterMixin","AsyncRequest","AsyncResponse","Form","UserAgent","copyProperties"],function(a,b,c,d,e,f){



var g=b('ArbiterMixin'),
h=b('AsyncRequest'),
i=b('AsyncResponse'),
j=b('Form'),
k=b('UserAgent'),

l=b('copyProperties');





function m(o){





this.setURI(o);}


m.isSupported=function(){
if(k.safari()&&!k.chrome()&&k.windows())


return false;

return ('FileList' in window)&&('FormData' in window);};


l(m.prototype,g,

{_limit:10,

setAllowCrossOrigin:function(o){
this._allowCrossOrigin=!!o;
return this;},







setData:function(o){
this._data=o;
return this;},







setLimit:function(o){
this._limit=o;
return this;},


setRelativeTo:function(o){
this._relativeTo=o;
return this;},


setStatusElement:function(o){
this._statusElement=o;
return this;},


setURI:function(o){
this._uri=o;
return this;},


_createFileUpload:function(o,p,q){
return new n(o,p,q);},


_parseFiles:function(o){
var p={};
for(var q in o){
var r=o[q];
if(Array.isArray(r)){
p[q]=r;}else{

p[q]=[];
if(r instanceof window.FileList){
for(var s=0;s<r.length;s++)
p[q].push(r.item(s));}else

if(r instanceof window.File||
r instanceof window.Blob)
p[q].push(r);}}



return p;},


_processQueue:function(){
while(this._pending.length<this._limit){
if(!this._waiting.length)
break;

var o=this._waiting.shift();
this._processUpload(o);
this._pending.push(o);}},



_processUpload:function(o){
this.inform('start',o);

var p=j.createFormData(o.getData()||this._data);
if(o.getFile())
p.append(o.getName(),o.getFile());


new h().
setAllowCrossOrigin(this._allowCrossOrigin).
setURI(this._uri).
setRawData(p).
setRelativeTo(this._relativeTo).
setStatusElement(this._statusElement).
setHandler(this._success.bind(this,o)).
setErrorHandler(this._failure.bind(this,o)).
setUploadProgressHandler(this._progress.bind(this,o)).
setInitialHandler(this._initial.bind(this,o)).
send();},


_initial:function(o){
this.inform('initial',o);},


_success:function(o,p){
this.inform('success',o.handleSuccess(p));
this._complete(o);},


_failure:function(o,p){
if(this.inform('failure',o.handleFailure(p))!==false)
i.defaultErrorHandler(p);

this._complete(o);},


_progress:function(o,event){
this.inform('progress',o.handleProgress(event));},


_complete:function(o){
this._pending.remove(o);
this._processQueue();

if(!this._pending.length)

this._inFlight=false;}});









var n=function(o,p,q){
this._name=o;
this._file=p;
this._data=q;
this._success=null;
this._response=null;
this._progressEvent=null;};


l(n.prototype,
{getName:function(){
return this._name;},

getFile:function(){
return this._file;},

getData:function(){
return this._data;},

isComplete:function(){
return this._success!==null;},

isSuccess:function(){
return this._success===true;},

getResponse:function(){
return this._response;},

getProgressEvent:function(){
return this._progressEvent;},




handleSuccess:function(o){
this._success=true;
this._response=o;
this._progressEvent=null;
return this;},

handleFailure:function(o){
this._success=false;
this._response=o;
this._progressEvent=null;
return this;},

handleProgress:function(event){
this._progressEvent=event;
return this;}});




e.exports=m;});

/** js/modules/AsyncUploadRequest.js */
__d("AsyncUploadRequest",["AsyncUploadBase","Class","copyProperties"],function(a,b,c,d,e,f){



var g=b('AsyncUploadBase'),
h=b('Class'),

i=b('copyProperties');










































function j(k){
this.parent.construct(this,k);}


j.isSupported=function(){
return g.isSupported();};


h.extend(j,g);

i(j.prototype,















{setFiles:function(k){
this._files=this._parseFiles(k);
return this;},


send:function(){
if(this._inFlight)







return;

this._inFlight=true;

this._uploads=[];
for(var k in this._files)
this._files[k].forEach(function(l){
this._uploads.push(this._createFileUpload(k,l));}.
bind(this));


if(this._uploads.length){
this._waiting=this._uploads.slice(0);
this._pending=[];

this._processQueue();}else 


this._processUpload(this._createFileUpload(null,null));},



_complete:function(k){
this.parent._complete(k);
if(!this._pending.length)
this.inform('complete',this._uploads);}});





e.exports=j;});

/** js/composerx/dragdrop/ComposerXDragDropStore.js */
__d("ComposerXDragDropStore",[],function(a,b,c,d,e,f){






var g={},
h={},
i={};

function j(n,o){
return n+'/'+o;}


function k(n,o){
var p=j(n,o);
if(!i[p])
i[p]=[];

return i[p];}


function l(n,o){
var p=g[j(n,o)];
if(!p)
return;

var q=k(n,o);
while(q.length)
p(q.pop());}



var m=
{register:function(n,o,p,q){
h[j(n,o)]=q;
p.subscribe('failure',function(r,s){
var t=k(n,o);
t.push({success:false,upload:s});
l(n,o);});},



handleFiles:function(n,o){
var p=h[j(n,o)];
delete h[j(n,o)];
return p;},


subscribe:function(n,o,p){
g[j(n,o)]=p;
l(n,o);},


setPhoto:function(n,o,p){
var q=k(n,o);
q.push({success:true,payload:p});
l(n,o);}};



e.exports=m;});

/** js/dragdrop/DragDropFileUpload.js */
__d("DragDropFileUpload",[],function(a,b,c,d,e,f){



f.isSupported=function(){
return typeof(FileList)!=="undefined";};});

/** js/dragdrop/DocumentDragDrop.js */
__d("DocumentDragDrop",["event-extensions","CSS","DOM","DragDropFileUpload","emptyFunction","getObjectValues"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('CSS'),
h=b('DOM'),
i=b('DragDropFileUpload'),

j=b('emptyFunction'),
k=b('getObjectValues'),


l={},

m=0;

function n(){
m=0;
k(l).forEach(function(q){
g.removeClass(q.element,q.className);});}



function o(){

if(!i.isSupported())
return;












Event.listen(document,'dragenter',function(r){
if(m===0)
k(l).forEach(function(s){
g.addClass(s.element,s.className);});


m++;});


Event.listen(document,'dragleave',function(r){
m--;
if(m===0)
n();});













Event.listen(document,'drop',Event.prevent);
Event.listen(document,'dragover',Event.prevent);









var q=null;


document.addEventListener('dragover',function(){
q&&clearTimeout(q);
q=setTimeout(n,839);},
true);

o=j;}


var p=
{registerStatusElement:function(q,r){
o();
l[h.getID(q)]=
{element:q,
className:r};},



removeStatusElement:function(q){
var r=h.getID(q),
s=l[r];
g.removeClass(s.element,s.className);
delete l[r];}};



e.exports=p;});

/** js/dragdrop/DragDropTarget.js */
__d("DragDropTarget",["event-extensions","CSS","DocumentDragDrop","DragDropFileUpload","copyProperties","emptyFunction"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('CSS'),
h=b('DocumentDragDrop'),
i=b('DragDropFileUpload'),

j=b('copyProperties'),
k=b('emptyFunction');







































function l(m){
this._element=m;
this._listeners=[];
this._statusElem=m;
this._dragEnterCount=0;
this._enabled=false;}


j(l.prototype,
{_onFilesDropCallback:k,
_onURLDropCallback:k,
_fileFilterFn:k.thatReturnsArgument,

setOnFilesDropCallback:function(m){
this._onFilesDropCallback=m;
return this;},


setOnURLDropCallback:function(m){
this._onURLDropCallback=m;
return this;},


enable:function(){
if(!i.isSupported())
return this;


h.registerStatusElement(this._statusElem,'fbWantsDragDrop');

this._listeners.push
(Event.listen(this._element,'dragenter',this._onDragEnter.bind(this)));
this._listeners.push
(Event.listen(this._element,'dragleave',this._onDragLeave.bind(this)));
this._listeners.push
(Event.listen(this._element,'dragover',Event.kill));

this._listeners.push
(Event.listen(this._element,'drop',function(m){
this._dragEnterCount=0;
g.removeClass(this._statusElem,'fbDropReady');

var n=this._fileFilterFn(m.dataTransfer.files);
if(n.length)
this._onFilesDropCallback(n);

var o=
m.dataTransfer.getData('url')||
m.dataTransfer.getData('text/uri-list');
if(o)
this._onURLDropCallback(o);


m.kill();}.
bind(this)));

this._enabled=true;
return this;},


disable:function(){
if(!this._enabled)
return this;

h.removeStatusElement(this._statusElem,'fbWantsDragDrop');
g.removeClass(this._statusElem,'fbDropReady');

while(this._listeners.length)
this._listeners.pop().remove();


this._enabled=false;
return this;},


setFileFilter:function(m){
this._fileFilterFn=m;
return this;},


setStatusElement:function(m){
this._statusElem=m;
return this;},






_onDragEnter:function(){
if(this._dragEnterCount===0)
g.addClass(this._statusElem,'fbDropReady');

this._dragEnterCount++;},


_onDragLeave:function(){
this._dragEnterCount=Math.max(this._dragEnterCount-1,0);
if(this._dragEnterCount===0)
g.removeClass(this._statusElem,'fbDropReady');}});




e.exports=l;});

/** js/composerx/dragdrop/ComposerXDragDrop.js */
__d("ComposerXDragDrop",["AsyncUploadRequest","ComposerXController","ComposerXDragDropStore","DragDropTarget","URI","copyProperties"],function(a,b,c,d,e,f){










var g=b('AsyncUploadRequest'),
h=b('ComposerXController'),
i=b('ComposerXDragDropStore'),
j=b('DragDropTarget'),
k=b('URI'),

l=b('copyProperties'),

m=
'/ajax/composer/attachment/photo/vault/saveunpublished.php',
n='/ajax/composerx/attachment/media/upload/',
o='/ajax/composerx/attachment/link/scraper/',

p=function(r){
r();};






function q(r,s,t,u){
this._root=r;
this._composerID=s;
this._targetID=t;
u=u||p;

this._dragdrop=
new j(r).
setOnFilesDropCallback(function(v){
u(this._uploadFiles.bind(this,v));}.
bind(this)).
setFileFilter(q.filterImages).
enable();}


q.filterImages=function(r){
var s=[];
for(var t=0;t<r.length;t++)
if(r[t].type.match('image/*'))
s.push(r[t]);


return s;};


l(q.prototype,
{enableURLDropping:function(){
this._dragdrop.setOnURLDropCallback(this._onURLDrop.bind(this));},


deactivate:function(){
this._dragdrop.disable();},


_uploadFiles:function(r){
var s=new g(m);
i.register
(this._composerID,'mediaupload',s,r);
s.
setFiles(r).
setData
({dragdrop:true,
composerid:this._composerID,
attachmentid:'mediaupload',
profile_id:this._targetID,
source:8}).

send();
h.getAttachment(this._root,n);},


_onURLDrop:function(r){
var s=new k(o);
s.addQueryData
({scrape_url:encodeURIComponent(r)});

h.getAttachment(this._root,s.toString());}});



e.exports=q;});

/** js/composerx/attachments/ComposerXBootloadStatusAttachment.js */
__d("ComposerXBootloadStatusAttachment",["event-extensions","function-extensions","Bootloader","Class","ComposerXAttachment","ComposerXController","ComposerXDragDrop","CSS","DOM","DOMQuery","Input","Parent","copyProperties","csx","cx"],function(a,b,c,d,e,f){



b('event-extensions');
b('function-extensions');

var g=b('Bootloader'),
h=b('Class'),
i=b('ComposerXAttachment'),
j=b('ComposerXController'),
k=b('ComposerXDragDrop'),
l=b('CSS'),
m=b('DOM'),
n=b('DOMQuery'),
o=b('Input'),
p=b('Parent'),

q=b('copyProperties'),
r=b('csx'),
s=b('cx'),

t={};

function u(v,w){
this.parent.construct(this);
this._root=v;
this._config=w;}


h.extend(u,i);

q(u.prototype,
{_attachmentIsActive:false,
_bootloading:false,
_fullVersion:false,
_focusListener:null,

_privacyWidgetTags:null,
_scraper:null,
_dragdrop:null,

attachmentClassName:"_4j",

getRoot:function(){
return this._root;},


initWithComponents:function(v){
t[this._composerID]=this;
this._attachmentIsActive=true;

var w=n.find
(this.getComponent('maininput').element,'textarea.input');
if(this._fullVersion){
this._fullInitWithComponents();}else
if(!this._bootloading)
if(n.contains(this._root,document.activeElement)){
this._onInitialFocus();}else 

this._focusListener=Event.listen
(w,'focus',this._onInitialFocus.bind(this));



this.getComponent('maininput').instance.
setPlaceholder(this._config.mentionsPlaceholder);
if(!v)
o.focus(w);


if(this._config.plus_version){
this._dragdrop=new k
(this._root,
this._composerID,
this._config.targetID);
this._dragdrop.enableURLDropping();}},









_fullInitWithComponents:function(){


g.loadModules
(['ComposerXPrivacyWidgetTags','URLScraper','URI'],
function(v,w,x){

this._tagger.init(this);
this._privacyWidgetTags=new v(this);

var y=n.find
(this.getComponent('maininput').element,'textarea.input');
if(!this._scraper){
this._scraper=new w(y);
this._scraper.subscribe('match',function(z,aa){
var ba=new x('/ajax/composerx/attachment/link/scraper/');
ba.addQueryData
({scrape_url:encodeURIComponent(aa.url)});

j.getAttachment(this._root,ba.toString());}.
bind(this));}

this._scraper.enable();
this._scraper.check();}.
bind(this));},


cleanup:function(){
this._attachmentIsActive=false;
if(this._focusListener){
this._focusListener.remove();
this._focusListener=null;}

if(this._dragdrop){
this._dragdrop.deactivate();
this._dragdrop=null;}

if(this._fullVersion){
this._tagger.cleanup();
this._privacyWidgetTags.destroy();
this._privacyWidgetTags=null;
this._scraper.disable();}},



reset:function(){

var v=
p.byClass(this._root,"child_was_focused");
if(v)
l.removeClass(v,"child_was_focused");


if(this._tagger)
this._tagger.reset();


this.getComponent('maininput').instance.
setPlaceholder(this._config.mentionsPlaceholder);},


canSwitchAway:function(){
return !p.byClass(this._root,'async_saving');},


setBootloadedContent:function(v,w,x){
var y=n.find
(this._root,"._3-6"),
z=n.find
(this._root,"._3-7");
m.setContent(y,v.tagger_content);
m.setContent(z,v.tagger_icons);
j.addPlaceholders(this._root,this,x);

this._tagger=w;
this._fullVersion=true;
if(this._attachmentIsActive){
if(this._focusListener){
this._focusListener.remove();
this._focusListener=null;}

this._fullInitWithComponents();}},



_onInitialFocus:function(){
j.getEndpoint
(this._root,
'/ajax/composerx/attachment/status/bootload/',
true);
this._bootloading=true;}});



u.setBootloadedContent=
function(v,w,x,y){
var z=t[v];
if(z)
z.setBootloadedContent(w,x,y);};



e.exports=u;});

/** js/composerx/components/ComposerXMentionsInputReset.js */
__d("ComposerXMentionsInputReset",["DOMQuery","Input"],function(a,b,c,d,e,f){



var g=b('DOMQuery'),
h=b('Input');

function i(j){
var k=g.scry(j.element,'textarea.input')[0];
j.instance.reset();
h.reset(k);}


e.exports=i;});

/** js/composerx/components/ComposerXPrivacyWidgetReset.js */
__d("ComposerXPrivacyWidgetReset",["Arbiter"],function(a,b,c,d,e,f){



var g=b('Arbiter');

function h(i){
g.inform('Composer/changedtags',
{withTags:[],
mention:{},
eventTag:false});}



e.exports=h;});

/** js/composerx/components/ComposerXTaggerIconReset.js */
__d("ComposerXTaggerIconReset",["CSS","cx"],function(a,b,c,d,e,f){



var g=b('CSS'),

h=b('cx');

function i(j){
g.removeClass
(j.element,
"_4k");
g.removeClass
(j.element,
"_4l");
g.removeClass
(j.element,
"_4m");}


e.exports=i;});

/** js/lib/dom/ScrollAwareDOM.js */
__d("legacy:ScrollAwareDOM",["ScrollAwareDOM"],function(a,b,c,d){



a.ScrollAwareDOM=b('ScrollAwareDOM');},

3);

/** js/lib/util/ARIA.js */
__d("legacy:ARIA",["ARIA"],function(a,b,c,d){



a.ARIA=b('ARIA');},

3);

/** js/listeners/forms/RequiredFormListener.js */
__d("RequiredFormListener",["event-extensions","Input"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('Input');

Event.listen(document.documentElement,'submit',function(h){
var i=h.getTarget().getElementsByTagName('*');
for(var j=0;j<i.length;j++)
if(i[j].getAttribute('required')&&
g.isEmpty(i[j])){
i[j].focus();
return false;}},


Event.Priority.URGENT);});

/** js/modules/DynamicIconSelector.js */
__d("DynamicIconSelector",["Button","CSS","DOM","Selector"],function(a,b,c,d,e,f){



var g=b('Button'),
h=b('CSS'),
i=b('DOM'),
j=b('Selector'),





k=
{swapIcon:function(l){
var m=j.getSelectedOptions(l)[0],
n=m&&i.scry(m,'.itemIcon')[0],
o=j.getSelectorButton(l);
if(n){
g.setIcon(o,n.cloneNode(true));}else{

var p=i.scry(o,'.img')[0];
p&&i.remove(p);}

h.conditionClass(o,'uiSelectorChevronOnly',!n);}};



j.subscribe('change',function(l,m){
var n=m.selector;
if(h.hasClass(n,'dynamicIconSelector'))
k.swapIcon(n);});



e.exports=k;});

/** js/modules/PrivacyConst.js */
__d("PrivacyConst",["copyProperties"],function(a,b,c,d,e,f){



var g=b('copyProperties'),









h=
{FRIENDS_MINUS_ACQUAINTANCES:127,
FACEBOOK_EMPLOYEES:112,
CUSTOM:111,
EVERYONE:80,
NETWORKS_FRIENDS_OF_FRIENDS:60,
NETWORKS_FRIENDS:55,
FRIENDS_OF_FRIENDS:50,
ALL_FRIENDS:40,
SELF:10,
NOBODY:0},


i=
{EVERYONE:80,
NETWORKS_FRIENDS:55,



FRIENDS_OF_FRIENDS:50,
ALL_FRIENDS:40,
SOME_FRIENDS:30,
SELF:10,
NO_FRIENDS:0},


j=
{BaseValue:h,
FriendsValue:i};


e.exports=j;});

/** js/modules/AudienceSelector.js */
__d("AudienceSelector",["Arbiter","CSS","DOM","DynamicIconSelector","PrivacyConst","Selector","copyProperties"],function(a,b,c,d,e,f){




var g=b('Arbiter'),
h=b('CSS'),
i=b('DOM'),
j=b('DynamicIconSelector'),
k=b('PrivacyConst'),
l=b('Selector'),

m=b('copyProperties');






l.subscribe('select',function(p,q){
if(!h.hasClass(q.selector,'audienceSelector'))
return;


var r=l.getOptionValue(q.option);
g.inform('AudienceSelector/changed',q);



if(r==k.BaseValue.CUSTOM&&
!h.hasClass(q.option,'noDialog')){
l.toggle(q.selector);
return false;}


if(h.hasClass(q.selector,'dataTooltip')){
var s=i.find(q.option,'.itemAnchor').
getAttribute('data-tooltip');

l.setButtonTooltip
(q.selector,
s||null);}



if(!h.hasClass(q.option,'specialOption'))
return;


var t=i.find(q.option,'a').getAttribute('data-type');
if(h.hasClass(q.option,'moreOption')){



h.addClass(q.selector,t);
h.addClass(q.selector,'showSecondaryOptions');
return false;}else
if(h.hasClass(q.option,'returnOption')){


h.removeClass(q.selector,'showSecondaryOptions');
h.removeClass(q.selector,'friendList');
return false;}});



var n={},

o=

{hasTags:function(p){
return n.hasOwnProperty(p);},


setHasTags:function(p){
if(!p)
return;


n[p]=true;}};



g.subscribe('CustomPrivacyOption/update',function(p,q){
if(!h.hasClass(q.selector,'audienceSelector'))
return;


l.setSelected(q.selector,l.getOptionValue(q.option));
j.swapIcon(q.selector);
l.setButtonTooltip(q.selector,q.tooltip);

g.inform('AudienceSelector/update',q.selector);});


e.exports=o;});

/** js/modules/CustomPrivacyOption.js */
__d("CustomPrivacyOption",["event-extensions","Arbiter","AsyncRequest","Dialog","DOM","Form","Parent","PrivacyConst","Selector","copyProperties"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('Arbiter'),
h=b('AsyncRequest'),
i=b('Dialog'),
j=b('DOM'),
k=b('Form'),
l=b('Parent'),
m=b('PrivacyConst'),
n=b('Selector'),

o=b('copyProperties');


















function p(q,r,s,t,u,
v){
if(!q)
return;




(function(){
this.initCustomState(q,r,s);

Event.listen(q,'click',function(event){
this.openCustomDialog(event,r,t,v);}.
bind(this));

this._initSelector(q,u);}).
bind(this).defer();}


o(p,
{_instances:{},
update:function(q,r,s,t){
var u=p._instances[q];

u.
_update(r,s).
_updateOption(s,t);

g.inform('Form/change',{node:u._container});},


getData:function(q){
return p._instances[q]._privacyData;}});



o(p.prototype,
{_initSelector:function(q,r){
this._selector=l.byClass(q,'uiSelector');



n.listen(this._selector,'select',function(s){
if(s.option._id!=this._id)
this.clearCustomState();}.

bind(this));



if(r)
n.setButtonTooltip(this._selector,r);},







_updateOption:function(q,r){


var s=
n.getOption(this._selector,q)||
n.getOption(this._selector,m.BaseValue.CUSTOM+'');

g.inform
('CustomPrivacyOption/update',

{selector:this._selector,
option:s,
tooltip:r});


return this;},


_update:function(q,r){
var s=
r==m.BaseValue.CUSTOM||
!n.getOption(this._selector,r),
t=this._selector.getAttribute('data-name');

this.updateCustomState(q,s,t);
return this;},









initCustomState:function(q,r,s){
p._instances[r]=this;
this._container=j.find(q,'.customPrivacyInputs');
this._id=s;
this._privacyData={};


var t=k.serialize(this._container);
if(t.audience)
this._privacyData=t.audience[s];


return q;},






openCustomDialog:function(event,q,r,s){
var t=new h('/ajax/privacy/custom_dialog/').
setData
({option_id:q,
id:this._id,
privacy_data:this._privacyData,
explain_tags:r,
autosave:s});


new i().
setAsync(t).
setModal(true).
setCausalElement(event.getTarget()).
show();},















updateCustomState:function(q,r,s){
this.clearCustomState();
this._privacyData=o({},q);


if(r)



if(s){
s=s.slice(0,-'[value]'.length);

var t={};
t[s]=q;
k.createHiddenInputs(t,this._container,null,true);}},










clearCustomState:function(){
this._privacyData={};
j.empty(this._container);}});



e.exports=p;});

/** js/modules/ComposerAudienceSelector.js */
__d("ComposerAudienceSelector",["DynamicIconSelector","CustomPrivacyOption","PrivacyConst","Selector"],function(a,b,c,d,e,f){



b('DynamicIconSelector');

var g=b('CustomPrivacyOption'),
h=b('PrivacyConst'),
i=b('Selector'),

j={},
k={},

l=

{syncSelector:function(m){
j[m]&&i.setSelected(m,j[m]);

if(j[m]==h.BaseValue.CUSTOM&&
k[m]){
var n=i.getOption
(m,
h.BaseValue.CUSTOM+''),
o=k[m];


(function(){
g.update
(n.id,
o.data,
o.audience,
o.tooltip);}).
defer();}}};




e.exports=l;});

/** js/modules/ErrorDialog.js */
__d("ErrorDialog",["Dialog","emptyFunction"],function(a,b,c,d,e,f){



var g=b('Dialog'),

h=b('emptyFunction'),


















i=







{showAsyncError:function(j){

try{return i.show
(j.getErrorSummary(),
j.getErrorDescription());}catch(

k){
alert(j);}},









show:function(j,k,l,m){
return (new g()).
setTitle(j).
setBody(k).
setButtons([g.OK]).
setStackable(true).
setModal(true).
setHandler(l||h).
setButtonsMessage(m||'').
show();}};



e.exports=i;});

/** js/modules/Popover.js */
__d("Popover",["event-extensions","Arbiter","ArbiterMixin","ContextualLayer","ContextualLayerHideOnScroll","CSS","DataStore","DOM","Input","KeyStatus","LayerHideOnEscape","Toggler","copyProperties"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('Arbiter'),
h=b('ArbiterMixin'),
i=b('ContextualLayer'),
j=b('ContextualLayerHideOnScroll'),
k=b('CSS'),
l=b('DataStore'),
m=b('DOM'),
n=b('Input'),
o=b('KeyStatus'),
p=b('LayerHideOnEscape'),
q=b('Toggler'),

r=b('copyProperties');

q.subscribe(['show','hide'],function(t,u){
var v=l.get(u.getActive(),'Popover');
if(v)
if(t==='show'){
v.showLayer();}else 

v.hideLayer();});




function s(t,u,v,w){
this._root=t;
this._triggerElem=u;
this._behaviors=v;
this._config=w;



if(!(u.nodeName==='A'&&u.rel==='toggle'))
Event.listen(u,'click',function(){
q.bootstrap(u);});


u.setAttribute('role','button');
l.set(t,'Popover',this);}


r(s.prototype,h,
{_layer:null,
_closeListener:null,

ensureInit:function(){
if(!this._layer)
this._init();},



showLayer:function(){
this.ensureInit();
this._layer.show();
q.show(this._root);
k.addClass(this._root,'selected');
this.inform('show');
this._triggerElem.setAttribute('aria-expanded','true');},


getLayer:function(){
return this._layer;},


hideLayer:function(){
this._layer.hide();
this._triggerElem.setAttribute('aria-expanded','false');},


isShown:function(){
return this._layer.isShown();},


setLayerContent:function(t){
this.ensureInit();
this._layer.setContent(t);},


_init:function(){
var t=new i
({context:this._triggerElem,
position:'below'},
m.create('div'));
t.enableBehaviors([j,p]);



q.createInstance(t.getRoot()).setSticky(false);

t.subscribe('hide',this._onLayerHide.bind(this));
this._behaviors&&t.enableBehaviors(this._behaviors);
this._layer=t;

if(this._config.alignh)
this._layer.setAlignment(this._config.alignh);

if(this._config.layer_content)
this._layer.setContent(this._config.layer_content);


this.inform('init',null,g.BEHAVIOR_PERSISTENT);},






_onLayerHide:function(){
q.hide(this._root);
k.removeClass(this._root,'selected');
this.inform('hide');


if(o.isKeyDown())
n.focus(this._triggerElem);}});




e.exports=s;});

/** js/modules/PopoverMenuInterface.js */
__d("PopoverMenuInterface",["Arbiter","ArbiterMixin","Class","copyProperties","emptyFunction"],function(a,b,c,d,e,f){



var g=b('Arbiter'),
h=b('ArbiterMixin'),
i=b('Class'),

j=b('copyProperties'),
k=b('emptyFunction');

function l(){}

j(l.prototype,h,






{getRoot:k,




onShow:k,




onHide:k,






focusAnItem:k.thatReturnsFalse,




blur:k,





handleKeydown:k.thatReturnsFalse,






done:function(){
this.inform('done');}});



e.exports=l;});

/** js/modules/PopoverAsyncMenuLoading.js */
__d("PopoverAsyncMenuLoading",["Class","copyProperties","DOM","PopoverMenuInterface"],function(a,b,c,d,e,f){






var g=b('Class'),
h=b('copyProperties'),
i=b('DOM'),
j=b('PopoverMenuInterface');

function k(l){
this.parent.construct(this);
this._className=l||'';}


g.extend(k,j);
h(k.prototype,
{_root:null,

getRoot:function(){
if(!this._root)
this._root=
i.create('div',{className:this._className},
i.create('div',{className:'uiMenuXBorder'},
i.create('div',{className:'uiMenuX uiMenuXLoading'},
i.create('span',{className:'spinner'}))));


return this._root;}});



e.exports=k;});

/** js/modules/PopoverMenu.js */
__d("PopoverMenu",["event-extensions","Arbiter","ArbiterMixin","ARIA","BehaviorsMixin","Class","Input","Keys","KeyStatus","copyProperties"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('Arbiter'),
h=b('ArbiterMixin'),
i=b('ARIA'),
j=b('BehaviorsMixin'),
k=b('Class'),
l=b('Input'),
m=b('Keys'),
n=b('KeyStatus'),

o=b('copyProperties');

function p(q,r,s,t){
this._popover=q;
this._triggerElem=r;
this._initialMenu=s;

q.subscribe('init',this._onLayerInit.bind(this));
q.subscribe('show',this._onPopoverShow.bind(this));
q.subscribe('hide',this._onPopoverHide.bind(this));

t&&this.enableBehaviors(t);}


o(p.prototype,h,j);

o(p.prototype,
{_popoverShown:false,

setMenu:function(q){
this._menu=q;

var r=q.getRoot();
this._popover.setLayerContent(r);
q.subscribe('done',this._onMenuDone.bind(this));

if(this._popoverShown)
this._menu.onShow();


i.owns(this._triggerElem,r);
this.inform('setMenu',null,g.BEHAVIOR_PERSISTENT);},


getPopover:function(){
return this._popover;},


getTriggerElem:function(){
return this._triggerElem;},


getMenu:function(){
return this._menu;},


_onLayerInit:function(){
this.setMenu(this._initialMenu);
this._popover.getLayer().subscribe('key',this._handleKeyEvent.bind(this));},


_onPopoverShow:function(){
if(this._menu){
this._menu.onShow();
if(n.isKeyDown())
this._menu.focusAnItem();}


this._popoverShown=true;},


_onPopoverHide:function(){
if(this._menu)
this._menu.onHide();

this._popoverShown=false;},


_handleKeyEvent:function(q,r){
var s=Event.getKeyCode(r);
switch(s){
case m.RETURN:

return;
case m.UP:
case m.DOWN:
this._menu.handleKeydown(s);
break;



default:if(this._menu.handleKeydown(s)===false){
this._menu.blur();
this._menu.handleKeydown(s);}

break;
}
r.prevent();},


_onMenuDone:function(q){




this._popover.hideLayer.bind(this._popover).defer();



if(n.isKeyDown())
l.focus(this._triggerElem);}});




e.exports=p;});

/** js/modules/PopoverAsyncMenu.js */
__d("PopoverAsyncMenu",["event-extensions","AsyncRequest","Class","CSS","DOM","PopoverAsyncMenuLoading","PopoverMenu","copyProperties"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('AsyncRequest'),
h=b('Class'),
i=b('CSS'),
j=b('DOM'),
k=b('PopoverAsyncMenuLoading'),
l=b('PopoverMenu'),

m=b('copyProperties'),

n={},
o=0;

function p
(q,
r,
s,
t,
u){

this._endpoint=t;
this._loadingMenu=s;
this._instanceId=o++;
n[this._instanceId]=this;
this._mouseoverListener=
Event.listen(r,'mouseover',this._fetchMenu.bind(this));

this.parent.construct(this,q,r,null,u);}


p.setMenu=function(q,r){
n[q].setMenu(r);};


h.extend(p,l);

m(p.prototype,
{_fetched:false,
_mouseoverListener:null,

_onLayerInit:function(){

if(!this._menu)
this.setMenu(this._loadingMenu);


this._fetchMenu();},


_fetchMenu:function(){
if(this._fetched)
return;


new g().
setURI(this._endpoint).
setData({pmid:this._instanceId}).
send();
this._fetched=true;

if(this._mouseoverListener){
this._mouseoverListener.remove();
this._mouseoverListener=null;}}});




e.exports=p;});

/** js/modules/PopoverMenuOverlappingBorder.js */
__d("PopoverMenuOverlappingBorder",["function-extensions","CSS","DOM","Style","copyProperties"],function(a,b,c,d,e,f){




b('function-extensions');

var g=b('CSS'),
h=b('DOM'),
i=b('Style'),

j=b('copyProperties');

function k(l){
this._popoverMenu=l;
this._popover=l.getPopover();
this._triggerElem=l.getTriggerElem();}


j(k.prototype,
{_shortBorder:null,
_setMenuSubscription:null,
_showSubscription:null,
_menuSubscription:null,

enable:function(){
this._setMenuSubscription=
this._popoverMenu.subscribe('setMenu',this._onSetMenu.bind(this));},


disable:function(){
this._popoverMenu.unsubscribe(this._setMenuSubscription);
this._setMenuSubscription=null;
this._removeBorderSubscriptions();
this._removeShortBorder();},


_onSetMenu:function(){
this._removeBorderSubscriptions();

this._menu=this._popoverMenu.getMenu();
this._renderShortBorder(this._menu.getRoot());

this._showSubscription=
this._popover.subscribe('show',this._updateBorder.bind(this));


this._menuSubscription=
this._menu.subscribe
(['change','resize'],
Function.prototype.defer.shield(this._updateBorder.bind(this)));

this._updateBorder();},


_updateBorder:function(){
var l=this._menu.getRoot(),
m=this._triggerElem.offsetWidth;


i.set(l,'min-width',m+'px');

var n=Math.max(l.offsetWidth-m,0);
i.set(this._shortBorder,'width',n+'px');},


_renderShortBorder:function(l){
this._shortBorder=h.create('div',{className:'uiMenuXShortBorder'});
h.appendContent(l,this._shortBorder);
g.addClass(l,'uiMenuXWithShortBorder');},


_removeShortBorder:function(){
if(this._shortBorder){
h.remove(this._shortBorder);
this._shortBorder=null;
g.removeClass
(this._popoverMenu.getMenu().getRoot(),
'uiMenuXShortBorder');}},



_removeBorderSubscriptions:function(){
if(this._showSubscription){
this._popover.unsubscribe(this._showSubscription);
this._showSubscription=null;}

if(this._menuSubscription){
this._menu.unsubscribe(this._menuSubscription);
this._menuSubscription=null;}}});




e.exports=k;});

/** js/privacy/audience/AudienceSelector.js */
__d("legacy:AudienceSelector",["AudienceSelector"],function(a,b,c,d){



b('AudienceSelector');},

3);

/** js/privacy/audience/ComposerAudienceSelector.js */
__d("legacy:ComposerAudienceSelector",["ComposerAudienceSelector"],function(a,b,c,d){



a.ComposerAudienceSelector=b('ComposerAudienceSelector');},

3);

/** js/privacy/audience/FriendListPrivacyOptions.js */






var FriendListPrivacyOptions=(function(){

var a=false,
b=false,
c=null,
d={},

e=function(f){
if(is_empty(d))
PageTransitions.registerHandler(function(){
d={};
a=false;
b=false;});



var g=f.getAttribute('data-name');


d[g]=f;
Selector.listen(f,'select',function(h){
var i=h.option,
j=DOM.find(i,'a.itemAnchor'),
k=j.getAttribute('data-flid');
if(!k)
return;

var l=j.getAttribute('data-dynamic');

if(l&&a){
FriendListPrivacyOptions.showSmartListNux(i,k);}else
if(!l&&b)
FriendListPrivacyOptions.showDumbListNux([k]);});};





return {listen:function(f,g,h){
var i=ge(f);
if(!i)
return;

var j=Parent.byClass(i,'audienceSelector');
if(j){
e(j);
a=g;
b=h;}},



showSmartListNux:function(f,g){
new AsyncRequest
('/ajax/friends/lists/smart_list_publish_nux.php').
setData({option_id:f.id,flid:g}).
send();
a=false;},


setContextualDialog:function(f,g){
var h=Parent.byClass(g,'audienceSelector');
if(h){
f.setContext(h);
f.show();
var i=Arbiter.subscribe('composer/publish',function(){
f.hide();});

f.subscribe('hide',function(){
i.unsubscribe();});}},




showDumbListNux:function(f){
new AsyncRequest
('/ajax/friends/lists/dumb_list_publish_nux.php').
setData({flids:f}).
send();
b=false;},


showBothListsNux:function(f,g){
c=f;
FriendListPrivacyOptions.showDumbListNux(g);},


setDialog:function(){
if(!c)
return;

var f=Dialog.getCurrent();
if(f)
f.setCloseHandler(function(){
FriendListPrivacyOptions.showSmartListNux(c);
c=null;});}};})




();

/** js/privacy/audience/OnlyMePrivacyOption.js */
__d("OnlyMePrivacyOption",["Arbiter","copyProperties","CSS","DOM","Env","Parent","PrivacyConst","Selector","tx"],function(a,b,c,d,e,f){



var g=b('Arbiter'),
h=b('copyProperties'),
i=b('CSS'),
j=b('DOM'),
k=b('Env'),
l=b('Parent'),
m=b('PrivacyConst'),
n=b('Selector'),
o=b('tx');

function p(q){
this._selector=l.byClass(q,'composerAudienceSelector');
this._plusLabel=j.scry(q,'.plusLabel')[0];

if(!this._selector)
return;


this._elem=q;
this._taggedIDs=[];
this._tags=[];
this._hasEvent=false;
this._recalculateTooltipAndLabel();
this._updateSelector();


g.subscribe('Composer/changedtags',function(r,s){
var t=this._hasEvent;
this._hasEvent=!!s.eventTag;
this._tags=s.withTags.map(function(v){
return v.getText();});


this._taggedIDs=s.withTags.map(function(v){
return v.getValue();});


for(var u in s.mention)
if(s.mention[u].type=='user'&&
s.mention[u].uid!=k.user){
this._tags.push(s.mention[u].text);
this._taggedIDs.push(s.mention[u].uid);}else

if(s.mention[u].type=='event')
this._hasEvent=true;



if(this._hasEvent&&
t!=this._hasEvent)
this._eventTagChanged();


if(this._recalculateTooltipAndLabel()&&
n.isOptionSelected(this._elem)){
this._updateSelector();
g.inform('SelectedPrivacyOption/changed',
this._getChangedData());}}.

bind(this));

n.listen(this._selector,'change',this._updateSelector.bind(this));}


h(p.prototype,

{_eventTagChanged:function(){
},




_getChangedData:function(){

return {hasEvent:this._hasEvent,
tags:this._taggedIDs,
privacy:m.FriendsValue.SELF};},






_recalculateTooltipAndLabel:function(){
var q=this._tooltip,
r=this._label;

if(this._taggedIDs.length){
this._tooltip="Anyone tagged";
this._label="Only Me"+' (+)';}else{

this._tooltip="Only you";
this._label="Only Me";}


i.conditionShow(this._plusLabel,this._taggedIDs.length);

return (q!=this._tooltip)||(r!=this._label);},








_updateSelector:function(){
if(n.isOptionSelected(this._elem)){
n.setButtonLabel(this._selector,this._label);
n.setButtonTooltip(this._selector,this._tooltip);
return false;}


return true;}});




e.exports=p;});

/** js/privacy/audience/FriendsMinusAcquaintancesPrivacyOption.js */
__d("FriendsMinusAcquaintancesPrivacyOption",["Class","OnlyMePrivacyOption","PrivacyConst","CSS","tx","copyProperties"],function(a,b,c,d,e,f){



var g=b('Class'),
h=b('OnlyMePrivacyOption'),
i=b('PrivacyConst'),
j=i.FriendsValue,
k=b('CSS'),
l=b('tx'),
m=b('copyProperties');

function n(o,p){
this._hasRestricted=p;
this.parent.construct(this,o);}


g.extend
(n,
h);


m(n.prototype,
{_getChangedData:function(){

return {hasEvent:this._hasEvent,
tags:this._taggedIDs,
privacy:j.FRIENDS_MINUS_ACQUAINTANCES};},






_recalculateTooltipAndLabel:function(){

var o=this._hasEvent,
p=this._tags.length,
q=this._tooltip,
r=this._label,
s=this._taggedIDs.length||this._hasEvent;

if(o){
if(p>1){
this._tooltip=this._hasRestricted?
"Your friends, friends of anyone tagged and event guests; Except: Acquaintances, Restricted":
"Your friends, friends of anyone tagged and event guests; Except: Acquaintances";}else
if(p==1){
if(this._hasRestricted){
this._tooltip=l._("Your friends, {user}'s friends and event guests; Except: Acquaintances, Restricted",
{user:this._tags[0]});}else 

this._tooltip=l._("Your friends, {user}'s friends and event guests; Except: Acquaintances",
{user:this._tags[0]});}else 


this._tooltip=this._hasRestricted?
"Your friends and event guests; Except: Acquaintances, Restricted":
"Your friends and event guests; Except: Acquaintances";}else 


this._tooltip=this._hasRestricted?
"Friends except Acquaintances, Restricted":
"Friends except Acquaintances";


k.conditionShow(this._plusLabel,s);

this._label=this._elem.getAttribute('data-label');
if(s)
this._label+=' (+)';


return ((q!=this._tooltip)||(r!=this._label));}});



e.exports=n;});

/** js/privacy/audience/FriendsPrivacyOption.js */
__d("FriendsPrivacyOption",["Arbiter","Class","CSS","OnlyMePrivacyOption","PrivacyConst","Selector","tx"],function(a,b,c,d,e,f){



var g=b('Arbiter'),
h=b('Class'),
i=b('CSS'),
j=b('OnlyMePrivacyOption'),
k=b('PrivacyConst'),
l=b('Selector'),
m=b('tx');

function n(o,p){
this._hasRestricted=p;
this.parent.construct(this,o);}


h.extend(n,j);




n.prototype._getChangedData=function(){
return {hasEvent:this._hasEvent,
tags:this._taggedIDs,
privacy:k.FriendsValue.ALL_FRIENDS};};


n.prototype._eventTagChanged=function(){


var o=this._getChangedData();
o.privacy=l.getValue(this._selector);
g.inform('EventTagged/changed',o);};





n.prototype._recalculateTooltipAndLabel=function(){

var o=this._hasEvent,
p=this._tags.length,
q=this._tooltip,
r=this._label;

if(p>2){
if(o){
this._tooltip=this._hasRestricted?
"Your friends, friends of anyone tagged and event guests; Except: Restricted":
"Your friends, friends of anyone tagged and event guests";}else 

this._tooltip=this._hasRestricted?
"Your friends and friends of anyone tagged; Except: Restricted":
"Your friends and friends of anyone tagged";}else

if(p==2){
if(o){
if(this._hasRestricted){
this._tooltip="Your friends, friends of anyone tagged and event guests; Except: Restricted";}else 

this._tooltip="Your friends, friends of anyone tagged and event guests";}else 


if(this._hasRestricted){
this._tooltip=m._("Your friends, {user}'s friends and {user2}'s friends; Except: Restricted ",
{user:this._tags[0],user2:this._tags[1]});}else 

this._tooltip=m._("Your friends, {user}'s friends and {user2}'s friends",
{user:this._tags[0],user2:this._tags[1]});}else


if(p==1){
if(o){
if(this._hasRestricted){
this._tooltip=
m._("Your friends, {user}'s friends and event guests; Except: Restricted",{user:this._tags[0]});}else 

this._tooltip=m._("Your friends, {user}'s friends and event guests",{user:this._tags[0]});}else 


if(this._hasRestricted){
this._tooltip=m._("Your friends and {user}'s friends; Except: Restricted",{user:this._tags[0]});}else 

this._tooltip=m._("Your friends and {user}'s friends",{user:this._tags[0]});}else 



if(o){
this._tooltip=this._hasRestricted?
"Your friends and event guests; Except: Restricted":
"Your friends and event guests";}else 

this._tooltip=this._hasRestricted?
"Your friends; Except: Restricted":
"Your friends";



i.conditionShow(this._plusLabel,this._tags.length);

this._label=this._elem.getAttribute('data-label');
if(this._tags.length||this._hasEvent)
this._label+=' (+)';

return (q!=this._tooltip)||(r!=this._label);};


e.exports=n;});

/** js/privacy/audience/MetaComposerEdDialog.js */











function MetaComposerEdDialog(){}

copyProperties(MetaComposerEdDialog.prototype,
{init:function(a,
b,
c,
d,
e,
f,
g){
MetaComposerEdDialog.timesTagEduShown=c;
MetaComposerEdDialog.timesEventTagEduShown=e;
MetaComposerEdDialog.timesStickyEduShown=g;

if(MetaComposerEdDialog.singleton){
a.destroy();
return;}


MetaComposerEdDialog.singleton=this;
this._dialog=a;


if(f)
Arbiter.subscribe
('composer/mutate',
function(h,i){
this._sendEducationRequest
({sticky_num:MetaComposerEdDialog.timesStickyEduShown},
'/ajax/composer/audience/sticky_education');}.

bind(this));

if(d)
if(e===0){
Arbiter.subscribe
('EventTagged/changed',
function(h,i){
this._sendEducationRequest
({id:"composerTourAudience",
privacy:i.privacy,
event_tag_num:MetaComposerEdDialog.timesEventTagEduShown},
'ajax/events/tagging/user_education',
null);}.

bind(this));
Arbiter.subscribe
(['composer/publish',
'composer/reset'],
function(){
var h=ge("event_tagging_tag_expansion_NUX");
h&&CSS.hide(h);}.
bind(this));}else 

Arbiter.subscribe
('EventTagged/changed',
function(h,i){
this._sendEducationRequest
({ids:i.tags,
from:'AtTagger',
hasEvent:i.hasEvent,
type:i.privacy,
tag_num:MetaComposerEdDialog.timesTagEduShown,
event_tag_num:MetaComposerEdDialog.timesEventTagEduShown},
'ajax/composer/audience/tag_education',
this._handler.bind(this));}.

bind(this));




if(b)
Arbiter.subscribe
('SelectedPrivacyOption/changed',
function(h,i){
this._sendEducationRequest
({ids:i.tags,
from:'WithTagger',
hasEvent:i.hasEvent,
type:i.privacy,
tag_num:MetaComposerEdDialog.timesTagEduShown,
event_tag_num:MetaComposerEdDialog.timesEventTagEduShown},
'/ajax/composer/audience/tag_education',
this._handler.bind(this));}.

bind(this));


Selector.subscribe('open',this._killAnim.bind(this));},


_sendEducationRequest:function(a,b,c){
if(!this._updateDialogContext())
return;

this._async&&this._async.abort();
this._async=new AsyncRequest(b);
this._async.
setData(a).
setHandler(c).
send();},


_updateDialogContext:function(){
var a=DOM.scry(document.body,'div.composerAudienceWrapper'),
b,c;
for(var d=0;d<a.length;d++){
b=a[d];
c=Vector2.getElementPosition(b);
if(b&&c.x>0&&c.y>0){
this._dialog.setContext(b);
return true;}}


return false;},


_handler:function(a){
var b=a.payload;
if(!b||!this._updateDialogContext())
return;


var c=this._dialog.getContent();
DOM.setContent(c,b);
ARIA.announce(DOM.getText(c));

this._dialog.
disableBehavior(LayerDestroyOnHide).
show();


var d=Parent.byClass(c,'metaComposerUserEd');

if(this._anim){
this._anim.stop();
this._anim=animation(d);}else 

this._anim=animation(d).
from('opacity',0);


this._anim.
by('opacity',1).
checkpoint().
duration(3500).
checkpoint().
to('opacity',0).
checkpoint().
ondone(this._killAnim.bind(this)).
go();},


_killAnim:function(a,b){
if(this._anim){
this._anim.stop();
this._dialog.hide(false);
this._anim=null;}}});

/** js/ui/xhp/form/mentions/MentionsInputMatchers.js */
__d("MentionsInputMatchers",[],function(a,b,c,d,e,f){




var g=['@','\\uff20','+','\\uff0b'].join(''),

h='.,*?$|#{}()\\^\\-\\[\\]\\\\\/!%&\'"~=<>_:;',
i='\\b[A-Z][^ A-Z'+h+']',




j='([^'+g+h+']|['+h+'][^ '+h+'])',


k='(?:^|\\s)(?:['+g+']('+j+'{0,20}))',


l='(?:(?:'+i+'+)|'+k+')',


m='(?:'+i+'{4,})',

n=
{trigger:new RegExp('['+g+']$'),
mainMatcher:new RegExp(k+'$'),
autoMatcher:new RegExp(l+'$'),
userMatcher:new RegExp(m+'$')};


e.exports=n;});

/** js/ui/xhp/form/mentions/MentionsInput.js */
__d("MentionsInput",["event-extensions","function-extensions","Arbiter","ArbiterMixin","Class","CSS","DataStore","DOM","HTML","Input","InputSelection","Parent","htmlize","Style","Typeahead","TypeaheadUtil","UserAgent","copyProperties","MentionsInputMatchers"],function(a,b,c,d,e,f){




b('event-extensions');
b('function-extensions');

var g=b('Arbiter'),
h=b('ArbiterMixin'),
i=b('Class'),
j=b('CSS'),
k=b('DataStore'),
l=b('DOM'),
m=b('HTML'),
n=b('Input'),
o=b('InputSelection'),
p=b('Parent'),
q=b('htmlize'),
r=b('Style'),
s=b('Typeahead'),
t=b('TypeaheadUtil'),
u=b('UserAgent'),

v=b('copyProperties'),

w=b('MentionsInputMatchers');

function x
(y,z,aa,ba,ca,da){
k.set(y,'MentionsInput',this);
this._root=y;
this._typeahead=z;




this._input=aa;

var ea=false;



try{ea=document.activeElement===this._input;}catch(
fa){}

if(ea){
this.init.bind(this,ba,ca,da).defer();}else 

var ga=Event.listen(this._input,'focus',function(){
this.init.bind(this,ba,ca,da).defer();
ga.remove();}.
bind(this));}



x.getInstance=function(y){
var z=p.byClass(y,'uiMentionsInput');
return z?k.get(z,'MentionsInput'):null;};


v(x.prototype,h,

{init:function(y,z,aa){
this.init=Function.prototype;
this._initialized=true;

this._highlighter=l.find(this._root,'.highlighter');
this._highlighterInner=this._highlighter.firstChild;
this._highlighterContent=l.find(this._root,'.highlighterContent');
this._hiddenInput=l.find(this._root,'.mentionsHidden');
this._placeholder=this._input.getAttribute('placeholder')||'';
this._maxMentions=y.max||6;
this._metrics=aa;


if(u.firefox()<4){
this._input.blur();
setTimeout(function(){this._input.focus();}.bind(this));}





if(!this._hiddenInput.name){
var ba=this._input.name;
this._input.name=ba+'_text';
this._hiddenInput.name=ba;}

this._initEvents();
this._initTypeahead();
this.reset(z);

this.inform('init',null,g.BEHAVIOR_STATE);},


reset:function(y){
if(!this._initialized)
return;

this._mentioned={};
this._orderedUIDs=[];
this._numMentioned=0;
this._filterData=null;
this._hiddenInput&&(this._hiddenInput.value='');
this._highlighterContent&&l.empty(this._highlighterContent);
this._highlighterAuxContent&&l.remove(this._highlighterAuxContent);
this._highlighterAuxContent=null;
n.setPlaceholder(this._input,this._placeholder);
r.set(this._typeahead.getElement(),'height','auto');

if(y){
n.setValue(this._input,y.flattened);
for(var z in y.mention_data)
this._addToken
({uid:z,
text:y.mention_data[z],
type:'unknown'});}




this._updateTypeahead();
this._updateWidth();
this._update();},


getValue:function(){
return n.getValue(this._input);},


getRawValue:function(){
this._update();
return n.getValue(this._hiddenInput);},


checkValue:function(){
var y=this._typeahead.getCore().getValue();
if(w.trigger.exec(y)||y==='')
this.inform('sessionEnd',{});},



getTypeahead:function(){
return this._typeahead;},


_initEvents:function(){
var y=this._update.bind(this);
Event.listen(this._input,
{input:y,
keyup:y,
change:y,
blur:this._handleBlur.bind(this),
focus:this._handleFocus.bind(this)});


if(this._metrics){
this._metrics._reset();
this._metrics.bindSessionStart(this._typeahead,'render',true);
this._metrics.bindSessionEnd(this._typeahead.getView(),'select',true);
this._metrics.bindSessionEnd(this,'sessionEnd',false);
Event.listen(this._input,'keyup',function(event){
this.checkValue.bind(this).defer();}.
bind(this));}},



_initTypeahead:function(){
this._typeahead.subscribe('select',function(ca,da){
var ea=da.selected;
this._addToken
({uid:ea.uid,
text:ea.text,
type:ea.type});

this.updateValue();}.
bind(this));


var y=this._input,
z=null,
aa=function(){
if(z===null){
z=n.getSubmitOnEnter(y);
n.setSubmitOnEnter(y,false);}},


ba=function(){
if(z!==null){
n.setSubmitOnEnter(y,z);
z=null;}};


this._typeahead.subscribe('render',aa);
this._typeahead.subscribe('reset',ba);
this._typeahead.subscribe('highlight',function(ca,da){
da.index>=0?aa():ba();});

this._typeahead.subscribe('query',function(){
this._filterData=null;}.
bind(this));

this._typeahead.getCore().suffix='';
this._handleFocus();},


_handleBlur:function(){
if(this._filterToken){
this._filterToken.remove();
this._filterToken=null;}},



_handleFocus:function(){
if(!this._filterToken)
this._filterToken=
this._typeahead.getData().addFilter(this._filterResults.bind(this));

this._updateWidth();},


_filterResults:function(y){
if(this._filterData===null){
var z=o.get(this._input).start||0;
for(var aa=0;aa<this._offsets.length;aa++){
var ba=this._offsets[aa];
if(z>ba[0]&&z<=ba[1]){
this._filterData={caretIsInsideMention:true};
return false;}}



var ca=this._typeahead.getCore();
this._filterData=
{value:ca.getValue(),
rawValue:ca.getRawValue()};}




if(this._filterData.caretIsInsideMention)
return false;



if(w.mainMatcher.test(this._filterData.rawValue))
return true;




if(y.type!='user')
return false;




if(w.userMatcher.test(this._filterData.value))
return true;




return t.isExactMatch
(this._filterData.value,
this._typeahead.getData().getTextToIndex(y));},





_addToken:function(y){
var z=y.uid;
if(!this._mentioned.hasOwnProperty(z)){
this._mentioned[z]=y;
this._orderedUIDs.push(z);
this._numMentioned++;
this._updateTypeahead();}},



_removeToken:function(y){
if(this._mentioned.hasOwnProperty(y)){
delete this._mentioned[y];
this._orderedUIDs.remove(y);
this._numMentioned--;
this._updateTypeahead();}},



_reduceToken:function(y,z){
var aa=z.split(' '),
ba=[];

for(var ca=0;ca<aa.length;ca++)
if(y.indexOf(aa[ca])!=-1)
ba.push(aa[ca]);


aa=ba;


for(ca=1;ca<aa.length;ca++)
for(var da=1;da<aa[ca-1].length+1;da++)
if(y.indexOf(aa[ca-1].substr(0,da)+aa[ca])!=-1)
aa.splice(ca-1,1);





while(y.indexOf(aa.join(' '))==-1)
aa.splice(0,1);


return aa.join(' ');},


_update:function(){
var y=this.getValue();
if(y==this._value)return;


this._updateTokens();
this.updateValue();
this._updateDirection();},


_updateTokens:function(){
var y=this.getValue(),
z=false;
for(var aa=0;aa<this._orderedUIDs.length;++aa){
var ba=this._orderedUIDs[aa],
ca=this._mentioned[ba],
da=ca.text,
ea;

if(ca.type=='user'&&
(ea=this._reduceToken(y,da))!==''){










if(ea==da.substring(0,da.lastIndexOf(' '))&&
y==this._value.substring(0,this._value.length-1)){
y=y.substring(0,y.lastIndexOf(' '));
z=true;}


ca.text=ea;}else

if(!da||
y.indexOf(da)==-1||
typeof da!=='string')
this._removeToken(ba);}



this._value=y;
if(z)

n.setValue(this._input,y);},



updateValue:function(){
var y=this.getValue(),
z=this._orderedUIDs,
aa=[],
ba,ca,da,ea;





for(ea=0;ea<z.length;++ea){
ca=this._mentioned[z[ea]].text;
y=y.replace(ca,function(fa,ga){
aa.push([ga,ga+ca.length]);
return ca;});}





for(ea=0;ea<z.length;++ea){
da=z[ea];
ca=this._mentioned[da].text;
y=y.replace(ca,'@['+da+':]');}




ba=q(y);
for(ea=0;ea<z.length;++ea){
da=z[ea];
ca=this._mentioned[da].text;
ba=ba.replace('@['+da+':]','<b>'+q(ca)+'</b>');
ca=ca.replace(/[\\\]:]/g,function(fa){return '\\'+fa;});
y=y.replace('@['+da+':]','@['+da+':'+ca+']');}


if(u.ie()){

ba=ba.replace(/ {2}/g,'&nbsp;<wbr />&nbsp;<wbr />');




ba=ba.replace(/ (?=[^\/]|\/[^>])/g,'&nbsp;<wbr />');}


this._offsets=aa;
this._hiddenInput.value=y;
l.setContent(this._highlighterContent,m(ba));

this._updateHighlighter();
this._updateHeight();},


_updateDirection:function(){
var y=r.get(this._input,'direction');
if(y==this._dir)return;
this._dir=y;
r.set(this._highlighter,'direction',y);
if(y=='rtl'){
r.set(this._highlighter,'text-align','right');}else 

r.set(this._highlighter,'text-align','left');},



_updateWidth:function(){


var y=r.getFloat.curry(this._input),
z=this._input.offsetWidth-
y('paddingLeft')-
y('paddingRight')-
y('borderLeftWidth')-
y('borderRightWidth');

if(u.firefox())



z-=2;


if(u.ie()<=7){



z-=r.getFloat(this._highlighterInner,'paddingLeft');



this._highlighter.style.zoom=1;}

this._highlighterInner.style.width=Math.max(z,0)+'px';},


_updateHeight:function(){



if(this._highlighterAuxContent){
var y=this._highlighter.offsetHeight,
z=this._typeahead.getElement();
if(y>z.offsetHeight){
r.set(z,'height',y+'px');
g.inform('reflow');}}},




_updateTypeahead:function(){
var y=this._typeahead.getCore(),
z=null;
if(!this._maxMentions||this._numMentioned<this._maxMentions)
z=w.autoMatcher;

y.matcher=z;
y.setExclusions(this._orderedUIDs);
this.inform('update',{mentioned:this._mentioned});},


setPlaceholder:function(y){
this._placeholder=y;



if(!this.hasAuxContent())
n.setPlaceholder(this._input,y);},








_updateHighlighter:function(){
if(this._highlighterContent)
j.conditionShow
(this._highlighterContent,
this._numMentioned>0||this.hasAuxContent());},














setAuxContent:function(y){
if(this._highlighterContent){
if(!this._highlighterAuxContent){
this._highlighterAuxContent=l.create('span',
{className:'highlighterAuxContent'});

l.insertAfter(this._highlighterContent,this._highlighterAuxContent);}

l.setContent(this._highlighterAuxContent,y);
if(y){
n.setPlaceholder(this._input,'');}else 

n.setPlaceholder(this._input,this._placeholder);

this._updateHighlighter();
this._updateHeight();}},



hasAuxContent:function(){
var y=this.getAuxContentRoot();
return y&&y.innerHTML.length>0;},


getAuxContentRoot:function(){
return this._highlighterAuxContent;},






addMention:function(y){
var z=this.getValue();
n.setValue(this._input,z+" "+y.text);
this._addToken(y);
this._update();},


getMentions:function(){
return this._mentioned;}});




e.exports=x;});

/** js/ufi/modules/UFIUpdate.js */
__d("UFIUpdate",["CommentPrelude","CSS","DOM","DOMQuery","HTML","MentionsInput","Parent","ScrollableArea","ScrollAwareDOM"],function(a,b,c,d,e,f){



var g=b('CommentPrelude'),
h=b('CSS'),
i=b('DOM'),
j=b('DOMQuery'),
k=b('HTML'),
l=b('MentionsInput'),
m=b('Parent'),
n=b('ScrollableArea'),
o=b('ScrollAwareDOM'),

p=
{expandFeedback:function(q,r,s){
i.scry(q,r).forEach(function(t){
g.expand(t,s);});},



uncollapseFeedback:function(q){
g.uncollapse
(m.byTag
(i.find(q,'.fbUfi'),
'form'));},




multiContentReplaceGlobal:function(q,r){
this.multiContentReplace(document.documentElement,q,r);},


multiContentReplace:function(q,r,s){
s=s instanceof k?s.getRootNode():s;
i.scry(q,r).forEach(function(t){
o.replace(t,s.cloneNode(true));});},





refocusCommentBox:function(q,r){
var s=i.find(q,'textarea');
s.value=s.style.height="";

if(r){



s.blur();
s.focus.defer();}else 

document.documentElement.onfocusin({target:s});},



resetMentionsInput:function(q){
var r=l.getInstance
(i.find(q,'div.uiMentionsInput'));

r&&r.reset();},


insertAtBottom:function(q,r,s,t){
var u=i.scry(q,'.comment_'+s).length;
if(r)
u+=i.scry(q,'#'+r).length;


if(!u){
var v=i.find(q,'.commentList'),
w=n.getInstance(v),
x=w&&w.isScrolledToBottom();

o.appendContent(v,t);
x&&w.scrollToBottom(false);}},



updateUnsubscribeLink:function(q,r){
var s=i.scry(q,'.unsub_link')[0];
if(s){
i.replace(s,r);}else
if(r)
i.insertAfter
(i.find(q,'.comment_link'),
[" \xB7 ",r]);},



updateSeenCount:function(q){



j.scry(q,'.uiUfiSeenBar').forEach(function(t){
h.hide(t);});

j.scry(q,'.uiUfiViewSeenCount').forEach(function(t){
h.hide(t);});


var r=j.scry(q,'.uiUfiLike')[0];
if(r&&r.childNodes.length===0)


r=null;


r=r||j.scry(q,'.uiUfiSeenBar')[0];

if(!r)
return;


var s=j.scry(r,'.uiUfiViewSeenCount')[0];
if(!s)
return;

h.show(s);
h.show(r);}};



e.exports=p;});

/** js/ui/xhp/form/mentions/MentionsTypeaheadAreaView.js */
__d("MentionsTypeaheadAreaView",["Class","ContextualTypeaheadView","Parent","copyProperties"],function(a,b,c,d,e,f){



var g=b('Class'),
h=b('ContextualTypeaheadView'),
i=b('Parent'),

j=b('copyProperties');

function k(l,m){
this.parent.construct(this,l,m);}


g.extend(k,h);

j(k.prototype,
{getContext:function(){
return i.byClass(this.element,'uiMentionsInput');}});



e.exports=k;});

/** js/ui/xhp/form/mentions/mentions-input.js */
__d("legacy:MentionsInput",["MentionsInput"],function(a,b,c,d){



a.MentionsInput=b('MentionsInput');},

3);

/** js/ui/xhp/overlay/hover_flyout.js */
__d("HoverFlyout",["event-extensions","ArbiterMixin","Class","DataStore","LayerDestroyOnHide","copyProperties"],function(a,b,c,d,e,f){








b('event-extensions');

var g=b('ArbiterMixin'),
h=b('Class'),
i=b('DataStore'),
j=b('LayerDestroyOnHide'),

k=b('copyProperties');

function l(m,n,o,p){
if(m){
this._showDelay=o;
this._hideDelay=p;
this.init(m);
if(n)
this.initNode(n);}}




k(l.prototype,g,

{init:function(m){
this._flyout=m;
this._showDelay=this._showDelay||0;
this._hideDelay=this._hideDelay||100;
this._showTimeout=null;
this._hideTimeout=null;
this._flyoutSubscriptions=
[this._flyout.subscribe
('mouseenter',
this._onFlyoutMouseEnter.bind(this)),

this._flyout.subscribe
('mouseleave',
this.hideFlyout.shield(this))];


this._nodes=[];
this._dataStoreUnique='HoverFlyout_'+Date.now()+'_listeners';
this._flyout.disableBehavior(j);
return this;},


initNode:function(m){

if(this._nodes.contains(m))
return this;

this._nodes.push(m);
i.set
(m,
this._dataStoreUnique,

[Event.listen
(m,
'mouseenter',
this._onNodeMouseEnter.bind(this,m)),

Event.listen(m,'mouseleave',this.hideFlyout.shield(this))]);


return this;},


deactivateNode:function(m){
var n=i.get(m,this._dataStoreUnique);
if(n)
while(n.length)
n.pop().remove();


this._nodes.remove(m);},






setShowDelay:function(m){
this._showDelay=m;
return this;},






setHideDelay:function(m){
this._hideDelay=m;
return this;},


showFlyout:function(m,n){
this.setActiveNode(m);

if(n){
this._flyout.setContext(m).show();
this.inform('show',m);}else 

this._showTimeout=
this.showFlyout.bind(this,m,true).defer(this._showDelay);

return this;},


hideFlyout:function(m){
clearTimeout(this._showTimeout);
if(m){
this._flyout.hide();
this._activeNode&&this.inform('hide',this._activeNode);
this._activeNode=null;}else 

this._hideTimeout=
this.hideFlyout.bind(this,true).defer(this._hideDelay);},



hideFlyoutDelayed:function(m){
clearTimeout(this._showTimeout);
clearTimeout(this._hideTimeout);
this._hideTimeout=this.hideFlyout.bind(this,true).defer(m);},







getActiveNode:function(){
return this._activeNode;},


setActiveNode:function(m){
clearTimeout(this._hideTimeout);
if(this._activeNode&&this._activeNode!==m)
this.hideFlyout(true);

this._activeNode=m;
return this;},


clearNodes:function(){
for(var m=this._nodes.length;m>0;m--)
this.deactivateNode(this._nodes[m-1]);},



destroy:function(){
while(this._flyoutSubscriptions.length)
this._flyout.unsubscribe(this._flyoutSubscriptions.pop());

this.clearNodes();},


_onNodeMouseEnter:function(m){
if(this._activeNode===m){
clearTimeout(this._hideTimeout);}else 

this.showFlyout(m);},



_onFlyoutMouseEnter:function(){
clearTimeout(this._hideTimeout);}});



e.exports=a.HoverFlyout||l;});

/** js/ui/xhp/typeahead/TypeaheadAreaCore.js */
__d("TypeaheadAreaCore",["Class","InputSelection","TypeaheadCore","copyProperties","emptyFunction"],function(a,b,c,d,e,f){






var g=b('Class'),
h=b('InputSelection'),
i=b('TypeaheadCore'),

j=b('copyProperties'),
k=b('emptyFunction');

function l(m){
this.parent.construct(this,m);
this.matcher=new RegExp(this.matcher+'$');
this.preventFocusChangeOnTab=true;}


g.extend(l,i);

j(l.prototype,

{prefix:'',

suffix:', ',

matcher:"\\b[^,]*",


click:k,

select:function(m){
this.parent.select(m);

var n=this.element.value,
o=this.prefix+m.text+this.suffix;

this.expandBounds(n,o);

var p=n.substring(0,this.start),
q=n.substring(this.end);

this.element.value=p+o+q;
h.set(this.element,p.length+o.length);},







expandBounds:function(m,n){
m=m.toLowerCase().trim();
n=n.toLowerCase();
var o,p,q,r,
s=/\s/;

p=m.substring(this.start,this.end);
q=n.indexOf(p);
o=this.start;

while(o>=0&&q>=0){
r=m.charAt(o-1);
if(!r||s.test(r))
this.start=o;

p=r+p;
q=n.indexOf(p);
o--;}


p=m.substring(this.start,this.end);
q=n.indexOf(p);
o=this.end;

while(o<=m.length&&q>=0){
r=m.charAt(o);
if(!r||s.test(r))
this.end=o;

p=p+r;
q=n.indexOf(p);
o++;}},



getRawValue:function(){
var m=h.get(this.element).start||0;
return this.parent.getValue().substring(0,m);},


getValue:function(){
var m=this.matcher&&this.matcher.exec(this.getRawValue());
if(!m)return '';

var n=m[0],
o=m.index+n.length;

n=n.replace(/^\s/,'');
var p=n.length;
n=n.replace(/\s$/,'');
var q=p-n.length;

this.start=o-p;
this.end=o+q;

return m[1]||m[0];}});




e.exports=l;});

/** js/ui/xhp/typeahead/TypeaheadMetrics.js */
__d("TypeaheadMetrics",["event-extensions","AsyncRequest","Typeahead","copyProperties","emptyFunction"],function(a,b,c,d,e,f){





b('event-extensions');

var g=b('AsyncRequest'),
h=b('Typeahead'),

i=b('copyProperties'),
j=b('emptyFunction');

function k(l){
this.extraData={};
i(this,l);}


i(k.prototype,


{endPoint:'/ajax/typeahead/record_basic_metrics.php',

init:function(l){
this.init=j;
this.core=l.getCore();
this.view=l.getView();
this.data=l.getData();
this.stats={};
this.sessionActive=false;
this._sessionStartEvents=[];
this._sessionEndEvents=[];

this._reset();
this.initEvents();},





_reset:function(){
this.stats={};
this.avgStats={};
this.sessionActive=false;
this.sid=Math.floor(Date.now()*Math.random());
this.data.setQueryData({sid:this.sid});},


recordSelect:function(l){
var m=l.selected;
if(m.uid==null){
this.recordStat('selected_id','SELECT_NULL');}else 

this.recordStat('selected_id',m.uid);

this.recordStat('selected_type',m.type);
this.recordStat('selected_position',l.index);
this.recordStat('selected_with_mouse',l.clicked?1:0);
this._sessionEnd();},










bindSessionStart:function(l,event,m){
if(m)
for(var n=0;n<this._sessionStartEvents.length;++n){
var o=this._sessionStartEvents[n];
o.obj.unsubscribe(o.token);}



this._sessionStartEvents.push
({obj:l,
token:l.subscribe(event,function(p,q){
this._sessionStart();}.
bind(this))});},











bindSessionEnd:function(l,event,m){
if(m)
for(var n=0;n<this._sessionEndEvents.length;++n){
var o=this._sessionEndEvents[n];
o.obj.unsubscribe(o.token);}



this._sessionEndEvents.push
({obj:l,
token:l.subscribe(event,function(p,q){
this._sessionEnd();}.
bind(this))});},



initEvents:function(){
this.bindSessionStart(this.core,'focus',false);
this.bindSessionEnd(this.core,'blur',false);

this.view.subscribe('select',function(l,m){
this.recordSelect(m);}.
bind(this));
this.bindSessionEnd(this.view,'select',false);

this.view.subscribe('render',function(l,m){
this.results=m;}.
bind(this));

this.data.subscribe('beforeQuery',function(l,m){
if(!m.value)return;
this.query=m.value;
this.recordCountStat('num_queries');}.
bind(this));


this.data.subscribe('beforeFetch',function(l,m){
if(m.fetch_context.bootstrap){
this.bootstrapBegin=Date.now();}else 

m.fetch_context.queryBegin=Date.now();}.

bind(this));


this.data.subscribe('fetchComplete',function(l,m){
if(m.fetch_context.bootstrap){
this.recordAvgStat('bootstrap_latency',
Date.now()-this.bootstrapBegin);

var n={};
m.response.payload.entries.forEach(function(o){
if(!n[o.type]){
n[o.type]=1;}else 

n[o.type]++;});



this.recordStat('bootstrap_response_types',n);

this.bootstrapped=true;}else 

this.recordAvgStat('avg_query_latency',
Date.now()-m.fetch_context.queryBegin);}.

bind(this));

this.data.subscribe('dirty',function(l,m){
this.bootstrapped=false;});},



_sessionStart:function(){
if(this.sessionActive)return;
this.sessionActive=true;},


_sessionEnd:function(){
if(!this.sessionActive)return;
this.sessionActive=false;

this.submit();
this._reset();},


recordStat:function(l,m){
this.stats[l]=m;},


recordCountStat:function(l){
var m=this.stats[l];
this.stats[l]=m?m+1:1;},


recordAvgStat:function(l,m){
if(this.avgStats[l]){
this.avgStats[l][0]+=m;
++this.avgStats[l][1];}else 

this.avgStats[l]=[m,1];},






submit:function(){
if(Object.keys(this.stats).length){
i(this.stats,this.extraData);

if(this.results){
var l=(this.results).map(function(o,p){
return o.uid;});

this.recordStat('candidate_results',JSON.stringify(l));}


if(this.query)
this.recordStat('query',this.query);


if(this.sid)
this.recordStat('sid',this.sid);


if(this.bootstrapped)
this.recordStat('bootstrapped',1);


for(var m in this.avgStats){
var n=this.avgStats[m];
this.stats[m]=n[0]/n[1];}


new g().
setURI(this.endPoint).
setMethod('POST').
setData({stats:this.stats}).
send();
this._reset();}}});




k.register=function(l,m,n){
if(document.activeElement===l){
m.init(n);}else 

var o=Event.listen(l,'focus',function(){
m.init(n);
o.remove();});};




e.exports=k;});

/** js/ui/xhp/typeahead/behaviors/TypeaheadHoistFriends.js */
__d("TypeaheadHoistFriends",["copyProperties"],function(a,b,c,d,e,f){



var g=b('copyProperties');

function h(i){
this._typeahead=i;}


g(h.prototype,
{_subscription:null,

enable:function(){
var i=this._typeahead.getView();
this._subscription=
i.subscribe('beforeRender',function(j,k){
var l=[],
m=[];

for(var n=0;n<k.results.length;++n){
var o=k.results[n];
if(o.type=='user'&&o.bootstrapped){
m.push(o);}else 

l.push(o);}



k.results=m.concat(l);});},



disable:function(){
this._typeahead.getView().unsubscribe(this._subscription);
this._subscription=null;}});




e.exports=h;});

/** js/ui/xhp/typeahead/behaviors/LegacyHoistFriendsTypeaheadBehavior.js */
__d("legacy:HoistFriendsTypeaheadBehavior",["TypeaheadHoistFriends"],function(a,b,c,d){



var e=b('TypeaheadHoistFriends');

if(!a.TypeaheadBehaviors)a.TypeaheadBehaviors={};
a.TypeaheadBehaviors.hoistFriends=function(f){
f.enableBehavior(e);};},


3);

/** js/deprecated/UIControllerRegistry.js */
__d("legacy:UIControllerRegistry",[],function(a,b,c,d){



a.__UIControllerRegistry=a.__UIControllerRegistry||{};},

3);

/** js/modules/MenuX.js */
__d("MenuX",["event-extensions","Class","copyProperties","CSS","DataStore","DOM","HTML","Keys","Parent","PopoverMenuInterface","ScrollableArea","Style","UserAgent"],function(a,b,c,d,e,f){




b('event-extensions');

var g=b('Class'),
h=b('copyProperties'),
i=b('CSS'),
j=b('DataStore'),
k=b('DOM'),
l=b('HTML'),
m=b('Keys'),
n=b('Parent'),
o=b('PopoverMenuInterface'),
p=b('ScrollableArea'),
q=b('Style'),
r=b('UserAgent');

function s(t,u,v,w){
this.parent.construct(this);
this._id=t;
this._className=u;
this._items=[];
for(var x=0;x<v.length;x++)
this._items[x]=new v[x].ctor(v[x]);

this._config=w;}


g.extend(s,o);
h(s.prototype,
{_focused:null,
_root:null,

addItem:function(t){
this._items.push(t);

if(this._root)
this._insertItem(t);},



getRoot:function(){
if(!this._root)
this._render();

return this._root;},


onShow:function(){
if(this._config.maxheight)
if(!this._scrollableArea){
q.set
(this._scrollableElems.root,
'width',
this._scrollableElems.body.offsetWidth+'px');


this._scrollableArea=
p.fromNative(this._scrollableElems.root,{fade:true});
q.set
(this._scrollableElems.wrap,
'max-height',
this._config.maxheight+'px');}else{


q.set(this._scrollableElems.root,'width','');
q.set(this._scrollableElems.content,'width','');
if(r.ie()<=7){
q.set
(this._scrollableElems.root,
'width',
this._scrollableElems.content.offsetWidth+'px');}else 

q.set
(this._scrollableElems.root,
'width',
this._scrollableElems.content.offsetWidth+'px');

this._scrollableArea.resize();}},




onHide:function(){
this.blur();},


focusAnItem:function(){
return this._attemptFocus(0,1);},


blur:function(){
if(this._focused){
this._focused.blur();
this._focused=null;
this.inform('blur');}},



handleKeydown:function(t){
var u=this._items.indexOf(this._focused);
switch(t){

case m.UP:
case m.DOWN:
var v=t===m.UP?-1:1;
if(u!==-1){
return this._attemptFocus(u+v,v);}else 

if(t===m.UP){
return this._attemptFocus(this._items.length-1,-1);}else 

return this._attemptFocus(0,1);


break;
case m.SPACE:
if(this._items.indexOf(this._focused)!==-1){
this._handleItemClick(this._focused);
return true;}

return false;



default:var w=String.fromCharCode(t).toLowerCase(),
x;

for(var y=u+1;y<this._items.length;y++){
x=this._items[y].getAccessKey();
if(x&&x.charAt(0).toLowerCase()===w)
if(this._focusItem(this._items[y]))
return true;}



return false;
}},


_render:function(){
this._ul=k.create('ul',{className:'uiMenuX'});
this._ul.setAttribute('role','menu');

this._items.forEach(this._insertItem.bind(this));

Event.listen(this._ul,'click',this._handleClick.bind(this));
Event.listen(this._ul,'mouseover',this._handleMouseOver.bind(this));
Event.listen(this._ul,'mouseout',this._handleMouseOut.bind(this));

var t=this._ul;
if(this._config.maxheight){
this._scrollableElems=p.renderDOM();
k.setContent(this._scrollableElems.content,this._ul);
t=this._scrollableElems.root;}




var u=
'uiMenuXWrapper'+(this._className?' '+this._className:'');
this._root=
k.create('div',{className:u},
k.create('div',{className:'uiMenuXBorder'},t));
this._id&&this._root.setAttribute('id',this._id);},


_handleClick:function(t){
var u=this._getItemInstance(t.getTarget());
if(u)
return this._handleItemClick(u);},



_handleItemClick:function(t){
this.inform('itemclick',t);
if(t.hasAction())
this.done();

return t.handleClick();},


_handleMouseOver:function(t){
var u=this._getItemInstance(t.getTarget());
u&&this._focusItem(u);},


_handleMouseOut:function(t){
var u=this._getItemInstance(t.getTarget());
if(u&&this._focused===u)
this.blur();},



_insertItem:function(t){
var u=t.getRoot();
i.addClass(u,'__MenuXItem');
j.set(u,'MenuXItem',t);
k.appendContent(this._ul,u);},











_attemptFocus:function(t,u){
var v=this._items[t];
if(v)
if(this._focusItem(v)){
return true;}else 

return this._attemptFocus(t+u,u);


return false;},





_focusItem:function(t){
if(t.focus()!==false){
if(this._focused!==t){
this.blur();
this._focused=t;
this.inform('focus');}

return true;}

return false;},





_getItemInstance:function(t){
var u=n.byClass(t,'__MenuXItem');
return u?j.get(u,'MenuXItem'):null;}});



e.exports=s;});

/** js/modules/MenuXSelectableItem.js */
__d("MenuXSelectableItem",["Class","copyProperties","CSS","MenuXItem"],function(a,b,c,d,e,f){



var g=b('Class'),
h=b('copyProperties'),
i=b('CSS'),
j=b('MenuXItem');

function k(l){
this.parent.construct(this,l);}


g.extend(k,j);

h(k.prototype,
{_selected:false,

getLabel:function(){
return this._data.label;},


getIcon:function(){
return this._data.icon;},


isSelected:function(){
return this._selected;},


select:function(){
i.addClass(this._root,'checked');
this._selected=true;},


deselect:function(){
i.removeClass(this._root,'checked');
this._selected=false;},


render:function(){
var l=this.parent.render();
if(this._data.selected){
i.addClass(l,'checked');
this._selected=true;}

return l;}});



e.exports=k;});

/** js/modules/core/escapeRegex.js */
__d("escapeRegex",[],function(a,b,c,d,e,f){







function g(h){

return h.replace(/([.?*+\^$\[\]\\(){}|\-])/g,"\\$1");}


e.exports=g;});

/** js/ui/xhp/tokenizer/behaviors/FreeformTokenizerBehavior.js */
__d("FreeformTokenizerBehavior",["Input","Keys","event-extensions","function-extensions"],function(a,b,c,d,e,f){



var g=b('Input'),
h=b('Keys');

b('event-extensions');
b('function-extensions');

















function i(j,k){
var l=k.tokenize_on_blur!==false,
m=k.tokenize_on_paste!==false,
n=k.matcher&&new RegExp(k.matcher,'i');

function o(event){
var p=g.getValue(j.getInput()).trim();
if(p&&(!n||n.test(p))){
var q={uid:p,text:p,freeform:true};
j.addToken(j.createToken(q));
if(event){
j.getTypeahead().getCore().afterSelect();
event.kill();}}}




j.subscribe('keydown',function(p,q){
var event=q.event,
r=Event.getKeyCode(event);
if(r==h.COMMA||r==h.RETURN){
var s=j.getTypeahead().getView();
if(s.getSelection()){
s.select();
event.kill();}else 

o(event);}});




j.subscribe('paste',function(p,q){
if(m)
o.bind(null,q.event).defer(20);});



j.subscribe('blur',function(p,q){
if(l)
o();

j.getTypeahead().getCore().reset();});}



e.exports=i;});

/** js/mercury/data_source/MercuryDataSources.js */
__d("MercuryDataSources",[],function(a,b,c,d,e,f){



var g={},

h=
{add:function(i,j){
g[i]=j;},


get:function(i){
!g[i];






return g[i];}};



e.exports=h;});

/** js/mercury/clients/web_messenger/WebMessengerSubscriptionsHandler.js */
__d("WebMessengerSubscriptionsHandler",["SubscriptionsHandler"],function(a,b,c,d,e,f){





var g=b('SubscriptionsHandler'),

h=new g('webmessenger');
e.exports=h;});

/** js/mercury/renderers/MercuryListUpdateRenderer.js */
__d("MercuryListUpdateRenderer",["DOM","ge"],function(a,b,c,d,e,f){



var g=b('DOM'),
h=b('ge'),

i=














{updateList:
function(j,
k,
l,
m,
n){

var o=[];
for(var p=0;p<k.length;p++){
if(n){
var q=n(p);
q&&o.push(q);}

var r=h(k[p]);
if(r&&l(p)){
o.push(r);}else 

o.push(m(p));}


g.setContent(j,o);}};



e.exports=i;});

/** js/modules/FileForm.js */
__d("FileForm",["event-extensions","ArbiterMixin","AsyncRequest","AsyncUploadRequest","AsyncResponse","BehaviorsMixin","DataStore","DOMQuery","Env","Form","JSONPTransport","Parent","URI","copyProperties"],function(a,b,c,d,e,f){



b('event-extensions');

var g=b('ArbiterMixin'),
h=b('AsyncRequest'),
i=b('AsyncUploadRequest'),
j=b('AsyncResponse'),
k=b('BehaviorsMixin'),
l=b('DataStore'),
m=b('DOMQuery'),
n=b('Env'),
o=b('Form'),
p=b('JSONPTransport'),
q=b('Parent'),
r=b('URI'),

s=b('copyProperties');





function t(v){
var w={},
x=m.scry(v,'input[type="file"]');
x.forEach(function(y){
w[y.name]=y.files;});

return w;}


function u(v,w,x){
if(v.getAttribute('rel')==='async')
throw new Error('FileForm cannot be used with Primer forms.');

if(v.getAttribute('method').toUpperCase()!=='POST')
throw new Error('FileForm must be used with POST forms.');


this._form=v;
this._previousEncoding=this._form.enctype;
this._form.enctype=this._form.encoding='multipart/form-data';

w&&this.enableBehaviors(w);

this._options=x||{};
this.setAllowCrossOrigin(this._options.allowCrossOrigin);
this.setUploadInParallel(this._options.uploadInParallel);

this._listener=Event.listen(this._form,'submit',this._submit.bind(this));
l.set(this._form,'FileForm',this);}


s(u,
{EVENTS:['submit','initial','progress','success','failure'],

getInstance:function(v){
return l.get(v,'FileForm');}});



s(u.prototype,g,k,

{getRoot:function(){
return this._form;},





setAllowCrossOrigin:function(v){
this._allowCrossOrigin=!!v;
return this;},






setUploadInParallel:function(v){
this._uploadInParallel=!!v;
return this;},


_submit:function(event){
if(this.inform('submit')===false){
event.prevent();
return;}


var v='FormData' in window;
if(v)
if(!r(this._form.action).isSameOrigin()&&!this._allowCrossOrigin){
emptyFunction
('Attempted to submit a FileForm via XHR to a different domain '+
'without explicitly allowing cross-domain requests; falling back '+
'to iframe transport. See: http://fburl.com/cors');

v=false;}



return v?this._sendViaXHR(event):this._sendViaFrame(event);},


_sendViaFrame:function(event){



var v=this._request=new h();
v.setStatusElement(this._getStatusElement());
v.addStatusIndicator();
v.setOption('useIframeTransport',true);
var w=v.handleResponse.bind(v),

x=new p('iframe',this._form.action,w),

y=x.getTransportFrame(),
z=x.getRequestURI().addQueryData
({__iframe:true,
__user:n.user});


this._form.setAttribute('action',z.toString());
this._form.setAttribute('target',y.name);

v.setJSONPTransport(x);
v.setURI(z);
v.setHandler(this.success.bind(this,null));
v.setErrorHandler(this.failure.bind(this,null));
v.setInitialHandler(this.initial.shield(this,null));},




_sendViaXHR:function(event){
var v;

if(this._uploadInParallel&&i.isSupported()){
v=new i().
setData(o.serialize(this._form)).
setFiles(t(this._form));
var w=
[v.subscribe('progress',function(x,y){
this.progress(y,y.getProgressEvent());}.
bind(this)),
v.subscribe('initial',function(x,y){
this.initial(y,y.getResponse());}.
bind(this)),
v.subscribe('success',function(x,y){
this.success(y,y.getResponse());}.
bind(this)),
v.subscribe('failure',function(x,y){
this.failure(y,y.getResponse());
return false;}.
bind(this)),
v.subscribe('complete',function(){
while(w.length)
w.pop().unsubscribe();})];}else 




v=new h().
setRawData(o.createFormData(this._form)).
setHandler(this.success.bind(this,null)).
setErrorHandler(this.failure.bind(this,null)).
setUploadProgressHandler(this.progress.bind(this,null)).
setInitialHandler(this.initial.shield(this,null));


v.
setAllowCrossOrigin(this._allowCrossOrigin).
setRelativeTo(this._form).
setStatusElement(this._getStatusElement()).
setURI(this._form.action).
send();

this._request=v;


event.prevent();},


initial:function(v){
return this.inform('initial',{upload:v});},





success:function(v,w){
var x={response:w,upload:v};
if(this.inform('success',x)!==false)
Event.fire(this._form,'success',x);

this._cleanup();},


failure:function(v,w){
var x={response:w,upload:v};
if(this.inform('failure',x)!==false)
if(Event.fire(this._form,'error',x)!==false)
j.defaultErrorHandler(w);


this._cleanup();},


progress:function(v,event){
this.inform('progress',{event:event,upload:v});},


abort:function(){
if(this._request){
this._request.abort();
this._cleanup();}},



destroy:function(){
this._cleanup();
this._listener.remove();
this._listener=null;
this._form.enctype=this._form.encoding=this._previousEncoding;
l.remove(this._form,'FileForm');},


_cleanup:function(){
this._request=null;},


_getStatusElement:function(){
return q.byClass(this._form,'stat_elem')||this._form;}});




e.exports=u;});

/** js/lib/ui/error_dialog.js */
__d("legacy:error-dialog",["ErrorDialog"],function(a,b,c,d){



var e=b('ErrorDialog');
a.ErrorDialog=e;},

3);
