import { LitElement, css, html } from 'lit-element';

class HwsPrice extends LitElement {
  static get styles() {
    return css`
      :host {
        bottom: 0;
        left: 0;
        position: absolute;
      }

      :host([hidden]) {
        display: none !important;
      }

      dl {
        align-items: center;
        display: flex;
        justify-content: flex-start;
        margin: 0;
        padding: 0;
      }

      dl[hidden] {
        display: none !important;
      }

      dd,
      dt {
        line-height: 1.5;
        margin: 0;
        padding: 0.4375rem 0.75rem;
      }

      dt {
        font-weight: bold;
      }

      dd {
        color: hsl(210, 9%, 31%);
      }
    `;
  }

  static get properties() {
    return {
      groups: { type: Array },
      keyPrice: { type: Number },
      items: { type: Object },
    };
  }

  constructor() {
    super();

    this.groups = [];
    this.keyPrice = 0;
    this.items = {};
  }

  render() {
    let total = 0;

    Object.values(this.items).forEach((item) => {
      if (item.details) {
        if (item.details.price) {
          const itemPrice = item.details.price * item.quantity;

          let keyPrice = 0;

          this.groups.forEach((group) => {
            keyPrice += this.keyPrice * group;
          });

          total += itemPrice + keyPrice;
        }
      }
    });

    const hasPrice = total ? true : false;

    return html`
      <dl ?hidden="${!hasPrice}">
        <dt>Preis:</dt>
        <dd>
          ${new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
          }).format(total)}
        </dd>
      </dl>
    `;
  }
}

customElements.define('hws-price', HwsPrice);
