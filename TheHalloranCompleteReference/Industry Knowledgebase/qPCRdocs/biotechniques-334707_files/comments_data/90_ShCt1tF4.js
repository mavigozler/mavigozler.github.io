/*1349187296,178142531*/

if (window.CavalryLogger) { CavalryLogger.start_js(["clmx1"]); }

/** js/openid/protocol.js */



















































function OpenIDRequest(){
var a=new AsyncRequest().
setReadOnly(true).
setHandler(this.asyncResponseHandler.bind(this)).
setErrorHandler(this.asyncErrorHandler.bind(this));
copyProperties(this,
{openidUrl:null,
requestId:OpenIDRequest.maxRequestId++,
successResponseHandler:null,
cancelHandler:null,
intermediateHandler:null,
immediateMode:false,
useExtensions:true,
thirdPartyLogin:false,
popupWindow:null,
asyncRequest:a,
retryCount:0});


OpenIDRequest.requests[this.requestId]=this;}



















OpenIDRequest.getRequestById=function(a){
return OpenIDRequest.requests[a];};





OpenIDRequest.prototype.setOpenIDUrl=function(a){
this.openidUrl=a;
return this;};










OpenIDRequest.prototype.setSuccessHandler=function(a){
this.successResponseHandler=a;
return this;};











OpenIDRequest.prototype.setErrorHandler=function(a){
this.errorHandler=a;
return this;};









OpenIDRequest.prototype.setCancelHandler=function(a){
this.cancelHandler=a;
return this;};








OpenIDRequest.prototype.setImmediateMode=function(a){
this.immediateMode=a;
return this;};






OpenIDRequest.prototype.setUseExtensions=function(a){
this.useExtensions=a;
return this;};











OpenIDRequest.prototype.setIntermediateHandler=function(a){
this.intermediateHandler=a;
return this;};







OpenIDRequest.prototype.setThirdPartyLogin=function(a){
this.thirdPartyLogin=a;
return this;};







OpenIDRequest.prototype.send=function(){

if(!this.openidUrl)
throw "openidUrl is a required parameter. Call setOpenIDUrl()";


uri=this.calculateRedirectUrl();

if(!uri){
this.logMetrics('redirectUrlNotFound');
return;}


if(this.immediateMode){
this.createHiddenIframe(uri);}else{

if(this.popupWindow)
throw "OpenID popup is already in progress";

this.showPopup(uri);}


this.logMetrics('requestSent');};









OpenIDRequest.prototype.calculateRedirectUrl=function(a){
var b=this.immediateMode?'checkid_immediate':'checkid_setup',

c={'openid.mode':b},

d;
if(!OpenIDRequest.cache[this.openidUrl])



return null;


d=OpenIDRequest.cache[this.openidUrl].url;




var e=URI(URI(d).getQueryData()['openid.return_to']);


e.addQueryData({context:OpenIDRequest.context,
request_id:this.requestId});


c['openid.return_to']=e.toString();

c.third_party_login=this.thirdPartyLogin;

return URI(d).addQueryData(c).getQualifiedURI();};





OpenIDRequest.prototype.createHiddenIframe=function(a){

var b='openid_request_'+this.requestId,
c=document.body.appendChild(document.createElement('div')),


d=function(){
c.innerHTML=
('<iframe name="'+b+'"'+
' src="'+a.toString()+'"'+
' scrolling="no" '+
' frameborder="0" class="hidden_elem"></iframe>');};









if(ua.ie()){
c.innerHTML='<iframe src="javascript:false"></iframe>';
d.defer();}else 

d();};







OpenIDRequest.prototype.showPopup=function(a){
if(OpenIDRequest.cache[this.openidUrl])
popupDimensions=OpenIDRequest.cache[this.openidUrl].popup_dimensions;



if(typeof(popupDimensions)=="undefined"||
!popupDimensions||
!popupDimensions.height||
!popupDimensions.width)
popupDimensions={height:'580',
width:'790'};



var b=
{x:coalesce(window.screenX,window.screenLeft),
y:coalesce(window.screenY,window.screenTop),
width:coalesce(window.outerWidth,document.body.clientWidth),
height:coalesce(window.outerHeight,document.body.clientHeight)},

c=b.x+((b.width-popupDimensions.width)/2),
d=b.y+((b.height-popupDimensions.height)/2),

e=["location=yes",
"scrollbars=1",
"left="+c,
"top="+d,
"resizable=yes",
"height="+popupDimensions.height,
"width="+popupDimensions.width].
join(",");

this.popupWindow=window.open(a.toString(),
'_blank',
e);


this.popupPollInterval=setInterval(this.pollPopupWindow.bind(this),100);

this.popupWindow.focus();};






OpenIDRequest.prototype.pollPopupWindow=function(){
if(!(this.popupPollInterval&&
this.popupWindow))
return;


if(this.popupWindow.closed){
clearInterval(this.popupPollInterval);
this.cancel();}};







OpenIDRequest.prototype.closePopupIfOpen=function(){
if(this.popupWindow){
if(this.popupPollInterval)
clearInterval(this.popupPollInterval);

this.popupWindow.close();}

this.popupWindow=null;};











