import { LitElement, css, html } from 'lit-element';

import 'hws-table';
import 'hws-loader';
import 'hws-message';
import 'hws-price';
import 'hws-select-model';

import configureStore from './store';
import { connect } from 'pwa-helpers';

import {
  hideModelSelector,
  initAssistant,
  resetAssistant,
  addKey,
  addRow,
  deleteKey,
  deleteRow,
  updateGroups,
  updateItem,
  updateLoginStatus,
  updateMessage,
  fetchBuilds,
  fetchDetails,
  fetchInnerLengths,
  fetchKeyDetails,
  fetchKeyPrice,
  fetchModels,
  fetchOuterLengths,
  reloadData,
  sortRow,
} from './actions';

import {
  getBuilds,
  getGroups,
  getGuard,
  getItems,
  getKeyDetails,
  getKeyPrice,
  getKeys,
  getLoginStatus,
  getMessage,
  getModel,
  getModels,
  getRows,
} from './reducers/selectors';

import { authenticate, checkForm } from './lib/helpers';
import { getPdf, addToCart } from './lib/products';

const { store } = configureStore();

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
        display: inline-flex;
        flex-direction: column;
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
      keyPrice: { type: Number },
      keys: { type: Number },
      loading: { type: Boolean },
      showCartBtn: { type: Boolean },
      message: { type: String },
      model: { type: String },
      models: { type: Array },
      msgType: { type: String },
      outerLengths: { type: Object },
      rowIds: { type: Array },
      rows: { type: Number },
      selectable: { type: Boolean },
    };
  }

  stateChanged(state) {
    this.builds = state.app.builds;
    this.groups = state.app.groups;
    this.guard = state.app.guard;
    this.innerLengths = state.app.innerLengths;
    this.items = state.app.items;
    this.keyPrice = state.app.keyPrice;
    this.keys = state.app.keys;
    this.loading = state.app.loading;
    this.showCartBtn = state.app.showCartBtn;
    this.message = state.cache.message;
    this.model = state.app.model;
    this.models = state.app.models;
    this.msgType = state.cache.msgType;
    this.outerLengths = state.app.outerLengths;
    this.rows = state.app.rows;
    this.selectable = state.app.selectable;
  }

  constructor() {
    super();

    this.builds = getBuilds(store.getState());
    this.groups = getGroups(store.getState());
    this.guard = getGuard(store.getState());
    this.items = getItems(store.getState());
    this.keyPrice = getKeyPrice(store.getState());
    this.keys = getKeys(store.getState());
    this.showCartBtn = getLoginStatus(store.getState());
    this.message = getMessage(store.getState());
    this.model = getModel(store.getState());
    this.models = getModels(store.getState());
    this.rows = getRows(store.getState());

    this._init();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'showCartBtn') {
      const isTrue = newVal === 'true';

      if (isTrue) {
        store.dispatch(updateLoginStatus(true));
      }
    }

    if (name === 'model') {
      store.dispatch(reloadData(newVal));
    }

    if (name === 'selectable') {
      const hide = newVal === 'false';

      if (hide) {
        store.dispatch(hideModelSelector());
      }
    }

    super.attributeChangedCallback(name, oldVal, newVal);
  }

  async _init() {
    // Switch to authenticate with a test user for testing purposes
    if (sessionStorage.getItem('hws-logged-in') === 'true') {
      await authenticate();

      store.dispatch(updateLoginStatus(true));
    }

    await store.dispatch(initAssistant());
    await store.dispatch(fetchModels());
    await store.dispatch(fetchBuilds(this.model));
    await store.dispatch(fetchKeyDetails(this.model));
    await store.dispatch(fetchKeyPrice(this.model));
  }

  _getRequestBody(e) {
    e.stopPropagation();

    const errors = checkForm(e.detail);

    if (errors.length) {
      errors.forEach((item) => item.classList.add('is-invalid'));
      store.dispatch(
        updateMessage(
          'Bitte überprüfen Sie die mit rot markierten Felder.',
          'danger',
        ),
      );
    } else {
      const groups = getGroups(store.getState());
      const items = getItems(store.getState());
      const { reference: keyReference } = getKeyDetails(store.getState());

      const cylinders = [];

      Object.values(items).forEach((item) => {
        const {
          details: { reference },
          index,
          keys,
          name,
          quantity,
        } = item;

        cylinders.push({
          index,
          keys,
          name,
          quantity,
          reference,
        });
      });

      return { groups, cylinders, keyReference };
    }
  }

  _onDeleteRow(e) {
    e.stopPropagation();

    store.dispatch(deleteRow(e.detail));
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

    e.detail === 'increment'
      ? store.dispatch(addKey())
      : store.dispatch(deleteKey());
  }

  _onEditQuantity(e) {
    e.stopPropagation();

    store.dispatch(updateItem(e.detail));
  }

  _onEditRows(e) {
    e.stopPropagation();

    e.detail === 'increment'
      ? store.dispatch(addRow())
      : store.dispatch(deleteRow());
  }

  _onPrintForm(e) {
    const body = this._getRequestBody(e);

    if (body) {
      getPdf({ body });
    }
  }

  _onReset(e) {
    e.stopPropagation();

    if (window.confirm(`Wirklich zurücksetzen?`)) {
      store.dispatch(resetAssistant());
    }
  }

  _onSelectBuild(e) {
    e.stopPropagation();

    store.dispatch(fetchInnerLengths(e.detail));
  }

  _onSelectInnerLength(e) {
    e.stopPropagation();

    store.dispatch(fetchOuterLengths(e.detail));
  }

  _onSelectKey(e) {
    e.stopPropagation();

    store.dispatch(updateItem(e.detail));
  }

  _onSelectOuterLength(e) {
    e.stopPropagation();

    store.dispatch(fetchDetails(e.detail));
  }

  _onSelectModel(e) {
    e.stopPropagation();

    store.dispatch(reloadData(e.detail));
  }

  _onSortRow(e) {
    e.stopPropagation();

    store.dispatch(sortRow(e.detail));
  }

  _onSubmitForm(e) {
    const body = this._getRequestBody(e);

    if (body) {
      addToCart({ body, endpoint: 'cart' });
    }
  }

  render() {
    return html`
      <p>
        <hws-select-model
          @select-model="${this._onSelectModel}"
          .model="${this.model}"
          .models="${this.models}"
          ?hidden="${!this.selectable}"
        ></hws-select-model>
      </p>
      <div class="data-table-wrapper">
        <hws-message
          @dismissMessage="${this._onDismissMessage}"
          .message="${this.message}"
          .msgType="${this.msgType}"
          ?hidden="${!this.message}"
        ></hws-message>
        <hws-table
          @edit-group="${this._onEditGroup}"
          @editIdentifier="${this._onEditIdentifier}"
          @editKeys="${this._onEditKeys}"
          @editQuantity="${this._onEditQuantity}"
          @editRows="${this._onEditRows}"
          @deleteRow="${this._onDeleteRow}"
          @printForm="${this._onPrintForm}"
          @reset="${this._onReset}"
          @selectBuild="${this._onSelectBuild}"
          @selectInnerLength="${this._onSelectInnerLength}"
          @selectOuterLength="${this._onSelectOuterLength}"
          @selectKey="${this._onSelectKey}"
          @sortRow="${this._onSortRow}"
          @submitForm="${this._onSubmitForm}"
          .builds="${this.builds}"
          .groups="${this.groups}"
          .guard="${this.guard}"
          .innerLengths="${this.innerLengths}"
          .items="${this.items}"
          .keys="${this.keys}"
          .showCartBtn="${this.showCartBtn}"
          .outerLengths="${this.outerLengths}"
          .rows="${this.rows}"
        ></hws-table>
        <hws-loader
          ?message="${this.message}"
          ?hidden="${!this.loading}"
        ></hws-loader>
        <hws-price
          .groups="${this.groups}"
          .keyPrice="${this.keyPrice}"
          .items="${this.items}"
        ></hws-price>
      </div>
    `;
  }
}

customElements.define('hws-lsa', HwsLsa);
