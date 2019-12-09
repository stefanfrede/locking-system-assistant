import { html } from 'lit-element';

export const table = ({ body, columns, head, isLoading, rows } = {}) => html`
  <div class="table-responsive" data-loading="${isLoading}">
    <table>
      <thead>
        ${thead({ columns, head })}
      </thead>
      <tbody>
        ${tbody({ columns, rows, body })}
      </tbody>
      <tfoot>
        ${tfoot({ columns })}
      </tfoot>
    </table>
    <div class="is-loading">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        class="spinner"
      >
        <path
          d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48
             48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48
             48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48
             48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96
             256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49
             48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48
             48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48
             21.49-48 48s21.49 48 48 48 48-21.49
             48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48
             48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"
        />
      </svg>
    </div>
  </div>
`;

export const thead = ({ columns, head } = {}) => html`
  <tr>
    <th scope="col">
      #
    </th>
    <th scope="col">
      ${head.id}
    </th>
    <th scope="col">
      ${head.type}
    </th>
    <th scope="col">
      ${head.length}
    </th>
    <th scope="col">
      ${head.unit}
    </th>
    <th colspan="${columns}" scope="col">
      ${head.key}
    </th>
  </tr>
`;

export const tbody = ({ columns, rows, body } = {}) => {
  const trs = [];

  for (let i = 0; i < rows; i++) {
    const row = i + 1;

    trs.push(html`
      <tr>
        <th scope="row" class="lsa__pos">
          ${row}
        </th>
        ${inputText({
          id: `door-${row}`,
          name: `door-${row}`,
          placeholder: 'Tür- oder Raumbezeichner',
          row,
          value: '',
        })}
        ${selectBuild({
          items: body.builds.items,
          row,
          select: body.builds.select,
        })}
        ${selectLength({
          inner: body.lengths.inner[row] ? body.lengths.inner[row] : [],
          outer: body.lengths.outer[row] ? body.lengths.outer[row] : [],
          row,
          selectInner: body.lengths.selectInner,
          selectOuter: body.lengths.selectOuter,
        })}
        ${inputNumber({
          id: `quantity-model-${row}`,
          max: '',
          min: '0',
          name: `quantity-model-${row}`,
          row,
          value: '0',
        })}
        ${inputCheckboxes({ columns, row })}
      </tr>
    `);
  }

  return html`
    ${trs}
  `;
};

export const tfoot = ({ columns }) => {
  const tds = [];

  for (let i = 0; i < columns; i++) {
    tds.push(html`
      ${inputNumber({
        id: `quantity-keys-${i + 1}`,
        max: '',
        min: '0',
        name: `quantity-keys-${i + 1}`,
        row: 'footer',
        value: '0',
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

export const inputText = ({ id, name, placeholder, row, value } = {}) => html`
  <td class="lsa__id">
    <input
      data-row="${row}"
      id="${id}"
      type="text"
      name="${name}"
      placeholder="${placeholder}"
      value="${value}"
    />
  </td>
`;

export const inputNumber = ({ id, max, min, name, row, value } = {}) => html`
  <td class="lsa__unit">
    <input
      data-row="${row}"
      id="${id}"
      max="${max}"
      min="${min}"
      name="${name}"
      type="number"
      value="${value}"
    />
  </td>
`;

export const inputCheckboxes = ({ columns, row }) => {
  const tds = [];

  for (let i = 0; i < columns; i++) {
    const id = `key-${i + 1}-${row}`;
    const label = `Schlüssel ${i + 1} für Zeile ${row}`;
    const value = `${i + 1}-${row}`;

    tds.push(html`
      ${inputCheckbox({ id, label, row, value })}
    `);
  }

  return html`
    ${tds}
  `;
};

export const inputCheckbox = ({ id, label, row, value }) => html`
  <td class="lsa__key">
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
`;

export const selectBuild = ({ items, row, select }) => html`
  <td class="lsa__type">
    <select
      @change="${select}"
      ?disabled=${!items.length}
      data-row="${row}"
      id="cylinder-build-${row}"
      name="cylinder-build-${row}"
    >
      <option selected hidden value>Bitte auswählen</option>
      ${items.map(
        item =>
          html`
            <option value="${item}">${item}</option>
          `,
      )}
    </select>
  </td>
`;

export const selectLength = ({
  inner,
  outer,
  row,
  selectInner,
  selectOuter,
}) => html`
  <td class="lsa__length">
    <div class="lsa__length__inner">
      <select
        @change="${selectInner}"
        ?disabled=${!inner.length}
        data-row="${row}"
        id="cylinder-length-inner-${row}"
        name="cylinder-length-inner-${row}"
      >
        <option selected hidden value>innen</option>
        ${inner.map(
          length => html`
            <option value="${length}">${length}</option>
          `,
        )}
      </select>
      <select
        @change="${selectOuter}"
        ?disabled=${!outer.length}
        id="cylinder-length-outer-${row}"
        name="cylinder-length-outer-${row}"
        data-row="${row}"
      >
        <option selected hidden value>außen</option>
        ${outer.map(
          length => html`
            <option value="${length}">${length}</option>
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
