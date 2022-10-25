var _token = {},
  _token2 = {};
/** @jsx C */ /** @jsxFrag F */ /** @jsxInterpolation I */

import { render, signal, createElement as C, Fragment as F, interpolation as I } from 'udomsay';
const clicks = signal(0);
function Counter() {
  return C("div", {
    __token: _token
  }, C("button", {
    onclick: I(() => {
      clicks.value--;
    })
  }, "-"), C("span", null, I(clicks.value)), C("button", {
    onclick: I(() => {
      clicks.value++;
    })
  }, "+"));
}
render(C(Counter, {
  __token: _token2
}), document.body);
