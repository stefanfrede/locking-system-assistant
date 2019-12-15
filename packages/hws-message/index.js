import { LitElement, html } from 'lit-element';

import { stylesheet } from './styles/index.js';

class HwsMessage extends LitElement {
  static get styles() {
    return [stylesheet];
  }

  static get properties() {
    return {
      message: { type: String },
    };
  }

  constructor() {
    super();

    this.message = '';
    this.msgType = 'info';
  }

  dismissMessage(e) {
    this.dispatchEvent(
      new CustomEvent('dismissMessage', {
        bubbles: true,
        composed: true,
        detail: e.target,
      }),
    );
  }

  render() {
    return html`
      <div class="alert alert-dismissible alert-${this.msgType}" role="alert">
        ${this.message}
        <button
          @click="${this.dismissMessage}"
          type="button"
          class="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">
              <path
                d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19
                0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28
    75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28
    32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24
    22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28
    32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
              />
            </svg>
          </span>
        </button>
      </div>
    `;
  }
}

customElements.define('hws-message', HwsMessage);
