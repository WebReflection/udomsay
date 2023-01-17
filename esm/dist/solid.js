import {createSignal as $, createEffect} from 'solid-js';
export * from 'solid-js';

import _ from '../index.js';

const {defineProperty} = Object;
const signals = new WeakSet;
const udomsay = Symbol();
export const createSignal = (value, ...rest) => {
  const [signal, update] = $(value, ...rest);
  signals.add(signal);
  return [
    defineProperty(signal, udomsay, {get: () => value}),
    newValue => update(value = newValue)
  ];
};

export const createRender = (options = {}) => _({
  ...options,
  effect: createEffect,
  getPeek: s => s[udomsay],
  getValue: s => s(),
  isSignal: s => signals.has(s)
});
