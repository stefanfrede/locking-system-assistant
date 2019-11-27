import { css } from 'lit-element';

import { forms } from './forms.js';
import { reboot } from './reboot.js';
import { tables } from './tables.js';
import { variables } from './variables.js';

export const stylesheet = [
  variables,
  reboot,
  forms,
  tables,
  css`
    .lsa__pos {
      width: 3rem;
    }

    .lsa__id {
      width: 14rem;
    }

    .lsa__type {
      width: 10rem;
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

    .lsa__key,
    .lsa__unit {
      width: 4rem;
    }

    .lsa__key-icon {
      text-align: center;
    }

    [data-icon='key'] {
      height: 1.5rem;
      width: 1.5rem;
    }
  `,
];
