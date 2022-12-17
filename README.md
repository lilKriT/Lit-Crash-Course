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

Using a map
`import {map} from 'lit/directives/map.js';`
and later

```
<ul>
  ${map(this.items, (item) => html`<li>${item}</li>`)}
</ul>
```

Lit map is useful when you are working with anything that's not a js array.
