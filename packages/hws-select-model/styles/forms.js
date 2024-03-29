import { css } from 'lit-element';

export const forms = css`
  input,
  select {
    background-clip: padding-box;
    background-color: var(--input-bg, hsl(0, 0%, 100%));
    border: 1px solid var(--input-border-color, hsl(210, 14%, 83%));
    border-radius: 3.2px;
    color: var(--input-color, hsl(210, 9%, 31%));
    display: block;
    font-size: 16px;
    font-weight: 400;
    height: 32px;
    line-height: 1.5;
    padding: 3px 8px;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    width: 100%;
  }

  select {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    input,
    select {
      transition: none;
    }
  }

  /* Unstyle the caret on <select>s in IE10+ */

  input::-ms-expand,
  select::-ms-expand {
    background-color: transparent;
    border: 0;
  }

  input:focus,
  select:focus {
    background-color: var(--input-focus-bg, hsl(0, 0%, 100%));
    border-color: var(--input-focus-border-color, hsl(215, 98%, 77%));
    box-shadow: 0 0 0 3.2px
      var(--input-focus-box-shadow, rgba(13, 110, 253, 0.25));
    color: var(--input-focus-color, hsl(210, 9%, 31%));
    outline: 0;
  }

  input::-webkit-input-placeholder,
  select::-webkit-input-placeholder {
    color: var(--input-placeholder-color, hsl(208, 7%, 46%));
    font-style: italic;
    opacity: 1;
  }

  input::-moz-placeholder,
  select::-moz-placeholder {
    color: var(--input-placeholder-color, hsl(208, 7%, 46%));
    font-style: italic;
    opacity: 1;
  }

  input:-ms-input-placeholder,
  select:-ms-input-placeholder {
    color: var(--input-placeholder-color, hsl(208, 7%, 46%));
    font-style: italic;
    opacity: 1;
  }

  input::-ms-input-placeholder,
  select::-ms-input-placeholder {
    color: var(--input-placeholder-color, hsl(208, 7%, 46%));
    font-style: italic;
    opacity: 1;
  }

  input::placeholder,
  select::placeholder {
    color: var(--input-placeholder-color, hsl(208, 7%, 46%));
    font-style: italic;
    opacity: 1;
  }

  input:disabled,
  select:disabled,
  input[readonly],
  select[readonly] {
    background-color: hsl(210, 16%, 93%);
    opacity: 1;
  }

  input.is-invalid,
  select.is-invalid {
    border-color: hsl(354, 70%, 54%);
  }

  input.is-invalid:focus,
  select.is-invalid:focus {
    border-color: hsl(354, 70%, 54%);
    box-shadow: 0 0 0 3.2px rgba(220, 53, 69, 0.25);
  }

  .chkb {
    align-items: center;
    display: inline-flex;
    justify-content: center;
    position: relative;
  }

  .chkb__input {
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

  .chkb__label {
    align-items: center;
    background-color: var(--input-bg, hsl(0, 0%, 100%));
    border: 1px solid var(--input-border-color, hsl(210, 14%, 83%));
    border-radius: 3.2px;
    cursor: pointer;
    display: flex;
    height: 24px;
    justify-content: center;
    margin-bottom: 0;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    user-select: none;
    width: 24px;
  }

  .chkb__label:before {
    content: '';
  }

  .chkb__label > svg {
    pointer-events: none;
    width: 16px;
  }

  .chkb__label > svg > path {
    fill: var(--input-bg, hsl(0, 0%, 100%));
    transition: fill 0.15s ease-in-out;
  }

  .chkb__input:focus + .chkb__label {
    border-color: var(--input-focus-border-color, hsl(215, 98%, 77%));
    box-shadow: 0 0 0 3.2px
      var(--input-focus-box-shadow, rgba(13, 110, 253, 0.25));
    outline: 0;
  }

  .chkb__input:checked + .chkb__label > svg > path {
    fill: var(--input-color, hsl(210, 9%, 31%));
  }

  .chkb__input.is-invalid + .chkb__label {
    border-color: hsl(354, 70%, 54%);
  }

  .chkb__input.is-invalid:focus + .chkb__label {
    border-color: hsl(354, 70%, 54%);
    box-shadow: 0 0 0 3.2px rgba(220, 53, 69, 0.25);
  }
`;
