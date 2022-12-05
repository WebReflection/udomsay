import {render, signal} from '../index.js';

const s = signal('test');
const c = signal(<strong>deep</strong>);

function P({test}) {
  return (
    <p>
      Another {c} / {test}
    </p>
  );
}

[1, 2, 3].map(num => <span>{num}</span>);

document.body.innerHTML = '<div></div><div></div>';
const {firstElementChild, lastElementChild} = document.body;

const main = (test) => (
  <div data-test={test}>
    Hello World {test} {s}
    {[1, 2, 3].map(num => <Span num={num} />)}
    <P test={test} />
  </div>
);

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
        c.value = <i>deep</i>;
      }, 1000);
    }, 1000);
  },
  2000
);

function Span({num}) {
  return <span>{num}</span>;
}