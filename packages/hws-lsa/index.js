import { LitElement, css, html } from 'lit-element';

import 'hws-data-table';
import 'hws-loader';
import 'hws-message';

import configureStore from './store';
import { connect } from 'pwa-helpers';

import {
  deleteDetails,
  addGroup,
  deleteGroup,
  updateGroups,
  addItem,
  deleteItem,
  updateItem,
  deleteInnerLength,
  updateMessage,
  deleteOuterLength,
  addRowId,
  deleteRowId,
  fetchBuilds,
  fetchDetails,
  fetchLengths,
  fetchOuterLengths,
} from './actions';

import {
  getBuilds,
  getDetails,
  getGroups,
  getGuard,
  getItems,
  getKeys,
  getMessage,
  getModel,
  getRows,
  getRowIds,
} from './reducers/selectors';

import { deselectOption, uuidv4 } from './lib/helpers';

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
      details: { type: Object },
      groups: { type: Array },
      guard: { type: Number },
      innerLengths: { type: Object },
      items: { type: Object },
      keys: { type: Number },
      loading: { type: Boolean },
      message: { type: String },
      model: { type: String },
      msgType: { type: String },
      outerLengths: { type: Object },
      rows: { type: Number },
      rowIds: { type: Array },
    };
  }

  stateChanged(state) {
    this.builds = state.app.builds;
    this.details = state.app.details;
    this.groups = state.app.groups;
    this.guard = state.app.guard;
    this.innerLengths = state.app.innerLengths;
    this.items = state.app.items;
    this.keys = state.app.keys;
    this.loading = state.app.loading;
    this.message = state.app.message;
    this.model = state.app.model;
    this.msgType = state.app.msgType;
    this.outerLengths = state.app.outerLengths;
    this.rows = state.app.rows;
    this.rowIds = state.app.rowIds;
  }

  constructor() {
    super();

    this.builds = getBuilds(store.getState());
    this.details = getDetails(store.getState());
    this.groups = getGroups(store.getState());
    this.guard = getGuard(store.getState());
    this.items = getItems(store.getState());
    this.keys = getKeys(store.getState());
    this.message = getMessage(store.getState());
    this.model = getModel(store.getState());
    this.rows = getRows(store.getState());
    this.rowIds = getRowIds(store.getState());

    this.addEventListener('editIdentifier', this._onEditIdentifier);
    this.addEventListener('editKeys', this._onEditKeys);
    this.addEventListener('editQuantity', this._onEditQuantity);
    this.addEventListener('editRows', this._onEditRows);
    this.addEventListener('dismissMessage', this._onDismissMessage);
    this.addEventListener('deleteRow', this._onDeleteRow);
    this.addEventListener('selectBuild', this._onSelectBuild);
    this.addEventListener('selectInnerLength', this._onSelectInnerLength);
    this.addEventListener('selectOuterLength', this._onSelectOuterLength);
    this.addEventListener('selectKey', this._onSelectKey);
    this.addEventListener('submitForm', this._onSubmitForm);

    this._initGroups(this.keys);
    this._initRows(this.keys, this.rows);

    fetchBuilds(this.model)(store);
  }

  _initGroups(keys) {
    for (let i = 0; i < keys; i++) {
      store.dispatch(addGroup(0, i + 1));
    }
  }

  _initRows(keys, rows) {
    for (let i = 0; i < rows; i++) {
      const rowId = uuidv4();
      const item = this._getItem(keys);

      store.dispatch(addItem({ [rowId]: item }));
      store.dispatch(addRowId(rowId, i + 1));
    }
  }

  _getItem(num) {
    const keys = [];

    for (let i = 0; i < num; i++) {
      keys.push(false);
    }

    return {
      name: '',
      build: '',
      innerLength: 0,
      outerLength: 0,
      quantity: 0,
      keys,
    };
  }

  _onDeleteRow(e) {
    e.stopPropagation();

    const rowIdx = this.rowIds.indexOf(e.detail);
    const rows = this.rowIds.length - 1;

    store.dispatch(deleteItem(e.detail));
    store.dispatch(deleteRowId(rowIdx, rows));
    store.dispatch(deleteDetails(e.detail));
  }

  _onDismissMessage(e) {
    e.stopPropagation();

    store.dispatch(updateMessage('', 'info'));
  }

  _onEditIdentifier(e) {
    e.stopPropagation();

    const rowId = e.detail.closest('tbody').dataset.rowId;

    const item = this.items[rowId];
    item.name = e.detail.value;

    store.dispatch(updateItem({ [rowId]: item }));
  }

  _onEditKeys(e) {
    e.stopPropagation();

    if (e.detail.dataset.action === 'increment') {
      const keys = this.groups.length + 1;

      store.dispatch(addGroup(0, keys));

      this.rowIds.forEach(rowId => {
        const item = this.items[rowId];
        item.keys.push(false);

        store.dispatch(updateItem({ [rowId]: item }));
      });
    } else {
      const index = this.groups.length - 1;

      store.dispatch(deleteGroup(index, index));

      this.rowIds.forEach(rowId => {
        const item = this.items[rowId];
        item.keys.pop();

        store.dispatch(updateItem({ [rowId]: item }));
      });
    }
  }

  _onEditQuantity(e) {
    e.stopPropagation();

    if (e.detail.dataset.type === 'cylinder') {
      const rowId = e.detail.closest('tbody').dataset.rowId;

      const item = this.items[rowId];
      item.quantity = Number(e.detail.value);

      store.dispatch(updateItem({ [rowId]: item }));
    } else {
      const [, idx] = e.detail.id.split('-');

      this.groups[Number(idx)] = Number(e.detail.value);

      store.dispatch(updateGroups(this.groups));
    }
  }

  _onEditRows(e) {
    e.stopPropagation();

    if (e.detail.dataset.action === 'increment') {
      const rowId = uuidv4();
      const rows = this.rowIds.length + 1;
      const item = this._getItem(this.keys);

      store.dispatch(addItem({ [rowId]: item }));
      store.dispatch(addRowId(rowId, rows));
    } else {
      const rowId = this.rowIds[this.rowIds.length - 1];
      const rowIdx = this.rowIds.indexOf(rowId);
      const rows = this.rowIds.length - 1;

      store.dispatch(deleteItem(rowId));
      store.dispatch(deleteRowId(rowIdx, rows));
    }
  }

  _onSelectBuild(e) {
    e.stopPropagation();

    const row = e.detail.closest('tbody');
    const rowId = row.dataset.rowId;
    const [, rowIdx] = e.detail.id.split('-');

    const item = this.items[rowId];

    item.build = e.detail.value;
    item.innerLength = 0;
    item.outerLength = 0;

    store.dispatch(updateItem({ [rowId]: item }));

    deselectOption(row.querySelector(`#inner-length-${rowIdx}`));
    deselectOption(row.querySelector(`#outer-length-${rowIdx}`));

    store.dispatch(deleteInnerLength(rowId));
    store.dispatch(deleteOuterLength(rowId));
    store.dispatch(deleteDetails(rowId));

    fetchLengths(item.build, this.model, rowId)(store);
  }

  _onSelectInnerLength(e) {
    e.stopPropagation();

    const row = e.detail.closest('tbody');
    const rowId = row.dataset.rowId;
    const [, , rowIdx] = e.detail.id.split('-');

    const item = this.items[rowId];

    item.innerLength = Number(e.detail.value);
    item.outerLength = 0;

    store.dispatch(updateItem({ [rowId]: item }));

    deselectOption(row.querySelector(`#outer-length-${rowIdx}`));

    store.dispatch(deleteOuterLength(rowId));
    store.dispatch(deleteDetails(rowId));

    fetchOuterLengths(item.build, this.model, rowId, item.innerLength)(store);
  }

  _onSelectOuterLength(e) {
    e.stopPropagation();

    const row = e.detail.closest('tbody');
    const rowId = row.dataset.rowId;

    const item = this.items[rowId];

    item.outerLength = Number(e.detail.value);

    store.dispatch(updateItem({ [rowId]: item }));

    fetchDetails({
      build: this.items[rowId].build,
      model: this.model,
      innerLength: this.items[rowId].innerLength,
      outerLength: this.items[rowId].outerLength,
      rowId,
    })(store);
  }

  _onSelectKey(e) {
    e.stopPropagation();

    const rowId = e.detail.closest('tbody').dataset.rowId;

    const checked = e.detail.checked;
    const keyNum = Number(e.detail.value);

    const item = this.items[rowId];
    item.keys[keyNum] = checked;

    store.dispatch(updateItem({ [rowId]: item }));
  }

  _onSubmitForm(e) {
    e.stopPropagation();
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
          .details="${this.details}"
          .groups="${this.groups}"
          .guard="${this.guard}"
          .innerLengths="${this.innerLengths}"
          .items="${this.items}"
          .keys="${this.keys}"
          .model="${this.model}"
          .outerLengths="${this.outerLengths}"
          .rows="${this.rows}"
          .rowIds="${this.rowIds}"
        ></hws-data-table>
        <hws-loader
          ?message="${this.message}"
          ?hidden="${!this.loading}"
        ></hws-loader>
      </div>
    `;
  }
}

customElements.define('hws-lsa', HwsLsa);
