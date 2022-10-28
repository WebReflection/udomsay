'use strict';
/*! (c) Andrea Giammarchi - ISC */

// @see https://github.com/WebReflection/html-escaper#readme
const es = /[&<>'"]/g;
const cape = pe => esca[pe];
const esca = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
};

const escape = value => value.replace(es, cape);
exports.escape = escape;
