/** @jsx C *//** @jsxFrag F *//** @jsxInterpolation I */

import {
  render,
  signal,
  createElement as C,
  Fragment as F,
  interpolation as I
} from '../esm/ssr.js';

function Counter({clicks}) {
  return (
    <div>
      <button onclick={() => { clicks.value--; }}>-</button>
      <span>{clicks}</span>
      <button onclick={() => { clicks.value++; }}>+</button>
    </div>
  );
}

const counters = new Array(2).fill();

function test() {
  console.time('render');
  render(
    (
      <html lang="en">
        <body>
          {counters.map((_, i) => <li><Counter clicks={signal(i)} /></li>)}
        </body>
      </html>
    ),
    console.log.bind(console)
  );
  console.timeEnd('render');
}

for (let i = 0; i < 5; i++) test();
