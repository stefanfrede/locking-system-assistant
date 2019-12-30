import { LitElement, html } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';

import { stylesheet } from './styles/index.js';

class HwsDataTable extends LitElement {
  static get styles() {
    return [stylesheet];
  }

  static get properties() {
    return {
      guard: { type: Number },
      model: { type: String },
      builds: { type: Object },
      innerLengths: { type: Object },
      outerLengths: { type: Object },
      selection: { type: Object },
    };
  }

  constructor() {
    super();

    this.model = '';
    this.builds = {};
    this.guard = 3;
    this.innerLengths = {};
    this.outerLengths = {};
    this.selection = [];
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

  adjustTable(e) {
    e.preventDefault();

    const btn = e.target.closest('button');

    this.dispatchEvent(
      new CustomEvent('adjustTable', {
        bubbles: true,
        composed: true,
        detail: btn,
      }),
    );
  }

  editIdentifier(e) {
    this.dispatchEvent(
      new CustomEvent('editIdentifier', {
        bubbles: true,
        composed: true,
        detail: e.target,
      }),
    );
  }

  editQuantity(e) {
    this.dispatchEvent(
      new CustomEvent('editQuantity', {
        bubbles: true,
        composed: true,
        detail: e.target,
      }),
    );
  }

  deleteRow(e) {
    e.preventDefault();

    const btn = e.target.closest('button');

    this.dispatchEvent(
      new CustomEvent('deleteRow', {
        bubbles: true,
        composed: true,
        detail: btn,
      }),
    );
  }

  getSelectOptions({ index, object }) {
    return Array.isArray(object[index]) ? object[index] : [];

    // return Object.keys(lengths).length
    //   ? Array.isArray(lengths[index])
    //     ? lengths[index]
    //     : []
    //   : [];
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

  selectKey(e) {
    this.dispatchEvent(
      new CustomEvent('selectKey', {
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

  submitForm(e) {
    e.preventDefault();

    this.dispatchEvent(
      new CustomEvent('submitForm', {
        bubbles: true,
        composed: true,
        detail: e.target,
      }),
    );
  }

  colgroup(keys) {
    const cols = [];

    for (let i = 0; i < keys; i++) {
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
        <col class="lsa__actions" />
      </colgroup>
    `;
  }

  thead(keys) {
    return html`
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
          <th colspan="${keys}" scope="col">
            Schlüssel
          </th>
          <th scope="col"></th>
        </tr>
      </thead>
    `;
  }

  tbody({ builds, innerLengths, model, outerLengths, selection }) {
    return html`
      <tbody>
        ${repeat(
          selection,
          item => item,
          (item, index) => html`
            <tr data-row="${index}">
              <th scope="row">
                ${index + 1}
              </th>
              <td>
                <input
                  @blur="${this.editIdentifier}"
                  class="js-form-field"
                  id="door-${index}"
                  type="text"
                  name="door-${index}"
                  placeholder="Tür- oder Raumbezeichner"
                  value="${item.name}"
                />
              </td>
              <td>
                <select
                  @change="${this.selectBuild}"
                  ?disabled=${!this.getSelectOptions({
                    index: model,
                    object: builds,
                  }).length}
                  class="js-form-field"
                  id="cylinder-build-${index}"
                  name="cylinder-build-${index}"
                >
                  <option selected hidden value>
                    Bitte auswählen
                  </option>
                  ${this.getSelectOptions({ index: model, object: builds }).map(
                    option =>
                      html`
                        <option
                          ?selected="${option === item.build}"
                          value="${option}"
                        >
                          ${option}
                        </option>
                      `,
                  )}
                </select>
              </td>
              <td>
                <div class="lsa__length__inner">
                  <select
                    @change="${this.selectInnerLength}"
                    ?disabled=${!this.getSelectOptions({
                      index,
                      object: innerLengths,
                    }).length}
                    class="js-form-field"
                    id="cylinder-length-inner-${index}"
                    name="cylinder-length-inner-${index}"
                  >
                    <option selected hidden value>
                      Innen
                    </option>
                    ${this.getSelectOptions({
                      index,
                      object: innerLengths,
                    }).map(
                      option =>
                        html`
                          <option
                            ?selected="${option === item.innerLength}"
                            value="${option}"
                          >
                            ${option}
                          </option>
                        `,
                    )}
                  </select>
                  <select
                    @change="${this.selectOuterLength}"
                    ?disabled=${!this.getSelectOptions({
                      index,
                      object: outerLengths,
                    }).length}
                    class="js-form-field"
                    id="cylinder-length-outer-${index}"
                    name="cylinder-length-outer-${index}"
                  >
                    <option selected hidden value>
                      Außen
                    </option>
                    ${this.getSelectOptions({
                      index,
                      object: outerLengths,
                    }).map(
                      option =>
                        html`
                          <option
                            ?selected="${option === item.outerLength}"
                            value="${option}"
                          >
                            ${option}
                          </option>
                        `,
                    )}
                  </select>
                </div>
              </td>
              <td>
                <input
                  @change="${this.editQuantity}"
                  class="js-form-field"
                  id="quantity-model-${index}"
                  max=""
                  min="0"
                  name="quantity-model-${index}"
                  type="number"
                  value="${item.units}"
                />
              </td>
              ${repeat(
                item.keys,
                key => key,
                (key, idx) => html`
                  <td>
                    <div class="chkb">
                      <input
                        @change="${this.selectKey}"
                        ?checked="${key}"
                        aria-label="${`Schlüssel ${key + 1} in Zeile ${idx +
                          1}`}"
                        class="chkb__input js-form-field"
                        id="key-${index}-${idx}"
                        name="key-${index}-${idx}"
                        type="checkbox"
                        value="${idx}"
                      />
                      <label for="key-${index}-${idx}" class="chkb__label">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path
                            d="M173.898
                            439.404l-166.4-166.4c-9.997-9.997-9.997-26.206
                            0-36.204l36.203-36.204c9.997-9.998 26.207-9.998
                            36.204 0L192 312.69 432.095 72.596c9.997-9.997
                            26.207-9.997 36.204 0l36.203 36.204c9.997 9.997
                            9.997 26.206 0 36.204l-294.4 294.401c-9.998
                            9.997-26.207 9.997-36.204-.001z"
                          />
                        </svg>
                      </label>
                    </div>
                  </td>
                `,
              )}
              <td>
                <button
                  @click="${this.deleteRow}"
                  class="btn btn-outline-danger"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path
                      d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0
                         48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0
                         1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32
                         0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432
                         32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72
                         0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0
                         0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          `,
        )}
      </tbody>
    `;
  }

  tfoot(keys) {
    const tds = [];

    for (let i = 0; i < keys; i++) {
      const id = `quantity-keys-${i}`;

      tds.push(html`
        <td class="lsa__unit">
          <input
            @change="${this.editQuantity}"
            class="js-form-field"
            data-key="${i}"
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
          <td colspan="4">
            <div class="lsa__controls">
              <div class="lsa__control">
                Zeile
                <button
                  @click="${this.adjustTable}"
                  class="btn btn-light"
                  data-type="row"
                  data-action="increment"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path
                      d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32
                      14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67
                      14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0
                      32-14.33 32-32V304h144c17.67 0 32-14.33
                      32-32v-32c0-17.67-14.33-32-32-32z"
                    />
                  </svg>
                </button>
                <button
                  @click="${this.adjustTable}"
                  class="btn btn-light"
                  data-type="row"
                  data-action="decrement"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path
                      d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32
                      32 32h384c17.67 0 32-14.33
                      32-32v-32c0-17.67-14.33-32-32-32z"
                    />
                  </svg>
                </button>
              </div>
              <div class="lsa__control">
                Schlüssel
                <button
                  @click="${this.adjustTable}"
                  class="btn btn-light"
                  data-type="key"
                  data-action="increment"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path
                      d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32
                      14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67
                      14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0
                      32-14.33 32-32V304h144c17.67 0 32-14.33
                      32-32v-32c0-17.67-14.33-32-32-32z"
                    />
                  </svg>
                </button>
                <button
                  @click="${this.adjustTable}"
                  class="btn btn-light"
                  data-type="key"
                  data-action="decrement"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path
                      d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32
                      32 32h384c17.67 0 32-14.33
                      32-32v-32c0-17.67-14.33-32-32-32z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </td>
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
          <td></td>
        </tr>
      </tfoot>
    `;
  }

  render() {
    return html`
      <form @submit="${this.submitForm}" class="table-responsive">
        <table>
          ${this.colgroup(this.keys)} ${this.thead(this.keys)}
          ${this.tbody({
            builds: this.builds,
            innerLengths: this.innerLengths,
            model: this.model,
            outerLengths: this.outerLengths,
            selection: this.selection,
          })}
          ${this.tfoot(this.keys)}
        </table>
        <button class="btn btn-success">
          In den Warenkorb legen
        </button>
      </form>
    `;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'selection') {
        const btnKey = this.shadowRoot.querySelector(
          '[data-action=decrement][data-type=key]',
        );

        const btnRow = this.shadowRoot.querySelector(
          '[data-action=decrement][data-type=row]',
        );

        if (this.keys <= this.guard) {
          btnKey.setAttribute('disabled', '');
          btnKey.setAttribute('aria-disabled', 'true');
        }

        if (this.keys > this.guard) {
          btnKey.removeAttribute('disabled');
          btnKey.removeAttribute('aria-disabled');
        }

        if (this.rows <= this.guard) {
          btnRow.setAttribute('disabled', '');
          btnRow.setAttribute('aria-disabled', 'true');
        }

        if (this.rows > this.guard) {
          btnRow.removeAttribute('disabled');
          btnRow.removeAttribute('aria-disabled');
        }
      }
    });
  }
}

customElements.define('hws-data-table', HwsDataTable);
