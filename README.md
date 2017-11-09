# SP.css
Small lightweight framework to develop beautiful design , made by combination of Vanilla javascript and pure css <br/>

>Created by Master Saurabh

No extra framework needed  just add sp.css and sp.js files in your html document and start designing.<br/>
Beautifully designed buttons based on material design colors<br/>

**Basic utilities**

Start your code with sp-container

```html
<div class="sp-container">
  
</div>
```
Or sp-container-full to avoid different size according to screen.

Add small attribute or class or element to size them 85% of current font size.

Add class 'full-width' or attribute to set the width to 100%.

Add class 'center' or attribute to centerize an element.

Add pull-left or pull-right classes to set left or right margins to 0.

Add classes 'font-2x','font-3x','font-4x','font-5x' to set the size of font in multiples of the current font size. The class 'font-20' has been added to size the font to 20px.

Add class 'sp-curved-border' to set border-radius property to 4px.

Add class 'sp-no-curved-border' to remove border-radius.

Add class 'sp-circle' to set border-radius to 50%.

Add class or attribute 'bold' to bold the typeface.

Add class or attribute 'block' / 'padding' to block/give padding to the element.

**Grid system**

To use our grid system you must add a class 'sp-row' to a container div box.

```html
<div class="sp-row">
  
</div>
```

Our grid system can show upto 12 columns in a row and they are classified as per the window's screen width.
The grid system has four tiers : xs (phones), sm (tablets), md (desktops), and lg (larger desktops).
The sum of all the columns value should be 12 to make a good grid.

```html
<div class="col-xs-6 col-sm-4">
</div>
<div class="col-xs-6 col-sm-4">
</div>
<div class="col-xs-6 col-sm-4">
</div>
```

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
bluegrey,
default,
primary,
danger,
success,
info,
warning
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
To set background color set the class "sp-" followed by following color names 

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
bluegrey,
white,
black,
primary,
danger,
success,
info,
warning
```


```html
<div class="sp-primary sp-shadow_2">Hey check me , am i not great</div>
```


**Toasts**<br/>
create an android like toast (a message box for a few seconds just above the bottom):
using javascript

```javascript
//calling toast
$().createToast("Hey toast!",2);
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

**SP-SCROLLBAR**

Our scrollbar currently works only in chrome browsers . To create one you need to add a class "sp-scrollbar" to any of your element.

```html
<div class="sp-scrollbar">
•••some content here•••
</div>
```
