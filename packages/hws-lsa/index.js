import { LitElement, css, html } from 'lit-element';

import 'hws-data-table';
import 'hws-loader';
import 'hws-message';

import configureStore from './store';
import { connect } from 'pwa-helpers';

import {
  adjustTable,
  deleteRow,
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

import { deselectOption, serialize } from './lib/helpers';

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
      selection: { type: Array },
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
    this.addEventListener('deleteRow', this._onDeleteRow);
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
      build: '',
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
    const selection = JSON.parse(JSON.stringify(this.selection));
    const type = e.detail.dataset.type;

    adjustTable({ action, guard, selection, selectionItem, type })(store);
  }

  _onDeleteRow(e) {
    e.stopPropagation();

    const rowNum = Number(e.detail.closest('tr').dataset.row);

    deleteRow(rowNum)(store);
  }

  _onDismissMessage(e) {
    e.stopPropagation();

    dismissMessage()(store);
  }

  _onEditIdentifier(e) {
    e.stopPropagation();

    const row = e.detail.closest('tr');
    const rowNum = Number(row.dataset.row);
    const selection = JSON.parse(JSON.stringify(this.selection));
    const value = e.detail.value;

    selection[rowNum].name = value;

    setSelection(selection)(store);
  }

  _onEditQuantity(e) {
    e.stopPropagation();

    const row = e.detail.closest('tr');
    const rowNum = Number(row.dataset.row);
    const selection = JSON.parse(JSON.stringify(this.selection));
    const value = Number(e.detail.value);

    selection[rowNum].units = value;

    setSelection(selection)(store);
  }

  _onSelectBuild(e) {
    e.stopPropagation();

    const build = e.detail.value;
    const row = e.detail.closest('tr');
    const rowNum = Number(row.dataset.row);
    const selection = JSON.parse(JSON.stringify(this.selection));

    deselectOption(row.querySelector(`#cylinder-length-inner-${rowNum}`));
    deselectOption(row.querySelector(`#cylinder-length-outer-${rowNum}`));

    selection[rowNum].innerLength = 0;
    selection[rowNum].outerLength = 0;

    resetOuterLength(rowNum)(store);

    selection[rowNum].build = build;

    setSelection(selection)(store);
    fetchLengths(build, this.model, rowNum)(store);
  }

  _onSelectInnerLength(e) {
    e.stopPropagation();

    const row = e.detail.closest('tr');
    const rowNum = Number(row.dataset.row);
    const selectedBuild = this.selection[rowNum].build;
    const selectedInnerLength = e.detail.value;
    const selection = JSON.parse(JSON.stringify(this.selection));

    deselectOption(row.querySelector(`#cylinder-length-outer-${rowNum}`));

    selection[rowNum].innerLength = Number(selectedInnerLength);
    selection[rowNum].outerLength = 0;

    setSelection(selection)(store);

    fetchOuterLengths(
      selectedBuild,
      this.model,
      rowNum,
      selectedInnerLength,
    )(store);
  }

  _onSelectOuterLength(e) {
    e.stopPropagation();

    const row = e.detail.closest('tr');
    const rowNum = Number(row.dataset.row);
    const selectedOuterLength = e.detail.value;
    const selection = JSON.parse(JSON.stringify(this.selection));

    selection[rowNum].outerLength = Number(selectedOuterLength);

    setSelection(selection)(store);
  }

  _onSelectKey(e) {
    e.stopPropagation();

    const checked = e.detail.checked;
    const key = Number(e.detail.value);
    const row = e.detail.closest('tr');
    const rowNum = Number(row.dataset.row);
    const selection = JSON.parse(JSON.stringify(this.selection));

    selection[rowNum].keys[key] = checked;

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