OpenIDRequest.prototype.cancel=function(){
this.closePopupIfOpen();

if(this.cancelHandler)
this.cancelHandler();


this.logMetrics('requestCanceled');};





OpenIDRequest.prototype.logMetrics=function(a){
new AsyncSignal('/ajax/openid/metrics.php',
{metric:a,
immediate:this.immediateMode,
context:OpenIDRequest.context,
openid_url:this.openidUrl}).
send();};










OpenIDRequest.prototype.triggerCompleteAuthAsync=function(a){







if(a.charAt(0)=='?'||
a.charAt(0)=='&')
a=a.substr(1);

var b=URI.explodeQuery(a);



this.closePopupIfOpen();



if(b['openid.mode']=='cancel'){
this.cancel();
return;}




if(this.intermediateHandler)
this.intermediateHandler();



this.asyncRequest.
setData({openid_params:b}).
send();};










OpenIDRequest.prototype.asyncResponseHandler=function(a){
var b=a.getPayload();

if(this.successResponseHandler)
this.successResponseHandler(b);

this.closePopupIfOpen();};







OpenIDRequest.prototype.cleanHandleResponse=function(a){
if(a.css)
a.css=$A(a.css);

this.asyncRequest.handleResponse(a);};









OpenIDRequest.prototype.asyncErrorHandler=function(a){
this.closePopupIfOpen();


if(a.error==1428010||
a.error==1428011){
this.cancel();
return;}


if(this.errorHandler)
this.errorHandler(a);};








OpenIDRequest.prototype.retry=function(){
++this.retryCount;
this.requestId=OpenIDRequest.maxRequestId++;
this.send();};












OpenIDRequest.prototype.setProviderCache=function(a){
OpenIDRequest.cache=a;
return this;};

OpenIDRequest.cache={};

OpenIDRequest.requests=[];
OpenIDRequest.maxRequestId=0;







OpenIDRequest.context='default';

/** js/modules/core/mergeObjects.js */
__d("mergeObjects",["copyProperties"],function(a,b,c,d,e,f){



var g=b('copyProperties');

function h(){
var i={};
for(var j=0;j<arguments.length;j++)
g(i,arguments[j]);

return i;}


e.exports=h;});

/** js/comments.js */











FBCommentServer=
{serverStarted:true,












init:function(a){
CSS.setClass($(a.commentsID).parentNode,'mu-connect-disable-logout');
this._notifyAddComment=a.notify;
ConnectLogin.init(a);
XD.init
({channelUrl:a.channelUrl,
hideOverflow:true,
autoResize:true});},






showConnect:function(){
ConnectLogin.login();},








setupConnect:function(a,b){
if(Env.user&&Env.user!="0"){
a.defer();}else 

b.defer();},









addComment:function(a){
if(this._notifyAddComment)

XD.send({type:'addComment',comments:a});}};

/** js/deprecated/startsWith-legacy.js */
__d("legacy:startsWith",["startsWith"],function(a,b,c,d){



a.startsWith=b('startsWith');},

3);

/** js/comments/comments_admin.js */
























