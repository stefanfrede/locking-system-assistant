import { LitElement, html } from 'lit-element';

import { stylesheet } from './styles.js';

class HwsCheckbox extends LitElement {
  static get styles() {
    return [stylesheet];
  }

  static get properties() {
    return {
      checked: { type: Boolean },
      id: { type: String },
      invalid: { type: Boolean },
      key: { type: Number },
    };
  }

  constructor() {
    super();

    this.checked = false;
    this.id = 'key-0-0';
    this.invalid = false;
    this.key = 0;
  }

  selectKey(e) {
    const checked = e.target.checked;

    this.dispatchEvent(
      new CustomEvent('selectKey', {
        bubbles: true,
        composed: true,
        detail: { checked, key: this.key },
      }),
    );
  }

  render() {
    return html`
      <div>
        <input
          @change="${this.selectKey}"
          ?checked="${this.checked}"
          aria-label="${`Schlüssel ${this.key + 1}`}"
          class="js-form-field"
          id="${this.id}"
          name="${this.id}"
          type="checkbox"
        />
        <label for="${this.id}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206
              0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192
              312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203
              36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998
              9.997-26.207 9.997-36.204-.001z"
            />
          </svg>
        </label>
      </div>
    `;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'invalid') {
        const chk = this.shadowRoot.querySelector('[type=checkbox]');

        if (this.invalid) {
          chk.classList.add('is-invalid');
        } else {
          chk.classList.remove('is-invalid');
        }
      }
    });
  }
}

customElements.define('hws-checkbox', HwsCheckbox);
