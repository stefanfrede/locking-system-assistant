import { css } from 'lit-element';

export const alert = css`
  :host {
    display: block;
  }

  .alert {
    border: var(--alert-border-width, 1px) solid transparent;
    border-radius: var(--alert-border-radius, 0.25rem);
    margin-bottom: var(--alert-margin-bottom-x, 1rem);
    padding: var(--alert-padding-y, 0.75rem) var(--alert-padding-x, 1.25rem);
    position: relative;
  }

  .alert-dismissible {
    padding-right: calc(
      var(--close-font-size, calc(1rem * 1.5)) + var(--alert-padding-x, 1.25rem) *
        2
    );
  }

  .alert-dismissible .close {
    appearance: none;
    background-color: transparent;
    border: 0;
    color: inherit;
    opacity: 0.5;
    padding: var(--alert-padding-y, 0.75rem) var(--alert-padding-x, 1.25rem);
    position: absolute;
    right: 0;
    top: 0;
  }

  .alert-dismissible .close:hover {
    opacity: 1;
  }

  .alert-dismissible .close svg {
    height: 1rem;
    width: 1rem;
  }

  .alert-danger {
    background-color: hsl(355, 70%, 91%);
    border-color: hsl(354, 70%, 87%);
    color: hsl(354, 61%, 28%);
  }

  .alert-info {
    background-color: hsl(189, 53%, 88%);
    border-color: hsl(188, 53%, 83%);
    color: hsl(189, 78%, 21%);
  }

  .alert-success {
    background-color: hsl(134, 41%, 88%);
    border-color: hsl(134, 41%, 83%);
    color: hsl(134, 61%, 21%);
  }

  .alert-warning {
    background-color: hsl(46, 100%, 90%);
    border-color: hsl(45, 100%, 86%);
    color: hsl(45, 94%, 27%);
  }
`;
