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
  setSelection,
} from './actions';

import {
  getBuilds,
  getData,
  getGuard,
  getMessage,
  getModel,
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
      guard: { type: Number },
      isLoading: { type: Boolean },
      innerLengths: { type: Object },
      outerLengths: { type: Object },
      message: { type: String },
      msgType: { type: String },
      model: { type: String },
      store: { type: Object },
      selection: { type: Object },
    };
  }

  stateChanged(state) {
    this.builds = state.app.builds;
    this.guard = state.app.guard;
    this.isLoading = state.app.isLoading;
    this.innerLengths = state.app.innerLengths;
    this.outerLengths = state.app.outerLengths;
    this.message = state.app.message;
    this.msgType = state.app.msgType;
    this.model = state.app.model;
    this.selection = state.app.selection;
  }

  constructor() {
    super();

    this.builds = getBuilds(store.getState());
    this.guard = getGuard(store.getState());
    this.message = getMessage(store.getState());
    this.model = getModel(store.getState());
    this.selection = getSelection(store.getState());

    this.addEventListener('adjustTable', this._onAdjustTable);
    this.addEventListener('editIdentifier', this._onEditIdentifier);
    this.addEventListener('editQuantity', this._onEditQuantity);
    this.addEventListener('dismissMessage', this._onDismissMessage);
    this.addEventListener('selectBuild', this._onSelectBuild);
    this.addEventListener('selectInnerLength', this._onSelectInnerLength);
    this.addEventListener('selectOuterLength', this._onSelectOuterLength);
    this.addEventListener('selectKey', this._onSelectKey);
    this.addEventListener('submitForm', this._onSubmitForm);

    this._initSelection(5, 5);

    fetchBuilds()(store);
  }

  get keys() {
    let keys;

    if (this.selection.length) {
      keys = Array.isArray(this.selection[0].keys)
        ? this.selection[0].keys.length
        : 1;
    } else {
      keys = 1;
    }

    return keys;
  }

  get rows() {
    let rows;

    if (this.selection.length) {
      rows = this.selection.length;
    } else {
      rows = 1;
    }

    return rows;
  }

  _initSelection(keys, rows) {
    const selection = [];

    for (let i = 0; i < rows; i++) {
      selection.push(this._getSelectionItem(keys));
    }

    setSelection(selection)(store);
  }

  _getSelectionItem(num) {
    const keys = [];

    for (let i = 0; i < num; i++) {
      keys.push(false);
    }

    return {
      name: '',
      type: '',
      innerLength: 0,
      outerLength: 0,
      units: 0,
      keys,
    };
  }

  _onAdjustTable(e) {
    e.stopPropagation();

    const action = e.detail.dataset.action;
    const guard = this.guard;
    const selectionItem = this._getSelectionItem(this.keys);
    const selection = [...this.selection];
    const type = e.detail.dataset.type;

    adjustTable({ action, guard, selection, selectionItem, type })(store);
  }

  _onDismissMessage(e) {
    e.stopPropagation();

    dismissMessage()(store);
  }

  _onEditIdentifier(e) {
    e.stopPropagation();

    const index = e.detail.dataset.row - 1;
    const selection = [...this.selection];
    const value = e.detail.value;

    selection[index].name = value;

    setSelection(selection)(store);
  }

  _onEditQuantity(e) {
    e.stopPropagation();

    const index = e.detail.dataset.row - 1;
    const selection = [...this.selection];
    const value = Number(e.detail.value);

    selection[index].units = value;

    setSelection(selection)(store);
  }

  _onSelectBuild(e) {
    e.stopPropagation();

    const build = getSelectedOption(e.detail);
    const index = e.detail.dataset.row - 1;
    const row = e.detail.dataset.row;
    const selection = [...this.selection];

    const [hwsDataTable] = e.composedPath();
    const root = hwsDataTable.shadowRoot;
    const inner = root.getElementById(`cylinder-length-inner-${row}`);
    const outer = root.getElementById(`cylinder-length-outer-${row}`);

    deselectOption(inner);
    deselectOption(outer);

    selection[index].innerLength = 0;
    selection[index].outerLength = 0;

    resetOuterLength(row)(store);

    selection[index].type = build;

    setSelection(selection)(store);
    fetchLengths(build, this.model, row)(store);
  }

  _onSelectInnerLength(e) {
    e.stopPropagation();

    const selectedInnerLength = getSelectedOption(e.detail);
    const index = e.detail.dataset.row - 1;
    const row = e.detail.dataset.row;
    const selection = [...this.selection];

    const [hwsDataTable] = e.composedPath();
    const root = hwsDataTable.shadowRoot;
    const outer = root.getElementById(`cylinder-length-outer-${row}`);
    const builds = root.getElementById(`cylinder-build-${row}`);
    const selectedBuild = getSelectedOption(builds);

    deselectOption(outer);

    selection[index].innerLength = Number(selectedInnerLength);
    selection[index].outerLength = 0;

    setSelection(selection)(store);

    fetchOuterLengths(
      selectedBuild,
      this.model,
      row,
      selectedInnerLength,
    )(store);
  }

  _onSelectOuterLength(e) {
    e.stopPropagation();

    const selectedOuterLength = getSelectedOption(e.detail);
    const index = e.detail.dataset.row - 1;
    const selection = [...this.selection];

    selection[index].outerLength = Number(selectedOuterLength);

    setSelection(selection)(store);
  }

  _onSelectKey(e) {
    e.stopPropagation();

    const { checked, key, row } = e.detail;
    const selection = [...this.selection];

    selection[row].keys[key] = checked;

    setSelection(selection)(store);
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
        const data = getData(store.getState());
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
          .model="${this.model}"
          .builds="${this.builds}"
          .guard="${this.guard}"
          .innerLengths="${this.innerLengths}"
          .outerLengths="${this.outerLengths}"
          .selection="${this.selection}"
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
