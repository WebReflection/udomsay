var _token = {},
  _token2 = {},
  _token3 = {},
  _token4 = {},
  _token5 = {},
  _token6 = {};
/** @jsx C */
/** @jsxFrag F */
/** @jsxInterpolation I */

// import './esm/document.js';
import { signal, createElement as C, Fragment as F, interpolation as I, render } from '../index.js';
const A = signal('A');
const B = signal('B');
const props = {
  ok: 1
};
const div = () => C("div", {
  __token: _token,
  test: I(A),
  static: "value"
}, I(Math.random() < .5 ? [C("p", {
  __token: _token2
}, "first"), C("p", {
  __token: _token3
}, "second")] : [C("p", {
  __token: _token4
}, "third"), C("p", {
  __token: _token5
}, "fourth")]));
function Component({
  test
}) {
  return C(F, {
    __token: _token6
  }, C("p", {
    test: I(test)
  }, "OK ", I(test)));
}
render(div, document.body);
setInterval(render, 1000, div, document.body);
