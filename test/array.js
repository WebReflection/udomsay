var _templateReference = {},
  _templateReference2 = {},
  _templateReference3 = {},
  _templateReference4 = {};
globalThis.ESXToken || (globalThis.ESXToken = class ESXToken { static ATTRIBUTE = 1; static COMPONENT = 2; static ELEMENT = 3; static FRAGMENT = 4; static INTERPOLATION = 5; static STATIC = 6; static _ = Object.freeze([]); static a = (dynamic, name, value) => ({ type: 1, dynamic, name, value }); static b = (type, value) => ({ type, value }); constructor(id, type, attributes, children, name, value) { this.id = id; this.type = type; this.attributes = attributes; this.children = children; this.name = name; this.value = value; } get properties() { const { attributes } = this; if (attributes.length) { const properties = {}; for (const entry of attributes) { if (entry.type < 2) properties[entry.name] = entry.value;else Object.assign(properties, entry.value); } return properties; } return null; } });
import createRender from '../index.js';
import { Signal, signal, effect } from 'https://unpkg.com/@webreflection/signal';
const render = createRender({
  Signal,
  effect
});
function Counter({
  signal
}) {
  console.log('Counter');
  return new ESXToken(_templateReference, 3, ESXToken._, [new ESXToken(null, 3, [ESXToken.a(true, "onclick", () => {
    signal.value--;
  })], [ESXToken.b(6, "-")], "button", "button"), new ESXToken(null, 3, ESXToken._, [ESXToken.b(5, signal.value)], "span", "span"), new ESXToken(null, 3, [ESXToken.a(true, "onclick", () => {
    signal.value++;
  })], [ESXToken.b(6, "+")], "button", "button")], "div", "div");
}
const Counters = ({
  many
}) => {
  console.log('Counters');
  const data = [];
  for (let i = 0; i < many; i++) data[i] = new ESXToken(_templateReference2, 2, [ESXToken.a(true, "signal", signal(0))], ESXToken._, "Counter", Counter);
  return new ESXToken(_templateReference3, 3, ESXToken._, [ESXToken.b(5, data)], "div", "div");
};
render(new ESXToken(_templateReference4, 2, [ESXToken.a(true, "many", 3)], ESXToken._, "Counters", Counters), document.body);