if(!window.CommentAdminPanelController){
window.CommentAdminPanelController=function(a){
copyProperties(this,
{locale:a.locale,
channel:a.channel,
controllerID:a.controllerID,
commentIDs:a.commentIDs,
domIDs:a.domIDs,
duplicateComments:[],
fetchMoreCommentsIsPending:{},
blacklistedActors:a.blacklistedActors,
actorToCommentInfoMap:a.actorToCommentIDMap,
commentInfoMap:a.commentInfoMap,
inAggregatedView:a.inAggregatedView,
inModerationQueue:a.inModerationQueue,
inContextualDialog:a.inContextualDialog,
isTopLevelCommentPollingEnabled:false,
loggedIn:a.loggedIn,
newestCommentTimestamp:a.newestCommentTimestamp,
realTimePollingParams:{},
userOwnsPages:a.userOwnsPages,
recentlyBlacklistedActors:a.blacklistedActors});


Arbiter.subscribe
(ChannelConstants.getArbiterType('comments_plugin_new_post'),
function(b,c){

if(c.obj.target===this.realTimePollingParams.target){
if(ge(c.obj.comment_element_id))

return;


var d=copyProperties({},this.realTimePollingParams);
d.post_fbid=c.obj.post_fbid;

var e=c.obj.parent_comment_id;
if(e){

var f=ge(e);
if(!f)

return;


var g=
DOM.scry(f,'.fbFeedbackPager.uiMorePager');
if(g.length>0)

return;


d.parent_comment_id=e;
d.is_reply_thread=true;}else{


if(!this.isTopLevelCommentPollingEnabled)


return;

d.is_reply_thread=false;}


this.pollForComments(d);}}.

bind(this));


this.controlledRegion=$(this.controllerID);
this.attachClickHandlers();
if(this.inModerationQueue)
this.registerModeratorQueueHandlers(true);


if(this.inContextualDialog)
this.attachContextualDialogHandlers();


if(!this.inAggregatedView)


UnverifiedXD.init
({autoResize:true,
channelUrl:a.channel,
hideOverflow:true,
resizeWidth:false});};




copyProperties(CommentAdminPanelController,
{allControllers:{},
mainController:null,
contextualControllers:{},

initController:function(a){
var b=new CommentAdminPanelController(a),
c=a.controllerID;
CommentAdminPanelController.allControllers[c]=b;
if(b.inContextualDialog){
CommentAdminPanelController.contextualControllers[c]=
b;}else 

CommentAdminPanelController.mainController=b;},



syncController:function(a,b){
var c=CommentAdminPanelController.allControllers[a];
c.attachClickHandlers();
if(!c.isControllingModerationQueue())
return;









c.deselectComments(b);
c.registerModeratorQueueHandlers
(false);
c.synchronizeModeratorQueueUI();},


resetController:function(a){
var b=CommentAdminPanelController.allControllers[a];
b.resetController();},


appendComments:function(a,
b,
c){
var d=CommentAdminPanelController.allControllers[a];
d.appendComments(b,c);},


prependComments:function(a,
b,
c){
var d=CommentAdminPanelController.allControllers[a];
d.prependComments(b,c);},


updateController:function(a,
b,
c,
d,
e,
f,
g){
var h=CommentAdminPanelController.allControllers[a];
h.updateController(b,
c,
d,
e,
f,
g);

if(!CommentAdminPanelController.mainController.loggedIn)
MultiLoginPopup.reattachLoginInterceptors();


if(!h.isControllingModerationQueue())
return;







h.registerModeratorQueueHandlers
(false);
h.synchronizeModeratorQueueUI();},


updatePollingParamsCommentas:function(a,
b){
var c=CommentAdminPanelController.allControllers[a];
c.updatePollingParamsCommentas(b);},


registerMoreCommentsLinkHandler:function(a,b){
var c=CommentAdminPanelController.allControllers[a];
c.registerMoreCommentsLinkHandler(b);},


setRealTimePollingParams:function(a,b){
var c=CommentAdminPanelController.allControllers[a];
c.setRealTimePollingParams(b);},


enableTopLevelCommentPolling:function(a){
var b=CommentAdminPanelController.allControllers[a];
b.enableTopLevelCommentPolling();},


disableTopLevelCommentPolling:function(a){
var b=CommentAdminPanelController.allControllers[a];
b.disableTopLevelCommentPolling();},


replaceContentMaybe:function(a,b){



var c=DOM.scry(document.documentElement,a)[0];
if(c)
DOM.replace(c,b);},



notifyCommentCreated:function(a){
if(!CommentAdminPanelController.mainController.channel)
return;


UnverifiedXD.send
({type:'commentCreated',
href:a.href,
parentCommentID:a.parentCommentID,
commentID:a.commentID});},



notifyCommentRemoved:function(a){
if(!CommentAdminPanelController.mainController.channel)
return;


UnverifiedXD.send
({type:'commentRemoved',
href:a.href,
commentID:a.commentID});},



markAsShowingAllReplies:function(a){
var b=
a+' a.fbUpDownVoteOption',
c=
DOM.scry(document.documentElement,b),

d=
a+' li.fbUpDownVoteOption a.itemAnchor',
e=
DOM.scry(document.documentElement,d),

f=c.concat(e);
for(var g=0;g<f.length;g++){
var h=f[g],
i=new URI(h.getAttribute('ajaxify'));
i.addQueryData({show_all_replies:1});
h.setAttribute('ajaxify',i.toString());}},



setLoggedIn:function(a){
CommentAdminPanelController.mainController.loggedIn=a;}});



copyProperties(CommentAdminPanelController.prototype,

{isControllingModerationQueue:function(){
var a=
this==CommentAdminPanelController.mainController&&
this.inModerationQueue;
return a;},


resetController:function(){
this.commentIDs=[];
this.domIDs=[];},


updateController:function(a,
b,
c,
d,
e,
f){

a.forEach(function(h){
this.commentIDs.push(h);},
this);

b.forEach(function(h){
this.domIDs.push(h);},
this);

copyProperties(this.blacklistedActors,d);
for(var g in e){
if(!this.actorToCommentInfoMap[g])
this.actorToCommentInfoMap[g]=[];


e[g].forEach(function(h){
this.actorToCommentInfoMap[g].push(h);},
this);}


this.newestCommentTimestamp=
Math.max(this.newestCommentTimestamp,c);

copyProperties(this.commentInfoMap,f);
this.attachClickHandlers();},


updatePollingParamsCommentas:function(a){
this.realTimePollingParams.commentas=a;},


attachClickHandlers:function(){
for(var a=0;a<this.domIDs.length;a++){
var b='li[id="'+this.domIDs[a]+'"]',
c=DOM.scry(this.controlledRegion,b);
if(c.length===0)
continue;


var d=c[0],
e=DOM.scry(d,'a.uiCloseButton');
Event.listen(d,
'mouseleave',
this.closeStickyMenuFlyouts.bind(this,e));
var f=DOM.scry(d,
'.fbModerateDropdownContainer');
if(f.length>0){
var g=f[0],
h=DOM.find(g,
'.fbModerateDropdownLink');
Event.listen(h,
'mouseover',
function(q,event){
CSS.addClass(q,'fbUnderlineText');}.
curry(h));
Event.listen(h,
'mouseout',
function(q,event){
CSS.removeClass(q,'fbUnderlineText');}.
curry(h));
var i=DOM.find(g,
'.fbModerationDropdownList');
Event.listen(h,
'click',
this.exposeDropDownMenu.bind(this,
h,
i));
Event.listen(i.parentNode,
'mouseleave',
this.concealDropDownMenu.bind(this,
h,
i));
this.attachDropDownHandlers(d,
this.commentIDs[a],
i);}


var j=this.commentInfoMap[this.commentIDs[a]].actor,
k=
!!this.recentlyBlacklistedActors[j];
if(k){



var l=DOM.scry(d,'.fbUndoBlacklistLink');
if(l.length>0){
var m=l[0];
Event.listen(m,'click',
this.toggleBlackListAndSync.bind(this,
this.commentIDs[a]));}}}




var n=
DOM.scry(this.controlledRegion,'.fbReplyButton'),
o=
DOM.scry(this.controlledRegion,'.fbReplyAfterLoginButton');

for(var p=0;p<n.length;p++)
if(this.loggedIn){
CSS.show(n[p]);
CSS.hide(o[p]);}else{

CSS.hide(n[p]);
CSS.show(o[p]);}},




closeStickyMenuFlyouts:function(a,event){
Toggler.hide();





for(var b=0;b<a.length;b++)
a[b].blur();},



attachDropDownHandlers:function(a,b,c){
var d=DOM.scry(c,'.fbBanUser');
if(d.length>0){
var e=d[0],
f=DOM.find(e,'^.fbFeedbackPost');
if(startsWith(f.id,b))





Event.listen(e,
'click',
this.toggleBlackListAndSync.bind(this,b));}},







exposeDropDownMenu:function(a,b,event){
if(CSS.shown(b))



return this.concealDropDownMenu(a,b,event);


Event.stop(event);
CSS.show(b);
b.focus();
a.blur();
return false;},


concealDropDownMenu:function(a,b,event){
Event.stop(event);
CSS.removeClass(a,'fbUnderlineText');
CSS.hide(b);
a.blur();
return false;},


registerMoreCommentsLinkHandler:function(a){
var b=a.pager_id;
if(!ge(b))
return;


var c=$(b);
Event.listen(c,'click',this.fetchMoreComments.bind(this,
a,
c));},


deselectComments:function(a){
for(var b=0;b<a.length;b++)
delete this.selectedCommentsMap[a[b]];},



registerModeratorQueueHandlers:function(a){
if(a)
this.selectedCommentsMap={};


this.selectableComments=this.findSelectableComments();
this.selectableCheckboxes=[];

this.selectAllCheckBoxes=
DOM.scry(this.controlledRegion,'.fbSelectAllCheckbox');
this.approveButtons=DOM.scry(this.controlledRegion,'.fbApproveButton');
this.removeButtons=DOM.scry(this.controlledRegion,'.fbRemoveButton');

for(var b=0;b<this.selectableComments.length;b++){
var c=this.selectableComments[b].id,
d=!!this.selectedCommentsMap[c];
this.setCommentSelection(this.selectableComments[b],d);
var e=
DOM.find(this.selectableComments[b],'.fbCommentCheckbox');

Event.listen(e,
'click',
this.toggleCommentSelection.bind(this));
Event.listen(this.selectableComments[b],
'click',
this.toggleCommentSelection.bind(this));
e.checked=d;
this.selectableCheckboxes.push(e);}


for(var f=0;f<this.selectAllCheckBoxes.length;f++){
this.selectAllCheckBoxes[f].checked=false;
this.selectAllCheckBoxes[f].disabled=
this.selectableComments.length===0;
Event.listen
(this.selectAllCheckBoxes[f],
'click',
this.toggleSelectAllCheckbox.bind(this,
this.selectAllCheckBoxes[f]));}


for(var g=0;g<this.approveButtons.length;g++)
Event.listen(this.approveButtons[g],
'click',
this.setBulkPrivacy.bind(this,false));


for(var h=0;h<this.removeButtons.length;h++)
Event.listen(this.removeButtons[h],
'click',
this.setBulkPrivacy.bind(this,true));},



findSelectableComments:function(){
var a=
DOM.scry(this.controlledRegion,'.fbTopLevelComment'),
b=[];
for(var c=0;c<a.length;c++)
if((DOM.scry(a[c],
'.fbCommentCheckbox').length===1)&&
(DOM.scry(a[c],
'.fbCommentOverlay').length===0))
b.push(a[c]);



return b;},


toggleCommentSelection:function(event){
var a={a:true},
b=event.getTarget(),
c=b.tagName.toLowerCase(),
d=b.parentNode.tagName.toLowerCase();
if(a[c]||
a[d])

return;


var e=
CSS.hasClass(b,'fbFeedbackPost')?b:
DOM.find(b,'^.fbFeedbackPost'),
f=this.commentIsSelected(e),
g=!f;
this.setCommentSelection(e,g);
this.synchronizeModeratorQueueUI();
if(CSS.hasClass(b,'fbCommentCheckbox'))
Event.stop(event);},






commentIsSelected:function(a){
return CSS.hasClass(a,'fbCommentSelected');},


setCommentSelection:function(a,b){
if(b){
this.selectComment(a);}else 

this.deselectComment(a);},



selectComment:function(a){
CSS.addClass(a,'fbCommentSelected');
this.selectedCommentsMap[a.id]=true;
DOM.find(a,'.fbCommentCheckbox').checked=true;},


deselectComment:function(a){
CSS.removeClass(a,'fbCommentSelected');
delete this.selectedCommentsMap[a.id];
DOM.find(a,'.fbCommentCheckbox').checked=false;},


toggleSelectAllCheckbox:function(a,event){
Event.stop(event);
var b=a.checked;
for(var c=0;c<this.selectableComments.length;c++){
this.setCommentSelection(this.selectableComments[c],
a.checked);
this.selectableCheckboxes[c].checked=b;}


this.synchronizeBulkModerationCheckboxes(b);
this.synchronizeBulkModerationButtons(b);},


synchronizeModeratorQueueUI:function(){
var a=0;
for(var b=0;b<this.selectableCheckboxes.length;b++)
if(this.selectableCheckboxes[b].checked)
a++;



var c=
this.selectableCheckboxes.length>0&&
a==this.selectableCheckboxes.length;
this.synchronizeBulkModerationCheckboxes(c);
this.synchronizeBulkModerationButtons(a>0);},


synchronizeBulkModerationCheckboxes:function(a){
for(var b=0;b<this.selectAllCheckBoxes.length;b++)
this.selectAllCheckBoxes[b].checked=a;},



synchronizeBulkModerationButtons:function(a){
for(var b=0;b<this.approveButtons.length;b++)
Button.setEnabled(this.approveButtons[b],a);


for(var c=0;c<this.removeButtons.length;c++)
Button.setEnabled(this.removeButtons[c],a);},



setBulkPrivacy:function(a,event){
Event.stop(event);

this.synchronizeBulkModerationButtons(false);
selectedCommentIDs=[];
for(var b in this.selectedCommentsMap)
selectedCommentIDs.push(b);


var c=
{is_private:a,
in_moderation_queue:true,
comment_ids:selectedCommentIDs,
uniqids:selectedCommentIDs,
controller_id:this.controllerID,
locale:this.locale,
owns_pages:this.userOwnsPages,
in_aggregated_view:this.inAggregatedView,
in_contextual_dialog:this.inContextualDialog};


new AsyncRequest().
setURI('/ajax/connect/comments/set_bulk_private.php').
setData(c).
send();
return false;},


toggleBlackListAndSync:function(a,event){
Event.stop(event);
var b=this.commentInfoMap[a].actor,
c=
{blacklist:!this.blacklistedActors[b],
in_moderation_queue:this.inModerationQueue,
comment_id:a,
other_comment_ids:this.getOtherCommentsByActor(b,a),
uniqid:a,
controller_id:this.controllerID,
locale:this.locale,
owns_pages:this.userOwnsPages,
in_aggregated_view:this.inAggregatedView,
in_contextual_dialog:this.inContextualDialog};


new AsyncRequest().
setURI('/ajax/connect/comments/set_blacklist.php').
setData(c).
setHandler(function(d){
this.blacklistedActors[b]=!this.blacklistedActors[b];
if(this.blacklistedActors[b]){
this.recentlyBlacklistedActors[b]=true;}else 

delete this.recentlyBlacklistedActors[b];}.

bind(this)).
send();
return false;},


getOtherCommentsByActor:function(a,b){
return this.actorToCommentInfoMap[a].filter
(function(c){return c!=b;});},



fetchMoreComments:function(a,b,event){
Event.kill(event);
CSS.addClass(b,'async_saving');
if(this.fetchMoreCommentsIsPending[a.pager_id]===true)
return;


this.fetchMoreCommentsIsPending[a.pager_id]=true;

var c=
{is_reply_thread:false,
in_moderation_queue:false,
view_as_moderator:false};


copyProperties(c,a);

c.offset=this.getVisibleCommentCount(c);

if(!c.aggregate_view)
delete c.aggregate_view;


if(!c.comment_id)
delete c.comment_id;


if(!c.is_reply_thread)
c.comment_ids=this.commentIDs;


if(!c.commentas){
var d=
CommentAdminPanelController.allControllers[c.controller_id];
c.commentas=d.realTimePollingParams.commentas;}


new AsyncRequest().
setURI('/ajax/connect/feedback.php').
setReadOnly(true).
setData(c).
setHandler(function(e){
this.fetchMoreCommentsIsPending[a.pager_id]=false;}.
bind(this)).
send();},


getVisibleCommentCount:function(a){
var b=this.getCommentsSelector(a),
c=this.getCollapsedCommentsSelector(a),
d=DOM.scry($(a.controller_id),b);
d=
d.concat(DOM.scry($(a.controller_id),c));
var e=0;
for(var f=0;f<d.length;f++)
if(!CSS.hasClass(d[f],'fbCommentIgnored'))
e++;



return e;},


getCommentsSelector:function(a){
var b=
a.is_reply_thread?'li.fbCommentReply':'li.fbTopLevelComment';
if(a.controller_id!=a.uniqid)
b='div[id="'+a.uniqid+'"] '+b;

return b;},


getCollapsedCommentsSelector:function(a){
var b=
a.is_reply_thread?'div.fbCommentReply':'div.fbTopLevelComment';
if(a.controller_id!=a.uniqid)
b='div[id="'+a.uniqid+'"] '+b;

return b;},


getRecentlyBlacklistedActors:function(){
var a=[];
for(var b in this.recentlyBlacklistedActors)
a.push(b);


return a;},


attachContextualDialogHandlers:function(){
this.documentClickListener=
Event.listen(document.documentElement,
'click',
this.closeContextualDialog.bind(this));},


closeContextualDialog:function(event){
var a=event.getTarget(),
b=
Parent.byClass(a,'fbCommentContext');

if(!b)
this.destroyContextualDialog();},



destroyContextualDialog:function(){
this.documentClickListener.remove();
delete this.documentClickListener;
var a=this.controllerID;
Feedback.closeContextualDialog(a);},


setRealTimePollingParams:function(a){
this.realTimePollingParams=a;},


enableTopLevelCommentPolling:function(){
this.isTopLevelCommentPollingEnabled=true;},


disableTopLevelCommentPolling:function(){
this.isTopLevelCommentPollingEnabled=false;},


appendComments:function(a,b){
var c=ge(a);
if(!c)
return;





var d=
DOM.scry(c,'.fbFeedbackReplies')[0];
if(!d)
return;


DOM.appendContent(d,b);},


prependComments:function(a,b){



var c=
DOM.scry(document.documentElement,a)[0];
if(!c)
return;


var d=b.getNodes(),
e=[];
for(var f=d.length;f-->0;){
var g=
{id:DOM.getID(d[f]),
element:d[f]};

e.push(g);

var h=ge(g.id);
if(h){





CSS.hide(g.element);
this.duplicateComments.push(g.element);
for(var i=0;i<e.length;++i)
DOM.insertAfter(h,e[i].element);

e=[];}}



for(f=0;f<e.length;++f)
DOM.prependContent(c,
e[f].element);




setTimeout(this.removeDuplicateComments.bind(this),0);},


removeDuplicateComments:function(){
for(var a=0;a<this.duplicateComments.length;++a)
DOM.remove(this.duplicateComments[a]);

this.duplicateComments=[];},


pollForComments:function(a){
data=
{locale:this.locale};


copyProperties(data,a);

if(!data.is_reply_thread)
data.comment_ids=this.commentIDs;


data.newest_comment_timestamp=this.newestCommentTimestamp;

handler=this.handlePollResponse.bind(this);
errorHandler=this.handlePollError.bind(this);
finallyHandler=this.handlePollFinally.bind(this);

new AsyncRequest().
setURI('/plugins/comments/poll').
setReadOnly(true).
setData(data).
setMethod('GET').
setHandler(handler).
setErrorHandler(errorHandler).
setFinallyHandler(finallyHandler).
send();},


handlePollResponse:function(a){


},

handlePollError:function(a){

},

handlePollFinally:function(a){
}});}

