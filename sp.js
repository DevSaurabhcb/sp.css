(function (root, factory) {
  "use strict";
  if(typeof module === "object" && typeof module.exports === "object" ){

  module.exports = root.document ?
  factory( root, true ) :
  function( w ) {
  if ( !w.document ) {
  throw new Error( "Required a window with a document" );
  }
  return factory( w );
  };
  }
  else {
  factory(root);
  }
}(this, function(w){
  var SP = function(selector){
  var self = {};
  self.selector = selector;
  if (typeof self.selector == "object"){
    self.elements = self.selector;
    self.eleLength = self.selector.length;
  }
  else if(self.selector == document){
    self.elements = document.documentElement;
    self.eleLength = 1;
  }
  else{
    self.elements = document.querySelectorAll(selector);
    self.eleLength = self.elements.length;
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
  this.duration = (typeof duration !== 'undefined') ?  duration : 2.5;
  var dur = this.duration;
  this.option = (typeof option !== 'undefined') ?  option : {};
  var opt = this.option;
  toast.classList.add("sp-toast");
  this.animType = (typeof this.option.animate !== 'undefined') ?  this.option.animate : 'translate';
  toast.style.background = (typeof this.option.background !== 'undefined') ?  this.option.background : '#000';
  toast.style.color = (typeof this.option.color !== 'undefined') ?  this.option.color : '#fff';
  toast.innerHTML = this.text;
  
  toast.style.width = (typeof this.option.width !== 'undefined') ?  this.option.width : '100%';
  toast.style.maxWidth = (typeof this.option.maxWidth !== 'undefined') ?  this.option.maxWidth : '100%';
  toast.style.borderRadius = (typeof this.option.borderRadius !== 'undefined') ?  this.option.borderRadius : '4px';
  toast.style.boxShadow = (typeof this.option.boxShadow !== 'undefined') ?  this.option.boxShadow : '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)';
  document.body.appendChild(toast);

  if (typeof this.option.button !== 'undefined') {
    var button = document.createElement('button');
    button.style.background = (typeof this.option.button.background !== 'undefined') ?  this.option.button.background : '#000';
    button.style.color = (typeof this.option.button.color !== 'undefined') ?  this.option.button.color : '#7e57c2';
    button.style.borderRadius = (typeof this.option.button.borderRadius !== 'undefined') ?  this.option.button.borderRadius : '2px';
    button.style.boxShadow = (typeof this.option.button.boxShadow !== 'undefined') ?  this.option.button.boxShadow : 'none';
    button.innerHTML = (typeof this.option.button.text !== 'undefined') ?  this.option.button.text : 'Button';
    toast.appendChild(button);
    if(option.button.callback){
    button.addEventListener('click',function(){option.button.callback();});
    }
  }

  if (this.option.swipeable != false) {
    $('.sp-toast').swipe('right',function(){
      document.body.removeChild(toast);
    });
  }
  if (this.animType == 'translate'){
    toast.style.bottom = "-1000px";
    setTimeout(function(){toast.style.bottom = (typeof opt.bottom !== 'undefined') ?  opt.bottom : '0';},300);  
    setTimeout(function(){
    toast.style.bottom = "-58px";
    setTimeout(function(){
    document.body.removeChild(toast);},300);
    },dur*1000);
  }
  else {
      toast.style.opacity = '0';
      toast.style.bottom = (typeof opt.bottom !== 'undefined') ?  opt.bottom : '0';
      setTimeout(function(){toast.style.opacity = '1';},300);
      setTimeout(function(){toast.style.opacity = '0';
      setTimeout(function(){document.body.removeChild(toast);},300);
      },dur*1000);
  }

  return self;
  };
  /*End sp toast*/
  /*events*/
  self.click = function(callback){
  self.elements.forEach(function(r){
  r.addEventListener('click',callback);
  });
  return self;
  };
  self.rightclick = function(callback){
  self.elements.forEach(function(r){
  r.addEventListener("contextmenu",callback);
  });
  return false;
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
  case "rightclick":
  $(self.selector).rightclick(callback);
  break;
  default:
  self.elements.forEach(function(r){
  r.addEventListener(e,callback);
  });
  }
  return self;
  };
  
  /*now swipe function*/
  self.swipe = function(dir, callback, options){
  self.elements.forEach(function(r){
  r.addEventListener('mousedown',handleStart,false);
  r.addEventListener('mousemove',handleMove,false);
  r.addEventListener('mouseup',handleEnd,false);
  });
  
  var ismousedown = false;
  xi = null,
  yi = null,
  xf = null,
  yf = null,
  direction = undefined,
  da1 = undefined,da2 = undefined,
  t1 = undefined, t2 = undefined,t = undefined,
  o = (typeof options !== 'undefined') ? options : {minLength : 150, doWhileSwipe : false};

  var minLength = (typeof o.minLength !== 'undefined') ? o.minLength : 150;
  var doWhileSwipe = (typeof o.doWhileSwipe !== 'undefined') ? o.doWhileSwipe : false;
  var onstart = (typeof o.onstart !== 'undefined') ? o.onstart : false;

  function handleStart(e){
  ismousedown = true;
  da1 = new Date();
  t1 = da1.getTime();
  e = e || window.event;
  if(__sp_eventMap['mousedown'] == "mousedown"){
    xi = e.clientX;
    yi = e.clientY;
  }
  else {
  xi = e.touches[0].clientX;
  yi = e.touches[0].clientY;
  }
  if (typeof onstart == "function"){
    onstart(xi,yi,t1);
  }
  }
  function handleMove(e){
  e = e || window.event;
  e.preventDefault();
  da2 = new Date();
  t2 = da2.getTime();
  if(ismousedown == true){
    if(__sp_eventMap['mousedown'] == "mousedown"){
      xf = e.clientX;
      yf = e.clientY;
    }
    else {
      xf = e.touches[0].clientX;
      yf = e.touches[0].clientY;
    }
    if(typeof doWhileSwipe == "function"){
      x = xf-xi;
      y = yf-yi;
      angle = Math.atan2(y,x)*(180/Math.PI);
      t = t2 - t1;
      doWhileSwipe({initial:xi,final:xf,traveled:x},{initial:yi,final:yf,traveled:y},angle,direction,t);
    }
  }
  }
  function handleEnd(e){
  e = e || window.event;
  ismousedown = false;
  da2 = new Date();
  t2 = da2.getTime();
  x = xf-xi;
  y = yf-yi;
  angle = Math.atan2(y,x)*(180/Math.PI);
  if(Math.abs(x)>minLength||Math.abs(y)>minLength){
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
  if(dir==direction || dir == "all"){
  t = t2 - t1;
  if (typeof callback == "function") {
  callback({initial:xi,final:xf,traveled:x},{initial:yi,final:yf,traveled:y},angle,direction,t);
  }
  }
  }
  return self;
  };
  /*End of swipe*/
  /*offset*/
  self.offset = function(ask){
    var toreturn = undefined;
    var __sp__to_returnArray = new Array();
    if (self.eleLength > 1){
      self.elements.forEach(function(r){
      var rect = r.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var objectis = {top: rect.top + scrollTop, left: rect.left + scrollLeft};
      if(typeof ask == "undefined"){
      __sp__to_returnArray.push(objectis);
        }
      else {
      __sp__to_returnArray.push(objectis[ask]);
        }
      toreturn = __sp__to_returnArray;
      return toreturn;
      });
    }
    else {
      self.elements.forEach(function(r){
      var rect = r.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var objectis = {top: rect.top + scrollTop, left: rect.left + scrollLeft};
      if(typeof ask == "undefined"){
        toreturn = objectis;
        }
      else {
        toreturn = objectis[ask];
        }
      });
    }
    return toreturn;
  };
  /*toggle class method*/
  self.toggleClass = function(cls){
    self.elements.forEach(function(r){
      r.classList.toggle(cls);
    });
    return self;
  };
  self.addClass = function(cls){
    self.elements.forEach(function(r){
      if (cls.indexOf(" ") > -1){
        var clsnames = cls.split(" ");
        for(var x = 0; x < clsnames.length; x++){
          r.classList.add(clsnames[x]);
        }
      }
      else{
      r.classList.add(cls);
      }
    });
  };
  self.removeClass = function(cls){
    self.elements.forEach(function(r){
      if (cls.indexOf(" ") > -1){
        var clsnames = cls.split(" ");
        for(var x = 0; x < clsnames.length; x++){
          r.classList.remove(clsnames[x]);
        }
      }
      else{
      r.classList.remove(cls);
      }
    });
  };
  self.toggleNoScroll = function(cls){
        if (cls){
          self.elements.forEach(function(r){
          r.classList.toggle(cls);
          });  
        }
        else {
          document.body.classList.toggle("noscroll");
        }
  };
  /*custom material dialog box*/
  self.createDialog = function(o,scrimEvt,shadow){
    $().toggleNoScroll();
    this.scrimEvt = scrimEvt;
    this.shadow = shadow;
    this.option =  o;
    var cLoad = (typeof this.option.load !== 'undefined') ? this.option.load : "not given";
    
    if (cLoad == "not given"){
      var cTitle = (typeof this.option.titleColor !== 'undefined') ? this.option.titleColor : "#000";
      var cText = (typeof this.option.textColor !== 'undefined') ? this.option.textColor : "grey";
      var cContent = (typeof this.option.contentColor !== 'undefined') ? this.option.contentColor : "#000";
      var cButton = (typeof this.option.buttonColor !== 'undefined') ? this.option.buttonColor : "#007bff";
      var cBackground = (typeof this.option.background !== 'undefined') ? this.option.background : "#fff";
      var cContentBorder = (typeof this.option.contentBorder !== 'undefined') ? this.option.contentBorder : "1px solid #eee";
      var cScrim = (typeof this.option.scrimColor !== 'undefined') ?  this.option.scrimColor : "rgba(0,0,0,0.4)";
      var cBorderRadius = (typeof this.option.borderRadius !== 'undefined') ? this.option.borderRadius : "4px";
    }
    var ele = document.createElement("div");
    ele.classList.add("dialog");
    ele.style.borderRadius = cBorderRadius;
    ele.style.background = cBackground;
    if (typeof this.shadow === "undefined" || this.shadow === true){
    ele.classList.add("shadow5");
    }
    var scrim = document.createElement("div");
    scrim.classList.add("scrim");
    scrim.style.background = cScrim;
    if (typeof this.scrimEvt === "undefined" || this.scrimEvt === true){
      scrim.addEventListener('click',function(){
        document.body.removeChild(ele);
        document.body.removeChild(scrim);$().toggleNoScroll();});
    }
    document.body.appendChild(scrim);
    
    if (cLoad == "not given"){
      if (this.option.title !== undefined){
        var eTitle = document.createElement("div");
        eTitle.classList.add("dialog-title");
        eTitle.style.color = cTitle;
        eTitle.innerHTML = this.option.title;
        ele.appendChild(eTitle);
      }
      if (this.option.text !== undefined){
        var eText = document.createElement("div");
        eText.classList.add("dialog-text");
        eText.style.color = cText;
        eText.innerHTML = this.option.text;
        ele.appendChild(eText);
      }
      if (this.option.content !== undefined){
        var eContent = document.createElement("div");
        eContent.classList.add("dialog-content");
        eContent.style.color = cContent;
        eContent.style.border = cContentBorder;
        eContent.innerHTML = this.option.content;
        ele.appendChild(eContent);
      }
    }
    if (this.option.button1 !== undefined){
      var eBtn1 = document.createElement("button");
      eBtn1.classList.add("dialog-btn");
      eBtn1.innerHTML = this.option.button1;
      ele.appendChild(eBtn1);
      if (this.option.action1 === "cancel"){eBtn1.addEventListener("click",function(){
        document.body.removeChild(ele);
        document.body.removeChild(scrim);$().toggleNoScroll();});}
      else if (typeof this.option.action1 === "function"){
        eBtn1.addEventListener('click',function(){
          o.action1(ele.querySelector('.dialog-content'));
          document.body.removeChild(ele);
          document.body.removeChild(scrim);$().toggleNoScroll();});
      }
      else if($().isValidURL(this.option.action1)){
        eBtn1.addEventListener('click',function(){
          window.open(o.action1,'_self');
          document.body.removeChild(ele);
          document.body.removeChild(scrim);$().toggleNoScroll();});
      }
      else {}
    }
    if (this.option.button2 !== undefined){
      var eBtn2 = document.createElement("button");
      eBtn2.classList.add("dialog-btn");
      eBtn2.innerHTML = this.option.button2;
      ele.appendChild(eBtn2);
      if (this.option.action2 === "cancel"){eBtn2.addEventListener("click",function(){
        document.body.removeChild(ele);
        document.body.removeChild(scrim);$().toggleNoScroll();});}
      else if (typeof this.option.action2 === "function"){
        eBtn2.addEventListener('click',function(){
          o.action2(ele.querySelector('.dialog-content'));
          document.body.removeChild(ele);
          document.body.removeChild(scrim);$().toggleNoScroll();});
      }
      else if($().isValidURL(this.option.action2)){
        eBtn2.addEventListener('click',function(){
          window.open(o.action2,'_self');
          document.body.removeChild(ele);
          document.body.removeChild(scrim);$().toggleNoScroll();});
      }
      else {}
    }
    if (this.option.button3 !== undefined){
      var eBtn3 = document.createElement("button");
      eBtn3.classList.add("dialog-btn");
      eBtn3.innerHTML = this.option.button3;
      ele.appendChild(eBtn3);
      if (this.option.action3 === "cancel"){eBtn3.addEventListener("click",function(){
        document.body.removeChild(ele);
        document.body.removeChild(scrim);$().toggleNoScroll();});}
      else if (typeof this.option.action3 === "function"){
        eBtn3.addEventListener('click',function(){
          o.action3(ele.querySelector('.dialog-content'));
          document.body.removeChild(ele);
          document.body.removeChild(scrim);$().toggleNoScroll();});
      }
      else if($().isValidURL(this.option.action3)){
        eBtn3.addEventListener('click',function(){
          window.open(o.action3,'_self');
          document.body.removeChild(ele);
          document.body.removeChild(scrim);$().toggleNoScroll();});
      }
      else {}
    }
    if (ele.querySelectorAll(".dialog-btn")){
    Array.prototype.forEach.call(ele.querySelectorAll(".dialog-btn"),function(e){
      e.style.color = cButton;
    });
    }
    document.body.appendChild(ele);
    return self;
  };
  self.isValidURL = function(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+'((\\d{1,3}\\.){3}\\d{1,3}))'+'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+'(\\?[;&a-z\\d%_.~+=-]*)?'+'(\\#[-a-z\\d_]*)?$','i');
    return pattern.test(str);
};
  self.getcss = function(prop){
    var style, val;
    val = new Array();
    self.elements.forEach(function(r){
    style = window.getComputedStyle(r);
    val.push(style.getPropertyValue(prop));
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
self.width = function(w){
  if(typeof w == "undefined"){
    return $(self.selector).getcss("width");
  }
  else {
    $(self.selector).css({"width": w});
    return self;
  }
};
self.height = function(w){
  if(typeof w == "undefined"){
    return $(self.selector).getcss("height");
  }
  else {
    $(self.selector).css({"height": w});
    return self;
  }
};
self.position = function(w){
  if(typeof w == "undefined"){
    return $(self.selector).getcss("position");
  }
  else {
    $(self.selector).css({"position": w});
    return self;
  }
};
self.background = function(w){
  if(typeof w == "undefined"){
    return $(self.selector).getcss("background");
  }
  else {
    $(self.selector).css({"background": w});
    return self;
  }
};
self.color = function(w){
  if(typeof w == "undefined"){
    return $(self.selector).getcss("color");
  }
  else {
    $(self.selector).css({"color": w});
    return self;
  }
};
self.x = function(x){
  if(typeof w == "undefined"){
    return $(self.selector).getcss("x");
  }
  else {
    $(self.selector).css({"x": w});
    return self;
  }
};
self.y = function(y){
  if(typeof w == "undefined"){
    return $(self.selector).getcss("y");
  }
  else {
    $(self.selector).css({"y": w});
    return self;
  }
};
self.display = function(w){
  if(typeof w == "undefined"){
    return $(self.selector).getcss("display");
  }
  else {
    $(self.selector).css({"display": w});
    return self;
  }
};
self.vibrate = function(t){
  if (typeof window.navigator.vibrate == "function"){
    var time = (typeof t == 'undefined') ? 200 : t;
    window.navigator.vibrate(time);
  }
  return self;
};
/*child methods*/
self.addChild = function(e){
  self.elements.forEach(function(r){r.appendChild(e);});
  return self;
};
self.removeChild = function(e){
  self.elements.forEach(function(r){r.removeChild(e);});
  return self;
};
self.toggleChild = function(e){
  self.elements.forEach(function(r){
    if(r.contains(e)){
      r.removeChild(e);
    }
    else {
      r.addChild(e);
    }
  });
  return self;
};
/*a few other basic utilities*/

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
  self.elements.forEach(function(r){
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


SP.noConflict = function(c){
	if (window.$ === SP){
		window.$ = _$;
	}
	if (c && window.SP === SP){
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
//here is the declaration of the variables
var __prevScrollpos = window.pageYOffset;
var __sEles = document.querySelectorAll('.sticky');
if (__sEles) {
  var __sp_ot = [];
  Array.prototype.forEach.call(__sEles,function(r){
    __sp_ot.push(r.offsetTop);
  });
}
var __sp_eventMap = {};

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
//function to test touch and mouse events
var eventReplacement = {
    "mousedown": ["touchstart mousedown", "mousedown"],
    "mouseup": ["touchend mouseup", "mouseup"],
    "click": ["touchstart click", "click"],
    "mousemove": ["touchmove mousemove", "mousemove"]
};
for (i in eventReplacement) {
    if (typeof window["on" + eventReplacement[i][0]] == "object") {
        __sp_eventMap[i] = eventReplacement[i][0];
    } 
    else {
        __sp_eventMap[i] = eventReplacement[i][1];
    };
 };
})();

function _sp_init(){
  var ct = document.querySelector(".container");
  var header = document.querySelector(".header");
  if (header && !header.classList.contains('bottom')){
    if (document.querySelector('.page')){
      var hEle = document.querySelector('.page');
    hEle.style.position = 'relative';
    hEle.style.top = window.getComputedStyle(document.querySelector(".header")).getPropertyValue('height');
    }
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
    if(document.querySelector('.fab-btn ~ .fab-content')){
      $('.fab-btn ~ .fab-content').toggle('active');
    }
  });
  var fabs = document.querySelectorAll('.fab');
  Array.prototype.forEach.call(fabs,function(f){
    var fc = f.querySelector('.fab-content');
    var fb = f.querySelector('.fab-btn');
    if (fc && fb){
      if (fb.classList.contains('fab-center')){
        fc.classList.add('center');
      }
      else if (fb.classList.contains('fab-top-left')){
        fc.classList.add('sp-fab-content-top-left');
      }
      else {
        fc.classList.add('sp-fab-content-default');
      }
    }
  });
  var acc = document.getElementsByClassName("collapse-btn");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      var icon = this.querySelector(".material-icons");
      if (icon){
        icon.classList.toggle("rotate180");
      }
      var panel = this.nextElementSibling;
      if (panel.style.display == "block"){
        panel.style.maxHeight = "0px";
        setTimeout(function(){panel.style.display = "none";},200);
      } else {
        panel.style.display = "block";
        panel.style.maxHeight = panel.scrollHeight + "px";
      } 
    });
  }
//init data hover, data active, data click, data press, data right click etc
  var _d_hvr = document.querySelectorAll("[data-hover]");
  var _d_hvr_cnames = undefined;
  Array.prototype.forEach.call(_d_hvr,function(r){
    _d_hvr_cnames = r.getAttribute("data-hover");
    if (_d_hvr_cnames.indexOf(" ")> -1) {
      _d_hvr_cnames_array = _d_hvr_cnames.split(" ");
      r.addEventListener("mouseenter",function(){
        for(var x = 0; x < _d_hvr_cnames_array.length; x++){
          r.classList.add(_d_hvr_cnames_array[x]);
        }
      });
      r.addEventListener("mouseleave",function(){
        for(var x = 0; x < _d_hvr_cnames_array.length; x++){
          r.classList.remove(_d_hvr_cnames_array[x]);
        }
      });
    }
    else{
      r.addEventListener("mouseenter",function(){r.classList.add(_d_hvr_cnames);});
      r.addEventListener("mouseleave",function(){r.classList.remove(_d_hvr_cnames);});
  }
  });
  var _d_actv = document.querySelectorAll("[data-active]");
  var _d_atcv_cnames = undefined;
  Array.prototype.forEach.call(_d_actv,function(r){
    _d_actv_cnames = r.getAttribute("data-active");
    if (_d_actv_cnames.indexOf(" ")> -1) {
      _d_actv_cnames_array = _d_actv_cnames.split(" ");
      r.addEventListener("mousedown",function(){
        for(var x = 0; x < _d_actv_cnames_array.length; x++){
          r.classList.add(_d_actv_cnames_array[x]);
        }
      });
      r.addEventListener("mouseup",function(){
        for(var x = 0; x < _d_actv_cnames_array.length; x++){
          r.classList.remove(_d_actv_cnames_array[x]);
        }
      });
    }
    else{
      r.addEventListener("mousedown",function(){r.classList.add(_d_actv_cnames);});
      r.addEventListener("mouseup",function(){r.classList.remove(_d_actv_cnames);});
  }
  });

  var _count = 0;
  Array.prototype.forEach.call(document.querySelectorAll(".header"),function(ele){
    if (ele.querySelector('.right-icon')){
      var elesIcon = ele.querySelectorAll('.right-icon');
      var numcount = 16;
      Array.prototype.forEach.call(elesIcon,function(r){
        numcount += 48;
      });
      ele.style.paddingRight = String(numcount) + 'px';
    }
    if (ele.querySelector('.left-icon')){
      ele.style.paddingLeft = "72px";
    }
    var st = window.getComputedStyle(ele);
    var val = parseInt(st.getPropertyValue('height'));
    if (val > 56){
      ele.style.paddingTop = 72 + 'px';
      ele.style.paddingBottom = 28 + 'px';
      ele.style.fontSize = "24px";
    }
  });

  if (document.querySelector('.bottom-navigation .wrapper')){
    var count_eles_bn = 0;
    var _bn = document.querySelector('.bottom-navigation .wrapper');
    var _bn_w = 0;
    var _bn_eles = _bn.querySelectorAll('.element');
    Array.prototype.forEach.call(_bn_eles,function(r){
      count_eles_bn++;
      _bn_w += parseInt(window.getComputedStyle(r).getPropertyValue('width'));
    });
    _bn.style.width = _bn_w + 'px';
  }

}
//end of init function
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
$(".chip .close").click(function(e){
  e = e || window.event;
  e.target.parentElement.style.display = 'none';
});
/*material nav opener*/
function _sp_materialnav(){
document.getElementById(this.getAttribute("data-target")).style.left="0";
var navcover = document.createElement('div');
navcover.classList.add("scrim");
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
window.onscroll = function(){
  if (typeof atScroll === "function"){atScroll();}
  if (__sEles){
    for (var i = 0; i < __sp_ot.length; i++){
    if(window.pageYOffset >= __sp_ot[i]){__sEles[i].classList.add("sp-sticky");}
    else{__sEles[i].classList.remove('sp-sticky')}
    }
  }
  
  var __autohideTop__ele = document.querySelectorAll(".autohideTop");
  var __autohideBottom__ele = document.querySelectorAll(".autohideBottom");
  if (__autohideTop__ele || __autohideBottom__ele) {
    var __currentScrollPos = window.pageYOffset;
    if (__prevScrollpos > __currentScrollPos){
      if (__autohideTop__ele){
      Array.prototype.forEach.call(document.querySelectorAll(".autohideTop"),function(r){r.style.top = "0"});
      }
      if (__autohideBottom__ele){
      Array.prototype.forEach.call(document.querySelectorAll(".autohideBottom"),function(r){r.style.bottom = "0"});
      }
    } else {
      if (__autohideTop__ele){
      Array.prototype.forEach.call(document.querySelectorAll(".autohideTop"),function(r){r.style.top = "-500px"});
      }
      if (__autohideBottom__ele){
      Array.prototype.forEach.call(document.querySelectorAll(".autohideBottom"),function(r){r.style.bottom = "-500px"});
      }
    }
    __prevScrollpos = __currentScrollPos;
  }

  if (document.querySelector('.header.extended')){
    var extheader = document.querySelector('.header.extended');
    if(window.pageYOffset > 0){
      var _s = extheader.style;
      _s.paddingTop = _s.paddingBottom = 0 + 'px';
      _s.fontSize = "20px";
      _s.lineHeight = '56px';
    }
    else {
      var _s = extheader.style;
      _s.paddingTop = '72px';
      _s.paddingBottom = 28 + 'px';
      _s.fontSize = "24px";
      _s.lineHeight = 'initial';
    }
  }
};