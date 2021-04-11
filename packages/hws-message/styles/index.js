import { css } from 'lit-element';

import { alert } from './alert.js';
import { reboot } from './reboot.js';

export const stylesheet = [
  reboot,
  alert,
  css`
    .lsa__pos {
      width: 48px;
    }

    .lsa__id {
      width: 224px;
    }

    .lsa__type {
      width: 176px;
    }

    .lsa__length {
      width: 176px;
    }

    .lsa__length__inner {
      display: flex;
      justify-content: space-between;
    }

    .lsa__length__inner > select {
      width: 80px;
    }

    .lsa__key,
    .lsa__unit {
      width: 64px;
    }

    .lsa__key-icon {
      text-align: center;
    }

    [data-icon='key'] {
      height: 24px;
      width: 24px;
    }
  `,
];
