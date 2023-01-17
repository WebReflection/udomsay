import {createRender, signal} from '../../signal.js';
const render = createRender();

render(
  <Counter clicks={signal(0)} />,
  document.body
);

function Counter({clicks}) {
  return (
    <div>
      <button onclick={() => { clicks.value--; }}>-</button>
      <span>{clicks}</span>
      <button onclick={() => { clicks.value++; }}>+</button>
    </div>
  );
}
