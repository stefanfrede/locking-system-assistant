import { LitElement, css, html } from 'lit-element';

import 'hws-data-table';
import 'hws-loader';
import 'hws-message';

import configureStore from './store';
import { connect } from 'pwa-helpers';

import {
  adjustTable,
  dismissMessage,
  fetchBuilds,
  fetchLengths,
  fetchOuterLengths,
  resetOuterLength,
  setMessage,
} from './actions';

import {
  getCachedData,
  getColumns,
  getMessage,
  getModel,
  getRows,
} from './reducers/selectors';

import { deselectOption, getSelectedOption, serialize } from './lib/helpers';

const store = configureStore();

class HwsLsa extends connect(store)(LitElement) {
  static get styles() {
    return css`
      :host([hidden]) {
        display: none !important;
      }

      .data-table-wrapper {
        display: inline-block;
        position: relative;
      }
    `;
  }

  static get properties() {
    return {
      builds: { type: Object },
      columns: { type: Number },
      isLoading: { type: Boolean },
      innerLengths: { type: Object },
      outerLengths: { type: Object },
      message: { type: String },
      msgType: { type: String },
      model: { type: String },
      rows: { type: Number },
      store: { type: Object },
    };
  }

  stateChanged(state) {
    this.builds = state.app.builds;
    this.columns = state.app.columns;
    this.isLoading = state.app.isLoading;
    this.innerLengths = state.app.innerLengths;
    this.outerLengths = state.app.outerLengths;
    this.message = state.app.message;
    this.msgType = state.app.msgType;
    this.model = state.app.model;
    this.rows = state.app.rows;
  }

  constructor() {
    super();

    this.columns = getColumns(store.getState());
    this.message = getMessage(store.getState());
    this.model = getModel(store.getState());
    this.rows = getRows(store.getState());

    this.addEventListener('adjustTable', this._onAdjustTable);
    this.addEventListener('dismissMessage', this._onDismissMessage);
    this.addEventListener('selectBuild', this._onSelectBuild);
    this.addEventListener('selectInnerLength', this._onSelectInnerLength);
    this.addEventListener('selectOuterLength', this._onSelectOuterLength);
    this.addEventListener('submitForm', this._onSubmitForm);

    fetchBuilds()(store);
  }

  _onAdjustTable(e) {
    e.stopPropagation();

    const item = {
      action: e.detail.dataset.action,
      type: e.detail.dataset.type,
    };

    adjustTable(item)(store);
  }

  _onDismissMessage(e) {
    e.stopPropagation();

    dismissMessage()(store);
  }

  _onSelectBuild(e) {
    e.stopPropagation();

    const build = getSelectedOption(e.detail);
    const row = e.detail.dataset.row;

    const [hwsDataTable] = e.composedPath();
    const root = hwsDataTable.shadowRoot;
    const inner = root.getElementById(`cylinder-length-inner-${row}`);
    const outer = root.getElementById(`cylinder-length-outer-${row}`);

    deselectOption(inner);
    deselectOption(outer);

    resetOuterLength(row)(store);

    fetchLengths(build, this.model, row)(store);
  }

  _onSelectInnerLength(e) {
    e.stopPropagation();

    const innerLength = getSelectedOption(e.detail);
    const row = e.detail.dataset.row;

    const [hwsDataTable] = e.composedPath();
    const root = hwsDataTable.shadowRoot;
    const outer = root.getElementById(`cylinder-length-outer-${row}`);

    deselectOption(outer);

    fetchOuterLengths(row, innerLength)(store);
  }

  _onSubmitForm(e) {
    e.stopPropagation();

    const { rows, keys } = serialize(e.detail);
    let errors = rows.reduce((acc, cur) => [...acc, ...cur.errors], []);
    errors = [...errors, ...keys.errors];

    if (errors.length) {
      errors.forEach(item => item.classList.add('is-invalid'));
      setMessage('Bitte füllen Sie alle Felder aus', 'danger')(store);
    } else {
      const cylinders = rows.map(row => {
        const data = getCachedData(store.getState());
        const product =
          data[
            `${this.model}-${row.type}-${row.length.inner}-${row.length.outer}`
          ];

        return {
          keys: row.keys,
          name: row.name,
          quantity: row.quantity,
          reference: product.reference,
        };
      });

      console.log(cylinders);
      console.log(keys.quantities);
    }
  }

  render() {
    return html`
      <div class="data-table-wrapper">
        <hws-message
          .message="${this.message}"
          .msgType="${this.msgType}"
          ?hidden="${!this.message}"
        ></hws-message>
        <hws-data-table
          .builds="${this.builds}"
          .columns="${this.columns}"
          .innerLengths="${this.innerLengths}"
          .outerLengths="${this.outerLengths}"
          .rows="${this.rows}"
        ></hws-data-table>
        <hws-loader
          ?message="${this.message}"
          ?hidden="${!this.isLoading}"
        ></hws-loader>
      </div>
    `;
  }
}

customElements.define('hws-lsa', HwsLsa);
