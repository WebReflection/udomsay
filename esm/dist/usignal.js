import {Signal, effect} from 'usignal';
export * from 'usignal';

import $ from '../index.js';
export const createRender = (options = {}) =>
  $({...options, Signal, effect, isSignal: void 0});
