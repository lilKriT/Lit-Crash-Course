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

## Making it async

Instead of Directive, use AsyncDirective

```
import {directive, AsyncDirective} from 'lit/async-directive.js';

class TimeAgoDirective extends AsyncDirective {
```

It adds a few useful methods:
`setValue()` - basically rerenders
`disconnected()` - unsubscribe
`reconnected()` - subscribe again

## Adding Update / Timer

Example:

```
timer = undefined;

  ensureTimerStarted() {
    if (this.timer === undefined) {
      this.timer = setInterval(() => {
        /* do some periodic work */
      }, 3000);
    }
  }
```

Then run it in update.
Example:

```
update(part, [time]) {
    if (this.isConnected) {
      this.ensureTimerStarted();
    }
    return this.render(time);
  }
```

Update the value:
you need to store it in the class.
update it whenever needed.

```
time;

 update(part, [time]) {
    this.time = time;
    // dont change the rest
  }
```

use `setValue` where needed.

## Add a disconnect

To avoid memory leaks.
Add a method to unsubscribe:

```
ensureTimerStopped() {
    clearInterval(this.timer);
    this.timer = undefined;
  }
```

and call it:

```
disconnected() {
    this.ensureTimerStopped();
  }
```

Then add reconnected:

```
reconnected() {
    this.ensureTimerStarted();
  }
```

You can test it:
remove and re-add an element, for example on click.

```
handleClick() {
    const parent = this.parentNode;
    this.remove();
    setTimeout(() => parent.appendChild(this), 1000);
  }
```

add console logs.

## Use

You can use them in any expression.
`<comment-card user="lit Developer" time=${timeAgo(timeCreated)}`

## SVG patterns

```
const helloHTML = html`
  <svg>
    ${svg`<text>Hello, SVG!</text>`}
  </svg>
`;
```

```
const createElement = (chars) => svg`
  <text
    dominant-baseline="hanging"
    font-family="monospace"
    font-size="24px">
    ${chars}
  </text>
`;
```

```
  static properties = {
    chars: {type: String},
  };

  constructor() {
    super();
    this.chars = 'lit';
  }
```

`<def>` contains svg elements without rendering them.

```
const helloDefs = svg`
  <defs>
    <text id="chars">Hello defs!</text>
  </defs>
`;
```

Then to use a defined element, `<use href="#chars">`

```
const helloDefs = svg`
  <defs>
    <text id="chars">Hello defs!</text>
  </defs>
  <use href="#chars"></use>
`;
```

you can apply effects, like

```
<use
    href="#chars"
    transform="rotate(180, 0,0)">
  </use>
```

`<g>` applies properties to all the children:

```
<g transform="translate(50, 50)">
    <use
      href="#chars"
      transform="rotate(${currRotation}, 0,0)">
    </use>
  </g>
```

## Tile Pattern

Create a clip path:

```
const helloClipPath = svg`
  <clipPath id="rect-clip">
    <rect width="200" height="200"></rect>
  </clipPath>
`;
```

Then refer to it in a rect:

```
const helloTile = svg`
  <rect
    clip-path="url(#rect-clip)"
    width="300"
    height="300"
    fill="#000000">
  </rect>
```

## Repeat a tile with pattern

`<pattern>` repeats an element over 2D space
select `<patternUnits>`, like `userSpaceOnUse`

```
const helloPattern = svg`
  <pattern patternUnits="userSpaceOnUse">
    ${createTile()}
  </pattern>
`;
```

`<pattern>`needs an id, and then add "fill"

```
const helloPattern = svg`
  <pattern
    id="hello-pattern"
    patternUnits="userSpaceOnUse">
    ${createTile()}
  </pattern>
`;

const helloPatternFill = svg`
  <rect fill="url(#hello-pattern)" width="200" height="200"></rect>
`;
```

## Theme pattern with CSS

Adding CSS to SVG

```
const helloSvgCss = css`
  .background {
    fill: #000000;
  }
`;
```

Add a class to an element like this:

```
const helloCssClasses = html`
  <rect class="background"></rect>
`;
```

You can also add properties:

```
const helloCssCustomProperties = css`
  .background {
    fill: var(--background-color, #000000);
  }
`;
```

## Displaying children as slot

Insert `<slot></slot>` in your component.
It will show it's content (children)

```
<my-component>This will be displayed</my-component>
```

## :host

It's basically `this` scope of an element. Useful for styling.

## Creating a tooltip

Make a tooltip component with slot inside. Style it.

```
render() {
    return html`<slot></slot>`;
  }
```

Hide / Show

```
show = () => {
  this.style.cssText = '';
};

hide = () => {
  this.style.display = 'none';
};
```

Hide by default:

```
connectedCallback() {
  super.connectedCallback();
  this.hide();
}
```

Add event listeners:
Define an array of relevant events like this:

```
const enterEvents = ['pointerenter', 'focus'];
const leaveEvents = ['pointerleave', 'blur', 'keydown', 'click'];
```

add event listeners:

```
_target = null;

