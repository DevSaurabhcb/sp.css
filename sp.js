window.onload = function(){
//to ripple
var toRipple = document.getElementsByClassName("sp-ripple");
Array.prototype.forEach.call(toRipple,function(r){
r.addEventListener("click",rippleIt);
});
var materialnavopener_ = document.getElementsByClassName("sp-material-nav-opener");
Array.prototype.forEach.call(materialnavopener_,function(r){
r.addEventListener("click",materialnav);
});
if(window.innerWidth<480){
var materialnav_ = document.getElementsByClassName("sp-material-nav");
Array.prototype.forEach.call(materialnav_,function(nav){
/*creating a back button to close the material nav*/
var closemtrlnvbtn = document.createElement('div');
nav.appendChild(closemtrlnvbtn);
/* for modern browsers
closemtrlnvbtn.style.display = "flex";
closemtrlnvbtn.style.alignItems = "center";
closemtrlnvbtn.style.justifyContent = "center";
*/
closemtrlnvbtn.style.textAlign = "center";
closemtrlnvbtn.style.padding = "0";
closemtrlnvbtn.style.position = "absolute";
closemtrlnvbtn.style.left = "10px";
closemtrlnvbtn.style.top = "10px";
closemtrlnvbtn.style.width = "30px";
closemtrlnvbtn.style.height = "30px";
closemtrlnvbtn.style.lineHeight = "29px";
closemtrlnvbtn.classList.add("text-white","sp-black","sp-shadow_3","sp-circle","font-2x");
closemtrlnvbtn.innerHTML = "&larr;";
closemtrlnvbtn.addEventListener("click",function(){nav.style.left="-290px";});
});
}

}
/*material nav opener*/
function materialnav(){
document.getElementById(this.getAttribute("data-target")).style.left="0";
var navcover = document.createElement('div');
navcover.style.width="100%";
navcover.style.height="100%";
navcover.style.left="0";
navcover.style.top="0";
navcover.style.position="fixed";
navcover.style.zIndex="998";
navcover.style.transition="0.4s linear opacity";
navcover.style.backgroundColor="rgba(0,0,0,.4)";
navcover.addEventListener("click",function(){
document.querySelector(".sp-material-nav").style.left="-290px";
document.body.removeChild(navcover);
});

document.body.appendChild(navcover);

/*adding swipe left to nav*/
$(".sp-material-nav").swipe("left",function(){
document.querySelector(".sp-material-nav").style.left="-290px";
document.body.removeChild(navcover);
});

}
/*sp ripple function*/
function rippleIt(e){
var circle = document.createElement('div');
this.appendChild(circle);

var d = Math.max(this.clientWidth,this.clientHeight);
circle.style.width = circle.style.height = d+"px";
if(this.style.background=="#fff"||this.style.background=="white"||this.style.background=="transparent"||this.style.backgroundColor=="#fff"||this.style.backgroundColor=="white"||this.style.backgroundColor=="transparent"){
circle.style.backgroundColor="rgba(0,0,0,0.3)";
}
else{
circle.style.backgroundColor="rgba(255,255,255,0.7)";
}
circle.style.left = e.clientX - this.offsetLeft - d/2+"px";
circle.style.top = e.clientY - this.offsetTop - d/2+"px";
circle.classList.add("ripple");
setTimeout(function(){circle.style.display="none";},500);
}


/*sp function is here as $()*/
function $(selector){
var self = {};
self.selector = selector;
self.element = document.querySelector(selector);

self.createToast = function(text,duration){
var toast = document.createElement('div');
this.text = text ;
this.duration = duration;
this.duration = (typeof this.duration !== 'undefined') ?  this.duration : 1.5;
toast.style.minHeight = "30px";
toast.style.fontSize = "16px";
toast.style.maxWidth = "95%";
toast.style.wordWrap = "break-word";
toast.style.backgroundColor = "rgba(0,0,0,0.7)";
toast.style.color = "#fff";
toast.style.padding = "10px 20px";
toast.style.position= "fixed";
toast.style.zIndex = "999";
toast.style.bottom = "20px";
toast.style.right = "50%";
toast.style.transform = "translateX(50%)";
toast.style.borderRadius = "20px";
toast.innerHTML = this.text;
document.body.appendChild(toast);
setTimeout(function(){
document.body.removeChild(toast);
},this.duration*1000);
}
/*now swipe function*/
self.swipe = function(dir,callback){
self.element.addEventListener('touchstart',handleStart,false);
self.element.addEventListener('touchmove',handleMove,false);

var xi = null;
var yi = null;
var xf = null;
var yf = null;
var direction;
function handleStart(e){
xi = e.touches[0].clientX;
yi = e.touches[0].clientY;
}
function handleMove(e){
if(!xi || !yi){return;}

xf = e.touches[0].clientX;
yf = e.touches[0].clientY;

var x = xi-xf;
var y = yi-yf;
if ( Math.abs(x) > Math.abs(y) ) {/*most significant*/
        if ( x > 0 ) {
            /* left swipe */ 
            direction="left";
        } else {
            /* right swipe */
            direction="right";
        }                       
    } else {
        if ( y > 0 ) {
            /* up swipe */
            direction = "up";
        } else { 
            /* down swipe */
            direction = "down";
        }                                                                 
    }
    /* reset values */
    xi = null;
    yi = null;
if(dir==direction){
callback();
console.log(x+" "+y);
}
}
}

return self;
}