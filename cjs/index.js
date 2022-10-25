'use strict';
/*! (c) Andrea Giammarchi - ISC */

(m => Object.keys(m).map(k => k !== 'default' && (exports[k] = m[k])))
(require('usignal'));
(m => Object.keys(m).map(k => k !== 'default' && (exports[k] = m[k])))
(require('./udomsay.js'));
(m => {
  exports.useProperty = m.useProperty;
})(require('./pure-utils.js'));
