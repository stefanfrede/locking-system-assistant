import { css } from 'lit-element';

export const buttons = css`
  .btn {
    background-color: transparent;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    color: #212529;
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
    color: #212529;
    text-decoration: none;
  }

  .btn-success {
    background-color: #28a745;
    border-color: #28a745;
    color: #fff;
  }

  .btn-success:hover {
    background-color: #218838;
    border-color: #1e7e34;
    color: #fff;
  }
`;