get target() {
  return this._target;
}

set target(target) {
  // Remove events from existing target
  if (this.target) {
    enterEvents.forEach((name) =>
      this.target.removeEventListener(name, this.show)
    );
    leaveEvents.forEach((name) =>
      this.target.removeEventListener(name, this.hide)
    );
  }
  // Add events to new target
  if (target) {
    enterEvents.forEach((name) => target.addEventListener(name, this.show));
    leaveEvents.forEach((name) => target.addEventListener(name, this.hide));
  }
  this._target = target;
}
```

Not sure what this does:

```
connectedCallback() {
  //...
  this.target ??= this.previousElementSibling;
}
```

`??=` only sets something if it's not set.

Basic positioning:

```
static properties = {
  offset: {type: Number},
};

constructor() {
  super();
  this.offset = 4;
}
```

```
show = () => {
  this.style.cssText = '';
  const {x, y, height} = this.target.getBoundingClientRect();
  this.style.left = `${x}px`;
  this.style.top = `${y + height + this.offset}px`;
};
```

Improve positioning:

```
import {
  computePosition,
  autoPlacement,
  offset,
  shift
} from '@floating-ui/dom';
```

change the positioning code:

```
show = () => {
  this.style.cssText = '';
  computePosition(this.target, this, {
    strategy: 'fixed',
    middleware: [
      offset(this.offset),
      shift(),
      autoPlacement({allowedPlacements: ['top', 'bottom']}),
    ],
  }).then(({x, y}) => {
    this.style.left = `${x}px`;
    this.style.top = `${y}px`;
  });
};
```

Adding animation:
Add a state:

```
static properties = {
  offset: {type: Number},
  showing: {reflect: true, type: Boolean},
};
constructor() {
  super();
  this.offset = 4;
  this.showing = false;
}
```

Then add css:

```
:host {
  /* ... */
  opacity: 0;
  transform: scale(0.75);
  transition: opacity, transform;
  transition-duration:  0.33s;
}

:host([showing]) {
  opacity: 1;
  transform: scale(1);
}
```

Show it:

```
show = () => {
  // ...
  this.showing = true;
};
```

Hide and add method on finishing hiding:

```
hide = () => {
  this.showing = false;
};

finishHide = () => {
  if (!this.showing) {
    this.style.display = 'none';
  }
};
```

Attach finishHide in the constructor:

```
this.addEventListener('transitionend', this.finishHide);
```

Adding lazy loading:

```
static lazy(target, callback) {
  const createTooltip = () => {
    const tooltip = document.createElement('simple-tooltip');
    callback(tooltip);
    target.parentNode!.insertBefore(tooltip, target.nextSibling);
    tooltip.show();
    // We only need to create the tooltip once, so ignore all future events.
    enterEvents.forEach(
      (eventName) => target.removeEventListener(eventName, createTooltip));
  };
  enterEvents.forEach(
    (eventName) => target.addEventListener(eventName, createTooltip));
}
```

Then remove the old tooltip, and add

```
import {SimpleTooltip} from './simple-tooltip.js';

export class MyContent extends LitElement {
  // ...
  firstUpdated() {
    const greeting = this.shadowRoot.getElementById('greeting');
    SimpleTooltip.lazy(greeting, (tooltip) => {
      tooltip.textContent = `${this.name}, there's coffee available in the lounge.`;
    });
  }
```

Using directives

```
setupLazy() {
  this.didSetupLazy = true;
  SimpleTooltip.lazy(this.part.element, (tooltip) => {
    this.tooltip = tooltip;
    this.renderTooltipContent();
  });
}
```

```
import {html, css, LitElement, render} from 'lit';
//...

renderTooltipContent() {
  render(this.tooltipContent, this.tooltip, this.part.options);
}
```

```
<p>
  <span ${tooltip(html`${this.name}, there's coffee available in the lounge.`)}>
    Hello, ${this.name}!
  </span>
</p>
```

```
import {html, css, LitElement, render} from 'lit';
import {Directive, directive} from 'lit/directive.js';

/* playground-fold */
import {computePosition, autoPlacement, offset, shift} from '@floating-ui/dom';

const enterEvents = ['pointerenter', 'focus'];
const leaveEvents = ['pointerleave', 'blur', 'keydown', 'click'];

export class SimpleTooltip extends LitElement {
  static properties = {
    offset: {type: Number},
    showing: {reflect: true, type: Boolean},
  };

  // Lazy creation
  static lazy(target, callback) {
    const createTooltip = () => {
      const tooltip = document.createElement('simple-tooltip');
      callback(tooltip);
      target.parentNode.insertBefore(tooltip, target.nextSibling);
      tooltip.show();
      // We only need to create the tooltip once, so ignore all future events.
      enterEvents.forEach((eventName) =>
        target.removeEventListener(eventName, createTooltip)
      );
    };
    enterEvents.forEach((eventName) =>
      target.addEventListener(eventName, createTooltip)
    );
  }

