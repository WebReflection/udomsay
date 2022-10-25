/** @jsx C *//** @jsxFrag F *//** @jsxInterpolation I */

import {
  render,
  signal,
  createElement as C,
  Fragment as F,
  interpolation as I
} from '../es.js';

const clicks = signal(0);

function Counter() {
  return (
    <div>
      <button onclick={() => { clicks.value--; }}>-</button>
      <span>{clicks.value}</span>
      <button onclick={() => { clicks.value++; }}>+</button>
    </div>
  );
}

render(<Counter />, document.body);
