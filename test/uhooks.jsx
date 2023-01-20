import {hooked, useState} from 'https://unpkg.com/uhooks?module';

const transform = token => {
  switch (token.type) {
    case ESXToken.COMPONENT: {
      let id, node;
      hooked(() => {
        const result = token.value();
        if (id !== result.id) {
          id = result.id;
          const replace = transform(result);
          if (!node)
            node = replace;
          else {
            node.replaceWith(replace);
            node = replace;
          }
        }
        node.update(result);
      })();
      return node;
    }
    case ESXToken.ELEMENT: {
      const node = document.createElement(token.name);
      node.update = ({attributes, children}) => {
        node.textContent = children[0].value;
        if (attributes.length)
          node.onclick = attributes[0].value;
      };
      return node;
    }
  }
};

const same = () => transform(<Counter />);

console.time('render');
document.body.append(
  transform(<Counter />),
  same(),
  same(),
  same(),
  transform(<Counter />)
);
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
  return count < 10 ?
    <button onClick={() => update(count + 1)}>{count}</button> :
    <div>You reached 10 🥳</div>
  ;
}