/** js/connect_login.js */







ConnectLogin=











{init:function(a){
this.appID=a.appID;
this.addToProfile=a.addToProfile;
this.oneClick=a.oneClick;
this.channelUrl=a.channelUrl;
XD.init(a);},







login:function(a,b,c){
if(this.oneClick&&!b){
this._oneClick(a);}else 

this._openPopup(a,b,c);},






logout:function(){
XD.send({type:'logout'});},








_oneClick:function(a){
new AsyncRequest().
setURI('/ajax/api/tos.php').
setData
({app_id:this.appID,
grant_perm:1}).

setHandler(function(b){
ConnectLogin._refreshLoginStatus();
a&&a();}).

send();},









_openPopup:function(a,b,c){
c=c||{};

var d=WindowComm.makeHandler(function(h){
ConnectLogin._closePopup();
if(ConnectLogin.appID)
ConnectLogin._refreshLoginStatus();

a&&a();}),

e=WindowComm.makeHandler(function(h){
ConnectLogin._closePopup();}),

f=new URI('/login.php');

f.setQueryData
({api_key:this.appID,
next:d,
channel_url:e,
cancel_url:e,
req_perms:b,
v:'1.0',
fbconnect:1,
add_to_profile:this.addToProfile,
display:'popup'});

f.addQueryData(c);

var g=this._getSize(c);
this._popup=PopupResizer.open(f.toString(),g.height,g.width);},





_closePopup:function(){
if(this._popup){
this._popup.close();
this._popup=null;}},






_refreshLoginStatus:function(){
if(this.channelUrl){
XD.send({type:'refreshLoginStatus'});}else 

window.location.reload();},







_getSize:function(a){
if(a.social_plugin=='registration'){
return {width:640,height:370};}else 

return {width:610,height:280};}};

