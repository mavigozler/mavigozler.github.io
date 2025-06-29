/*1342726370,176832698*/

if (window.CavalryLogger) { CavalryLogger.start_js(["YdG+M"]); }

/** js/lib/net/error_stack.js */








function get_error_stack(){
var a='';

try{throw new Error('');}catch(
b){
a=b.stack||b.stacktrace||'';
a=a.replace(/@.*?\/js\//g,'@/js/').replace(/js\?.*?:/g,'js:');}

return a;}
