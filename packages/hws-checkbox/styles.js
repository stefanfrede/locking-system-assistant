import { css } from 'lit-element';

export const stylesheet = [
  css`
    div {
      align-items: center;
      display: inline-flex;
      justify-content: center;
      position: relative;
    }

    input {
      border: 0 !important;
      clip: rect(0, 0, 0, 0) !important;
      height: 1px !important;
      margin: -1px !important;
      overflow: hidden !important;
      padding: 0 !important;
      position: absolute !important;
      white-space: nowrap !important;
      width: 1px !important;
    }

    label {
      align-items: center;
      background-color: var(--input-bg, hsl(0, 0%, 100%));
      border: 1px solid var(--input-border-color, hsl(210, 14%, 83%));
      border-radius: 0.2rem;
      cursor: pointer;
      display: flex;
      height: 1.5rem;
      justify-content: center;
      margin-bottom: 0;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      user-select: none;
      width: 1.5rem;
    }

    label:before {
      content: '';
    }

    label > svg {
      pointer-events: none;
      width: 1rem;
    }

    label > svg > path {
      fill: var(--input-bg, hsl(0, 0%, 100%));
      transition: fill 0.15s ease-in-out;
    }

    input:focus + label {
      border-color: var(--input-focus-border-color, hsl(215, 98%, 77%));
      box-shadow: 0 0 0 0.2rem
        var(--input-focus-box-shadow, rgba(13, 110, 253, 0.25));
      outline: 0;
    }

    input:checked + label > svg > path {
      fill: var(--input-color, hsl(210, 9%, 31%));
    }

    input.is-invalid + label {
      border-color: hsl(354, 70%, 54%);
    }

    input.is-invalid:focus + label {
      border-color: hsl(354, 70%, 54%);
      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
  `,
];
