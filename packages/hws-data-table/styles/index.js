import { css } from 'lit-element';

import { buttons } from './buttons.js';
import { forms } from './forms.js';
import { reboot } from './reboot.js';
import { tables } from './tables.js';
import { variables } from './variables.js';

export const stylesheet = [
  variables,
  reboot,
  buttons,
  forms,
  tables,
  css`
    form {
      text-align: right;
    }

    .lsa__pos {
      width: 3rem;
    }

    .lsa__id {
      width: 14rem;
    }

    .lsa__type {
      width: 11rem;
    }

    .lsa__length {
      width: 11rem;
    }

    .lsa__length__inner {
      display: flex;
      justify-content: space-between;
    }

    .lsa__length__inner > select {
      width: 5rem;
    }

    .lsa__actions,
    .lsa__key,
    .lsa__unit {
      width: 4rem;
    }

    .lsa__key-icon {
      text-align: center;
    }

    .lsa__controls {
      display: flex;
      padding-left: 3rem;
    }

    .lsa__control {
      align-items: center;
      display: flex;
    }

    .lsa__control + .lsa__control {
      margin-left: 1rem;
    }

    .lsa__control > button {
      margin-left: 0.5rem;
      padding: 0.1875rem 0.4375rem;
    }

    .lsa__control > button > svg {
      height: 1rem;
      width: 1rem;
    }

    td > .btn {
      padding: 0.1875rem 0.5rem;
    }

    td > .btn > svg {
      fill: currentcolor;
      height: 0.875rem;
      width: 0.875rem;
    }

    [data-icon='key'] {
      height: 1.5rem;
      width: 1.5rem;
    }
  `,
];
