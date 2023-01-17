'use strict';
const {Signal, effect} = require('@webreflection/signal');
(m => Object.keys(m).map(k => k !== 'default' && (exports[k] = m[k])))
(require('@webreflection/signal'));

const $ = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('../index.js'));
const createRender = (options = {}) =>
  $({...options, Signal, effect, isSignal: void 0});
exports.createRender = createRender;
