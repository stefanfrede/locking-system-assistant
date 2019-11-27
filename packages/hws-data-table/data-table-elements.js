import { html } from 'lit-element';

export const thead = ({
  id = 'Bezeichnung',
  type = 'Zylindertyp',
  length = 'Zylinderlänge',
  unit = 'Stück',
  key = 'Schlüssel',
  columns,
} = {}) => html`
  <tr>
    <th scope="col">
      #
    </th>
    <th scope="col">
      ${id}
    </th>
    <th scope="col">
      ${type}
    </th>
    <th scope="col">
      ${length}
    </th>
    <th scope="col">
      ${unit}
    </th>
    <th colspan="${columns}" scope="col">
      ${key}
    </th>
  </tr>
`;

export const tbody = (columns, rows) => {
  const trs = [];

  for (let i = 0; i < rows; i++) {
    const row = i + 1;
    trs.push(html`
      <tr>
        <th scope="row" class="lsa__pos">
          ${row}
        </th>
        ${inputText({
          id: 'door-${rows}',
          name: 'door-${rows}',
        })}
        ${selectType({
          items: [
            'Doppelzylinder',
            'Knaufzylinder',
            'Halbzylinder',
            'Vorhängeschloß',
            'Briefkasten',
            'Außenzylinder',
          ],
          row,
        })}
        ${selectLength({
          inners: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
          outers: [30, 35, 40, 45, 50, 55, 60, 65],
          row,
        })}
        ${inputNumber({
          id: 'quantity-${rows}',
          name: 'quantity-${rows}',
        })}
        ${inputCheckboxes(columns, row)}
      </tr>
    `);
  }

  return html`
    ${trs}
  `;
};

export const tfoot = columns => {
  const tds = [];

  for (let i = 0; i < columns; i++) {
    tds.push(html`
      ${inputNumber({
        id: `quantity-${i + 1}`,
        name: `quantity-${i + 1}`,
      })}
    `);
  }

  return html`
    <tr>
      <td colspan="4"></td>
      ${keyIcon} ${tds}
    </tr>
  `;
};

export const inputNumber = ({
  id = '',
  name = '',
  min = '0',
  max = '',
  value = '0',
} = {}) => html`
  <td class="lsa__unit">
    <input
      id="${id}"
      type="number"
      name="${name}"
      min="${min}"
      max="${max}"
      value="${value}"
    />
  </td>
`;

export const inputText = ({
  id = '',
  name = '',
  placeholder = 'Tür- oder Raumbezeichner',
  value = '',
} = {}) => html`
  <td class="lsa__id">
    <input
      id="${id}"
      type="text"
      name="${name}"
      placeholder="${placeholder}"
      value="${value}"
    />
  </td>
`;

export const inputCheckbox = (data = [0, 0]) => {
  const [key, row] = data;
  const id = `key-${key}-${row}`;
  const label = `Schlüssel ${key} für Zeile ${row}`;

  return html`
    <td class="lsa__key">
      <div class="checkbox">
        <input
          id="${id}"
          type="checkbox"
          value="${id}"
          aria-label="${label}"
          class="checkbox__input"
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
  `;
};

export const inputCheckboxes = (columns, row) => {
  const tds = [];

  for (let i = 0; i < columns; i++) {
    tds.push(html`
      ${inputCheckbox([i + 1, row])}
    `);
  }

  return html`
    ${tds}
  `;
};

export const selectType = ({ items = [], row = 1 } = {}) => html`
  <td class="lsa__type">
    <select id="cylinder-type-${row}" name="cylinder-type-${row}">
      <option selected hidden value>Bitte auswählen</option>
      ${items.map(
        item => html`
          <option value="${item}">${item}</option>
        `,
      )}
    </select>
  </td>
`;

export const selectLength = ({
  inners = [],
  outers = [],
  row = 1,
} = {}) => html`
  <td class="lsa__length">
    <div class="lsa__length__inner">
      <select
        id="cylinder-length-${row}-inner"
        name="cylinder-length-${row}-inner"
      >
        <option selected hidden value>innen</option>
        ${inners.map(
          inner => html`
            <option value="${inner}">${inner}</option>
          `,
        )}
      </select>
      <select
        id="cylinder-length-${row}-outer"
        name="cylinder-length-${row}-outer"
      >
        <option selected hidden value>außen</option>
        ${outers.map(
          outer => html`
            <option value="${outer}">${outer}</option>
          `,
        )}
      </select>
    </div>
  </td>
`;

export const keyIcon = html`
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
  </td>
`;
