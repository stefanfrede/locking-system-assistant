import { LitElement, html } from 'lit-element';

import { table } from './views';

import { stylesheet } from './styles/index.js';

import configureStore from './store';
import { connect } from 'pwa-helpers';

import {
  addBuilds,
  cacheBuilds,
  cacheLength,
  showLoading,
  updateLength,
} from './actions';

import {
  getCachedBuilds,
  getCachedLength,
  getColumns,
  getModel,
  getRows,
  getUrl,
} from './reducers/selectors';

import { GET, POST, deselectOption, getSelectedOption } from './utils';

const store = configureStore();

class HwsDataTable extends connect(store)(LitElement) {
  static get styles() {
    return [stylesheet];
  }

  static get properties() {
    return {
      columns: { type: Number, reflect: true },
      length: { type: Object },
      loading: { type: Boolean },
      model: { type: String, reflect: true },
      rows: { type: Number, reflect: true },
      builds: { type: Object },
      url: { type: String },
    };
  }

  stateChanged(state) {
    this.builds = state.app.builds;
    this.columns = state.app.columns;
    this.length = state.app.length;
    this.loading = state.app.loading;
    this.model = state.app.model;
    this.rows = state.app.rows;
    this.url = state.app.url;
  }

  constructor() {
    super();

    this.init();
  }

  async init() {
    store.dispatch(showLoading(true));

    this.url = getUrl(store.getState());
    this.model = getModel(store.getState());

    this.columns = getColumns(store.getState());
    this.rows = getRows(store.getState());

    const body = JSON.stringify({
      filter: [
        { name: 'Hersteller', value: 'Iseo' },
        { name: 'Serie', value: this.model },
      ],
      selector: 'Bauart',
    });

    const cachedBuilds = getCachedBuilds(store.getState());

    if (cachedBuilds[body]) {
      const data = cachedBuilds[body]['data'];

      store.dispatch(addBuilds(data));
    } else {
      const data = await POST({
        body,
        url: this.url,
      });

      store.dispatch(cacheBuilds({ [body]: { data } }));
      store.dispatch(addBuilds(data));
    }

    store.dispatch(showLoading(false));
  }

  async selectBuild(e) {
    const build = getSelectedOption(e.target);
    const row = e.target.dataset.row;

    const selectedInnerLength = this.shadowRoot.getElementById(
      `cylinder-length-inner-${row}`,
    );

    deselectOption(selectedInnerLength);

    const body = JSON.stringify({
      filter: [
        { name: 'Hersteller', value: 'Iseo' },
        { name: 'Serie', value: this.model },
        { name: 'Bauart', value: build },
      ],
      selector: 'reference',
    });

    const cachedLength = getCachedLength(store.getState());

    if (cachedLength[body]) {
      const data = cachedLength[body]['data'];

      store.dispatch(
        updateLength({
          [row]: {
            data,
            inner: Object.keys(data).map(Number),
            outer: [],
          },
        }),
      );
    } else {
      store.dispatch(showLoading(true));

      const references = await POST({
        body,
        url: this.url,
      });

      Promise.all(
        references.map(reference => GET({ reference, url: this.url })),
      ).then(products => {
        const data = {};

        products.forEach(product => {
          const [{ value: length }] = product.specifications.filter(
            specification => specification.name === 'Teillänge (C+D)',
          );

          const [inner, outer] = length
            .split('+')
            .map(str => Number(str.trim().replace('mm', '')));

          if (data[inner]) {
            data[inner].push(outer);
          } else {
            data[inner] = [outer];
          }
        });

        store.dispatch(cacheLength({ [body]: { data } }));

        store.dispatch(
          updateLength({
            [row]: {
              data,
              inner: Object.keys(data).map(Number),
              outer: [],
            },
          }),
        );
      });

      store.dispatch(showLoading(false));
    }
  }

  selectInnerLength(e) {
    const length = getSelectedOption(e.target);
    const row = e.target.dataset.row;

    store.dispatch(
      updateLength({
        [row]: {
          inner: this.length[row].inner,
          outer: this.length[row].data[length].sort((a, b) => a - b),
        },
      }),
    );
  }

  render() {
    return html`
      ${table({
        columns: this.columns,
        rows: this.rows,
        loading: this.loading,
        head: {
          id: 'Bezeichnung',
          key: 'Schlüssel',
          length: 'Zylinderlänge (mm)',
          type: 'Zylindertyp',
          unit: 'Stück',
        },
        body: {
          builds: {
            items: this.builds,
            select: this.selectBuild,
          },
          length: {
            items: this.length,
            selectInner: this.selectInnerLength,
          },
        },
      })}
    `;
  }
}

customElements.define('hws-data-table', HwsDataTable);
