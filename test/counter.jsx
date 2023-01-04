// grab signals from various libaries, here the simplest I know
import {Signal, signal, effect} from 'https://unpkg.com/@webreflection/signal';

// import the `createRender` utility
import createRender from 'https://unpkg.com/udomsay';
const render = createRender({Signal, effect});

// Counter Cmponent example
function Counter({clicks}) {
  return (
    <div>
      <button onclick={() => { clicks.value--; }}>-</button>
      <span>{clicks}</span>
      <button onclick={() => { clicks.value++; }}>+</button>
    </div>
  );
}

render(
  <Counter clicks={signal(0)} />,
  document.body
);
