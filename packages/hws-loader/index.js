import { LitElement, css, html } from 'lit-element';

class HwsLoader extends LitElement {
  static get styles() {
    return css`
      :host([hidden]) {
        display: none !important;
      }

      span {
        align-items: center;
        background-color: rgba(234, 237, 240, 0.35);
        bottom: 6.5rem;
        display: flex;
        justify-content: center;
        left: 0;
        position: absolute;
        right: 0;
        top: 2rem;
      }

      span.with-message {
        top: 6rem;
      }

      @keyframes spinner {
        to {
          transform: rotate(360deg);
        }
      }

      svg {
        animation: spinner 1s linear infinite;
        height: 4rem;
        width: 4rem;
      }
    `;
  }

  static get properties() {
    return {
      message: { type: Boolean },
    };
  }

  constructor() {
    super();

    this.message = false;
  }

  render() {
    return html`
      <span class="${this.message ? 'with-message' : ''}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48
              48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48
              48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48
              48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96
              256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49
              48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48
              48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48
              21.49-48 48s21.49 48 48 48 48-21.49
              48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48
              48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"
          />
        </svg>
      </span>
    `;
  }
}

customElements.define('hws-loader', HwsLoader);
