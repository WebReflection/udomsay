var _templateReference = {},
  _templateReference2 = {},
  _templateReference3 = {},
  _templateReference4 = {},
  _templateReference5 = {};
globalThis.ESXToken || (globalThis.ESXToken = class ESXToken { static ATTRIBUTE = 1; static COMPONENT = 2; static ELEMENT = 3; static FRAGMENT = 4; static INTERPOLATION = 5; static STATIC = 6; static _ = Object.freeze([]); static a = (dynamic, name, value) => ({ type: 1, dynamic, name, value }); static b = (type, value) => ({ type, value }); constructor(id, type, attributes, children, name, value) { this.id = id; this.type = type; this.attributes = attributes; this.children = children; this.name = name; this.value = value; } get properties() { const { attributes } = this; if (attributes.length) { const properties = {}; for (const entry of attributes) { if (entry.type < 2) properties[entry.name] = entry.value;else Object.assign(properties, entry.value); } return properties; } return null; } });
import { hooked, useState } from 'https://unpkg.com/uhooks?module';
const transform = token => {
  switch (token.type) {
    case ESXToken.COMPONENT:
      {
        let id, node;
        hooked(() => {
          console.time('update');
          const result = token.value();
          if (id !== result.id) {
            id = result.id;
            const replace = transform(result);
            if (!node) node = replace;else {
              node.replaceWith(replace);
              node = replace;
            }
          }
          node.update(result);
          console.timeEnd('update');
        })();
        return node;
      }
    case ESXToken.ELEMENT:
      {
        const node = document.createElement(token.name);
        node.update = ({
          attributes,
          children
        }) => {
          node.textContent = children[0].value;
          if (attributes.length) node.onclick = attributes[0].value;
        };
        return node;
      }
  }
};
const same = () => transform(new ESXToken(_templateReference, 2, ESXToken._, ESXToken._, "Counter", Counter));
console.time('render');
document.body.append(transform(new ESXToken(_templateReference2, 2, ESXToken._, ESXToken._, "Counter", Counter)), same(), same(), same(), transform(new ESXToken(_templateReference3, 2, ESXToken._, ESXToken._, "Counter", Counter)));
console.timeEnd('render');
if (location.search === '?auto') {
  requestAnimationFrame(function click() {
    const button = document.querySelector('button');
    if (button) {
      button.click();
      requestAnimationFrame(click);
    }
  });
}
function Counter() {
  const [count, update] = useState(0);
  return count < 10 ? new ESXToken(_templateReference4, 3, [ESXToken.a(true, "onClick", () => update(count + 1))], [ESXToken.b(5, count)], "button", "button") : new ESXToken(_templateReference5, 3, ESXToken._, [ESXToken.b(6, "You reached 10 \uD83E\uDD73")], "div", "div");
}
