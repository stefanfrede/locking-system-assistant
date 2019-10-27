import { LitElement, html, css } from 'lit-element';

class HwsCheckbox extends LitElement {
  static get styles() {
    return css`
      :host {
        align-items: center;
        display: inline-flex;
        justify-content: center;
        position: relative;
      }

      :host([hidden]) {
        display: none !important;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      /* Screenreader only */
      input {
        border: 0 !important;
        clip: rect(0, 0, 0, 0) !important;
        height: 1px !important;
        margin: -1px !important;
        overflow: hidden !important;
        padding: 0 !important;
        position: absolute !important;
        white-space: nowrap !important;
        width: 1px !important;
      }

      label {
        align-items: center;
        background-color: var(--input-bg, hsl(0, 0%, 100%));
        border: 1px solid var(--input-border-color, hsl(210, 14%, 83%));
        border-radius: 0.2rem;
        cursor: pointer;
        display: flex;
        height: 1.25rem;
        justify-content: center;
        margin-bottom: 0;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        user-select: none;
        width: 1.25rem;
      }

      svg {
        pointer-events: none;
        width: 13px;
      }

      label:before {
        content: '';
      }

      svg > path {
        fill: var(--input-bg, hsl(0, 0%, 100%));
        transition: fill 0.15s ease-in-out;
      }

      input:focus + label {
        border-color: var(input-focus-border-color, hsl(211, 100%, 75%));
        box-shadow: 0 0 0 0.2rem
          var(--input-focus-box-shadow, hsl(211, 100%, 50%));
        outline: 0;
      }

      input:checked + label > svg > path {
        fill: var(--input-color, hsl(210, 9%, 31%));
      }
    `;
  }

  static get properties() {
    return {
      data: { type: Array },
    };
  }

  constructor() {
    super();

    this.data = [0, 0];
  }

  getKeyId([key, row] = []) {
    return `key-${key}-${row}`;
  }

  getLabelTxt([key, row] = []) {
    return `Schlüssel ${key} für Zeile ${row}`;
  }

  render() {
    return html`
      <input
        type="checkbox"
        id="${this.getKeyId(this.data)}"
        value="${this.getKeyId(this.data)}"
        aria-label="${this.getLabelTxt(this.data)}"
      />
      <label for="${this.getKeyId(this.data)}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            d="M173.898
            439.404l-166.4-166.4c-9.997-9.997-9.997-26.206
            0-36.204l36.203-36.204c9.997-9.998 26.207-9.998
            36.204 0L192 312.69 432.095 72.596c9.997-9.997
            26.207-9.997 36.204 0l36.203 36.204c9.997 9.997
            9.997 26.206 0 36.204l-294.4 294.401c-9.998
            9.997-26.207 9.997-36.204-.001z"
          />
        </svg>
      </label>
    `;
  }
}

customElements.define('hws-checkbox', HwsCheckbox);
