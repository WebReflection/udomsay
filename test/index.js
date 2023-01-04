var _templateReference = {},
  _templateReference2 = {};
globalThis.ESXToken || (globalThis.ESXToken = class ESXToken { static ATTRIBUTE = 1; static COMPONENT = 2; static ELEMENT = 3; static FRAGMENT = 4; static INTERPOLATION = 5; static STATIC = 6; static _ = Object.freeze([]); static a = (dynamic, name, value) => ({ type: 1, dynamic, name, value }); static b = (type, value) => ({ type, value }); constructor(id, type, attributes, children, name, value) { this.id = id; this.type = type; this.attributes = attributes; this.children = children; this.name = name; this.value = value; } get properties() { const { attributes } = this; if (attributes.length) { const properties = {}; for (const entry of attributes) { if (entry.type < 2) properties[entry.name] = entry.value;else Object.assign(properties, entry.value); } return properties; } return null; } });
// import './esm/document.js';
import createRender from '../index.js';
import { Signal, signal, effect } from 'https://unpkg.com/@webreflection/signal';
const A = signal('A');
const B = signal('B');
const C = signal('C');
const div = (A, B) => new ESXToken(_templateReference, 3, [ESXToken.a(true, "test", A), ESXToken.a(false, "static", "value")], [ESXToken.b(5, B)], "div", "div");
function Component({
  test
}) {
  return new ESXToken(_templateReference2, 4, ESXToken._, [new ESXToken(null, 3, [ESXToken.a(true, "test", test)], [ESXToken.b(6, "OK "), ESXToken.b(5, test)], "p", "p")]);
}
const render = createRender({
  document,
  Signal,
  effect
});
render(div(A, B), document.body.appendChild(document.createElement('div')));
render(div(A, C), document.body.appendChild(document.createElement('div')));
setTimeout(() => A.value = 'B', 2000);
setTimeout(() => B.value = 'C', 2000);
setTimeout(() => B.value = 'D', 4000);

// setInterval(render, 1000, div, document.body);
