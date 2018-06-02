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
  if(self.selector != document){
    self.elements = document.querySelectorAll(selector);
  }
  else{
    self.elements = document.documentElement;
  }
  /*max z value*/
  self.maxZ = function(){
  var z = [],
  eles = document.querySelectorAll("body *");
  eles.forEach(function(r){
    var style = window.getComputedStyle(r);
    if(style.getPropertyValue('z-index')){
    z.push(style.getPropertyValue('z-index'));
  }
  });
  var largest= -999999;
  for (i=0; i<=z.length;i++){
    if (parseInt(z[i])>largest) {
        var largest=parseInt(z[i]);
    }
  }
  return largest;
  };
  /*max z end*/
  /*sp toast*/
  self.createToast = function(text,duration,option){
  var toast = document.createElement('div');
  this.text = text ;
  this.duration = duration;
  this.duration = (typeof this.duration !== 'undefined') ?  this.duration : 2.5;
  this.option = option;
  this.option = (typeof this.option !== 'undefined') ?  this.option : {
  'background':'black',
  'color':'white',
  'swipeable':false
  };
  toast.classList.add("sp-toast");
  toast.style.background = (typeof this.option.background !== 'undefined') ?  this.option.background : '#000';
  toast.style.color = (typeof this.option.color !== 'undefined') ?  this.option.color : '#fff';
  toast.innerHTML = this.text;
  toast.style.bottom = "0";
  document.body.appendChild(toast);

  $('.fab-btn').css({'bottom':'78px'});
  if (typeof this.option.button !== 'undefined') {
    var button = document.createElement('button');
    button.style.background = (typeof this.option.button.background !== 'undefined') ?  this.option.button.background : 'white';
    button.style.color = (typeof this.option.button.color !== 'undefined') ?  this.option.button.color : 'black';
    button.innerHTML = (typeof this.option.button.text !== 'undefined') ?  this.option.button.text : 'Button';
    toast.appendChild(button);
    button.addEventListener('click',function(){option.button.callback();});
  }

  setTimeout(function(){
  toast.style.bottom = "-58px";
  $('.fab-btn').css({'bottom':'20px'});
  setTimeout(function(){
  document.body.removeChild(toast);},300);
  },this.duration*1000);
  if (this.option.swipeable != false) {
    $('sp-toast').swipe('left',function(){
      document.body.removeChild(toast);
      $('.fab-btn').css({'bottom':'20px'});
    });
  }
  return self;
  };
  /*End sp toast*/
  /*events*/
  self.click = function(callback){
  Array.prototype.forEach.call(self.elements,function(r){
  r.addEventListener('click',callback);
  });
  return self;
  };
  self.dblclick = function(callback){
  $(self.selector).on('dblclick',callback);
  return self;
  };
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
  };
  
  /*now swipe function*/
  self.swipe = function(dir, callback, options){
  Array.prototype.forEach.call(self.elements,function(r){
  r.addEventListener('touchstart',handleStart,false);
  r.addEventListener('touchmove',handleMove,false);
  r.addEventListener('touchend',handleEnd,false);
  });
  
  var xi = null,
  yi = null,
  xf = null,
  yf = null,
  minArea,
  direction,
  doWithSwipe,
  o = options;
  
  if(typeof o === "Object"){
  minArea = o.minArea || 150;
  if(o.doWithSwipe != undefined){
  doWithSwipe = o.doWithSwipe;
  }
  }
  function handleStart(e){
  xi = e.touches[0].screenX;
  yi = e.touches[0].screenY;
  }
  function handleMove(e){
  xf = e.touches[0].screenX;
  yf = e.touches[0].screenY;
  if(doWithSwipe){
  doWithSwipe(xf,yf);
  }
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
  };
  /*End of swipe*/
  /*offset*/
  self.offset = function(){
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
  };
  /*toggle class method*/
  self.toggle = function(cls){
    self.elements.forEach(function(r){
      r.classList.toggle(cls);
    });
    return self;
  };
  self.getcss = function(prop){
    var style, val;
    self.elements.forEach(function(r){
    style = window.getComputedStyle(r);
    val = style.getPropertyValue(prop);
    });
    return val;
  };
  self.scrollHeight = function(){
    self.elements.forEach(function(r){
      return r.scrollHeight;
    });
    return;
  };
  self.scrollWidth = function(){
    self.elements.forEach(function(r){
      return r.scrollWidth;
    });
    return;
  };
  self.fullscreen = function() {
    if(self.selector != document){
      var r = document.querySelector(self.selector);
      if(r.requestFullscreen) {
        r.requestFullscreen();
      } else if(r.mozRequestFullScreen) {
        r.mozRequestFullScreen();
      } else if(r.webkitRequestFullscreen) {
        r.webkitRequestFullscreen();
      } else if(r.msRequestFullscreen) {
        r.msRequestFullscreen();
      }
    }
    else {
      if(document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if(document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if(document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if(document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    }
    return self;
};
self.exitfullscreen = function(){
   if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
  return self;
};
  /*colors*/
  self.colors = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dodgerblue: '#1e90ff',
  feldspar: '#d19275',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '*daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred : '#cd5c5c',
  indigo : '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgrey: '#d3d3d3',
  lightgreen: '*90ee90',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslateblue: '#8470ff',
  lightslategray: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370d8',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#d87093',
  papayawhip: '#ffefd5',
  peachpuff: 'ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  violetred: '#d02090',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32'
  };
  /*end of colors*/
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
  };
  /*End of CSS*/
  self.rgbToHex = function(rgb){
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  return self;
  };
  /*end of rgbTo Hex*/
  /*lighten darken color*/
  self.ld = function(col, amt){
  if(col[0] == "r"){
  col = $().rgbToHex(col);
  }
  var usePound = false;
  
  if (col[0] == "#") {
  col = col.slice(1);
  usePound = true;
  }
  
  var num = parseInt(col,16);
  
  var r = (num >> 16) + amt;
  
  if (r > 255) r = 255;
  else if  (r < 0) r = 0;
  
  var b = ((num >> 8) & 0x00FF) + amt;
  
  if (b > 255) b = 255;
  else if  (b < 0) b = 0;
  
  var g = (num & 0x0000FF) + amt;
  
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  
  return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  return self;
  };
  
  return self;
  };
  
  
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



(function(){
_sp_init();
//to ripple
var _toRipple = document.getElementsByClassName("ripple");
Array.prototype.forEach.call(_toRipple,function(r){
r.addEventListener("click",_sp_rippleIt);
});
var _toRipple_dark = document.getElementsByClassName("ripple-dark");
Array.prototype.forEach.call(_toRipple_dark,function(r){
r.addEventListener("click",_sp_rippleIt_dark);
});
var _toRipple_auto = document.getElementsByClassName("ripple-auto");
Array.prototype.forEach.call(_toRipple_auto,function(r){
r.addEventListener("click",_sp_rippleIt_auto);
});

if(document.querySelector(".material-nav.autoopen") == null){
    var _material_nav_opener_ = document.getElementsByClassName("material-nav_opener");
    Array.prototype.forEach.call(_material_nav_opener_,function(r){
    r.addEventListener("click",_sp_materialnav);
    });
}
else {
  if(window.innerWidth < 840){
    var _material_nav_opener_ = document.getElementsByClassName("material-nav_opener");
    Array.prototype.forEach.call(_material_nav_opener_,function(r){
    r.addEventListener("click",_sp_materialnav);
    });
  }
}
})();

function _sp_init(){
var ct = document.querySelector(".container");
var header = document.querySelector(".header");
if (header) {
  document.querySelector('.page').style.position = 'relative';
  document.querySelector('.page').style.top = '72px';
}
if(window.innerWidth>=840 && document.querySelector(".material-nav.autoopen")!==null){
    var _material_nav_opener_ = document.getElementsByClassName("material-nav_opener");
    Array.prototype.forEach.call(_material_nav_opener_,function(r){
    r.style.display = 'none';
    });
    header.style.marginLeft = ct.style.marginLeft = "270px";
    header.style.width = ct.style.width = "calc(100% - 270px)";
    header.style.paddingLeft = '24px';
}
$('.fab-btn').click(function(){
  $('.fab-btn ~ .fab-content').toggle('active');
});
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}

$('.fab-btn.animate').click(function(e){
  e = e || window.event;
  e.target.classList.toggle('doanim');
});
$('.tab').click(function(e){
  e = e || window.event;
  var i, tabcontent, tab;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }
  tab = document.getElementsByClassName("tab");
  for (i = 0; i < tab.length; i++) {
    tab[i].className = tab[i].className.replace(" active", "");
  }
  document.getElementById(e.target.getAttribute('data-tab')).style.display = "block";
  e.currentTarget.className += " active";
});
var __tab_default_ele = document.querySelectorAll(".tab[data-default='true']");
if (typeof __tab_default_ele == 'object'){
Array.prototype.forEach.call(__tab_default_ele,function(r){
  r.click();
});
}
}
/*material nav opener*/
function _sp_materialnav(){
document.getElementById(this.getAttribute("data-target")).style.left="0";
var navcover = document.createElement('div');
navcover.classList.add("navcover_mat");
navcover.addEventListener("click",function(){
document.querySelector(".material-nav").style.left="-290px";
document.body.removeChild(navcover);
});

document.body.appendChild(navcover);

/*adding swipe left to mat nav*/
$(".material-nav").swipe("left",function(){
document.querySelector(".material-nav").style.left="-290px";
document.body.removeChild(navcover);
});
}

