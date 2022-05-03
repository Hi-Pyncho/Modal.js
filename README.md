# Modal

This is a small library for creating modal windows.
I used one dependency - [dompurify](https://github.com/cure53/DOMPurify) in my script, to sanitize html in `innerHTML` method.

## Use
You can initialize `Modal` in two ways: 
1) [by setting attributes to a html tag](#set-attributes-to-a-trigger-tag)
2) [call an instance of a class](#call-an-instance-of-a-class)

## Set attributes to a trigger tag
First you need initialize class instance in script.
```js
Modal.init()
```
After that the script will find all the elements with a `data-m-modal` attribute in html.
```html
<button data-m-modal data-type="ajax" data-target="/src/content2.html">Open modal</button>
```
|attribute|description|required|
|---|---|---|
| data-m-modal | with this attribute script can find element | yes |
| data-type | [ajax, selector, image, text] | yes |
| data-target | watch examples from [types part](#types) | yes |
| data-zIndex | by default is `100` | no |
| data-modalWidth | by default is `90%` | no |
| data-modalHeight | by default is `auto` | no |
| data-display | by default is `block` | no |


## Call an instance of a class
|parameter|description|required|
|---|---|---|
| type | [ajax, selector, image, text, node] | yes |
| target | watch examples from [types part](#types) | yes |
| zIndex | by default is `100` | no |
| modalWidth | by default is `90%` | no |
| modalHeight | by default is `auto` | no |
| display | by default is `display` | no |
| openNow | by default is `false` [here an example](#text) | no |

## Types

#### Ajax
Put an absolute path to the file with content.
```html
<button data-m-modal data-type="ajax" data-target="/src/content2.html">Open modal</button>
```
```js
new Modal({
  trigger: document.querySelector('selector'),
  type: 'ajax',
  target: '/src/content2.html',
})
```
#### Selector
Here you can put an element selector in current html page.
By default, if you hide element by `display:none`, script set the element `display: block`. But you can set by attribute `data-display` this parameter.
```html
<button data-m-modal data-type="selector" data-target=".nodeClass">Open modal</button>
```
```js
new Modal({
  trigger: document.querySelector('selector'),
  type: 'selector',
  target: '.nodeClass',
})
```
#### Image
```html
<button data-m-modal data-type="selector" data-target="path_to_image">Open modal</button>
```
```js
new Modal({
  trigger: document.querySelector('selector'),
  type: 'image',
  target: 'path_to_image',
})
```
#### Text
If you just want show the text (for example, show to the user his mistake or an error).
Also you can add optional parameter `openNow` in a script - it will open a modal window immediately.
```html
<button data-m-modal data-type="text" data-target="Hello! You got an error!">Open modal</button>
```
```js
new Modal({
  trigger: document.querySelector('selector'),
  type: 'text',
  target: 'Hello! You got an error!',
  openNow: true
})
```
#### Node
If you dynamically create node in a script, you can put it in the modal.
```js
const paragraph = document.createElement('p')
paragraph.classList.add('className')
paragraph.textContent = 'Bye!'

new Modal({
  trigger: document.querySelector('selector'),
  type: 'node',
  target: paragraph,
})
```
---
Also you can put a modal trigger into another modal window, for example:
```html
<!-- here a document called by ajax (content.html) -->
<p>
  Read about our <button data-m-modal data-type="ajax" data-target="/another.html">benefits!</button>
</p>

<!-- here the first modal trigger -->
<p>
  <button data-m-modal data-type="ajax" data-target="/content.html">open it!</button>
</p>

```
