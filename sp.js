(function (root, factory){
  "use strict";
  if(typeof module === "object" && typeof module.exports === "object"){

  module.exports = root.document ?
  factory(root, true) :
  function(w){
  if (!w.document){
  throw new Error("Required a window with a documentElement");
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
  //now distinguish or classify the selector type
  //this is for array or nodes of elements
  //sType is selector type
  // e for element, d for document, s for css selected elements
  if (typeof self.selector == "object"){
    self.elements = self.selector;
    self.eleLength = self.selector.length;
    self.sType = "e";
  }
  //if selector is document object
  else if(self.selector == document){
    self.elements = document.documentElement;
    self.eleLength = 0;
    self.sType = "d";
  }
  //if selector is some CSS selector
  else if(typeof self.selector == "string"){
    self.elements = document.querySelectorAll(self.selector);
    self.eleLength = self.elements.length;
    self.sType = "s";
  }
  else {
    self.selector = "none";
    self.eleLength = "undefined";
    self.sType = "undefined";
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
  /*sp snackbar*/
  self.createSnackbar = function(text,duration,option){
    var sb = document.createElement('div');
    this.text = text ;
    this.duration = (typeof duration !== 'undefined') ?  duration : 2.5;
    var dur = this.duration;
    this.option = (typeof option !== 'undefined') ?  option : {};
    var opt = this.option;
    sb.classList.add("sp-snackbar");
    this.animType = (typeof this.option.animate !== 'undefined') ?  this.option.animate : 'translate';
    sb.style.background = (typeof this.option.background !== 'undefined') ?  this.option.background : '#000';
    sb.style.color = (typeof this.option.color !== 'undefined') ?  this.option.color : '#fff';
    sb.innerHTML = this.text;
    
    sb.style.width = (typeof this.option.width !== 'undefined') ?  this.option.width : '100%';
    sb.style.maxWidth = (typeof this.option.maxWidth !== 'undefined') ?  this.option.maxWidth : '100%';
    sb.style.borderRadius = (typeof this.option.borderRadius !== 'undefined') ?  this.option.borderRadius : '0px';
    sb.style.boxShadow = (typeof this.option.boxShadow !== 'undefined') ?  this.option.boxShadow : '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)';
    document.body.appendChild(sb);

    if (typeof this.option.button !== 'undefined') {
      var button = document.createElement('button');
      button.style.background = (typeof this.option.button.background !== 'undefined') ?  this.option.button.background : '#000';
      button.style.color = (typeof this.option.button.color !== 'undefined') ?  this.option.button.color : '#7e57c2';
      button.style.borderRadius = (typeof this.option.button.borderRadius !== 'undefined') ?  this.option.button.borderRadius : '2px';
      button.style.boxShadow = (typeof this.option.button.boxShadow !== 'undefined') ?  this.option.button.boxShadow : 'none';
      button.innerHTML = (typeof this.option.button.text !== 'undefined') ?  this.option.button.text : 'Button';
      sb.appendChild(button);
      if(option.button.callback){
      button.addEventListener('click',function(){option.button.callback();});
      }
    }

    if (this.option.swipeable != false) {
      $('.sp-snackbar').swipe('right',function(){
        document.body.removeChild(sb);
      });
    }
    if (this.animType == 'translate'){
      sb.style.bottom = "-1000px";
      setTimeout(function(){sb.style.bottom = (typeof opt.bottom !== 'undefined') ?  opt.bottom : '0';},300);  
      setTimeout(function(){
      sb.style.bottom = "-58px";
      setTimeout(function(){
      document.body.removeChild(sb);},300);
      },dur*1000);
    }
    else {
        sb.style.opacity = '0';
        sb.style.bottom = (typeof opt.bottom !== 'undefined') ?  opt.bottom : '0';
        setTimeout(function(){sb.style.opacity = '1';},300);
        setTimeout(function(){sb.style.opacity = '0';
        setTimeout(function(){document.body.removeChild(sb);},300);
        },dur*1000);
    }

    return self;
  };
  /*End sp snackbar*/
  self.createToast = function(text,duration,options){
    var t = (typeof text != "undefined") ? text : "";
    var d = (typeof duration != "undefined") ? duration : 1.5;
    var o = (typeof options != "undefined") ? options : {background: "#eee",color:'#000'};
    var b = (typeof o.background != "undefined") ? o.background : "#eee";
    var c = (typeof o.color != "undefined") ? o.color : "#000";
    var toast = document.createElement("div");
    toast.innerText = t;
    $(toast).addClass("spToast");
    $(toast).css({zIndex: $().maxZ() + 10,background:b,color:c});
    document.body.appendChild(toast);
    setTimeout(function(){
      document.body.removeChild(toast);
    },d*1000);
  };

  // custom sb
  self.customsb = function(c,t){
    document.body.innerHTML += c;
    setTimeout(document.removeChild(sb),t*1000);
  };
  // action sheet
  self.createSheet = function(content,title,color){
    var t = (typeof title == "undefined") ? '' : title;
    var c = (typeof color == "undefined") ? 'bg-white' : color;
    document.body.innerHTML += `
    <div class="scrim" id="sheetScrim"></div>
      <div class="bottomsheet unselectable" unselectable="on" id="bottomsheet">
        <div class="header fixed none ${c}" id="bottomsheetBar" style="padding-left:72px">
          <i class="material-icons left-icon ripple" id="bottomsheetClose">close</i>
          ${t}
        </div>
        ${content}
      </div>`;
  __sp_bottomsheet();
  $('#sheetScrim').click(function(e){e.target.parentElement.removeChild(e.target);document.getElementById('bottomsheet').parentElement.removeChild(document.getElementById('bottomsheet'));});
  }
  /*events*/
  self.click = function(callback){
    if (self.sType == "e"){
      self.elements.addEventListener('click',callback);
      return self;
    }
    else if (self.sType == "s"){
      self.elements.forEach(function(r){
        r.addEventListener('click',callback);
      });
      return self;
    }
    else {
      return false;
    }
  };
  self.rightclick = function(callback){
    if (self.sType == "e"){
      self.elements.addEventListener('contextmenu',callback);
      return self;
    }
    else if (self.sType == "s"){
      self.elements.forEach(function(r){
        r.addEventListener('contextmenu',callback);
      });
      return self;
    }
    else {
      return false;
    }
  };
  self.dblclick = function(callback){
    if (self.sType == "e"){
      var counts = 0;
      self.elements.addEventListener("click",function(){
        if(counts == 1){
          callback();
        }
        else {
          counts = 1;
          setTimeout(function(){
            counts = 0;
          },300);
        }
      });
      return self;
    }
    else if (self.sType == "s"){
      self.elements.forEach(function(r){
        var counts = 0;
        r.addEventListener("click",function(){
          if(counts == 1){
            callback();
          }
          else {
            counts = 1;
            setTimeout(function(){counts = 0;},300);
          }
      });
    });
      return self;
    }
    else {
      return false;
    }
  };
  self.longpress = function(callback,time){
    var t = 1000;
    if(typeof time != "undefined"){
      t = time*1000;
    }
    if (self.sType == "s"){
      self.elements.forEach(function(r){
        $(r).swipe("any",function(){
        return false;
        },{whileSwipe:function(o){
          if(o.time >= t && (o.x.traveled <= 2 || o.x.traveled >= -2) && (o.y.traveled <= 2 || o.y.traveled >= -2)){callback();}
        }});
      });
    }
    else if(self.sType == "e"){
      $(self.selector).swipe("any",function(){
        return false;
      },{whileSwipe:function(o){
          if(o.time >= t && o.x.traveled == 0 && o.y.traveled == 0){callback();}
        }});
    }
  };
  self.on = function(e,callback,options = {}){
    switch(e) {
    case "swipeleft":
    $(self.selector).swipe("left",callback,options);
    break;
    case "swiperight":
    $(self.selector).swipe("right",callback,options);
    break;
    case "swipedown":
    $(self.selector).swipe("down",callback,options);
    break;
    case "swipeup":
    $(self.selector).swipe("up",callback,options);
    break;
    case "rightclick":
    $(self.selector).rightclick(callback);
    case "dblclick":
    $(self.selector).dblclick(callback);
    break;
    case "longpress":
    $(self.selector).longpress(callback,options);
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
  var ismousedown = false, xi, yi, xf, yf, x, y, direction, da1, da2, t1, t2, t, o, minLength, whileSwipe, onstart;

  if (typeof options == "undefined"){
    o = {minLength : 150, whileSwipe : undefined};
  }
  else {
    o = options;
  }
  if (typeof o.minLength == "undefined"){
    minLength = 150;
  }
  else {
    minLength = o.minLength;
  }
  if (typeof o.whileSwipe == "undefined"){
    whileSwipe = undefined;
  }
  else {
    whileSwipe = o.whileSwipe;
  }
  if (typeof o.onstart == "undefined"){
    onstart = undefined;
  }
  else {
    onstart = o.onstart;
  }

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
    onstart({x:xi,y:yi,time:t1});
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
    if(typeof whileSwipe == "function"){
      x = xf-xi;
      y = yf-yi;
      angle = Math.atan2(y,x)*(180/Math.PI);
      t = t2 - t1;
//{initial:xi,final:xf,traveled:x},{initial:yi,final:yf,traveled:y},angle = -1*angle [it is because the origin or 0,0 is located at top left corner of screen and y is in downward],direction,t
      whileSwipe({x:{initial:xi,final:xf,traveled:x},y:{initial:yi,final:yf,traveled:y},angle:-1*angle,direction:direction,time:t});
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
  if(Math.abs(x) > minLength || Math.abs(y) > minLength){
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
  
    if(dir == direction || dir == "any"){
      t = t2 - t1;
      if (typeof callback == "function") {
        callback({x:{initial:xi,final:xf,traveled:x},y:{initial:yi,final:yf,traveled:y},angle:-1*angle,direction:direction,time:t});
      }
    }
  }
  if (self.sType == "s"){
    self.elements.forEach(function(r){
    if(__sp_eventMap['mousedown'] == "mousedown"){
      r.addEventListener('mousedown',handleStart,false);
      r.addEventListener('mousemove',handleMove,false);
      r.addEventListener('mouseup',handleEnd,false);
    }
    else {
      r.addEventListener('touchstart',handleStart,false);
      r.addEventListener('touchmove',handleMove,false);
      r.addEventListener('touchend',handleEnd,false);
    }
    });
    return self;
  }
  else if (self.sType == "e"){
    if(__sp_eventMap['mousedown'] == "mousedown"){
      self.elements.addEventListener('mousedown',handleStart,false);
      self.elements.addEventListener('mousemove',handleMove,false);
      self.elements.addEventListener('mouseup',handleEnd,false);
    }
    else {
      self.elements.addEventListener('touchstart',handleStart,false);
      self.elements.addEventListener('touchmove',handleMove,false);
      self.elements.addEventListener('touchend',handleEnd,false);
    }
    return self;
  }
  else {
    return false;
  }
  };

  self.withswipe = function(change,callback,target){
    var t = (typeof target == 'undefined') ? self.selector : target;
    var c = change;
    var _l = $(t).offset()[0][c];
    var l,xy;
    switch(c){
      case "left":
        l = parseInt($(t).left());
        xy = 'x';
        break;
      case "top":
        l = parseInt($(t).top());
        xy = 'y';
        break;
      case "right":
        l = parseInt($(t).right());
        xy = 'x';
        break;
      case "bottom":
        l = parseInt($(t).bottom());
        xy = 'y';
        break;
    }
    $(self.selector).swipe("any",function(result){
      return false;
    },{
      'whileSwipe': function(r){
      callback(r);
      $(t).css({c: _l + r[xy].traveled + "px"});
      },
      'onstart': function(r){
         switch(c){
          case "left":
            if (_l != parseInt($(t).left())){
              _l = parseInt($(t).left());
            }
            break;
          case "top":
            if (_l != parseInt($(t).top())){
              _l = parseInt($(t).top());
            }
            break;
          case "right":
            if (_l != parseInt($(t).right())){
              _l = parseInt($(t).right());
            }
            break;
          case "bottom":
            if (_l != parseInt($(t).bottom())){
              _l = parseInt($(t).bottom());
            }
            break;
        }
        $(t).css({c: _l + "px"});
      }
    });
  };
  /*End of swipe*/
  // sp ripple binding methods
  self.bindRipple = function(){
    if (self.sType = "s"){
      Array.prototype.forEach.call(self.elements,function(r){
      r.addEventListener("click",_sp_rippleIt);
      });
    }
    else if (self.sType = "s"){
      self.elements.addEventListener("click",_sp_rippleIt);
    }
    return self;
  };
  self.bindDarkRipple = function(){
    if (self.sType = "s"){
      Array.prototype.forEach.call(self.elements,function(r){
      r.addEventListener("click",_sp_rippleIt_dark);
      });
    }
    else if (self.sType = "s"){
      self.elements.addEventListener("click",_sp_rippleIt_dark);
    }
    return self;
  };
  self.bindAutoRipple = function(){
    if (self.sType = "s"){
      Array.prototype.forEach.call(self.elements,function(r){
      r.addEventListener("click",_sp_rippleIt_auto);
      });
    }
    else if (self.sType = "s"){
      self.elements.addEventListener("click",_sp_rippleIt_auto);
    }
    return self;
  };
  // sp bind a method or a function to selector
  self.bind = function(event,callback){
    if (self.sType == "s"){
      self.elements.forEach(function(r){
        r.addEventListener(event,callback);
      });
    }
    if (self.sType == "e"){
        self.elements.addEventListener(event,callback);
    }
    return self;
  };
  // innerhtml and innertext method
  self.html = function(a){
    if (typeof a != "undefined"){
      if(typeof a == 'string' || typeof a == "number"){
        if (self.sType = "s"){
          self.elements.forEach(function(r){
            r.innerHTML = a;
          });
        }
        else if (self.sType = "e"){
          self.elements.innerHTML = a;
        }
      }
      else {
        console.log("Didn't receive string or number as parameter for HTML method");
      }
      return self;
    }
    else {
      if (self.sType == "s"){
        if (self.eleLength == 1){
          return String(self.elements.forEach(function(r){return r.innerHTML;}));
        }
        else {
          var arr = [];
          self.elements.forEach(function(r){
            arr.push(r.innerHTML);
          });
          return arr;
        }
      }
      else if (self.sType == "e"){
        return self.elements.innerHTML;
      }
    }
  };
  self.text = function(a){
    if (typeof a != "undefined"){
      if(typeof a == 'string' || typeof a == "number"){
        if (self.sType = "s"){
          self.elements.forEach(function(r){
            r.innerText = a;
          });
        }
        else if (self.sType = "e"){
          self.elements.innerText = a;
        }
      }
      else {
        console.log("Didn't receive string or number as parameter for text method");
      }
      return self;
    }
    else {
      if (self.sType == "s"){
        if (self.eleLength == 1){
          return String(self.elements.forEach(function(r){return r.innerText;}));
        }
        else {
          var arr = [];
          self.elements.forEach(function(r){
            arr.push(r.innerText);
          });
          return arr;
        }
      }
      else if (self.sType == "e"){
        return self.elements.innerText;
      }
    }
  };
  self.appendHTML = function(a){
  if(typeof a == 'string' || typeof a == "number"){
    if (self.sType = "s"){
      self.elements.forEach(function(r){
        r.innerHTML += a;
      });
    }
    else if (self.sType = "e"){
      self.elements.innerHTML += a;
    }
  }
  else {
    console.log("Didn't receive string or number as parameter for appendHTML");
  }
    return self;
  };
  self.appendText = function(a){
  if(typeof a == 'string' || typeof a == "number"){
    if (self.sType = "s"){
      self.elements.forEach(function(r){
        r.innerText += a;
      });
    }
    else if (self.sType = "e"){
      self.elements.innerText += a;
    }
  }
  else {
    console.log("Didn't receive string or number as parameter for appendText");
  }
    return self;
  };
  self.prependHTML = function(a){
  if(typeof a == 'string' || typeof a == "number"){
    if (self.sType = "s"){
      self.elements.forEach(function(r){
        r.innerHTML = a + r.innerHTML;
      });
    }
    else if (self.sType = "e"){
      self.elements.innerHTML = a + self.elements.innerHTML;
    }
  }
  else {
    console.log("Didn't receive string or number as parameter for appendHTML");
  }
    return self;
  };
  self.appendText = function(a){
  if(typeof a == 'string' || typeof a == "number"){
    if (self.sType = "s"){
      self.elements.forEach(function(r){
        r.innerText = a + r.innerText;
      });
    }
    else if (self.sType = "e"){
      self.elements.innerText = a + self.elements.innerText;
    }
  }
  else {
    console.log("Didn't receive string or number as parameter for appendText");
  }
    return self;
  };
  /*offset*/
  self.offset = function(ask){
    var toreturn = undefined;
    var __sp__to_returnArray =[];
    if (self.sType == "s"){
      self.elements.forEach(function(r){
      var rect = r.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var objectis = {top: rect.top + scrollTop, left: rect.left + scrollLeft, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height};
      if(typeof ask == "undefined"){
      __sp__to_returnArray.push(objectis);
        }
      else {
      __sp__to_returnArray.push(objectis[ask]);
        }
      toreturn = __sp__to_returnArray;
      });
      return toreturn;
    }
    else if (self.sType == "e"){
      var rect = self.elements.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var objectis = {top: rect.top + scrollTop, left: rect.left + scrollLeft, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height};
      if(typeof ask == "undefined"){
        toreturn = objectis;
        }
      else {
        toreturn = objectis[ask];
        }
      return toreturn;
    }
    else {
      return false;
    }
  };
  /*toggle class method*/
  self.toggleClass = function(cls){
    if (self.sType == "s"){
      self.elements.forEach(function(r){
      r.classList.toggle(cls);
      });
      return self;
    }
    else if (self.sType == "e"){
      self.elements.classList.toggle(cls);
      return self;
    }
    else {
      return false;
    }
  };
  self.addClass = function(cls){
    if (self.sType == "s"){
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
      return self;
    }
    else if (self.sType == "e"){
      if (cls.indexOf(" ") > -1){
          var clsnames = cls.split(" ");
          for(var x = 0; x < clsnames.length; x++){
            self.elements.classList.add(clsnames[x]);
          }
        }
        else{
          self.elements.classList.add(cls);
        }
        return self;
    }
    else {
      return false;
    }
  };
  self.removeClass = function(cls){
    if (self.sType == "s"){
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
      return self;
    }
    else if (self.sType == "e"){
      if (cls.indexOf(" ") > -1){
          var clsnames = cls.split(" ");
          for(var x = 0; x < clsnames.length; x++){
            self.elements.classList.remove(clsnames[x]);
          }
        }
        else{
          self.elements.classList.remove(cls);
        }
        return self;
    }
    else {
      return false;
    }
  };
  self.replaceClass = function(a,b){
    $(self.selector).addClass(b);
    $(self.selector).removeClass(a);
  }
  self.hasClass = function(cls){
    if (self.sType == "s"){
      var _count = 0;
      self.elements.forEach(function(r){
        if (cls.indexOf(" ") > -1){
          var clsnames = cls.split(" ");
          var count = 0;
          for(var x = 0; x < clsnames.length; x++){
            if(r.classList.contains(clsnames[x])){count++;};
          }
          if (count == clsnames.length){_count++;}
        }
        else{
          return r.classList.contains(cls);
        }
      });
      if (_count == self.elements.length){return true;}else {return false;}
    }
    else if (self.sType == "e"){
      if (cls.indexOf(" ") > -1){
          var clsnames = cls.split(" ");
          var count = 0;
          for(var x = 0; x < clsnames.length; x++){
            if(self.elements.classList.contains(clsnames[x])){count++;};
          }
          if (count == clsnames.length){return true;}else{return false;}
        }
        else{
          return self.elements.classList.contains(cls);
        }
    }
    else {
      return false;
    }
  };
  self.attr = function(a,b){
    if (typeof b != "undefined"){
      if (self.sType == "s"){
        self.elements.forEach(function(r){
        r.setAttribute(a,b);
        });
        return self;
      }
      else if (self.sType == "e"){
        self.elements.setAttribute(a,b);
        return self;
      }
      else {
        return false;
      }
    }
    else {
      if (self.sType == "s"){
        var arr = [];
        self.elements.forEach(function(r){
        arr.push(r.getAttribute(a));
        });
        return arr;
      }
      else if (self.sType == "e"){
        return self.elements.getAttribute(a);
      }
      else {
        return false;
      }
    }
  };
  self.removeAttr = function(a){
    if (self.sType == "s"){
        self.elements.forEach(function(r){
        r.removeAttribute(a);
        });
        return self;
      }
      else if (self.sType == "e"){
        self.elements.removeAttribute(a);
        return self;
      }
      else {
        return false;
      }
  };
  self.val = function(){
    if (self.sType == "s"){
      var _v = [];
      self.elements.forEach(function(r){
        _v.push(r.value());
      });
      return _v;
      }
      else if (self.sType == "e"){
        return self.elements.value();
      }
      else {
        return false;
      }
  };
  self.toggleNoScroll = function(){
    document.body.classList.toggle("noscroll");
  };
  /*custom material dialog box*/
  self.createDialog = function(o,scrimEvt,shadow){
    $().toggleNoScroll();
    window.location.hash += "#dialog";
    this.scrimEvt = scrimEvt;
    this.shadow = shadow;
    this.option =  o;
    var cLoad = (typeof this.option.load !== 'undefined') ? this.option.load : "not given";
    var cTitle = (typeof this.option.titleColor !== 'undefined') ? this.option.titleColor : "#000";
    var cText = (typeof this.option.textColor !== 'undefined') ? this.option.textColor : "#000";
    var cContent = (typeof this.option.contentColor !== 'undefined') ? this.option.contentColor : "#000";
    var cButton = (typeof this.option.buttonColor !== 'undefined') ? this.option.buttonColor : "#007bff";
    var cBackground = (typeof this.option.background !== 'undefined') ? this.option.background : "#fff";
    var cContentBorder = (typeof this.option.contentBorder !== 'undefined') ? this.option.contentBorder : "1px solid #eee";
    var cScrim = (typeof this.option.scrimColor !== 'undefined') ?  this.option.scrimColor : "rgba(0,0,0,0.4)";
    var cBorderRadius = (typeof this.option.borderRadius !== 'undefined') ? this.option.borderRadius : "4px";
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
        _$_cancel();
      });
      window.addEventListener("popstate",function(){
        if (document.querySelector('.dialog')){
          _$_cancel();
        }
      });
    }
    else {
        window.addEventListener("popstate",function(e){
          if (document.querySelector('.dialog')){
            history.pushState("#back","The dialog");
            e = e || window.event;
            e.preventDefault(); 
          }
        }); 
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

      if (this.option.button1 !== undefined){
        var eBtn1 = document.createElement("button");
        eBtn1.classList.add("dialog-btn");
        eBtn1.classList.add("ripple-dark");
        eBtn1.innerHTML = this.option.button1;
        ele.appendChild(eBtn1);
        if (this.option.action1 === "cancel"){
          eBtn1.addEventListener("click",_$_cancel);
      }
        else if (typeof this.option.action1 === "function"){
          eBtn1.addEventListener('click',_$_function);
        }
        else if($().isValidURL(this.option.action1)){
          eBtn1.addEventListener('click',_$_visit);
        }
        else {}
      }
      if (this.option.button2 !== undefined){
        var eBtn2 = document.createElement("button");
        eBtn2.classList.add("dialog-btn");
        eBtn2.classList.add("ripple-dark");
        eBtn2.innerHTML = this.option.button2;
        ele.appendChild(eBtn2);
        if (this.option.action2 === "cancel"){
          eBtn2.addEventListener("click",_$_cancel);
        }
        else if (typeof this.option.action2 === "function"){
          eBtn2.addEventListener('click',_$_function);
        }
        else if($().isValidURL(this.option.action2)){
          eBtn2.addEventListener('click',_$_visit);
        }
        else {}
      }
      if (this.option.button3 !== undefined){
        var eBtn3 = document.createElement("button");
        eBtn3.classList.add("dialog-btn");
        eBtn3.classList.add("ripple-dark");
        eBtn3.innerHTML = this.option.button3;
        ele.appendChild(eBtn3);
        if (this.option.action3 === "cancel"){
          eBtn3.addEventListener("click",_$_cancel);
        }
        else if (typeof this.option.action3 === "function"){
          eBtn3.addEventListener('click',_$_function);
        }
        else if($().isValidURL(this.option.action3)){
          eBtn3.addEventListener('click',_$_visit);
        }
        else {}
      }
        if (ele.querySelectorAll(".dialog-btn")){
        Array.prototype.forEach.call(ele.querySelectorAll(".dialog-btn"),function(e){
          e.style.color = cButton;
        });
      }
      // functions to handle clicks
      function _$_cancel(){
        _$_delete();
        if (document.location.hash.indexOf("#dialog") > -1){
          document.location.hash = document.location.hash.replace("#dialog","");
        }
      }

      function _$_visit(){
        window.open(o.action3,'_self');
        _$_delete();
      }

      function _$_function(){
        o.action3(ele.querySelector('.dialog-content'));
        _$_delete();
      }
      function _$_delete(){
        document.body.removeChild(ele);
        document.body.removeChild(scrim);
        $().toggleNoScroll();
      }
    }
    else {
      ele.innerHTML = cLoad;
    }
    document.body.appendChild(ele);
    return self;
  };
  self.create = function(a){
    if(typeof a != undefined && typeof a == "string") return document.createElement(a);
    else return document.createElement('div');
  };
  self.createFullscreenDialog = function(o,back){
    var opt = o;
    document.location.hash = "dialog";
    var t = (typeof opt.title != "undefined") ? opt.title : "";
    var bg = (typeof opt.background != "undefined") ? opt.background : "white";
    var c = (typeof opt.color != "undefined") ? opt.color : "black";
    var b = (typeof opt.button != "undefined") ? opt.button : "not given";
    var a = (typeof opt.action != "undefined") ? opt.action : "not given";
    var cnt = (typeof opt.content != "undefined") ? opt.content : "";
    
    var d = document.createElement("div");
    $(d).addClass("fullscreendialog");
    $(d).css({position:'fixed',left:'0',top:'0',width:"100%",height:'100%',zIndex:$().maxZ() + 10});
    var h = document.createElement("div");
    $(h).addClass('header fixed shadow2');
    h.innerHTML = t;
    $(h).css({background:bg,color:c,paddingLeft:'72px'});
    var i = document.createElement("i");
    $(i).addClass("material-icons left-icon");
    $(i).bindRipple();
    i.addEventListener('click',_$_cancel);
    i.innerHTML = "close";
    h.appendChild(i);
    d.appendChild(h);
    var p = document.createElement("div");
    if (typeof cnt == "object"){p.appendChild(cnt);}
    else {
      $(p).css({height: "calc(100% - 56px)",position:"absolute",left:"0",top:'56px',background:'white',color:'black',width:'100%',padding:'16px 24px'});
      p.innerHTML = cnt;
    }
    d.appendChild(p);
    if (b != "not given"){
      var btn = $().create('button');
      $(btn).addClass("fsDialogBtn");
      $(btn).css({background:bg,color:c});
      btn.innerText = b;
      btn.addEventListener("click",function(){
        _$_cancel();
        a(p);
      });
      h.appendChild(btn);
    }
    document.body.appendChild(d);

    // back button event
    if (typeof this.back === "undefined" || this.back === true){
      window.addEventListener("popstate",function(){
        if (document.querySelector('.fullscreendialog')){
          _$_cancel();
        }
      });
    }
    else {
      window.addEventListener("popstate",function(e){
          if (document.querySelector('.fullscreendialog')){
            history.pushState("#back","The Full screen dialog");
            e = e || window.event;
            e.preventDefault(); 
          }
      });
    }

    function _$_cancel(){
      document.body.removeChild(d);
      if (document.location.hash.indexOf("#dialog") > -1){
          document.location.hash = document.location.hash.replace("#dialog","");
      }
    }
    return self;
  };
  self.isURL = function(str) {
      var pattern = new RegExp('^(https?:\\/\\/)?'+'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+'((\\d{1,3}\\.){3}\\d{1,3}))'+'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+'(\\?[;&a-z\\d%_.~+=-]*)?'+'(\\#[-a-z\\d_]*)?$','i');
      return pattern.test(str);
  };
  self.getcss = function(prop){
    var style, val;
    if (self.sType == "s"){
      val = new Array();
      self.elements.forEach(function(r){
      style = window.getComputedStyle(r);
      val.push(style.getPropertyValue(prop));
      });
      return val;
    }
    else if (self.sType == "e"){
      style = window.getComputedStyle(self.elements);
      val = style.getPropertyValue(prop);
      return val;
    }
    else {
      return false;
    }
  };
  self.scrollHeight = function(){
    if (self.sType == "s"){
      self.elements.forEach(function(r){
      return r.scrollHeight;
    });
    }
    else if (self.sType == "e"){
      return self.elements.scrollHeight;
    }
    else {return false;}
    
  };
  self.scrollWidth = function(){
    if (self.sType == "s"){
      self.elements.forEach(function(r){
        return r.scrollWidth;
      });
    }
    else if (self.sType == "e"){
      return self.elements.scrollWidth;
    }
    else {return false;}
  };
  self.fullscreen = function() {
    if(self.sType != "d"){
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
  else {
    console.log("Found some error with exitfullscreen, please open an issue on github");
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
self.left = function(x){
  if(typeof x == "undefined"){
    return $(self.selector).getcss("left");
  }
  else {
    $(self.selector).css({"left": x + "px"});
    return self;
  }
};
self.top = function(y){
  if(typeof y == "undefined"){
    return $(self.selector).getcss("top");
  }
  else {
    $(self.selector).css({"top": y + "px"});
    return self;
  }
};
self.right = function(x){
  if(typeof x == "undefined"){
    return $(self.selector).getcss("right");
  }
  else {
    $(self.selector).css({"right": x + "px"});
    return self;
  }
};
self.bottom = function(y){
  if(typeof y == "undefined"){
    return $(self.selector).getcss("bottom");
  }
  else {
    $(self.selector).css({"bottom": y + "px"});
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
  if (self.sType == "s"){
  self.elements.forEach(function(r){r.appendChild(e);});
  return self;
  }
  else if (self.sType == "e"){
  self.elements.appendChild(e);
  return self;
  }
  else {return false;}
};
self.removeChild = function(e){
  if (self.sType == "s"){
  self.elements.forEach(function(r){r.removeChild(e);});
  return self;
  }
  else if (self.sType == "e"){
  self.elements.removeChild(e);
  return self;
  }
  else {return false;}
};
self.toggleChild = function(e){
  if (self.sType == "s"){
    self.elements.forEach(function(r){
      if(r.contains(e)){
        r.removeChild(e);
      }
      else {
        r.addChild(e);
      }
    });
    return self;
  }
  else if (self.sType == "e"){
      if(self.elements.contains(e)){
        self.elements.removeChild(e);
      }
      else {
        self.elements.addChild(e);
      }
    return self;
  }
  else {return false;}
};
self.materialNav = function(){
  if ($(".material-nav").left() == "0px"){
    $(".material-nav").left(-290);
    var s = document.querySelector(".scrim");
    s.parentElement.removeChild(s);
  }
  else {
    var s = document.createElement("div");
    s.classList.add("scrim");
    document.body.appendChild(s);
    $(".material-nav").left(0);
    s.addEventListener('click',function(){
      $(".material-nav").left(-290);
      s.parentElement.removeChild(s);
    });
  }
  return self;
};
/*a few other basic utilities*/
  /*colors*/
  self.colors = {
  material: {
  "red": {
    "50": "#ffebee",
    "100": "#ffcdd2",
    "200": "#ef9a9a",
    "300": "#e57373",
    "400": "#ef5350",
    "500": "#f44336",
    "600": "#e53935",
    "700": "#d32f2f",
    "800": "#c62828",
    "900": "#b71c1c",
    "a100": "#ff8a80",
    "a200": "#ff5252",
    "a400": "#ff1744",
    "a700": "#d50000"
  },
  "pink": {
    "50": "#fce4ec",
    "100": "#f8bbd0",
    "200": "#f48fb1",
    "300": "#f06292",
    "400": "#ec407a",
    "500": "#e91e63",
    "600": "#d81b60",
    "700": "#c2185b",
    "800": "#ad1457",
    "900": "#880e4f",
    "a100": "#ff80ab",
    "a200": "#ff4081",
    "a400": "#f50057",
    "a700": "#c51162"
  },
  "purple": {
    "50": "#f3e5f5",
    "100": "#e1bee7",
    "200": "#ce93d8",
    "300": "#ba68c8",
    "400": "#ab47bc",
    "500": "#9c27b0",
    "600": "#8e24aa",
    "700": "#7b1fa2",
    "800": "#6a1b9a",
    "900": "#4a148c",
    "a100": "#ea80fc",
    "a200": "#e040fb",
    "a400": "#d500f9",
    "a700": "#aa00ff"
  },
  "deeppurple": {
    "50": "#ede7f6",
    "100": "#d1c4e9",
    "200": "#b39ddb",
    "300": "#9575cd",
    "400": "#7e57c2",
    "500": "#673ab7",
    "600": "#5e35b1",
    "700": "#512da8",
    "800": "#4527a0",
    "900": "#311b92",
    "a100": "#b388ff",
    "a200": "#7c4dff",
    "a400": "#651fff",
    "a700": "#6200ea"
  },
  "indigo": {
    "50": "#e8eaf6",
    "100": "#c5cae9",
    "200": "#9fa8da",
    "300": "#7986cb",
    "400": "#5c6bc0",
    "500": "#3f51b5",
    "600": "#3949ab",
    "700": "#303f9f",
    "800": "#283593",
    "900": "#1a237e",
    "a100": "#8c9eff",
    "a200": "#536dfe",
    "a400": "#3d5afe",
    "a700": "#304ffe"
  },
  "blue": {
    "50": "#e3f2fd",
    "100": "#bbdefb",
    "200": "#90caf9",
    "300": "#64b5f6",
    "400": "#42a5f5",
    "500": "#2196f3",
    "600": "#1e88e5",
    "700": "#1976d2",
    "800": "#1565c0",
    "900": "#0d47a1",
    "a100": "#82b1ff",
    "a200": "#448aff",
    "a400": "#2979ff",
    "a700": "#2962ff"
  },
  "lightblue": {
    "50": "#e1f5fe",
    "100": "#b3e5fc",
    "200": "#81d4fa",
    "300": "#4fc3f7",
    "400": "#29b6f6",
    "500": "#03a9f4",
    "600": "#039be5",
    "700": "#0288d1",
    "800": "#0277bd",
    "900": "#01579b",
    "a100": "#80d8ff",
    "a200": "#40c4ff",
    "a400": "#00b0ff",
    "a700": "#0091ea"
  },
  "cyan": {
    "50": "#e0f7fa",
    "100": "#b2ebf2",
    "200": "#80deea",
    "300": "#4dd0e1",
    "400": "#26c6da",
    "500": "#00bcd4",
    "600": "#00acc1",
    "700": "#0097a7",
    "800": "#00838f",
    "900": "#006064",
    "a100": "#84ffff",
    "a200": "#18ffff",
    "a400": "#00e5ff",
    "a700": "#00b8d4"
  },
  "teal": {
    "50": "#e0f2f1",
    "100": "#b2dfdb",
    "200": "#80cbc4",
    "300": "#4db6ac",
    "400": "#26a69a",
    "500": "#009688",
    "600": "#00897b",
    "700": "#00796b",
    "800": "#00695c",
    "900": "#004d40",
    "a100": "#a7ffeb",
    "a200": "#64ffda",
    "a400": "#1de9b6",
    "a700": "#00bfa5"
  },
  "green": {
    "50": "#e8f5e9",
    "100": "#c8e6c9",
    "200": "#a5d6a7",
    "300": "#81c784",
    "400": "#66bb6a",
    "500": "#4caf50",
    "600": "#43a047",
    "700": "#388e3c",
    "800": "#2e7d32",
    "900": "#1b5e20",
    "a100": "#b9f6ca",
    "a200": "#69f0ae",
    "a400": "#00e676",
    "a700": "#00c853"
  },
  "lightgreen": {
    "50": "#f1f8e9",
    "100": "#dcedc8",
    "200": "#c5e1a5",
    "300": "#aed581",
    "400": "#9ccc65",
    "500": "#8bc34a",
    "600": "#7cb342",
    "700": "#689f38",
    "800": "#558b2f",
    "900": "#33691e",
    "a100": "#ccff90",
    "a200": "#b2ff59",
    "a400": "#76ff03",
    "a700": "#64dd17"
  },
  "lime": {
    "50": "#f9fbe7",
    "100": "#f0f4c3",
    "200": "#e6ee9c",
    "300": "#dce775",
    "400": "#d4e157",
    "500": "#cddc39",
    "600": "#c0ca33",
    "700": "#afb42b",
    "800": "#9e9d24",
    "900": "#827717",
    "a100": "#f4ff81",
    "a200": "#eeff41",
    "a400": "#c6ff00",
    "a700": "#aeea00"
  },
  "yellow": {
    "50": "#fffde7",
    "100": "#fff9c4",
    "200": "#fff59d",
    "300": "#fff176",
    "400": "#ffee58",
    "500": "#ffeb3b",
    "600": "#fdd835",
    "700": "#fbc02d",
    "800": "#f9a825",
    "900": "#f57f17",
    "a100": "#ffff8d",
    "a200": "#ffff00",
    "a400": "#ffea00",
    "a700": "#ffd600"
  },
  "amber": {
    "50": "#fff8e1",
    "100": "#ffecb3",
    "200": "#ffe082",
    "300": "#ffd54f",
    "400": "#ffca28",
    "500": "#ffc107",
    "600": "#ffb300",
    "700": "#ffa000",
    "800": "#ff8f00",
    "900": "#ff6f00",
    "a100": "#ffe57f",
    "a200": "#ffd740",
    "a400": "#ffc400",
    "a700": "#ffab00"
  },
  "orange": {
    "50": "#fff3e0",
    "100": "#ffe0b2",
    "200": "#ffcc80",
    "300": "#ffb74d",
    "400": "#ffa726",
    "500": "#ff9800",
    "600": "#fb8c00",
    "700": "#f57c00",
    "800": "#ef6c00",
    "900": "#e65100",
    "a100": "#ffd180",
    "a200": "#ffab40",
    "a400": "#ff9100",
    "a700": "#ff6d00"
  },
  "deeporange": {
    "50": "#fbe9e7",
    "100": "#ffccbc",
    "200": "#ffab91",
    "300": "#ff8a65",
    "400": "#ff7043",
    "500": "#ff5722",
    "600": "#f4511e",
    "700": "#e64a19",
    "800": "#d84315",
    "900": "#bf360c",
    "a100": "#ff9e80",
    "a200": "#ff6e40",
    "a400": "#ff3d00",
    "a700": "#dd2c00"
  },
  "brown": {
    "50": "#efebe9",
    "100": "#d7ccc8",
    "200": "#bcaaa4",
    "300": "#a1887f",
    "400": "#8d6e63",
    "500": "#795548",
    "600": "#6d4c41",
    "700": "#5d4037",
    "800": "#4e342e",
    "900": "#3e2723"
  },
  "grey": {
    "50": "#fafafa",
    "100": "#f5f5f5",
    "200": "#eeeeee",
    "300": "#e0e0e0",
    "400": "#bdbdbd",
    "500": "#9e9e9e",
    "600": "#757575",
    "700": "#616161",
    "800": "#424242",
    "900": "#212121"
  },
  "bluegrey": {
    "50": "#eceff1",
    "100": "#cfd8dc",
    "200": "#b0bec5",
    "300": "#90a4ae",
    "400": "#78909c",
    "500": "#607d8b",
    "600": "#546e7a",
    "700": "#455a64",
    "800": "#37474f",
    "900": "#263238"
  }
  },
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
  if (self.sType == "s"){
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
    return self;
  }
  else if (self.sType == "e"){
    for(var prop in o){
    var p = prop.replace(/-([a-z])/g, function (m, w) {
    return w.toUpperCase();
    });
    if(o.hasOwnProperty(prop)){
    self.elements.style[p] = o[prop];
    }
    }
    return self;
  }
  else {return false;}
  }
  };
  /*End of CSS*/
  self.rgbToHex = function(rgb){
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
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
  

  self.get = function(){return self.elements;};
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
 
if(typeof define === "function" && define.amd){
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
// to load
var _toLoad = document.querySelectorAll("[data-load]");
Array.prototype.forEach.call(_toLoad,function(r){
  fetch(r.getAttribute("data-load")).then(function(a){return a.text();}).then(function(b){r.innerHTML = b;});
});
// to ripple
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
  var _d_colors  = ["green","teal","indigo","red","pink","purple","deeppurple","blue","skyblue","orange","brown","bluegrey","primary","warning","info","success","danger","black","white","yellow","steelblue","grey"];
  var _d_ldColor = ["lighten1","lighten2","lighten3","lighten4","darken1","darken2","darken3","darken4"];
  // now the data hover [data-hover]
  var _d_hvr = document.querySelectorAll("[data-hover]");
  var _d_hvr_cnames = undefined;
  var _d_hvr_cnames_replaced = [];
  var _d_hvr_cnames_t_replaced = [];
  var _d_hvr_cnames_ld_replaced = [];
  Array.prototype.forEach.call(_d_hvr,function(r){
    _d_hvr_cnames = r.getAttribute("data-hover");
    if (_d_hvr_cnames.indexOf(" ") > -1) {
      var _d_hvr_cnames_array = _d_hvr_cnames.split(" ");
      r.addEventListener("mouseenter",function(){
        if (_d_hvr_cnames.indexOf("bg-") > -1){
          for(var i in _d_colors){
            if (r.classList.contains("bg-"+_d_colors[i])){
              _d_hvr_cnames_replaced.push(_d_colors[i]);
              r.classList.remove("bg-"+_d_colors[i]);
            }
          }
        }
        if (_d_hvr_cnames.indexOf("text-") > -1){
          for(var i in _d_colors){
            if (r.classList.contains("text-"+_d_colors[i])){
              _d_hvr_cnames_t_replaced.push(_d_colors[i]);
              r.classList.remove("text-"+_d_colors[i]);
            }
          }
        }
        if (_d_hvr_cnames.indexOf("lighten") > -1 || _d_hvr_cnames.indexOf("darken") > -1){
          for(var i in _d_ldColor){
            if (r.classList.contains(_d_ldColor[i])){
              _d_hvr_cnames_ld_replaced.push(_d_ldColor[i]);
              r.classList.remove(_d_ldColor[i]);
            }
          }
        }
        for(var x = 0; x < _d_hvr_cnames_array.length; x++){
          r.classList.add(_d_hvr_cnames_array[x]);
        }
      });
      r.addEventListener("mouseleave",function(){
        for(var x = 0; x < _d_hvr_cnames_array.length; x++){
          r.classList.remove(_d_hvr_cnames_array[x]);
        if (_d_hvr_cnames_replaced.length > 0){
          for(var y = 0; y < _d_hvr_cnames_replaced.length; y++){
          r.classList.add("bg-"+_d_hvr_cnames_replaced[y]);
        }
        }
        if (_d_hvr_cnames_t_replaced.length > 0){
          for(var w = 0; w < _d_hvr_cnames_t_replaced.length; w++){
          r.classList.add("text-"+_d_hvr_cnames_t_replaced[w]);
        }
        }
        if (_d_hvr_cnames_ld_replaced.length > 0){
          for(var z = 0; z < _d_hvr_cnames_ld_replaced.length; z++){
          r.classList.add(_d_hvr_cnames_ld_replaced[z]);
        }
        }
        }
      });
    }
    else{
      r.addEventListener("mouseenter",function(){
        if (_d_hvr_cnames.indexOf("bg-") > -1){
          for(var i in _d_colors){
            if (r.classList.contains("bg-"+_d_colors[i])){
              _d_hvr_cnames_replaced.push(_d_colors[i]);
              r.classList.remove("bg-"+_d_colors[i]);
            }
          }
        }
        if (_d_hvr_cnames.indexOf("text-") > -1){
          for(var i in _d_colors){
            if (r.classList.contains("text-"+_d_colors[i])){
              _d_hvr_cnames_t_replaced.push(_d_colors[i]);
              r.classList.remove("text-"+_d_colors[i]);
            }
          }
        }
        if (_d_hvr_cnames.indexOf("lighten") > -1 || _d_hvr_cnames.indexOf("darken") > -1){
          for(var i in _d_ldColor){
            if (r.classList.contains(_d_ldColor[i])){
              _d_hvr_cnames_ld_replaced.push(_d_ldColor[i]);
              r.classList.remove(_d_ldColor[i]);
            }
          }
        }
        r.classList.add(_d_hvr_cnames);
      });
      r.addEventListener("mouseleave",function(){
        r.classList.remove(_d_hvr_cnames);
        if (_d_hvr_cnames_replaced.length > 0){
          for(var y = 0; y < _d_hvr_cnames_replaced.length; y++){
          r.classList.add("bg-"+_d_hvr_cnames_replaced[y]);
        }
        }
        if (_d_hvr_cnames_t_replaced.length > 0){
          for(var w = 0; w < _d_hvr_cnames_t_replaced.length; w++){
          r.classList.add("text-"+_d_hvr_cnames_t_replaced[w]);
        }
        }
        if (_d_hvr_cnames_ld_replaced.length > 0){
          for(var z = 0; z < _d_hvr_cnames_ld_replaced.length; z++){
          r.classList.add(_d_hvr_cnames_ld_replaced[z]);
        }
        }
      });
  }
  });
  // data active [data-active]
  var _d_actv = document.querySelectorAll("[data-active]");
  var _d_atcv_cnames = undefined;
  var _d_actv_cnames_replaced = [];
  var _d_actv_cnames_t_replaced = [];
  var _d_actv_cnames_ld_replaced = [];
  Array.prototype.forEach.call(_d_actv,function(r){
    var _d_actv_cnames = r.getAttribute("data-active");
    if (_d_actv_cnames.indexOf(" ")> -1) {
      _d_actv_cnames_array = _d_actv_cnames.split(" ");
      r.addEventListener("mousedown",function(){

      if (_d_actv_cnames.indexOf("bg-") > -1){
          for(var i in _d_colors){
            if (r.classList.contains("bg-"+_d_colors[i])){
              _d_actv_cnames_replaced.push(_d_colors[i]);
              r.classList.remove("bg-"+_d_colors[i]);
            }
          }
        }
        if (_d_actv_cnames.indexOf("text-") > -1){
          for(var i in _d_colors){
            if (r.classList.contains("text-"+_d_colors[i])){
              _d_actv_cnames_t_replaced.push(_d_colors[i]);
              r.classList.remove("text-"+_d_colors[i]);
            }
          }
        }
        if (_d_actv_cnames.indexOf("lighten") > -1 || _d_actv_cnames.indexOf("darken") > -1){
          for(var i in _d_ldColor){
            if (r.classList.contains(_d_ldColor[i])){
              _d_actv_cnames_ld_replaced.push(_d_ldColor[i]);
              r.classList.remove(_d_ldColor[i]);
            }
          }
        }
        for(var x = 0; x < _d_actv_cnames_array.length; x++){
          r.classList.add(_d_actv_cnames_array[x]);
        }
      });
      r.addEventListener("mouseup",function(){
        for(var x = 0; x < _d_actv_cnames_array.length; x++){
          r.classList.remove(_d_actv_cnames_array[x]);
        }
        if (_d_actv_cnames_replaced.length > 0){
          for(var y = 0; y < _d_actv_cnames_replaced.length; y++){
          r.classList.add("bg-"+_d_actv_cnames_replaced[y]);
        }
        }
        if (_d_actv_cnames_t_replaced.length > 0){
          for(var w = 0; w < _d_actv_cnames_t_replaced.length; w++){
          r.classList.add("text-"+_d_actv_cnames_t_replaced[w]);
        }
        }
        if (_d_actv_cnames_ld_replaced.length > 0){
          for(var z = 0; z < _d_actv_cnames_ld_replaced.length; z++){
          r.classList.add(_d_actv_cnames_ld_replaced[z]);
        }
        }
      });
    }
    else{
      r.addEventListener("mousedown",function(){
        if (_d_actv_cnames.indexOf("bg-") > -1){
          for(var i in _d_colors){
            if (r.classList.contains("bg-"+_d_colors[i])){
              _d_actv_cnames_replaced.push(_d_colors[i]);
              r.classList.remove("bg-"+_d_colors[i]);
            }
          }
        }
        if (_d_actv_cnames.indexOf("text-") > -1){
          for(var i in _d_colors){
            if (r.classList.contains("text-"+_d_colors[i])){
              _d_actv_cnames_t_replaced.push(_d_colors[i]);
              r.classList.remove("text-"+_d_colors[i]);
            }
          }
        }
        if (_d_actv_cnames.indexOf("lighten") > -1 || _d_actv_cnames.indexOf("darken") > -1){
          for(var i in _d_ldColor){
            if (r.classList.contains(_d_ldColor[i])){
              _d_actv_cnames_ld_replaced.push(_d_ldColor[i]);
              r.classList.remove(_d_ldColor[i]);
            }
          }
        }
        r.classList.add(_d_actv_cnames);
      });
      r.addEventListener("mouseup",function(){
        r.classList.remove(_d_actv_cnames);
        if (_d_actv_cnames_replaced.length > 0){
          for(var y = 0; y < _d_actv_cnames_replaced.length; y++){
          r.classList.add("bg-"+_d_actv_cnames_replaced[y]);
        }
        }
        if (_d_actv_cnames_t_replaced.length > 0){
          for(var w = 0; w < _d_actv_cnames_t_replaced.length; w++){
          r.classList.add("text-"+_d_actv_cnames_t_replaced[w]);
        }
        }
        if (_d_actv_cnames_ld_replaced.length > 0){
          for(var z = 0; z < _d_actv_cnames_ld_replaced.length; z++){
          r.classList.add(_d_actv_cnames_ld_replaced[z]);
        }
        }
      });
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
window.addEventListener("scroll",function(){
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
});
// function to control bottom sheet
function __sp_bottomsheet(){
  var s = document.getElementById('bottomsheet');
  var sb = document.getElementById('bottomsheetBar');
  var h = parseInt($('.bottomsheet').height());
  // if (s.scrollHeight > parseInt($('.bottomsheet').getcss('max-height'))){
    $('.bottomsheet').swipe('up',function(){
      $('.bottomsheet').css({height:'100vh','max-height':'100vh',overflow:'auto'});
      $('#bottomsheetBar').replaceClass('none','block');
    },{minLength: 10});
    $('#bottomsheetClose').click(function(){
      s.parentElement.removeChild(s);document.querySelector('.scrim').parentElement.removeChild(document.querySelector('.scrim'));
    });
    $('.bottomsheet').swipe('down',function(){
      if (parseInt($('.bottomsheet').height()) <= 56){
      $('.bottomsheet').css({height:'0','max-height':'0'});
      setTimeout(function(){s.parentElement.removeChild(s);document.querySelector('.scrim').parentElement.removeChild(document.querySelector('.scrim'));},320);
      }
    },{minLength: 5});
    $('#bottomsheetBar').swipe('down',function(){
      if (parseInt($('.bottomsheet').height()) > 56){
      $('#bottomsheetBar').replaceClass('block','none');
        $('.bottomsheet').css({height:'56px','max-height':'56px',overflow:'hidden'});
      }
    },{minLength: 5});
}
