// grab signals from various libaries, here the simplest I know
import {createRender, signal} from '../signal.js';

const render = createRender();

// Counter Cmponent example
function Outer(_, ...children) {
  return (
    <ul>{children}</ul>
  );
}

render(
  <Outer>
    <li>A</li>
    <li>{'B'}</li>
  </Outer>,
  document.body
);
