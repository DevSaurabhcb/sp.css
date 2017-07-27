window.onload = function(){
var toRipple = document.getElementsByClassName("sp-ripple");
Array.prototype.forEach.call(toRipple,function(r){
r.addEventListener("click",rippleIt);
});

function rippleIt(e){
var circle = document.createElement('div');
this.appendChild(circle);

var d = Math.max(this.clientWidth,this.clientHeight);
circle.style.width = circle.style.height = d+"px";

circle.style.left = e.clientX - this.offsetLeft - d/2+"px";
circle.style.top = e.clientY - this.offsetTop - d/2+"px";
circle.classList.add("ripple");
}
}