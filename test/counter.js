var _token = {},
  _token2 = {};
/** @jsx C */ /** @jsxFrag F */ /** @jsxInterpolation I */

import { render, signal, createElement as C, Fragment as F, interpolation as I } from '../index.js';
function Counter({
  clicks
}) {
  return C("div", {
    __token: _token
  }, C("button", {
    onclick: I(() => {
      clicks.value--;
    })
  }, "-"), C("span", null, I(clicks)), C("button", {
    onclick: I(() => {
      clicks.value++;
    })
  }, "+"));
}
const comp = C(Counter, {
  __token: _token2,
  clicks: I(signal(0))
});
const {
  body
} = document;
render(comp, body);
setTimeout(render, 2000, comp, body);
