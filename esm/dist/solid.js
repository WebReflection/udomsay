import {createSignal as $, createEffect, untrack} from 'solid-js';
export * from 'solid-js';

import _ from '../index.js';

const signals = new WeakSet;
const noop = () => {};

export const createSignal = (value, ...rest) => {
  const [signal, update] = $(value, ...rest);
  signals.add(signal);
  return [signal, update];
};

export const createRender = (options = {}) => _({
  ...options,
  effect: (...args) => (createEffect(...args), noop),
  getPeek: s => untrack(s),
  getValue: s => s(),
  isSignal: s => signals.has(s)
});
