import { LitElement, html, css } from 'lit-element';

import 'hws-data-table';

class HwsApp extends LitElement {
  static get styles() {
    return css`
      :host {
        color: hsl(210, 11%, 15%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
          'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
      }
    `;
  }
  render() {
    return html`
      <hws-data-table></hws-data-table>
    `;
  }
}

customElements.define('hws-app', HwsApp);
