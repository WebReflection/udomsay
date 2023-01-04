import createRender from '../index.js';
import {Signal, signal, effect} from 'https://unpkg.com/@webreflection/signal';
const render = createRender({Signal, effect});

function Counter({signal}) {
  console.log('Counter');
  return (
    <div>
      <button onclick={() => { signal.value--; }}>-</button>
      <span>{ signal.value }</span>
      <button onclick={() => { signal.value++; }}>+</button>
    </div>
  );
}

const Counters = ({many}) => {
  console.log('Counters');
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
