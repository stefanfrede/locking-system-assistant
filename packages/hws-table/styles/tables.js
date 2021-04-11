import { css } from 'lit-element';

export const tables = css`
  /**
   * Basic table
   */

  table {
    background-color: var(--table-bg, initial);
    color: var(--table-color, hsl(210, 11%, 15%));
    margin-bottom: 16px;
    vertical-align: top;
    width: 100%;
  }

  th {
    text-align: center;
  }

  th,
  td {
    border-bottom: 1px solid var(--table-border-color, hsl(210, 14%, 89%));
    padding: var(--table-cell-padding, 4px);
  }

  thead th {
    border-bottom-color: var(--table-head-border-color, hsl(210, 9%, 31%));
    vertical-align: bottom;
  }

  tbody {
    border-bottom: 1px solid var(--table-border-color, hsl(210, 14%, 89%));
    vertical-align: inherit;
  }

  tbody tr td {
    text-align: center;
  }

  tbody tr.details td {
    text-align: left;
  }

  tbody tr th {
    vertical-align: middle;
  }

  tbody tr td,
  tbody tr th {
    border-bottom: none;
    padding-bottom: 3px;
  }

  tfoot tr td {
    border-bottom: none;
  }

  /**
   * Hover effect
   */

  tbody:hover tr {
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
