import {Signal, effect} from '@webreflection/signal';
export * from '@webreflection/signal';

import $ from '../index.js';
export const createRender = (options = {}) =>
  $({...options, Signal, effect, isSignal: void 0});
