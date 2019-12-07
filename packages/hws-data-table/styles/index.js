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

    .is-loading {
      align-items: center;
      background-color: rgba(234, 237, 240, 0.35);
      display: none;
      justify-content: center;
    }

    @keyframes spinner {
      to {
        transform: rotate(360deg);
      }
    }

    .spinner {
      animation: spinner 1s linear infinite;
      height: 4rem;
      width: 4rem;
    }

    [data-loading='true'] {
      position: relative;
    }

    [data-loading='true'] .is-loading {
      bottom: 3.5rem;
      display: flex;
      left: 0;
      position: absolute;
      right: 0;
      top: 2rem;
    }
  `,
];
