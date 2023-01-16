// import './esm/document.js';
import createRender from '../index.js';
import {Signal, signal, effect} from 'https://unpkg.com/@webreflection/signal';
const render = createRender({Signal, effect});

const A = signal('A');
const B = signal('B');
const C = signal('C');
const p = signal(<p is="built-in-p">first</p>);

customElements.define(
  'built-in-p',
  class BuiltInP extends HTMLParagraphElement {
    connectedCallback() {
      console.log('connected', this);
    }
  },
  {extends: 'p'}
);

const div = (A, B) => (
  <div test={A} static="value">
    {B}
    <Component test={A} />
  </div>
);

function Component({test}) {
  return (
    <div>
      <p test={test}>OK {test}</p>
      {p}
    </div>
  );
}

function CompA({name}) {
  return <strong>Comp {name}</strong>;
}

function CompB({name}) {
  return <em>Comp {name}</em>;
}

// render(
//   <svg width="400" height="110">
//     <rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
//   </svg>,
//   document.body
// );

// setInterval(() => { render(<>{Math.random() < .5 ? <CompA name={Math.random()}/> : <CompB name={Math.random()}/>}</>, document.body) }, 1000);

// render(<CompA name={'A'}/>, document.body);
// setTimeout(() => render(<CompA name={'A2'}/>, document.body), 2000);
// setTimeout(() => render(<CompB name={'B'}/>, document.body), 4000);
// setTimeout(() => render(<CompB name={'B2'}/>, document.body), 6000);

// render(div(A, B), document.body.appendChild(document.createElement('div')));
// render(div(A, C), document.body.appendChild(document.createElement('div')));
// setTimeout(() => A.value = 'B', 2000);
// setTimeout(() => B.value = 'C', 2000);
// setTimeout(() => B.value = 'D', 4000);
// setTimeout(() => p.value = <p is="built-in-p">last</p>, 7000);
// setTimeout(() => {
//   render(div(B, C), document.body.firstElementChild);
//   render(div(C, A), document.body.lastElementChild);
// }, 10000);
