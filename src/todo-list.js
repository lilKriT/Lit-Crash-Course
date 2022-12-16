import { LitElement, html } from "lit";

export class TodoList extends LitElement {
  static get properties() {
    return {
      _tasks: { state: true },
      hideCompleted: {},
    };
  }

  constructor() {
    super();
    this._tasks = [{ text: "Write a task list", completed: false }];
    this.hideCompleted = false;
  }

  addTask() {
    alert("Added");
  }

  removeTask() {
    alert("Removed");
  }

  render() {
    const items = 0;

    return html`
      <div>
        <h1>Tasks:</h1>
        <ul></ul>
        <input type="text"></input>
        <button @click=${this.addTask}>Add a task</button>
        <input type="checkbox"></input>
      </div>
    `;
  }
}

customElements.define("todo-list", TodoList);