/** js/connect_widget/feedback.js */















add_properties('Feedback',
{registerComment:function(a,b){
Feedback.comments[a]=b;
return Feedback;},


getRegisteredComment:function(a){
return Feedback.comments[a];},





deleteClickHandler:function(a,
b,
c,
d,
e,
f){
var g=new Dialog().
setTitle("Delete post?").
setBody("Are you sure you want to delete this post?").
setButtons([Dialog.newButton('delete',"Delete"),
Dialog.CANCEL]).
setHandler(function(event){
new AsyncRequest().
setURI('/ajax/connect/feedback.php').
setData
({command:'delete',
url:a,
uniqid:d,
owns_pages:e,
controller_id:c,
locale:f,
comment_id:b}).

send();}.
bind(this)).
show();},


resizeCommentas:function(a){



var b=DOM.scry(a,'div.post')[0];
if(b){
var c=Vector2.getElementDimensions(b).x;
if(c){
var d=DOM.find(b,'.commentas'),
e=Vector2.getElementDimensions(d).x;
if((c-e)<190&&
(c-190)>60){

Style.set(d,
'width',
c-190+'px');

var f=DOM.scry(d,'span.commentas_inner')[0];
if(f){
var g=Vector2.getElementDimensions(f).x;
Style.set(d,'width',g+'px');}}}}},






exposeContextualDialogReply:function(a){
var b=$(a),
c=b.parentNode.parentNode;
CSS.show(DOM.find(c,"form"));
DOM.find(c,"textarea").focus();
return false;},


concealContextualDialogReply:function(a){
var b=$(a),
c=b.parentNode.parentNode,
d=DOM.find(c,"form"),
e=DOM.find(c,"textarea"),
f=e.value.length;
if(!Input.getValue(e))
CSS.hide(d);


return false;},


closeContextualDialog:function(a){
var b=ContextualDialogX.getInstance($(a));
b.hide();
return false;},


_clickLocked:false,
attachOptInClickListener:function(a){
Event.listen(a,'click',
function(b){
Event.kill(b);
if(!this._clickLocked){
this._clickLocked=true;
setTimeout(function(){
this._clickLocked=false;}.
bind(this),1000);
PlatformOptInPopup.open('feedback',
'opt.in');}});},







attachReplyListener:function(a){
if(!a)
return;


var b=DOM.find(a,'textarea');


a.suppressBlur=false;
Event.listen(a,'click',
function(c){
var d=c.getTarget(),
e=
Parent.byClass(d,'commentas')!==null,
f=
Parent.byClass(d,'uiButton')!==null,
g=
Parent.byClass(d,'uiSelector')!==null;
a.suppressBlur=
e||f||g;});


Event.listen(b,'blur',
function(c,d){
if(a.interval)
return;


a.interval=setInterval
((function(e,f){
if(e.suppressBlur||
Input.getValue(f)||
f==document.activeElement)
return;


CSS.hide(e);
e.suppressBlur=false;
clearInterval(e.interval);
delete e.interval;}).
curry(a,c),100);}.
curry(b));},





attachReplyClickListener:function(a,b,c){
if(!a)
return;


var d=DOM.find(a,'textarea');

Event.listen(b,'click',
function(e){
CSS.show(a);
d.focus();

if(!c.isViewer&&c.isReply){
var f=MentionsInput.getInstance(d);
if(f){
var g=f.getMentions();
if(!g[c.uid]&&Input.getValue(d)===''){
f.addMention(c);
Input.setValue(d,Input.getValue(d)+' ');}}else 




Input.setValue(d,c.text+' ');}



e.preventDefault();});},







resetInput:function(a){
var b=MentionsInput.getInstance(a);
if(b){
b.reset({flattened:'',mention_data:{}});}else 

Input.setValue(a,'');}});




