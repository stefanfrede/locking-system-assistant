import { css } from 'lit-element';

export const reboot = css`
  :host {
    display: inline-block;
  }

  :host([hidden]) {
    display: none !important;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /**
   * Images
   *
   * 1. Workaround for the SVG overflow bug in IE 11 is still required.
   *    See https://github.com/twbs/bootstrap/issues/26878
   */

  svg {
    overflow: hidden; /* 1 */
    vertical-align: middle;
  }

  /**
   * Tables
   *
   * Prevent double borders
   */

  table {
    border-collapse: collapse;
  }

  caption {
    caption-side: bottom;
    color: var(--table-caption-color, hsl(208, 7%, 46%));
    padding-bottom: var(--table-cell-padding, 8px);
    padding-top: var(--table-cell-padding, 8px);
    text-align: left;
  }

  /**
   * Matches default <td> alignment by inheriting from the <body>, or the
   * closest parent with a set text-align.
   */

  th {
    text-align: inherit;
  }

  /**
   * Forms
   *
   * 1. Allow labels to use margin for spacing.
   */

  label {
    display: inline-block; /* 1 */
    margin-bottom: 8px;
  }

  /**
   * Remove the default border-radius that macOS Chrome adds.
   *
   * Details at https://github.com/twbs/bootstrap/issues/24093
   */

  button {
    border-radius: 0;
  }

  /**
   * Work around a Firefox/IE bug where the transparent button background
   * results in a loss of the default button focus styles.
   *
   * Credit: https://github.com/suitcss/base/
   */

  button:focus {
    outline: 1px dotted;
    outline: 5px auto -webkit-focus-ring-color;
  }

  /* 1. Remove the margin in Firefox and Safari */

  input,
  button,
  select,
  optgroup,
  textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    margin: 0; /* 1 */
  }

  /* Show the overflow in Edge */

  button,
  input {
    overflow: visible;
  }

  /* Remove the inheritance of text transform in Firefox */

  button,
  select {
    text-transform: none;
  }

  /**
   * Remove the inheritance of word-wrap in Safari.
   *
   * Details at https://github.com/twbs/bootstrap/issues/24990
   */

  select {
    word-wrap: normal;
  }

  /**
   * Remove the dropdown arrow in Chrome from inputs built with datalists.
   *
   * Source: https://stackoverflow.com/a/54997118
   */

  [list]::-webkit-calendar-picker-indicator {
    display: none;
  }

  /**
   * 1. Prevent a WebKit bug where (2) destroys native audio and video controls
   *    in Android 4.
   * 2. Correct the inability to style clickable types in iOS and Safari.
   * 3. Opinionated: add "hand" cursor to non-disabled button elements.
   */

  button,
  [type='button'], /* 1 */
  [type='reset'],
  [type='submit'] {
    -webkit-appearance: button; /* 2 */
  }

  button:not(:disabled),
  [type='button']:not(:disabled),
  [type='reset']:not(:disabled),
  [type='submit']:not(:disabled) {
    cursor: pointer; /* 3 */
  }

  /**
   * Remove inner border and padding from Firefox, but don't restore the outline
   * like Normalize.
   */

  ::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }

  /**
   * Remove the default appearance of temporal inputs to avoid a Mobile Safari
   * bug where setting a custom line-height prevents text from being vertically
   * centered within the input.
   * See https://bugs.webkit.org/show_bug.cgi?id=139848
   * and https://github.com/twbs/bootstrap/issues/11266
   */

  input[type='date'],
  input[type='time'],
  input[type='datetime-local'],
  input[type='month'] {
    -webkit-appearance: textfield;
  }

  /**
   * 1. Remove the default vertical scrollbar in IE.
   * 2. Textareas should really only resize vertically so they don't break their
   *    (horizontal) containers.
   */

  textarea {
    overflow: auto; /* 1 */
    resize: vertical; /* 2 */
  }

  /**
   * 1. Browsers set a default min-width: min-content; on fieldsets, unlike e.g.
   *    <div>s, which have min-width: 0; by default.
   *    So we reset that to ensure fieldsets behave more like a standard block
   *    element.
   *    See https://github.com/twbs/bootstrap/issues/12359 and
   *    https://html.spec.whatwg.org/multipage/#the-fieldset-and-legend-elements
   * 2. Reset the default outline behavior of fieldsets so they don't affect
   *    page layout.
   */

  fieldset {
    border: 0; /* 2 */
    margin: 0; /* 2 */
    min-width: 0; /* 1 */
    padding: 0; /* 2 */
  }

  /**
   * 1. By using float: left, the legend will behave like a block element
   * 2. Correct the color inheritance from fieldset elements in IE.
   * 3. Correct the text wrapping in Edge and IE.
   */

  legend {
    color: inherit; /* 2 */
    float: left; /* 1 */
    font-size: 24px;
    line-height: inherit;
    margin-bottom: 8px;
    padding: 0;
    white-space: normal; /* 3 */
    width: 100%;
  }
`;
