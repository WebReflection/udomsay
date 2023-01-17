var _templateReference = {},
  _templateReference2 = {};
globalThis.ESXToken || (globalThis.ESXToken = class ESXToken { static ATTRIBUTE = 1; static COMPONENT = 2; static ELEMENT = 3; static FRAGMENT = 4; static INTERPOLATION = 5; static STATIC = 6; static _ = Object.freeze([]); static a = (dynamic, name, value) => ({ type: 1, dynamic, name, value }); static b = (type, value) => ({ type, value }); constructor(id, type, attributes, children, name, value) { this.id = id; this.type = type; this.attributes = attributes; this.children = children; this.name = name; this.value = value; } get properties() { const { attributes } = this; if (attributes.length) { const properties = {}; for (const entry of attributes) { if (entry.type < 2) properties[entry.name] = entry.value;else Object.assign(properties, entry.value); } return properties; } return null; } });
import { createRender, createSignal } from '../../solid.js';
const render = createRender();
render(new ESXToken(_templateReference, 2, [ESXToken.a(true, "clicks", createSignal(0))], ESXToken._, "Counter", Counter), document.body);
function Counter({
  clicks
}) {
  const [signal, update] = clicks;
  const value = signal();
  return new ESXToken(_templateReference2, 3, ESXToken._, [new ESXToken(null, 3, [ESXToken.a(true, "onclick", () => {
    update(value - 1);
  })], [ESXToken.b(6, "-")], "button", "button"), new ESXToken(null, 3, ESXToken._, [ESXToken.b(5, value)], "span", "span"), new ESXToken(null, 3, [ESXToken.a(true, "onclick", () => {
    update(value + 1);
  })], [ESXToken.b(6, "+")], "button", "button")], "div", "div");
}
