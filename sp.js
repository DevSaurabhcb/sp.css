window.onload = function(){
//to ripple
var toRipple = document.getElementsByClassName("sp-ripple");
Array.prototype.forEach.call(toRipple,function(r){
r.addEventListener("click",rippleIt);
});
}

//functions here
function rippleIt(e){
var circle = document.createElement('div');
this.appendChild(circle);

var d = Math.max(this.clientWidth,this.clientHeight);
circle.style.width = circle.style.height = d+"px";

circle.style.left = e.clientX - this.offsetLeft - d/2+"px";
circle.style.top = e.clientY - this.offsetTop - d/2+"px";
circle.classList.add("ripple");
}
var sp = {

createToast : function(text,duration){
var toast = document.createElement('div');
this.text = text ;
this.duration = duration;
this.duration = (typeof this.duration !== 'undefined') ?  this.duration : 2;
toast.style.height = "30px";
toast.style.backgroundColor = "rgba(0,0,0,0.5)";
toast.style.color = "#fff";
toast.style.padding = "5px 10px";
toast.style.position= "fixed";
toast.style.zIndex = "999";
toast.style.bottom = "50px";
toast.style.right = "50%";
toast.style.transform = "translateX(50%)";
toast.style.borderRadius = "10px";
toast.innerHTML = this.text;
document.body.appendChild(toast);
setTimeout(function(){
document.body.removeChild(toast);
},this.duration*1000);
},
}