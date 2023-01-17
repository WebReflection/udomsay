'use strict';
const {Signal, effect} = require('usignal');
(m => Object.keys(m).map(k => k !== 'default' && (exports[k] = m[k])))
(require('usignal'));

const $ = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('../index.js'));
const createRender = (options = {}) =>
  $({...options, Signal, effect, isSignal: void 0});
exports.createRender = createRender;
