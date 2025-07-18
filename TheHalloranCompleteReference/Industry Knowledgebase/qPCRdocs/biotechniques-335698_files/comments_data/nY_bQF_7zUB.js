/*1347575072,178142511*/

if (window.CavalryLogger) { CavalryLogger.start_js(["8PKAL"]); }

/** js/connect/third_party_auth/oauth_login.js */










OauthLogin=function(a,b){
this.provider=a;
this.endpoint=b;
return this;};










OauthLogin.prototype.login=function(a,
b,
c){
var d=
WindowComm.makeHandler(function(g){
this._closePopup();
var h=
this.provider+'..'+
g.oauth_token+'..'+
g.oauth_token_secret;


setCookie('tpa',h,0,'/');
if(c)
OauthLogin._refreshLoginStatus();


a&&a();}.
bind(this)),

e=
WindowComm.makeHandler(function(g){
this._closePopup();

new Dialog().
setTitle("Ruh roh!").
setBody(tx._("We're having trouble talking to {provider}.\u003Cbr \/>Either login to Facebook directly or try again later.",
{provider:this.provider})).
setHandler(function(){
b&&b();}).

setButtons(Dialog.OK).
show();}.
bind(this)),

f=new URI(this.endpoint);

f.setQueryData
({provider:this.provider,
next:d,
channel_url:e,
cancel_url:e,
display:'popup'});


this._popup=PopupResizer.open(f.toString(),416,468);};


OauthLogin.prototype._closePopup=function(){
if(this._popup){
this._popup.close();
this._popup=null;}};



OauthLogin._refreshLoginStatus=function(){

try{XD.send({type:'refreshThirdPartyAuthStatus'});}catch(
a){
window.location.reload();}};

/** js/connect/third_party_auth/openid_login.js */















OpenIDLogin=

















{login:function(a,b,c,d,e){
OpenIDRequest.context='tpa';

new OpenIDRequest().
setThirdPartyLogin(true).
setSuccessHandler(function(f){
var g=
'OpenID'+'..'+
f.oid+'..'+
f.secret;

setCookie('tpa',g,0,'/');
if(!!d)
OpenIDLogin._refreshLoginStatus();


b&&b();}).

setErrorHandler(function(f){
new Dialog().
setTitle("Ruh roh!").
setBody(tx._("We're having trouble talking to {provider}.\u003Cbr \/>Either login to Facebook directly or try again later.",
{provider:a})).
setButtons(Dialog.OK).
setHandler(function(){
c&&c();}).

show();}).

setProviderCache(e).
setOpenIDUrl(a).
send();},






_refreshLoginStatus:function(){

try{XD.send({type:'refreshThirdPartyAuthStatus'});}catch(
a){
window.location.reload();}}};

/** js/connect/third_party_auth/multi_login_popup.js */




















