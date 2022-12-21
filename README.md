# Lit Crash Course

# Basics

`yarn add lit`

example code:

```
import {LitElement, html} from 'lit';

export class MyElement extends LitElement {
  render() {
    return html`
      <p>Hello world! From my-element.</p>
    `;
  }
}
customElements.define('my-element', MyElement);
```

Add properties:

```
static properties = {
  message: {},
};

constructor() {
  super();
  this.message = 'Hello again.';
}
```

`${this.message}`

Event listeners
`<button @click=${this.handleClick}>Click me!</button>`

```
changeName(event) {
    const input = event.target;
    this.name = input.value;
  }
```

More attributes:
`?disabled=${!this.checked}`

5 types of expressions:

```
<!-- Child nodes -->
<h1>${this.pageTitle}</h1>

<!-- Attribute -->
<div class=${this.myTheme}></div>

<!-- Boolean attribute -->
<p ?hidden=${this.isHidden}>I may be in hiding.</p>

<!-- Property -->
<input .value=${this.value}>

<!-- Event listener -->
<button @click=${() => {console.log("You clicked a button.")}}>...</button>
```

Working with lists

```
${this._listItems.map((item) =>
    html`<li>${item.text}</li>`
  )}
```

Example of a task list

```
${this._listItems.map((item) =>
    html`<li>${item.text}</li>`
  )}

  get input() {
  return this.renderRoot?.querySelector('#newitem') ?? null;
}

addToDo() {
  this._listItems = [...this._listItems,
      {text: this.input.value, completed: false}];
  this.input.value = '';
}
```

Styles
Add this as a class field:

```
static styles = css`
  .completed {
    text-decoration-line: line-through;
    color: #777;
  }
`;
```

They will be scoped to the component, using shadow DOM.

Add classes conditionally:
`class=${item.completed ? 'completed' : ''}`

or use classmap

Map
`import {map} from 'lit/directives/map.js';`
and later

```
<ul>
  ${map(this.items, (item) => html`<li>${item}</li>`)}
</ul>
```

Lit map is useful when you are working with anything that's not a js array.

Range
`import {map} from 'lit/directives/map.js';`
`range(10)`

Repeat
`import {repeat} from 'lit/directives/repeat.js';`

Reactive properties
You need to add this code:

```
static properties = {
    result: {},
  };
```

Lit automatically adds accessors
Mutating doesn't trigger update!
You can trigger it yourself with `requestUpdate(changedProperties)`
You can also override `shouldUpdate(changedProperties)` - by default, it always returns `true`

Example:

```
shouldUpdate(changedProperties) {
    return !(changedProperties.size === 1 && changedProperties.has('duration'));
  }
```

calculating stuff for update
`willUpdate(changedProperties)`

After update
`updated(changedProperties)`

Attributes
Attribute (html):
`<input value="something">`
Property (js):
`input.value = 15;`

Sometimes they have the same names.

You can turn off attribute to property conversion off:
`date: {attribute: false},`
you can also turn on property to attribute conversion:
`reflect: true`

Built in converters:

- String
- Bool
- Number
- Array
- Object

Example:
properties:
`dateStr: {type: String, attribute: "date-str"}`

how to display, the basic way:

```
willUpdate(changed) {
    if (changed.has('dateStr') && this.dateStr) {
      this.date = new Date(this.dateStr);
    }
  }
```

It's better to define a custom attribute converter
example:
new file:

```
'use strict';

export const dateConverter = (locale) => {
 return {
  toAttribute: (date) => {
   return date.toLocaleDateString(locale);
  },
   fromAttribute: (value) => {
    return new Date(value);
   }
 }
}
```

then import
`import {dateConverter} from "./date-converter.js";`

and add converter to property

```
static properties = {
    date: {converter: dateConverter(navigator.language), reflect: true},
  };
```

You won't need dateStr, or willUpdate.

## Async Directives

Directive is a function that updates the value they render after the fact.

Make a directive

```
import {directive, Directive} from 'lit/directive.js';

class TimeAgoDirective extends Directive {
}

export const timeAgo = directive(TimeAgoDirective);
```

Add a render method with the arguments you want

```
render(time) {
    return time.toDateString();
  }
```

How to use it:
import
`import {timeAgo} from './time-ago.js';`

Then call the directive:
`${timeAgo(timeCreated)}`

for working with time, it's useful to get `timeago` npm package
