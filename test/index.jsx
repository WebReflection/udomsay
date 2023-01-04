// import './esm/document.js';
import createRender from '../index.js';
import {Signal, signal, effect} from 'https://unpkg.com/@webreflection/signal';

const A = signal('A');
const B = signal('B');
const C = signal('C');

const div = (A, B) => (
  <div test={A} static="value">
    {B}
  </div>
);

function Component({test}) {
  return <><p test={test}>OK {test}</p></>;
}

const render = createRender({document, Signal, effect});
render(div(A, B), document.body.appendChild(document.createElement('div')));
render(div(A, C), document.body.appendChild(document.createElement('div')));

setTimeout(() => A.value = 'B', 2000);
setTimeout(() => B.value = 'C', 2000);
setTimeout(() => B.value = 'D', 4000);

// setInterval(render, 1000, div, document.body);
