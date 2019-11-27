import { css } from 'lit-element';

export const tables = css`
  /**
   * Basic table
   */

  table {
    background-color: var(--table-bg, initial);
    color: var(--table-color, hsl(210, 11%, 15%));
    margin-bottom: 1rem;
    vertical-align: top;
    width: 100%;
  }

  th {
    text-align: center;
  }

  th,
  td {
    border-bottom: 1px solid var(--table-border-color, hsl(210, 14%, 89%));
    padding: var(--table-cell-padding, 0.25rem);
  }

  thead th {
    border-bottom-color: var(--table-head-border-color, hsl(210, 9%, 31%));
    vertical-align: bottom;
  }

  tbody {
    vertical-align: inherit;
  }

  tbody tr td {
    text-align: center;
  }

  tbody tr th {
    vertical-align: middle;
  }

  tfoot tr td {
    border-bottom: none;
  }

  /**
   * Hover effect
   */

  tbody tr:hover {
    background-color: var(--table-hover-bg, rgba(0, 0, 0, 0.075));
    color: var(--table-hover-color, hsl(210, 11%, 15%));
  }

  /**
   * Responsive tables
   *
   * Generate series of .table-responsive-* classes for configuring the screen
   * size of where your table will overflow.
   */

  .table-responsive {
    display: block;
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
    width: 100%;
  }
`;
