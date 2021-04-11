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
    :host {
      contain: content;
    }

    form {
      text-align: right;
    }

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

    .lsa__actions,
    .lsa__key,
    .lsa__unit {
      width: 64px;
    }

    .lsa__key-icon {
      text-align: center;
    }

    .lsa__controls {
      display: flex;
      padding-left: calc(1px + 8px);
    }

    .lsa__control {
      align-items: center;
      display: flex;
    }

    .lsa__control + .lsa__control {
      margin-left: 16px;
    }

    .lsa__control > button {
      margin-left: 8px;
      padding: 3px 7px;
    }

    .lsa__control > button > svg {
      height: 16px;
      width: 16px;
    }

    .btn > .down {
      display: none;
    }

    .hide-details .btn > .down {
      display: inline;
    }

    .hide-details .btn > .up {
      display: none;
    }

    .hide-details .details {
      display: none;
    }

    .first-row .btn-sort-up {
      display: none;
    }

    .last-row .btn-sort-down {
      display: none;
    }

    .btn-group {
      display: flex;
      justify-content: flex-end;
    }

    .last-row .btn-group {
      justify-content: space-between;
    }

    .btn-group > .btn + .btn {
      margin-left: 8px;
    }

    .btn-group > .btn,
    td > .btn {
      padding: 3px 8px;
    }

    .btn-group > .btn > svg,
    td > .btn > svg {
      fill: currentcolor;
      height: 14px;
      width: 14px;
    }

    [data-icon='key'] {
      height: 24px;
      width: 24px;
    }

    dl {
      column-gap: 16px;
      display: grid;
      font-size: 14px;
      grid-template-columns: auto 1fr;
      line-height: 1.5;
      margin: 16px 0;
    }

    dt {
      font-weight: 700;
    }

    dd {
      margin: 0;
    }
  `,
];
