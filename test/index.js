var _templateReference = {},
  _templateReference2 = {},
  _templateReference3 = {},
  _templateReference4 = {},
  _templateReference5 = {};
globalThis.ESXToken || (globalThis.ESXToken = class ESXToken { static ATTRIBUTE = 1; static COMPONENT = 2; static ELEMENT = 3; static FRAGMENT = 4; static INTERPOLATION = 5; static STATIC = 6; static _ = Object.freeze([]); static a = (dynamic, name, value) => ({ type: 1, dynamic, name, value }); static b = (type, value) => ({ type, value }); constructor(id, type, attributes, children, name, value) { this.id = id; this.type = type; this.attributes = attributes; this.children = children; this.name = name; this.value = value; } get properties() { const { attributes } = this; if (attributes.length) { const properties = {}; for (const entry of attributes) { if (entry.type < 2) properties[entry.name] = entry.value;else Object.assign(properties, entry.value); } return properties; } return null; } });
// import './esm/document.js';
import createRender from '../index.js';
import { Signal, signal, effect } from 'https://unpkg.com/@webreflection/signal';
const A = signal('A');
const B = signal('B');
const C = signal('C');
const p = signal(new ESXToken(_templateReference, 3, [ESXToken.a(false, "is", "built-in-p")], [ESXToken.b(6, "first")], "p", "p"));
customElements.define('built-in-p', class BuiltInP extends HTMLParagraphElement {
  connectedCallback() {
    console.log('connected', this);
  }
}, {
  extends: 'p'
});
const div = (A, B) => new ESXToken(_templateReference2, 3, [ESXToken.a(true, "test", A), ESXToken.a(false, "static", "value")], [ESXToken.b(5, B), new ESXToken(null, 2, [ESXToken.a(true, "test", A)], ESXToken._, "Component", Component)], "div", "div");
function Component({
  test
}) {
  return new ESXToken(_templateReference3, 3, ESXToken._, [new ESXToken(null, 3, [ESXToken.a(true, "test", test)], [ESXToken.b(6, "OK "), ESXToken.b(5, test)], "p", "p"), ESXToken.b(5, p)], "div", "div");
}
function CompA({
  name
}) {
  return new ESXToken(_templateReference4, 3, ESXToken._, [ESXToken.b(6, "Comp "), ESXToken.b(5, name)], "strong", "strong");
}
function CompB({
  name
}) {
  return new ESXToken(_templateReference5, 3, ESXToken._, [ESXToken.b(6, "Comp "), ESXToken.b(5, name)], "em", "em");
}
const render = createRender({
  Signal,
  effect
});

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
