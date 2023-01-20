import {hooked, useState} from 'https://unpkg.com/uhooks?module';

const transform = token => {
  switch (token.type) {
    case ESXToken.COMPONENT: {
      let result, id, node;
      hooked(() => {
        result = token.value();
        if (id !== result.id) {
          id = result.id;
          const replace = transform(result);
          if (!node)
            node = replace;
          else if (node !== replace) {
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
        node.onclick = attributes[0]?.value;
        node.textContent = children[0].value;
      };
      return node;
    }
  }
};

document.body.appendChild(
  transform(<Counter />)
);

function Counter() {
  const [count, update] = useState(0);
  return count < 10 ?
    <button onClick={() => update(count + 1)}>{count}</button> :
    <div>You reached 10 🥳</div>
  ;
}
