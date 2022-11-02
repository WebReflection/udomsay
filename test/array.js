var _token = {},
  _token2 = {},
  _token3 = {},
  _token4 = {};
/** @jsx C */ /** @jsxFrag F */ /** @jsxInterpolation I */

import { render, signal, createElement as C, Fragment as F, interpolation as I } from '../es.js';
function Counter({
  signal
}) {
  return C("div", {
    __token: _token
  }, C("button", {
    onclick: I(() => {
      signal.value--;
    })
  }, "-"), C("span", null, I(signal.value)), C("button", {
    onclick: I(() => {
      signal.value++;
    })
  }, "+"));
}
const Counters = ({
  many
}) => {
  console.log('Counters');
  const data = [];
  for (let i = 0; i < many; i++) data[i] = C(Counter, {
    __token: _token2,
    signal: I(signal(0))
  });
  return C("div", {
    __token: _token3
  }, I(data));
};
render(C(Counters, {
  __token: _token4,
  many: I(3)
}), document.body);
