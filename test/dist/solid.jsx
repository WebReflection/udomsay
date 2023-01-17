import {createRender, createSignal} from '../../solid.js';
const render = createRender();

render(
  <Counter clicks={createSignal(0)} />,
  document.body
);

function Counter({clicks}) {
  const [signal, update] = clicks;
  const value = signal();
  return (
    <div>
      <button onclick={() => { update(value - 1) }}>-</button>
      <span>{value}</span>
      <button onclick={() => { update(value + 1) }}>+</button>
    </div>
  );
}