if(!window.Feedback.comments)
window.Feedback.comments={};

/** js/lib/dom/controls/text_area.js */
__d("legacy:control-textarea",["TextAreaControl"],function(a,b,c,d){



a.TextAreaControl=b('TextAreaControl');},

3);

/** js/modules/ErrorLogging.js */
__d("ErrorLogging",["ErrorSignal","ErrorUtils"],function(a,b,c,d,e,f){



var g=b('ErrorSignal'),
h=b('ErrorUtils');

h.addListener(function(i){
g.logJSError(i.category||'onerror',
{error:i.name||i.message,
extra:i});});});

/** js/lib/type/object.js */
__d("legacy:object-extensions",["areObjectsEqual","coalesce","isScalar","mergeObjects","getObjectValues","createObjectFrom"],function(a,b,c,d){




a.are_equal=b('areObjectsEqual');
a.coalesce=b('coalesce');
a.count=function(f){return Object.keys(f).length;};
a.is_scalar=b('isScalar');
a.keys=Object.keys;
a.merge=b('mergeObjects');
a.values=b('getObjectValues');

var e=b('createObjectFrom');
Object.from=function(f,g){
emptyFunction('Object.from is deprecated; use createObjectFrom');
return e(f,g);};},


3);

/** js/follow/SubscriptionFlyoutController.js */
__d("SubscriptionFlyoutController",["Arbiter","CSS","DataStore","EditSubscriptions","Hovercard","HoverFlyout","$","emptyFunction"],function(a,b,c,d,e,f){



var g=b('Arbiter'),
h=b('CSS'),
i=b('DataStore'),
j=b('EditSubscriptions'),
k=b('Hovercard'),
l=b('HoverFlyout'),

m=b('$'),
n=b('emptyFunction'),

o=null,
p,
q,
r;





function s(){
var w=j.getSubscriptions(r);
if(w){
var x=w.custom_categories;
if(x&&x.length===0)
g.inform('UnfollowUser',
{profile_id:r,
from_hide_flyout:true});}}





function t(w,x){
r=i.get(x,'profile_id');
var y=i.get(x,'loc');
j.init(q,r,y);
h.addClass(x,'selected');
h.addClass(x,'uiButtonHover');
if(i.get(x,'onclose'))
clearTimeout(i.remove(x,'onclosetimeout'));}



function u(w,x){
r=null;
h.removeClass(x,'selected');
h.removeClass(x,'uiButtonHover');
if(i.get(x,'onclose'))
i.set(x,'onclosetimeout',function(){
var y=i.remove(x,'onclose');
y&&y();}.
defer(1500));}



var v=
{init:function(w,x){
v.init=n;

p=w;
q=m(x);
o=new l();
o.init(w);
o.setShowDelay(100).setHideDelay(150);
o.subscribe('show',t);
o.subscribe('hide',u);

g.subscribe(['UnfollowUser','UnfollowingUser'],function(y,z){
if(!z.from_hide_flyout&&z.profile_id==r){
if(k.contains&&p)
if(k.contains(p.getContext()))
k.hide();


o.hideFlyout(true);}});},




initNode:function(w,x,y){
i.set(w,'profile_id',x);
i.set(w,'loc',y);
o.initNode(w);},






setActiveNode:function(w){
o.setActiveNode(w);},


show:function(w){
o.showFlyout(w,true);},


setCloseListener:function(w,x){
if(o.getActiveNode()!==w){
x();}else 

i.set(w,'onclose',x);}};




e.exports=a.SubscriptionFlyoutController||
v;});

