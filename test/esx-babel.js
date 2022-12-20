var _templateReference = {},
  _templateReference2 = {},
  _templateReference3 = {},
  _templateReference4 = {},
  _templateReference5 = {},
  _templateReference6 = {},
  _templateReference7 = {};
globalThis.ESXToken || (globalThis.ESXToken = class ESXToken { static ATTRIBUTE = 1; static COMPONENT = 2; static ELEMENT = 3; static FRAGMENT = 4; static INTERPOLATION = 5; static STATIC = 6; static _ = Object.freeze([]); static a = (dynamic, name, value) => ({ type: 1, dynamic, name, value }); static b = (type, value) => ({ type, value }); constructor(id, type, attributes, children, name, value) { this.id = id; this.type = type; this.attributes = attributes; this.children = children; this.name = name; this.value = value; } get properties() { const { attributes } = this; if (attributes.length) { const properties = {}; for (const entry of attributes) { if (entry.type < 2) properties[entry.name] = entry.value;else Object.assign(properties, entry.value); } return properties; } return null; } });
import { render, signal } from '../index.js';
const s = signal('test');
const c = signal(new ESXToken(_templateReference, 3, ESXToken._, [ESXToken.b(6, "deep")], "strong", "strong"));
function P({
  test
}) {
  return new ESXToken(_templateReference2, 3, ESXToken._, [ESXToken.b(6, "\n      Another "), ESXToken.b(5, c), ESXToken.b(6, " / "), ESXToken.b(5, test)], "p", "p");
}
[1, 2, 3].map(num => new ESXToken(_templateReference3, 3, ESXToken._, [ESXToken.b(5, num)], "span", "span"));
document.body.innerHTML = '<div></div><div></div>';
const {
  firstElementChild,
  lastElementChild
} = document.body;
const main = test => new ESXToken(_templateReference4, 3, [ESXToken.a(true, "data-test", test)], [ESXToken.b(6, "\n    Hello World "), ESXToken.b(5, test), ESXToken.b(6, " "), ESXToken.b(5, s), ESXToken.b(5, [1, 2, 3].map(num => new ESXToken(_templateReference5, 2, [ESXToken.a(true, "num", num)], ESXToken._, "Span", Span))), new ESXToken(null, 2, [ESXToken.a(true, "test", test)], ESXToken._, "P", P)], "div", "div");
render(main('test'), firstElementChild);
render(main('test'), lastElementChild);
setTimeout(() => {
  render(main('OK'), firstElementChild);
  setTimeout(() => {
    s.value = 'signal';
    setTimeout(() => {
      c.value = new ESXToken(_templateReference6, 3, ESXToken._, [ESXToken.b(6, "deep")], "i", "i");
    }, 1000);
  }, 1000);
}, 2000);
function Span({
  num
}) {
  return new ESXToken(_templateReference7, 3, ESXToken._, [ESXToken.b(5, num)], "span", "span");
}
