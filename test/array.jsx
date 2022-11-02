/** @jsx C *//** @jsxFrag F *//** @jsxInterpolation I */

import {
  render,
  signal,
  createElement as C,
  Fragment as F,
  interpolation as I
} from '../es.js';

function Counter({signal}) {
  return (
    <div>
      <button onclick={() => { signal.value--; }}>-</button>
      <span>{ signal.value }</span>
      <button onclick={() => { signal.value++; }}>+</button>
    </div>
  );
}

const Counters = ({many}) => {
  const data = [];
  for (let i = 0; i < many; i++)
    data[i] = <Counter signal={signal(0)} />;
  return (
    <div>
      {data}
    </div>
  );
};

render(<Counters many={3} />, document.body);
