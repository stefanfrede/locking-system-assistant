import { LitElement, html, css, unsafeCSS } from 'lit-element';

import 'hws-checkbox';

import Bootstrap from './bootstrap.scss';

class HwsDataTable extends LitElement {
  static get styles() {
    return css`
      ${unsafeCSS(Bootstrap)};
    `;
  }

  render() {
    return html`
      <div class="table-responsive">
        <table class="table table-sm table-hover">
          <colgroup>
            <col class="lsa__pos" />
            <col class="lsa__id" />
            <col class="lsa__type" />
            <col class="lsa__length" />
            <col class="lsa__unit" />
            <col class="lsa__key" />
            <col class="lsa__key" />
            <col class="lsa__key" />
            <col class="lsa__key" />
            <col class="lsa__key" />
          </colgroup>
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
                Zylinderlänge
              </th>
              <th scope="col">
                Stück
              </th>
              <th colspan="5" scope="col">
                Schlüssel
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                1
              </th>
              <td>
                <input
                  id="door-1"
                  type="text"
                  name="door-1"
                  class="form-control form-control-sm"
                  placeholder="Tür- oder Raumbezeichner"
                />
              </td>
              <td>
                <select
                  id="cylinder-type-1"
                  name="cylinder-type-1"
                  class="form-control form-control-sm"
                >
                  <option value="">Bitte auswählen</option>
                  <option value="Doppelzylinder">Doppelzylinder</option>
                  <option value="Knaufzylinder">Knaufzylinder</option>
                  <option value="Halbzylinder">Halbzylinder</option>
                  <option value="Vorhängeschloß">Vorhängeschloß</option>
                  <option value="Briefkasten">Briefkasten</option>
                  <option value="Außenzylinder">Außenzylinder</option>
                </select>
              </td>
              <td>
                <div class="lsa__length__inner">
                  <select
                    id="cylinder-length-1-l"
                    name="cylinder-length-1-l"
                    class="form-control form-control-sm"
                  >
                    <option value="">außen</option>
                    <option value="30">30</option>
                    <option value="35">35</option>
                    <option value="40">40</option>
                    <option value="45">45</option>
                    <option value="50">50</option>
                    <option value="55">55</option>
                    <option value="60">60</option>
                    <option value="65">65</option>
                  </select>
                  <select
                    id="cylinder-length-1-r"
                    name="cylinder-length-1-r"
                    class="form-control form-control-sm"
                  >
                    <option value="">innen</option>
                    <option value="30">30</option>
                    <option value="35">35</option>
                    <option value="40">40</option>
                    <option value="45">45</option>
                    <option value="50">50</option>
                    <option value="55">55</option>
                    <option value="60">60</option>
                    <option value="65">65</option>
                    <option value="70">70</option>
                    <option value="75">75</option>
                    <option value="80">80</option>
                    <option value="85">85</option>
                    <option value="90">90</option>
                  </select>
                </div>
              </td>
              <td>
                <input
                  id="quantity-1"
                  type="number"
                  name="quantity-1"
                  min="0"
                  value="0"
                  class="form-control form-control-sm"
                />
              </td>
              <td>
                <hws-checkbox data="[1, 1]"></hws-checkbox>
              </td>
              <td>
                <hws-checkbox data="[2, 1]"></hws-checkbox>
              </td>
              <td>
                <hws-checkbox data="[3, 1]"></hws-checkbox>
              </td>
              <td>
                <hws-checkbox data="[4, 1]"></hws-checkbox>
              </td>
              <td>
                <hws-checkbox data="[5, 1]"></hws-checkbox>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4"></td>
              <td>
                <div class="key-box">
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
                      d="M512 176.001C512 273.203 433.202
                      352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012
                      27.014A23.999 23.999 0 0 1 261.223 384H224v40c0
                      13.255-10.745 24-24 24h-40v40c0
                      13.255-10.745 24-24 24H24c-13.255
                      0-24-10.745-24-24v-78.059c0-6.365
                      2.529-12.47
                      7.029-16.971l161.802-161.802C163.108
                      213.814 160 195.271 160 176 160 78.798
                      238.797.001 335.999 0 433.488-.001 512
                      78.511 512 176.001zM336 128c0 26.51
                      21.49 48 48 48s48-21.49
                      48-48-21.49-48-48-48-48 21.49-48 48z"
                    ></path>
                  </svg>
                </div>
              </td>
              <td>
                <input
                  id="key-1"
                  type="number"
                  name="key-1"
                  min="0"
                  value="0"
                  class="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  id="key-2"
                  type="number"
                  name="key-2"
                  min="0"
                  value="0"
                  class="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  id="key-3"
                  type="number"
                  name="key-3"
                  min="0"
                  value="0"
                  class="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  id="key-4"
                  type="number"
                  name="key-4"
                  min="0"
                  value="0"
                  class="form-control form-control-sm"
                />
              </td>
              <td>
                <input
                  id="key-5"
                  type="number"
                  name="key-5"
                  min="0"
                  value="0"
                  class="form-control form-control-sm"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  }
}

customElements.define('hws-data-table', HwsDataTable);
