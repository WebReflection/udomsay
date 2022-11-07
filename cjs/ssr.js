'use strict';
/*! (c) Andrea Giammarchi - ISC */

const {VOID_ELEMENTS} = require('domconstants');

const {
  COMPONENT,
  FRAGMENT,
  NODE,
  OBJECT
} = require('./constants.js');

const {Interpolation, Signal} = require('./classes.js');

const {escape} = require('./html-escaper.js');

const {entries, isArray} = require('./pure-utils.js');

(m => Object.keys(m).map(k => k !== 'default' && (exports[k] = m[k])))
(require('usignal'));
(m => Object.keys(m).map(k => k !== 'default' && (exports[k] = m[k])))
(require('./udomsay.js'));

// TODO: how can tokens help here?
//  * create once an html array related to each token
//  * crete details to map in future calls so that each hole (empty string)
//    can be populated with the new props value instead of parsing each time
//    over and over every prop per template (although repeated renders are very fast)
//  * store per token html array to "clone" and a list of ops to perform next time
//    same way template and details work now on the web
//  * each time a token is known, it can skip HTML parsing/creation and update only
//    indexes that could've been mutated by receiving new data or conditional holes
//  * profit?

const render = (what, where) => {
  const {type, args} = typeof what === COMPONENT ? what() : what;
  const notStreaming = typeof where === COMPONENT;
  const info = new Info(type, notStreaming ? [] : new Stream(where)).parse(args);
  if (notStreaming) {
    let html = info.html.join('');
    if (/^(<html>|<html\s[^>]+?>)/.test(html))
      html = '<!doctype html>' + html;
    where(html);
  }
};
exports.render = render;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Stream {
  constructor(where) {
    this.where = where;
  }
  push(chunk) {
    this.where.write(chunk);
  }
}

class Info {
  constructor(type, html) {
    this.fragment = type === FRAGMENT;
    this.type = type;
    this.html = html;
  }
  next(type) {
    return new Info(type, this.html);
  }
  parse(args) {
    createDetails.apply(this, args);
    return this;
  }
  pushChild(value) {
    if (value instanceof Interpolation)
        value = value.value;
    if (typeof value === OBJECT) {
      if (isArray(value)) {
        for (const entry of value)
          this.pushChild(entry);
      }
      else {
        const isSignal = value instanceof Signal;
        if (isSignal)
          value = value.peek();
        if (isSignal && (typeof value !== OBJECT))
          this.html.push(escape(value));
        else {
          const {type, args} = value;
          this.next(type).parse(args);
        }
      }
    }
    else
      this.html.push(escape(value));
  }
  pushProp(key, value) {
    switch (typeof value) {
      case 'function':
      case 'undefined':
        break;
      case 'object':
        if (!value)
          break;
        if (value instanceof Interpolation) {
          this.pushProp(key, value.value);
          break;
        }
        if (value instanceof Signal) {
          this.pushProp(key, value.peek());
          break;
        }
      case 'boolean':
        if (value === true)
          this.html.push(` ${key}`);
        break;
      default:
        this.html.push(` ${key === 'className' ? 'class' : key}="${escape(value)}"`);
        break;
    }
  }
}

function createDetails(entry, props, ...children) {
  const {type, html} = this;
  const {length} = arguments;
  switch (type) {
    case NODE:
      html.push(`<${entry}`);
      let textContent = '';
      if (props) {
        if (props instanceof Interpolation)
          props = props.value;
        for (let [key, value] of entries(props)) {
          switch (key) {
            case '__token':
            case 'key':
            case 'ref':
              break;
            case 'textContent':
              if (value instanceof Interpolation)
                value = value.value;
              if (value instanceof Signal)
                value = value.peek();
              textContent = value;
              break;
            default:
              this.pushProp(key, value);
              break;
          }
        }
      }
      if (length === 2 && textContent === '')
        html.push(VOID_ELEMENTS.test(entry) ? ' />' : `></${entry}>`);
      else {
        html.push('>');
        if (textContent === '')
          for (let i = 2; i < length; i++)
            this.pushChild(arguments[i]);
        else
          html.push(escape(textContent));
        html.push(`</${entry}>`);
      }
      break;
    case COMPONENT: {
      if (props) {
        if (props instanceof Interpolation)
          props = props.value;
        else {
          for (const [key, value] of entries(props)) {
            if (value instanceof Interpolation)
              props[key] = value.value;
          }
        }
      }
      const {type, args} = entry(props, ...children);
      this.next(type).parse(args);
      break;
    }
    case FRAGMENT:
      for (let i = 2; i < length; i++)
        this.pushChild(arguments[i]);
      break;
    default:
      throw new Error(entry);
  }
}
