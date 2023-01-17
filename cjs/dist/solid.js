'use strict';
const {createSignal: $, createEffect} = require('solid-js');
(m => Object.keys(m).map(k => k !== 'default' && (exports[k] = m[k])))
(require('solid-js'));

const _ = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('../index.js'));

const {defineProperty} = Object;
const signals = new WeakSet;
const udomsay = Symbol();
const createSignal = (value, ...rest) => {
  const [signal, update] = $(value, ...rest);
  signals.add(signal);
  return [
    defineProperty(signal, udomsay, {get: () => value}),
    newValue => update(value = newValue)
  ];
};
exports.createSignal = createSignal;

const createRender = (options = {}) => _({
  ...options,
  effect: createEffect,
  getPeek: s => s[udomsay],
  getValue: s => s(),
  isSignal: s => signals.has(s)
});
exports.createRender = createRender;
