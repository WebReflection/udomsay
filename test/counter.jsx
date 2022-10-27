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

const comp = <Counter clicks={signal(0)} />;
const {body} = document;

render(comp, body);

setTimeout(render, 2000, comp, body);
