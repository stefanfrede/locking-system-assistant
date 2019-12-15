import { css } from 'lit-element';

import { alert } from './alert.js';
import { reboot } from './reboot.js';

export const stylesheet = [
  reboot,
  alert,
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
  `,
];
