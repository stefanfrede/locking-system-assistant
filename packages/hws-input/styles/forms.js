import { css } from 'lit-element';

export const forms = [
  css`
    input {
      background-clip: padding-box;
      background-color: var(--input-bg, hsl(0, 0%, 100%));
      border: 1px solid var(--input-border-color, hsl(210, 14%, 83%));
      border-radius: 0.2rem;
      color: var(--input-color, hsl(210, 9%, 31%));
      display: block;
      font-size: 1rem;
      font-weight: 400;
      height: 2rem;
      line-height: 1.5;
      padding: 0.1875rem 0.5rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      width: var(--hws-input-width, 100%);
    }

    @media (prefers-reduced-motion: reduce) {
      input {
        transition: none;
      }
    }

    input::-ms-expand {
      background-color: transparent;
      border: 0;
    }

    input:focus {
      background-color: var(--input-focus-bg, hsl(0, 0%, 100%));
      border-color: var(--input-focus-border-color, hsl(215, 98%, 77%));
      box-shadow: 0 0 0 0.2rem
        var(--input-focus-box-shadow, rgba(13, 110, 253, 0.25));
      color: var(--input-focus-color, hsl(210, 9%, 31%));
      outline: 0;
    }

    input::-webkit-input-placeholder {
      color: var(--input-placeholder-color, hsl(208, 7%, 46%));
      font-style: italic;
      opacity: 1;
    }

    input::-moz-placeholder {
      color: var(--input-placeholder-color, hsl(208, 7%, 46%));
      font-style: italic;
      opacity: 1;
    }

    input:-ms-input-placeholder {
      color: var(--input-placeholder-color, hsl(208, 7%, 46%));
      font-style: italic;
      opacity: 1;
    }

    input::-ms-input-placeholder {
      color: var(--input-placeholder-color, hsl(208, 7%, 46%));
      font-style: italic;
      opacity: 1;
    }

    input::placeholder {
      color: var(--input-placeholder-color, hsl(208, 7%, 46%));
      font-style: italic;
      opacity: 1;
    }

    input:disabled,
    input[readonly] {
      background-color: hsl(210, 16%, 93%);
      opacity: 1;
    }

    input.is-invalid {
      border-color: hsl(354, 70%, 54%);
    }

    input.is-invalid:focus {
      border-color: hsl(354, 70%, 54%);
      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
  `,
];
