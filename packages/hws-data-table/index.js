import { LitElement, html } from 'lit-element';

import { table } from './views';

import { stylesheet } from './styles/index.js';

import configureStore from './store';
import { connect } from 'pwa-helpers';

import { fetchBuilds, fetchLengths, fetchOuterLengths } from './actions';

import { getColumns, getModel, getRows } from './reducers/selectors';

import { deselectOption, getSelectedOption } from './lib/helpers';

const store = configureStore();

class HwsDataTable extends connect(store)(LitElement) {
  static get styles() {
    return [stylesheet];
  }

  static get properties() {
    return {
      builds: { type: Object },
      columns: { type: Number, reflect: true },
      isLoading: { type: Boolean },
      innerLengths: { type: Object },
      outerLengths: { type: Object },
      model: { type: String, reflect: true },
      rows: { type: Number, reflect: true },
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

    fetchBuilds(this.model)(store.dispatch);
  }

  selectBuild(e) {
    const build = getSelectedOption(e.target);
    const row = e.target.dataset.row;

    deselectOption(
      this.shadowRoot.getElementById(`cylinder-length-inner-${row}`),
    );

    deselectOption(
      this.shadowRoot.getElementById(`cylinder-length-outer-${row}`),
    );

    fetchLengths(build, this.model, row)(store);
  }

  selectInnerLength(e) {
    const row = e.target.dataset.row;
    const selected = getSelectedOption(e.target);

    deselectOption(
      this.shadowRoot.getElementById(`cylinder-length-outer-${row}`),
    );

    fetchOuterLengths(row, selected)(store);
  }

  selectOuterLength(e) {
    const selected = getSelectedOption(e.target);
    console.log('outer length: ', selected);
  }

  render() {
    return html`
      ${table({
        body: {
          builds: {
            items: this.builds,
            select: this.selectBuild,
          },
          lengths: {
            inner: this.innerLengths,
            outer: this.outerLengths,
            selectInner: this.selectInnerLength,
            selectOuter: this.selectOuterLength,
          },
        },
        columns: this.columns,
        isLoading: this.isLoading,
        head: {
          id: 'Bezeichnung',
          key: 'Schlüssel',
          length: 'Zylinderlänge (mm)',
          type: 'Zylindertyp',
          unit: 'Stück',
        },
        rows: this.rows,
      })}
    `;
  }
}

customElements.define('hws-data-table', HwsDataTable);
