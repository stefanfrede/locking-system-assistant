import { css } from 'lit-element';

import { forms } from './forms.js';
import { reboot } from './reboot.js';

export const stylesheet = [
  reboot,
  forms,
  css`
    :root {
      --hws-input-width: 100%;
    }
  `,
];
