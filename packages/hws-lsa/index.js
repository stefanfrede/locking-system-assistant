import { LitElement, css, html } from 'lit-element';

import 'hws-loader';
import 'hws-data-table';

import configureStore from './store';
import { connect } from 'pwa-helpers';

import { fetchBuilds, fetchLengths, fetchOuterLengths } from './actions';

import { getColumns, getModel, getRows } from './reducers/selectors';

import { deselectOption, getSelectedOption } from './lib/helpers';

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
    this.model = state.app.model;
    this.rows = state.app.rows;
  }

  constructor() {
    super();

    this.columns = getColumns(store.getState());
    this.model = getModel(store.getState());
    this.rows = getRows(store.getState());

    this.addEventListener('selectBuild', this._onSelectBuild);
    this.addEventListener('selectInnerLength', this._onSelectInnerLength);
    this.addEventListener('selectOuterLength', this._onSelectOuterLength);

    fetchBuilds()(store);
  }

  _onSelectBuild(e) {
    e.stopPropagation();

    const build = getSelectedOption(e.detail);
    const row = e.detail.dataset.row;

    const [hwsDataTable] = e.composedPath();
    const root = hwsDataTable.shadowRoot;

    deselectOption(root.getElementById(`cylinder-length-inner-${row}`));
    deselectOption(root.getElementById(`cylinder-length-outer-${row}`));

    fetchLengths(build, this.model, row)(store);
  }

  _onSelectInnerLength(e) {
    e.stopPropagation();

    const innerLength = getSelectedOption(e.detail);
    const row = e.detail.dataset.row;

    const [hwsDataTable] = e.composedPath();
    const root = hwsDataTable.shadowRoot;

    deselectOption(root.getElementById(`cylinder-length-outer-${row}`));

    fetchOuterLengths(row, innerLength)(store);
  }

  _onSelectOuterLength(e) {
    const outerLength = getSelectedOption(e.detail);

    console.log(outerLength);
  }

  render() {
    return html`
      <div class="data-table-wrapper">
        <hws-data-table
          .builds="${this.builds}"
          .columns="${this.columns}"
          .innerLengths="${this.innerLengths}"
          .outerLengths="${this.outerLengths}"
          .rows="${this.rows}"
        ></hws-data-table>
        <hws-loader ?hidden="${!this.isLoading}"></hws-loader>
      </div>
    `;
  }
}

customElements.define('hws-lsa', HwsLsa);
