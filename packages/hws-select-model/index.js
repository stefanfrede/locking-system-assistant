import { LitElement, html } from 'lit-element';

import { stylesheet } from './styles/index.js';

class HwsSelectModel extends LitElement {
  static get styles() {
    return [stylesheet];
  }

  static get properties() {
    return {
      model: { type: String },
      models: { type: Array },
    };
  }

  constructor() {
    super();

    this.model = '';
    this.models = [];
  }

  selectModel(e) {
    e.preventDefault();

    this.dispatchEvent(
      new CustomEvent('select-model', {
        bubbles: true,
        composed: true,
        detail: e.target.value,
      }),
    );
  }

  render() {
    return html`
      <select
        @change="${this.selectModel}"
        ?disabled=${!this.models.length}
        id="select-model"
        name="select-model"
      >
        <option selected hidden value>
          Serie auswählen
        </option>
        ${this.models.map(
          (option) =>
            html`
              <option ?selected="${option === this.model}" value="${option}">
                ${option}
              </option>
            `,
        )}
      </select>
    `;
  }
}

customElements.define('hws-select-model', HwsSelectModel);
