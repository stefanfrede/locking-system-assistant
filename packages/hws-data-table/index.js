import { LitElement, html } from 'lit-element';

import { stylesheet } from './styles/index.js';

class HwsDataTable extends LitElement {
  static get styles() {
    return [stylesheet];
  }

  static get properties() {
    return {
      builds: { type: Object },
      columns: { type: Number },
      innerLengths: { type: Object },
      outerLengths: { type: Object },
      rows: { type: Number },
    };
  }

  constructor() {
    super();

    this.builds = [];
    this.columns = 1;
    this.innerLengths = {};
    this.outerLengths = {};
    this.rows = 1;
  }

  selectBuild(e) {
    this.dispatchEvent(
      new CustomEvent('selectBuild', {
        bubbles: true,
        composed: true,
        detail: e.target,
      }),
    );
  }

  selectInnerLength(e) {
    this.dispatchEvent(
      new CustomEvent('selectInnerLength', {
        bubbles: true,
        composed: true,
        detail: e.target,
      }),
    );
  }

  selectOuterLength(e) {
    this.dispatchEvent(
      new CustomEvent('selectOuterLength', {
        bubbles: true,
        composed: true,
        detail: e.target,
      }),
    );
  }

  colgroup(columns) {
    const cols = [];

    for (let i = 0; i < columns; i++) {
      cols.push(html`
        <col class="lsa__key" />
      `);
    }

    return html`
      <colgroup>
        <col class="lsa__pos" />
        <col class="lsa__id" />
        <col class="lsa__type" />
        <col class="lsa__length" />
        <col class="lsa__unit" />
        ${cols}
      </colgroup>
    `;
  }

  checkboxes(columns, row) {
    const tds = [];

    for (let i = 0; i < columns; i++) {
      const id = `key-${i + 1}-${row}`;
      const label = `Schlüssel ${i + 1} für Zeile ${row}`;
      const value = `${i + 1}-${row}`;

      tds.push(html`
        <td>
          <div class="checkbox">
            <input
              aria-label="${label}"
              class="checkbox__input"
              data-row="${row}"
              id="${id}"
              type="checkbox"
              value="${value}"
            />
            <label for="${id}" class="checkbox__label">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206
                  0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192
                  312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203
                  36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998
                  9.997-26.207 9.997-36.204-.001z"
                />
              </svg>
            </label>
          </div>
        </td>
      `);
    }

    return html`
      ${tds}
    `;
  }

  tbody(builds, columns, innerLengths, outerLengths, rows) {
    const trs = [];

    for (let i = 0; i < rows; i++) {
      const row = i + 1;

      const inners = Object.keys(innerLengths).length
        ? Array.isArray(innerLengths[row])
          ? innerLengths[row]
          : []
        : [];

      const outers = Object.keys(outerLengths).length
        ? Array.isArray(outerLengths[row])
          ? outerLengths[row]
          : []
        : [];

      trs.push(html`
        <tr>
          <th scope="row">
            ${row}
          </th>
          <td>
            <input
              data-row="${row}"
              id="door-${row}"
              type="text"
              name="door-${row}"
              placeholder="Tür- oder Raumbezeichner"
              value=""
            />
          </td>
          <td>
            <select
              @change="${this.selectBuild}"
              ?disabled=${!this.builds.length}
              data-row="${row}"
              id="cylinder-build-${row}"
              name="cylinder-build-${row}"
            >
              <option selected hidden value>
                Bitte auswählen
              </option>
              ${builds.map(
                build =>
                  html`
                    <option value="${build}">
                      ${build}
                    </option>
                  `,
              )}
            </select>
          </td>
          <td>
            <div class="lsa__length__inner">
              <select
                @change="${this.selectInnerLength}"
                ?disabled=${!inners.length}
                data-row="${row}"
                id="cylinder-length-inner-${row}"
                name="cylinder-length-inner-${row}"
              >
                <option selected hidden value>
                  innen
                </option>
                ${inners.map(
                  length => html`
                    <option value="${length}">
                      ${length}
                    </option>
                  `,
                )}
              </select>
              <select
                @change="${this.selectOuterLength}"
                ?disabled=${!outers.length}
                id="cylinder-length-outer-${row}"
                name="cylinder-length-outer-${row}"
                data-row="${row}"
              >
                <option selected hidden value>
                  außen
                </option>
                ${outers.map(
                  length => html`
                    <option value="${length}">
                      ${length}
                    </option>
                  `,
                )}
              </select>
            </div>
          </td>
          <td>
            <input
              id="quantity-model-${row}"
              max=""
              min="0"
              name="quantity-model-${row}"
              type="number"
              value="0"
            />
          </td>
          ${this.checkboxes(columns, row)}
        </tr>
      `);
    }

    return html`
      <tbody>
        ${trs}
      </tbody>
    `;
  }

  tfoot(columns) {
    const tds = [];

    for (let i = 0; i < columns; i++) {
      const id = `quantity-keys-${i + 1}`;

      tds.push(html`
        <td class="lsa__unit">
          <input
            data-key="${i + 1}"
            id="${id}"
            max=""
            min="0"
            name="${id}"
            type="number"
            value="0"
          />
        </td>
      `);
    }

    return html`
      <tfoot>
        <tr>
          <td colspan="4"></td>
          <td class="lsa__key-icon">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="key"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M512 176.001C512 273.203 433.202 352 336 352c-11.22
                0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 0 1
                261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0
                13.255-10.745 24-24 24H24c-13.255
                0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47
                7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176
                160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512
                176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49
                48-48-21.49-48-48-48-48 21.49-48 48z"
              ></path>
            </svg>
          </td>
          ${tds}
        </tr>
      </tfoot>
    `;
  }

  render() {
    return html`
      <div class="table-responsive">
        <table>
          ${this.colgroup(this.columns)}
          <thead>
            <tr>
              <th scope="col">
                #
              </th>
              <th scope="col">
                Bezeichnung
              </th>
              <th scope="col">
                Zylindertyp
              </th>
              <th scope="col">
                Zylinderlänge (mm)
              </th>
              <th scope="col">
                Stück
              </th>
              <th colspan="${this.columns}" scope="col">
                Schlüssel
              </th>
            </tr>
          </thead>
          ${this.tbody(
            this.builds,
            this.columns,
            this.innerLengths,
            this.outerLengths,
            this.rows,
          )}
          ${this.tfoot(this.columns)}
        </table>
      </div>
    `;
  }
}

customElements.define('hws-data-table', HwsDataTable);
