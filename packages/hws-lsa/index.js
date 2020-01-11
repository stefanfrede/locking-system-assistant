import { LitElement, css, html } from 'lit-element';

import 'hws-data-table';
import 'hws-loader';
import 'hws-message';
import 'hws-select-model';

import configureStore from './store';
import { connect } from 'pwa-helpers';

import {
  initApp,
  resetApp,
  addKey,
  addRow,
  deleteInnerLength,
  deleteOuterLength,
  deleteKey,
  deleteRow,
  updateGroups,
  updateItem,
  updateMessage,
  fetchBuilds,
  fetchDetails,
  fetchLengths,
  fetchModels,
  fetchOuterLengths,
} from './actions';

import {
  getBuilds,
  getGroups,
  getGuard,
  getItems,
  getKeys,
  getMessage,
  getModel,
  getModels,
  getRowIds,
  getRows,
} from './reducers/selectors';

const store = configureStore();

class HwsLsa extends connect(store)(LitElement) {
  static get styles() {
    return css`
      :host {
        display: block;
      }

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
      groups: { type: Array },
      guard: { type: Number },
      innerLengths: { type: Object },
      items: { type: Object },
      keys: { type: Number },
      loading: { type: Boolean },
      message: { type: String },
      model: { type: String },
      models: { type: Array },
      msgType: { type: String },
      outerLengths: { type: Object },
      rowIds: { type: Array },
      rows: { type: Number },
    };
  }

  stateChanged(state) {
    this.builds = state.app.builds;
    this.groups = state.app.groups;
    this.guard = state.app.guard;
    this.innerLengths = state.app.innerLengths;
    this.items = state.app.items;
    this.keys = state.app.keys;
    this.loading = state.app.loading;
    this.message = state.app.message;
    this.model = state.app.model;
    this.models = state.app.models;
    this.msgType = state.app.msgType;
    this.outerLengths = state.app.outerLengths;
    this.rowIds = state.app.rowIds;
    this.rows = state.app.rows;
  }

  constructor() {
    super();

    this.builds = getBuilds(store.getState());
    this.groups = getGroups(store.getState());
    this.guard = getGuard(store.getState());
    this.items = getItems(store.getState());
    this.keys = getKeys(store.getState());
    this.message = getMessage(store.getState());
    this.model = getModel(store.getState());
    this.models = getModels(store.getState());
    this.rowIds = getRowIds(store.getState());
    this.rows = getRows(store.getState());

    initApp()(store);

    fetchModels()(store);
    fetchBuilds(this.model)(store);
  }

  _onDeleteRow(e) {
    e.stopPropagation();

    deleteRow(e.detail)(store);
  }

  _onDismissMessage(e) {
    e.stopPropagation();

    store.dispatch(updateMessage('', 'info'));
  }

  _onEditGroup(e) {
    e.stopPropagation();

    store.dispatch(updateGroups(e.detail));
  }

  _onEditIdentifier(e) {
    e.stopPropagation();

    store.dispatch(updateItem(e.detail));
  }

  _onEditKeys(e) {
    e.stopPropagation();

    e.detail === 'increment' ? addKey()(store) : deleteKey()(store);
  }

  _onEditQuantity(e) {
    e.stopPropagation();

    store.dispatch(updateItem(e.detail));
  }

  _onEditRows(e) {
    e.stopPropagation();

    e.detail === 'increment' ? addRow()(store) : deleteRow()(store);
  }

  _onSelectBuild(e) {
    e.stopPropagation();

    const [[id, item]] = Object.entries(e.detail);

    store.dispatch(updateItem(e.detail));
    store.dispatch(deleteInnerLength(id));
    store.dispatch(deleteOuterLength(id));

    fetchLengths(item.build, this.model, id)(store);
  }

  _onSelectInnerLength(e) {
    e.stopPropagation();

    const [[id, item]] = Object.entries(e.detail);

    store.dispatch(updateItem(e.detail));
    store.dispatch(deleteOuterLength(id));

    fetchOuterLengths(item.build, this.model, id, item.innerLength)(store);
  }

  _onSelectKey(e) {
    e.stopPropagation();

    store.dispatch(updateItem(e.detail));
  }

  _onSelectOuterLength(e) {
    e.stopPropagation();

    const [[id, item]] = Object.entries(e.detail);

    item.details = fetchDetails({
      build: item.build,
      model: this.model,
      innerLength: item.innerLength,
      outerLength: item.outerLength,
    })(store);

    store.dispatch(updateItem({ [id]: item }));
  }

  _onSelectModel(e) {
    e.stopPropagation();

    if (
      window.confirm(
        `Durch das Ändern der Serie werden alle bereits vorgenommenen
        Einstellung zurück gesetzt. Fortfahren?`,
      )
    ) {
      resetApp(e.detail)(store);
    }
  }

  _onSubmitForm(e) {
    e.stopPropagation();
  }

  render() {
    return html`
      <p>
        <hws-select-model
          @select-model="${this._onSelectModel}"
          .model="${this.model}"
          .models="${this.models}"
        ></hws-select-model>
      </p>
      <div class="data-table-wrapper">
        <hws-message
          @dismissMessage="${this._onDismissMessage}"
          .message="${this.message}"
          .msgType="${this.msgType}"
          ?hidden="${!this.message}"
        ></hws-message>
        <hws-data-table
          @edit-group="${this._onEditGroup}"
          @editIdentifier="${this._onEditIdentifier}"
          @editKeys="${this._onEditKeys}"
          @editQuantity="${this._onEditQuantity}"
          @editRows="${this._onEditRows}"
          @deleteRow="${this._onDeleteRow}"
          @selectBuild="${this._onSelectBuild}"
          @selectInnerLength="${this._onSelectInnerLength}"
          @selectOuterLength="${this._onSelectOuterLength}"
          @selectKey="${this._onSelectKey}"
          @submitForm="${this._onSubmitForm}"
          .builds="${this.builds}"
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
