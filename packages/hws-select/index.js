import { LitElement, html } from 'lit-element';

import { stylesheet } from './styles';

class HwsSelect extends LitElement {
  static get styles() {
    return [stylesheet];
  }

  static get properties() {
    return {
      disabled: { type: Boolean },
      id: { type: String },
      invalid: { type: Boolean },
      option: { type: String },
      options: { type: Array },
      selected: { type: String },
      width: { type: String },
    };
  }

  constructor() {
    super();

    this.id = 'select';
    this.invalid = false;
    this.option = 'Bitte auswählen';
    this.options = [];
    this.selected = '';
    this.width = '100%';
  }

  get disabled() {
    return !this.options.length;
  }

  render() {
    return html`
      <select
        @change="${this.onChange}"
        ?disabled=${this.disabled}
        class="js-form-field"
        id="${this.id}"
        name="${this.id}"
      >
        <option selected hidden value>
          ${this.option}
        </option>
        ${this.options.map(
          option =>
            html`
              <option ?selected="${option === this.selected}" value="${option}">
                ${option}
              </option>
            `,
        )}
      </select>
    `;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'invalid') {
        const select = this.shadowRoot.querySelector('select');

        if (this.invalid) {
          select.classList.add('is-invalid');
        } else {
          select.classList.remove('is-invalid');
        }
      }

      if (propName === 'width') {
        this.style.setProperty('--hws-select-width', this.width);
      }
    });
  }
}

customElements.define('hws-select', HwsSelect);