  static styles = css`
    :host {
      display: inline-block;
      position: fixed;
      padding: 4px;
      border: 1px solid darkgray;
      border-radius: 4px;
      background: #ccc;
      pointer-events: none;
      /* Animate in */
      opacity: 0;
      transform: scale(0.75);
      transition: opacity, transform;
      transition-duration:  0.33s;
    }

    :host([showing]) {
      opacity: 1;
      transform: scale(1);
    }
  `;

  _target = null;

  get target() {
    return this._target;
  }
  set target(target) {
    // Remove events from existing target
    if (this.target) {
      enterEvents.forEach((name) =>
        this.target.removeEventListener(name, this.show)
      );
      leaveEvents.forEach((name) =>
        this.target.removeEventListener(name, this.hide)
      );
    }
    // Add events to new target
    if (target) {
      enterEvents.forEach((name) => target.addEventListener(name, this.show));
      leaveEvents.forEach((name) => target.addEventListener(name, this.hide));
    }
    this._target = target;
  }

  constructor() {
    super();
    // Finish hiding at end of animation
    this.addEventListener('transitionend', this.finishHide);
    this.offset = 4;
    // Attribute for styling "showing"
    this.showing = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.target ??= this.previousElementSibling;
    this.finishHide();
  }

  render() {
    return html`<slot></slot>`;
  }

  show = () => {
    this.style.cssText = '';
    computePosition(this.target, this, {
      strategy: 'fixed',
      middleware: [
        offset(this.offset),
        shift(),
        autoPlacement({allowedPlacements: ['top', 'bottom']}),
      ],
    }).then(({x, y}) => {
      this.style.left = `${x}px`;
      this.style.top = `${y}px`;
    });
    this.showing = true;
  };

  hide = () => {
    this.showing = false;
  };

  finishHide = () => {
    if (!this.showing) {
      this.style.display = 'none';
    }
  };
}
customElements.define('simple-tooltip', SimpleTooltip);

/* playground-fold-end */

class TooltipDirective extends Directive {
  didSetupLazy = false;
  tooltipContent;
  part;
  tooltip;

  // A directive must define a render method.
  render(tooltipContent = '') {}

  update(part, [tooltipContent]) {
    this.tooltipContent = tooltipContent;
    this.part = part;
    if (!this.didSetupLazy) {
      this.setupLazy();
    }
    if (this.tooltip) {
      this.renderTooltipContent();
    }
  }

  setupLazy() {
    this.didSetupLazy = true;
    SimpleTooltip.lazy(this.part.element, (tooltip) => {
      this.tooltip = tooltip;
      this.renderTooltipContent();
    });
  }

  renderTooltipContent() {
    render(this.tooltipContent, this.tooltip, this.part.options);
  }
}

export const tooltip = directive(TooltipDirective);

```

## Styling slotted children:

Use this selector:
`::slotted(*)`

It works same as
`:host` but for slotted elements.

## Making a carousel

Start with the DOM. Add slotted elements:

```
<div>
  <slot></slot>
</div>
```

and style it.

Added a selected property:

```
static properties = { selected: {type: Number} };

selectedInternal = 0;
constructor () {
  super();
  this.selected = 0;
}

get maxSelected() {
  return this.childElementCount - 1;
}

hasValidSelected() {
  return this.selected >= 0 && this.selected <= this.maxSelected;
}

render() {
  if (this.hasValidSelected()) {
    this.selectedInternal = this.selected;
  }
```

To only render the selected element:

```
<div class="fit">
  <slot name="selected"></slot>
</div>
```

```
previous = 0;
updated(changedProperties) {
  if (changedProperties.has('selected') && this.hasValidSelected()) {
    this.updateSlots();
    this.previous = this.selected;
  }
}

updateSlots() {
  this.children[this.previous]?.removeAttribute('slot');
  this.children[this.selected]?.setAttribute('slot', 'selected');
}
```

use this in html

```
<motion-carousel id="carousel" selected="4">
```

Then allow changing of the element
add click event

```
<div class="fit" @click=${this.clickHandler}>
```

```
clickHandler(e) {
  const i = this.selected + (Number(!e.shiftKey) || -1);
  this.selected = i > this.maxSelected ? 0 : i < 0 ? this.maxSelected : i;
  const change = new CustomEvent('change',
    {detail: this.selected, bubbles: true, composed: true});
  this.dispatchEvent(change);
}
```

Adding animations:
update code like this.

```
import {styleMap} from 'lit/directives/style-map.js';

// ...
left = 0;
render() {
  if (this.hasValidSelected()) {
    this.selectedInternal = this.selected;
  }
  const animateLeft = ``;
  const selectedLeft = ``;
  const previousLeft = ``;
  return html`
    <div class="fit"
      @click=${this.clickHandler}
      style=${styleMap({left: animateLeft})}
    >
      <div class="fit" style=${styleMap({left: previousLeft})}>
        <slot name="previous"></slot>
      </div>
      <div class="fit selected" style=${styleMap({left: selectedLeft})}>
        <slot name="selected"></slot>
      </div>
    </div>
  `;
}
```
