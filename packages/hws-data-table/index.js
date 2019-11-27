import { LitElement, html } from 'lit-element';

import { thead, tbody, tfoot } from './data-table-elements';

import { stylesheet } from './styles/index.js';

class HwsDataTable extends LitElement {
  static get styles() {
    return [stylesheet];
  }

  static get properties() {
    return {
      columns: { type: Number, reflect: true },
      rows: { type: Number, reflect: true },
    };
  }

  constructor() {
    super();

    this.columns = 5;
    this.rows = 5;
  }

  render() {
    return html`
      <div class="table-responsive">
        <table>
          <thead>
            ${thead({ columns: this.columns })}
          </thead>
          <tbody>
            ${tbody(this.columns, this.rows)}
          </tbody>
          <tfoot>
            ${tfoot(this.columns)}
          </tfoot>
        </table>
      </div>
    `;
  }
}

customElements.define('hws-data-table', HwsDataTable);