/*sp ripple function*/
function _sp_rippleIt(e){
var color;
var cColor = this.getAttribute("data-ripple");
if(cColor){
if(cColor[0] != "#"){
color = "#"+cColor;
}
else{
color = cColor;
}
}
else{
color = "rgba(255,255,255,0.9)";
}
var circle = document.createElement('span');
this.appendChild(circle);

var d,
    width = this.clientWidth,
    height = this.clientHeight;
if(width >= height) {
    d = width;
  } else {
    d = height; 
  }
circle.classList.add("sp-ripple");

circle.style.backgroundColor= color;

var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
scrollTop = window.pageYOffset || document.documentElement.scrollTop;
var coordX = scrollLeft + this.getBoundingClientRect().x;
var coordY = scrollTop + this.getBoundingClientRect().y;
var x = e.pageX - coordX - d / 2;
var y = e.pageY - coordY - d / 2;
circle.style.height = d+"px";
circle.style.width = d+"px";
circle.style.left = x + "px";
circle.style.top = y + "px";
setTimeout(function(){circle.style.display="none";},600);
}

function _sp_rippleIt_dark(e){

var circle = document.createElement('span');
this.appendChild(circle);

var d,
    width = this.clientWidth,
    height = this.clientHeight;
if(width >= height) {
    d = width;
  } else {
    d = height; 
  }
circle.classList.add("sp-ripple");

circle.style.backgroundColor="rgba(0,0,0,0.5)";

var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
scrollTop = window.pageYOffset || document.documentElement.scrollTop;
var coordX = scrollLeft + this.getBoundingClientRect().x;
var coordY = scrollTop + this.getBoundingClientRect().y;
var x = e.pageX - coordX - d / 2;
var y = e.pageY - coordY - d / 2;

circle.style.height = d+"px";
circle.style.width = d+"px";
circle.style.left = x + "px";
circle.style.top = y + "px";
setTimeout(function(){circle.style.display="none";},600);
}
function _sp_rippleIt_auto(e){

var circle = document.createElement('span');
this.appendChild(circle);

var d,
    width = this.clientWidth,
    height = this.clientHeight;
if(width >= height) {
    d = width;
  } else {
    d = height; 
  }
circle.classList.add("sp-ripple");

var style = window.getComputedStyle(e.target),
    bg = style.getPropertyValue("background-color");

circle.style.background = $().ld(bg,90);

var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
scrollTop = window.pageYOffset || document.documentElement.scrollTop;
var coordX = scrollLeft + this.getBoundingClientRect().x;
var coordY = scrollTop + this.getBoundingClientRect().y;
var x = e.pageX - coordX - d / 2;
var y = e.pageY - coordY - d / 2;

circle.style.height = d+"px";
circle.style.width = d+"px";
circle.style.left = x + "px";
circle.style.top = y + "px";
setTimeout(function(){circle.style.display="none";},600);
}
