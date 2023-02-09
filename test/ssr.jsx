import createRender from '../esm/ssr.js';
import {Signal, signal} from '@webreflection/signal';
const render = createRender({Signal});

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
        <title>not &scaped</title>
        <body>
          <ul test="attribute">
            {counters.map((_, i) => <li><Counter clicks={signal(i)} /></li>)}
          </ul>
        </body>
      </html>
    ),
    console.log.bind(console)
  );
  console.timeEnd('render');
}

for (let i = 0; i < 5; i++) test();
