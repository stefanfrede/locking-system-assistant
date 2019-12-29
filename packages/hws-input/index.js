import { LitElement, html } from 'lit-element';

import { stylesheet } from './styles';

class HwsInput extends LitElement {
  static get styles() {
    return [stylesheet];
  }

  static get properties() {
    return {
      id: { type: String },
      invalid: { type: Boolean },
      type: { type: String },
      value: { type: String },
      width: { type: String },
    };
  }

  constructor() {
    super();

    this.id = 'input';
    this.invalid = false;
    this.type = 'text';
    this.value = '';
    this.width = '100%';
  }

  number({ event, id, value }) {
    return html`
      <input
        @change="${event}"
        class="js-form-field"
        id="${id}"
        max=""
        min="0"
        name="${id}"
        type="number"
        value="${value}"
      />
    `;
  }

  text({ event, id, value }) {
    return html`
      <input
        @blur="${event}"
        class="js-form-field"
        id="${id}"
        type="text"
        name="${id}"
        placeholder="Tür- oder Raumbezeichner"
        value="${value}"
      />
    `;
  }

  render() {
    switch (this.type) {
      case 'number':
        return this.number({
          event: this.event,
          id: this.id,
          value: this.value,
        });
      default:
        return this.text({
          event: this.event,
          id: this.id,
          value: this.value,
        });
    }
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'invalid') {
        const select = this.shadowRoot.querySelector('input');

        if (this.invalid) {
          select.classList.add('is-invalid');
        } else {
          select.classList.remove('is-invalid');
        }
      }

      if (propName === 'width') {
        this.style.setProperty('--hws-input-width', this.width);
      }
    });
  }
}

customElements.define('hws-input', HwsInput);
