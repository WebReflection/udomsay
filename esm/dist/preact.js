import {Signal, effect} from '@preact/signals-core';
export * from '@preact/signals-core';

import $ from '../index.js';
export const createRender = (options = {}) =>
  $({...options, Signal, effect, isSignal: void 0});
