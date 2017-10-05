(function (root, factory) {
  
  "use strict";
  
  if ( typeof module === "object" && typeof module.exports === "object" ) {
  
  module.exports = root.document ?
  factory( root, true ) :
  function( w ) {
  if ( !w.document ) {
  throw new Error( "Required a window with a document" );
  }
  return factory( w );
  };
  } else {
  factory( root );
  }
}(this, function (w) {
  
  
  var SP = function(selector){
  var self = {};
  self.selector = selector;
  self.elements = document.querySelectorAll(selector);
  /*max z value*/
  self.maxZ = function(){
  var z = null,
  eles = document.querySelectorAll("*");
  for(var x=0;x<=eles.length;x++){
  if(typeof eles[x] !== "undefined"){
  if(eles[x].style.zIndex){
  if(eles[x].style.zIndex>z){
  z=eles[x].style.zIndex;
  }
  }
  }
  }
  return z ;
  return self;
  }
  /*max z end*/
  /*sp toast*/
  self.createToast = function(text,duration){
  var toast = document.createElement('div');
  this.text = text ;
  this.duration = duration;
  this.duration = (typeof this.duration !== 'undefined') ?  this.duration : 1.5;
  toast.classList.add("sp-toast");
  toast.innerHTML = this.text;
  document.body.appendChild(toast);
  setTimeout(function(){
  document.body.removeChild(toast);
  },this.duration*1000);
  return self;
  }
  /*End sp toast*/
  /*events*/
  self.click = function(callback){
  Array.prototype.forEach.call(self.elements,function(r){
  r.addEventListener('click',callback);
  });
  return self;
  }
  self.dblclick = function(callback){
  $(self.selector).on('dblclick',callback);
  return self;
  }
  self.on = function(e,callback){
  switch(e) {
  case "swipeleft":
  $(self.selector).swipe("left",callback);
  break;
  case "swiperight":
  $(self.selector).swipe("right",callback);
  break;
  case "swipedown":
  $(self.selector).swipe("down",callback);
  break;
  case "swipeup":
  $(self.selector).swipe("up",callback);
  break;
  default:
  Array.prototype.forEach.call(self.elements,function(r){
  r.addEventListener(e,callback);
  });
  }
  return self;
  }
  /*now swipe function*/
  self.swipe = function(dir,callback){
  Array.prototype.forEach.call(self.elements,function(r){
  r.addEventListener('touchstart',handleStart,false);
  r.addEventListener('touchmove',handleMove,false);
  r.addEventListener('touchend',handleEnd,false)
  });
  
  var xi = null,
  yi = null,
  xf = null,
  yf = null,
  opt,
  minArea = 150,
  direction;
 
  function handleStart(e){
  xi = e.touches[0].screenX;
  yi = e.touches[0].screenY;
  }
  function handleMove(e){
  xf = e.touches[0].screenX;
  yf = e.touches[0].screenY;
  }
  function handleEnd(e){
  x = xf-xi;
  y = yf-yi;
  if(Math.abs(x)>minArea||Math.abs(y)>minArea){
  if(Math.abs(x)>Math.abs(y)){
  if(xf>xi){
  direction="right";
  }
  else{
  direction="left";
  }
  }
  else{
  if(yf>yi){
  direction="down";
  }
  else{
  direction="up";
  }
  }
  }
  else{
  direction = undefined;
  }
  if(dir==direction){
  callback();
  }
  }
  return self;
  }
  /*End of swipe*/
  /*CSS*/
  self.css = function(o){
  if(typeof o === "object"){
  Array.prototype.forEach.call(self.elements,function(r){
  for(var prop in o){
  var p = prop.replace(/-([a-z])/g, function (m, w) {
  return w.toUpperCase();
  });
  if(o.hasOwnProperty(prop)){
  r.style[p] = o[prop];
  }
  }
  });
  }
  else{
  console.log(typeof o + " is not an Object , can't set css");
  }
  return self;
  }
  /*End of CSS*/
  
  return self;
  }
  
  
SP.noConflict = function( c ) {
	if ( window.$ === SP ) {
		window.$ = _$;
	}

	if ( c && window.SP === SP ) {
		window.SP = _SP;
	}

	return SP;
};
 
if ( typeof define === "function" && define.amd ) {
	define( "SP", [], function() {
		return SP;
	} );
}
window.SP = window.$ = SP;

return SP;
}));



window.onload = function(){
_sp_init();
//to ripple
var _toRipple = document.getElementsByClassName("sp-ripple");
Array.prototype.forEach.call(_toRipple,function(r){
r.addEventListener("click",_sp_rippleIt);
});
var _toRipple_dark = document.getElementsByClassName("sp-ripple_dark");
Array.prototype.forEach.call(_toRipple_dark,function(r){
r.addEventListener("click",_sp_rippleIt_dark);
});
var _material_nav_opener_ = document.getElementsByClassName("sp-material-nav_opener");
Array.prototype.forEach.call(_material_nav_opener_,function(r){
r.addEventListener("click",_sp_materialnav);
});

}
function _sp_init(){
if(document.querySelector('.sp-header')!=null){
document.querySelector('.sp-container').style.paddingTop="55px";
}
var ct = document.querySelector(".sp-container");
if(window.innerWidth>=900){
if(document.querySelector(".sp-material-nav.autoopen")!=null){
ct.style.marginLeft = "280px";
}
}
}
/*material nav opener*/
function _sp_materialnav(){
document.getElementById(this.getAttribute("data-target")).style.left="0";
var navcover = document.createElement('div');
navcover.classList.add("sp-navcover_mat");
navcover.addEventListener("click",function(){
document.querySelector(".sp-material-nav").style.left="-290px";
document.body.removeChild(navcover);
});

document.body.appendChild(navcover);

/*adding swipe left to mat nav*/
$(".sp-material-nav").swipe("left",function(){
document.querySelector(".sp-material-nav").style.left="-290px";
document.body.removeChild(navcover);
});

}
/*sp ripple function*/
function _sp_rippleIt(e){
var circle = document.createElement('div');
this.appendChild(circle);

var d = Math.max(this.clientWidth,this.clientHeight);
circle.style.width = circle.style.height = d+"px";
circle.classList.add("ripple");

circle.style.backgroundColor="rgba(255,255,255,0.9)";

var style = window.getComputedStyle(this);
var position = style.getPropertyValue("position");

if(position !="fixed"){
circle.style.left = e.pageX - this.offsetLeft - d/2+"px";
circle.style.top = e.pageY - this.offsetTop - d/2+"px";
}
else{
circle.style.left = e.screenX - this.offsetLeft - d/2+"px";
circle.style.top = e.screenY - this.offsetTop - d/2+"px";
}
setTimeout(function(){circle.style.display="none";},600);
}
function _sp_rippleIt_dark(e){
var circle = document.createElement('div');
this.appendChild(circle);

var d = Math.max(this.clientWidth,this.clientHeight);
circle.style.width = circle.style.height = d+"px";
circle.classList.add("ripple");

circle.style.backgroundColor="rgba(0,0,0,0.7)";
var style = window.getComputedStyle(this);
var position = style.getPropertyValue("position");

if(position !="fixed"){
circle.style.left = e.pageX - this.offsetLeft - d/2+"px";
circle.style.top = e.pageY - this.offsetTop - d/2+"px";
}
else{
circle.style.left = e.screenX - this.offsetLeft - d/2+"px";
circle.style.top = e.screenY - this.offsetTop - d/2+"px";
}
setTimeout(function(){circle.style.display="none";},600);
}