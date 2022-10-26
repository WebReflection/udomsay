/** @jsx C *//** @jsxFrag F *//** @jsxInterpolation I */

import {
  render,
  signal,
  createElement as C,
  Fragment as F,
  interpolation as I
} from '../es.js';

function Counter({clicks}) {
  return (
    <div>
      <button onclick={() => { clicks.value--; }}>-</button>
      <span>{clicks.value}</span>
      <button onclick={() => { clicks.value++; }}>+</button>
    </div>
  );
}

render(<Counter clicks={signal(0)} />, document.body);
