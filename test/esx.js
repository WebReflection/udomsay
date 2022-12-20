import {ESX, Token} from '../node_modules/@ungap/esx/esm/index.js';

import {render, signal} from '../index.js';

const esx = ESX({P});
const s = signal('test');
const c = signal(esx`<strong>deep</strong>`);

function P({test}) {
  return esx`
    <p>
      Another ${c} / ${test}
    </p>
  `;
}

document.body.innerHTML = '<div></div><div></div>';
const {firstElementChild, lastElementChild} = document.body;

const main = (test) => esx`
  <div data-test=${test}>
    Hello World ${test} ${s}
    ${[1, 2, 3].map(num => esx`<span>${num}</span>`)}
    <P test=${test} />
  </div>
`;

render(
  main('test'),
  firstElementChild
);

render(
  main('test'),
  lastElementChild
);

setTimeout(
  () => {
    render(
      main('OK'),
      firstElementChild
    );
    setTimeout(() => {
      s.value = 'signal';
      setTimeout(() => {
        c.value = esx`<i>deep</i>`;
      }, 1000);
    }, 1000);
  },
  2000
);

