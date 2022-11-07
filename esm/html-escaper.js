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

const {replace} = '';

export const escape = value => replace.call(value, es, cape);