/** js/follow/FollowButton.js */
__d("FollowButton",["event-extensions","Arbiter","AsyncRequest","Button","CSS","DOM","EditSubscriptions","FriendListFlyoutController","FriendStatus","Parent","SubscriptionFlyoutController","SubscriptionLevels","URI","$","copyProperties","ge"],function(a,b,c,d,e,f){




b('event-extensions');

var g=b('Arbiter'),
h=b('AsyncRequest'),
i=b('Button'),
j=b('CSS'),
k=b('DOM'),
l=b('EditSubscriptions'),
m=b('FriendListFlyoutController'),
n=b('FriendStatus'),
o=b('Parent'),
p=b('SubscriptionFlyoutController'),
q=b('SubscriptionLevels'),
r=b('URI'),

s=b('$'),
t=b('copyProperties'),
u=b('ge'),


v=14;

function w(aa,ba,ca){
j.conditionShow(ba,ca);
j.conditionShow(aa,!ca);}


function x(aa,ba){
if(ba&&j.hasClass(aa,'enableFriendListFlyout')){
m.show(aa);}else 

m.hide();}




function y(aa,ba,ca){
var da=k.scry(aa,'.lowIcon')[0],
ea=k.scry(aa,'.medIcon')[0],
fa=k.scry(aa,'.highIcon')[0];


if(!da||!ea||!fa)return;

g.subscribe('SubscriptionLevelUpdated',function(ga,ha){
if(ca===ha.profile_id)
switch(ha.level){
case q.ALL:
i.setIcon(ba,fa);
break;
case q.DEFAULT:
i.setIcon(ba,ea);
break;
case q.TOP:
i.setIcon(ba,da);
break;}});}





function z
(aa,
ba,
ca,
da,
ea,
fa){
this.init
(aa,
ba,
ca,
da,
ea,
fa);}



t(z.prototype,
{init:function(aa,ba,ca,da,ea,fa){
if(!j.hasClass(ca,'enableFriendListFlyout'))
p.initNode
(ca,
da,
ea);





if(ea==v&&j.shown(ca))
p.show(ca);


Event.listen(ba,'click',function(){
w(ba,ca,true);
p.setActiveNode(ca);






var ia=new r(ba.getAttribute('ajaxify')),

ja=
{profile_id:da,
location:ea,
source:'follow-button',
subscribed_button_id:ca.id,
xids:ia.getQueryData().xids};


new h().
setURI(fa).
setData(ja).
setRelativeTo(ca).
send();});


aa&&y(aa,ca,da);


g.subscribe
(['FollowUser','FollowingUser','UnfollowUser','UnfollowingUser'],
function(ia,ja){
if(ja.profile_id==da)
w
(ba,
ca,
ia=='FollowUser'||ia=='FollowingUser');




x(ca,ia=='FollowUser');});




var ga=false;
g.subscribe('UnfollowingUser',function(ia,ja){
if(ja.profile_id==da){
ga=j.shown(ca);
ga&&w(ba,ca,false);}});



g.subscribe('UnfollowUserFail',function(ia,ja){
if(ja.profile_id==da&&ga)
w(ba,ca,true);});



g.subscribe('FollowUserFail',function(ia,ja){
if(ja.profile_id==da&&ga)
w(ba,ca,false);});




var ha=false;
g.subscribe
(['FriendRequest/sending','FriendRequest/confirming'],
function(ia,ja){
if(ja.uid==da){
ha=j.shown(ba);
ha&&w(ba,ca,true);}});




g.subscribe
(['FriendRequest/sendFail','FriendRequest/confirmFail'],
function(ia,ja){
if(ja.uid==da&&ha)
w(ba,ca,false);});





g.subscribe('FriendRequest/unfriend',function(ia,ja){
(ja.uid==da)&&
w(ba,ca,false);});}});




e.exports=a.FollowButton||z;});
