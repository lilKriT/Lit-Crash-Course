import { LitElement, html } from "lit";

export class TodoList extends LitElement {
  static get properties() {
    return {
      message: {
        text: { type: String },
      },
    };
  }

  constructor() {
    super();
    this.message = "Hello Task";
  }

  render() {
    return html`<p>${this.message}</p>`;
  }
}

customElements.define("todo-list", TodoList);
