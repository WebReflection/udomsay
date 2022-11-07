var _token = {},
  _token2 = {},
  _token3 = {};
/** @jsx C */ /** @jsxFrag F */ /** @jsxInterpolation I */

import { render, signal, createElement as C, Fragment as F, interpolation as I } from '../esm/ssr.js';
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
const counters = new Array(2).fill();
function test() {
  console.time('render');
  render(C("html", {
    __token: _token2,
    lang: "en"
  }, C("body", null, I(counters.map((_, i) => C("li", {
    __token: _token3
  }, C(Counter, {
    clicks: I(signal(i))
  })))))), console.log.bind(console));
  console.timeEnd('render');
}
for (let i = 0; i < 5; i++) test();