MultiLoginPopup=
{provider:'facebook',
providerCache:{},
formSubmissionInterceptors:[],





init:function(){


Arbiter.subscribe('platform/socialplugins/login',function(a){
MultiLoginPopup.loggedIn=!!a.user;});





Selector.subscribe('close',function(a,b){
Selector.setSelected(b.selector,
Selector.getValue(b.selector),
false);});},




setProvider:function(a){
MultiLoginPopup.provider=a;
return this;},


setProviderCache:function(a){
MultiLoginPopup.providerCache=a;
return this;},


interceptFormSubmission:function(a,b,c,d){
var e=function(f){
if(f){




MultiLoginPopup.detachExistingSubmissionInterceptors();
if(f.fbDtsg){


Env.fb_dtsg=f.fbDtsg;



Env.user=f.user;}


if(f.isThirdParty==="0"){


DOM.scry(document.documentElement,'.postToProfile').forEach
(function(g){
CSS.show(g);});



DOM.scry(document.documentElement,'.postToProfileCheckbox').forEach
(function(g){
if(f.postToProfileChecked==="0"){
g.removeAttribute('checked');}else 

g.setAttribute('checked','checked');});




DOM.scry(document.documentElement,'.viewerProfileHref').forEach
(function(g){
g.href=f.profileUrl;
g.onclick='';});



DOM.scry(document.documentElement,'.commentas').forEach
(function(g){
var h=g.id;
DOM.replace(g,HTML(f.commentAsMarkup));
var i=$(f.commentAsMarkupID);
i.id=h;
var j=DOM.scry(i,'a.commentaschange');
if(j.length==1){
var k=j[0],
l=new URI(k.getAttribute('ajaxify'));
l.addQueryData({uniqid:h});
k.setAttribute('ajaxify',l.toString());}});}else 




DOM.scry(document.documentElement,'.commentas').forEach
(function(g){
var h=g.id;
DOM.replace(g,HTML(f.commentAsMarkup));
var i=$(f.commentAsMarkupID);
i.id=h;});





DOM.scry(document.documentElement,'.viewerProfilePic').forEach
(function(g){
g.src=f.profilePic;});




DOM.scry(document.documentElement,
'.fbCommentAfterLoginButton').forEach(CSS.hide);


DOM.scry(document.documentElement,
'.fbCommentButton').forEach(CSS.show);


DOM.scry(document.documentElement,
'.fbReplyAfterLoginButton').forEach(CSS.hide);


DOM.scry(document.documentElement,
'.fbReplyButton').forEach(CSS.show);


DOM.scry(document.documentElement,
'.fbUpDownVoteAfterLogin').forEach(CSS.hide);
DOM.scry(document.documentElement,
'.fbUpDownVoteOption').forEach(CSS.show);


DOM.scry(document.documentElement,
'.closeButtonAfterLogin').forEach(CSS.hide);
DOM.scry(document.documentElement,
'.closeButton').forEach(CSS.show);

CommentAdminPanelController.setLoggedIn
(parseInt(f.user,10));


Arbiter.inform('platform/socialplugins/login',
{user:f.user},
Arbiter.BEHAVIOR_STATE);

WidgetArbiter.inform('platform/socialplugins/login',
{user:f.user},
Arbiter.BEHAVIOR_STATE);}};



MultiLoginPopup.login(d,a,b,c,e);
return false;},










attachAllFormsToLogin:function(a,b){
MultiLoginPopup.formSubmissionInterceptors=[];
MultiLoginPopup.popupTitle=a;
MultiLoginPopup.params=b;
MultiLoginPopup.reattachLoginInterceptors();},


reattachLoginInterceptors:function(){
MultiLoginPopup.detachExistingSubmissionInterceptors();
var a=['composer',
'fbUpDownVoteAfterLogin',
'closeButtonAfterLogin'],
b=MultiLoginPopup.popupTitle,
c=MultiLoginPopup.params,


d=function(f){
var g=f.getTarget();
if(g.tagName.toLowerCase()==='form'&&
a.some(CSS.hasClass.curry(g)))
return MultiLoginPopup.interceptFormSubmission(g,
b,
c);},


e=Event.listen(document.body,
'submit',
d,
Event.Priority.URGENT);
MultiLoginPopup.formSubmissionInterceptors.push(e);},


detachExistingSubmissionInterceptors:function(){
var a=MultiLoginPopup.formSubmissionInterceptors.length;
for(var b=0;b<a;b++)
MultiLoginPopup.formSubmissionInterceptors[b].remove();

MultiLoginPopup.formSubmissionInterceptors=[];},














login:function(a,b,c,d,e){
if(!MultiLoginPopup.loggedIn)
MultiLoginPopup._openPopup(d,e);},








doOpenIDLogin:function(a,b,c){
OpenIDLogin.login(a,
MultiLoginPopup.tpaLoginCallback(b),
MultiLoginPopup.tpaLoginCallback(c),
false,
MultiLoginPopup.providerCache);},







doOauthWrapLogin:function(a,b,c){
var d=new OauthLogin(a,'/connect/oauthwrap_login.php');
return d.login(MultiLoginPopup.tpaLoginCallback(b),
MultiLoginPopup.tpaLoginCallback(c),
false);},





doTwitterLogin:function(a,b){
var c=new OauthLogin('Twitter','/connect/twitter_login.php');
return c.login();},











tpaLoginCallback:function(a){
return function(b,c){
var d=DOM.create('iframe',
{src:b,
className:'hidden_elem'});

DOM.appendContent(DOM.find(c.documentElement,
'body'),d);}.
curry(a,document);},





loggedIn:false,




_popup:null,







_openPopup:function(a,b){
var c=
MultiLoginPopup.provider==='facebook'?'opener':'parent',
d=WindowComm.makeHandler(function(l){
MultiLoginPopup._closePopup();
b&&b(l);},
c),
e=WindowComm.makeHandler(function(l){
MultiLoginPopup._closePopup();},
c),

f;
if(MultiLoginPopup.provider==='facebook'){
f=new URI('/login.php');
f.setQueryData(copyProperties(a,
{social_plugin:'multi_login',
cancel_url:e,
next:d,
provider:MultiLoginPopup.provider}));


var g=450,
h=700;
this._popup=PopupResizer.open(f.toString(),g,h);}else{

f=new URI('/plugins/multi_login_popup_loggedin.php');
f.setQueryData
({original_next:d,
original_cancel:e,
iframe_src:a.iframe_src});


d=f.toString();
if(MultiLoginPopup.provider==='twitter'){
MultiLoginPopup.doTwitterLogin(d,e);}else
if(MultiLoginPopup.provider==='microsoft'){
MultiLoginPopup.doOauthWrapLogin
(MultiLoginPopup.provider,d,e);}else
if(MultiLoginPopup.provider==='openid'){
var i=new Dialog(),
j=function(l){
var m=i.getFormData();
MultiLoginPopup.doOpenIDLogin(m.openid_url,d,e);

i.hide();
if(l.kill)
l.kill();

return false;};


i.
setContentWidth(350).
setTitle('OpenID').
setBody(DOM.create('form',{onsubmit:j},
DOM.create('input',{type:'text',
size:60,
name:'openid_url'}))).
setHandler(j).
setButtons([Dialog.CONFIRM,Dialog.CANCEL]).
show();}else{

var k=MultiLoginPopup.provider+'.com';
MultiLoginPopup.doOpenIDLogin(k,d,e);}}},







_closePopup:function(){
if(this._popup){
this._popup.close();
this._popup=null;}}};
