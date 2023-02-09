'use strict';
const {createSignal: $, createEffect, untrack} = require('solid-js');
(m => Object.keys(m).map(k => k !== 'default' && (exports[k] = m[k])))
(require('solid-js'));

const _ = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('../index.js'));

const signals = new WeakSet;
const noop = () => {};

const createSignal = (value, ...rest) => {
  const [signal, update] = $(value, ...rest);
  signals.add(signal);
  return [signal, update];
};
exports.createSignal = createSignal;

const createRender = (options = {}) => _({
  ...options,
  effect: (...args) => (createEffect(...args), noop),
  getPeek: s => untrack(s),
  getValue: s => s(),
  isSignal: s => signals.has(s)
});
exports.createRender = createRender;
