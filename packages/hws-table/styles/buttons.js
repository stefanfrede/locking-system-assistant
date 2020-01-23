import { css } from 'lit-element';

export const buttons = css`
  .btn {
    background-color: transparent;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    color: hsl(210, 11%, 15%);
    cursor: pointer;
    display: inline-block;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 0.4375rem 0.75rem;
    text-align: center;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    user-select: none;
    vertical-align: middle;
  }

  .btn:hover {
    color: hsl(210, 11%, 15%);
    text-decoration: none;
  }

  .btn:disabled {
    opacity: 0.65;
    pointer-events: none;
  }

  .btn-success {
    background-color: hsl(134, 61%, 41%);
    border-color: #hsl(134, 61%, 41%);
    color: hsl(0, 0%, 100%);
  }

  .btn-success:hover {
    background-color: hsl(133, 61%, 33%);
    border-color: hsl(134, 62%, 31%);
    color: hsl(0, 0%, 100%);
  }

  .btn-light {
    background-color: hsl(210, 17%, 98%);
    border-color: hsl(210, 17%, 98%);
  }

  .btn-light:hover {
    background-color: hsl(210, 16%, 90%);
    border-color: hsl(207, 17%, 88%);
  }

  .btn-outline-danger {
    border-color: hsl(354, 70%, 54%);
    color: hsl(354, 70%, 54%);
  }

  .btn-outline-danger:hover {
    background-color: hsl(354, 70%, 54%);
    border-color: hsl(354, 70%, 54%);
    color: hsl(0, 0%, 100%);
  }

  .btn-outline-danger:focus {
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5);
  }

  .btn-outline-dark {
    background-color: transparent;
    border-color: hsl(210, 10%, 23%);
    color: hsl(210, 10%, 23%);
  }

  .btn-outline-dark:hover {
    background-color: hsl(210, 10%, 23%);
    border-color: hsl(210, 10%, 23%);
    color: hsl(0, 0%, 100%);
  }

  .btn-outline-dark:focus {
    box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5);
  }

  .btn-outline-info {
    background-color: transparent;
    border-color: hsl(188, 78%, 41%);
    color: hsl(188, 78%, 41%);
  }

  .btn-outline-info:hover {
    background-color: hsl(188, 78%, 41%);
    border-color: hsl(188, 78%, 41%);
    color: hsl(0, 0%, 100%);
  }

  .btn-outline-info:focus {
    box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);
  }
`;
