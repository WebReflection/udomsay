/** @jsx C */
/** @jsxFrag F */
/** @jsxInterpolation I */

// import './esm/document.js';
import {signal, createElement as C, Fragment as F, interpolation as I, render} from '../index.js';

const A = signal('A');
const B = signal('B');
const props = {ok: 1};

const div = () => (
  <div test={A} static="value">
    {
      Math.random() < .5 ?
      [
        <p>first</p>,
        <p>second</p>
      ] :
      [
        <p>third</p>,
        <p>fourth</p>
      ]
    }
  </div>
);

function Component({test}) {
  return <><p test={test}>OK {test}</p></>;
}

render(div, document.body);

setInterval(render, 1000, div, document.body);
