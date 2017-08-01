# SP.css
Small lightweight framework to develop beautiful design , made by combination of Vanilla javascript and pure css <br/>

>Created by Master Saurabh

No extra framework needed  just add sp.css and sp.js files in your html document and start designing.<br/>
Beautifully designed buttons based on material design colors<br/>
**Buttons**

```html
<button class="sp-btn btn-indigo clickable sp-ripple">Beautiful!!</button>
```

Add 
```css
sp-btn
``` 

class to initiate button , add another class

```css
btn-{colorName}
```

Color names are 

```css
green ,  
teal , 
indigo ,  
red ,  
pink ,  
purple ,  
deeppurple ,  
blue ,  
skyblue ,  
orange ,  
brown , 
bluegrey
```

add another class 

```css
clickable
```
to have clicked effect. <br/>
**To add ripple effect**<br/>
Just add sp-ripple class to add ripple effect to element.
```html
<button class="sp-ripple">Click me</button>
```
```html
<div class="sp-ripple">See any element can have ripple effect</div>
```


**Badge**<br/>
The add a badge just add class sp-badge followed by a badge color (the badge colors are same as btn-colors) except it gets additional class badge-nocolor . Add data-badge attribute which contains the value of badge
```html
<span data-badge="9+" class="sp-badge badge-red">Inbox</span>
```

**Box shadows**<br/>
Add class sp-shadow_1 or sp-shadow_2 or sp-shadow_3 or sp-shadow_4 or sp-shadow_5 to add material based box shadow

```html
<button class="sp-btn btn-green sp-shadow_3">Check me</button>
```

**Background colors**<br/>
Added 5 classes , sp-primary , sp-info , sp-danger , sp-warning and sp-success
```html
<div class="sp-primary sp-shadow_2">Hey check me , am i not great</div>
```


**Toasts**<br/>
create an android like toast (a message box for a few seconds just above the bottom):
using javaseipt

```javascript
//calling toast
sp.createToast("Hey toast!",2);
```

The first parameter gives the text of toast and second gives time in seconds for the toast to be shown<br/>

**Outline**<br/>
This class adds the same color for text and border and makes the background transparent . Add class sp-outline-primary , on the place of primary You can also type warning , info , danger or success

```html
<button class="sp-btn sp-outline-info border-2 border-solid">Cool!</button>
```

```html
<div class="sp-outline-warning border-4 border-dashed">And isn't it great.</div>
```

**Border classes**<br/>
Add classes border-( 1 to 10 ) to give border-width and border-solid , border-dashed , border-dotted or border-doubled for border style
```html
<p class="border-3 border-doubled sp-outline-primary">Hello world awesome day</p>
```
