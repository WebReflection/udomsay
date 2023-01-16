/*! (c) Andrea Giammarchi - ISC */

import {VOID_ELEMENTS} from 'domconstants';
import {escape} from './html-escaper.js';

import EMPTY from '@webreflection/empty/array';
import noop from '@webreflection/empty/function';

import createRender from './index.js';

const cloneNode = (current, newNode) => {
  for (const node of current) {
    switch (node.nodeType) {
      case 1:
        const element = new Element(node.name);
        for (const {name, value} of node.attributes)
          element.attributes.push({name, value});
        cloneNode(node, element);
        newNode.appendChild(element);
        break;
      case 3:
        newNode.appendChild(new Text(node.data));
        break;
      case 11:
        for (const inner of node)
          cloneNode(inner, newNode);
        break;
    }
  }
  return newNode;
};

class Text {
  constructor(data) {
    this.nodeType = 3;
    this.parentNode = null;
    this.data = data;
  }
  remove() {
    Element.prototype.remove.call(this);
  }
  toString() {
    return escape(this.data);
  }
}

class Node extends Array {
  get childNodes() {
    return this;
  }
  appendChild(node) {
    switch (node.nodeType) {
      case 1:
      case 3:
        node.parentNode = this;
        this.push(node);
        break;
      case 11:
        for (const inner of node)
          this.appendChild(inner);
        break;
    }
    return node;
  }
  replaceChild(newChild, oldChild) {
    this[this.indexOf(oldChild)] = newChild;
    newChild.parentNode = this;
    return oldChild;
  }
}

class Fragment extends Node {
  constructor() {
    super();
    this.nodeType = 11;
    this.parentNode = null;
  }
  cloneNode() {
    return cloneNode(this, new Fragment);
  }
  toString() {
    return this.join('');
  }
}

class Element extends Node {
  constructor(name) {
    super();
    this.nodeType = 1;
    this.name = name;
    this.attributes = EMPTY;
  }
  set className(value) {
    this.setAttribute('class', value);
  }
  set textContent(value) {
    for (const node of this.splice(0))
      node.parentNode = null;
    this.appendChild(new Text(value));
  }
  cloneNode() {
    return cloneNode(this, new Element(this.name));
  }
  remove() {
    const {parentNode} = this;
    if (parentNode) {
      this.parentNode = null;
      parentNode.splice(parentNode.indexOf(this), 1);
    }
  }
  removeAttribute() {}
  setAttribute(name, value) {
    if (this.attributes === EMPTY)
      this.attributes = [];
    this.attributes.push({name, value});
  }
  toString() {
    const {length, name, attributes} = this;
    const html = ['<', name];
    for (const {name, value} of attributes) {
      if (typeof value === 'boolean') {
        if (value)
          html.push(` ${name}`);
      }
      else if (value != null)
        html.push(` ${name}="${escape(value)}"`);
    }
    if (!length && VOID_ELEMENTS.test(name))
      html.push(' />');
    else
      html.push('>', ...this, `</${name}>`);
    return html.join('');
  }
}

class Range {
  constructor() {
    this.before = null;
    this.after = null;
  }
  setStartBefore(node) {
    this.before = node;
  }
  setEndAfter(node) {
    this.after = node;
  }
  deleteContents() {
    const {parentNode} = this.before;
    const i = parentNode.indexOf(this.before);
    for (const node of parentNode.splice(i,  parentNode.indexOf(this.after) - i + 1))
      node.parentNode = null;
  }
}

const document = {
  createTextNode: data => new Text(data),
  createDocumentFragment: () => new Fragment,
  createElementNS: name => new Element(name),
  createElement: (name, options) => {
    const element = new Element(name);
    if (options && options.is)
      element.setAttribute('is', options.is);
    return element;
  },
  createRange: () => new Range
};

const diff = (_, nodes, before) => {
  const {parentNode} = before;
  const i = parentNode.indexOf(before);
  for (const node of nodes)
    node.parentNode = parentNode;
  parentNode.splice(i, 0, ...nodes);
};

/**
 * @typedef {Object} RenderOptions utilities to use while rendering.
 * @prop {Document} [document] the default document to use. By default it's the global one.
 * @prop {[string, (node:Element, current:any, previous:any) => void][]} [plugins] a list of plugins to deal with,
 *  used with attributes, example: `["stuff", (node, curr, prev) => { ... }]`
 * @prop {(fn:function) => function} [effect] an utility to create effects on components.
 *  It must return a dispose utility to drop previous effect.
 * @prop {(s:any) => any} [getPeek] an utility to retrieve a Signal value without side-effects.
 * @prop {(s:any) => any} [getValue] an utility to retrieve a Signal value.
 * @prop {(s:any) => boolean} [isSignal] an utility to know if a value is a Signal.
 * @prop {function} [Signal] an optional signal constructor used to trap-check.
 *  `isSignal(ref)` utility whenever the `isSignal` field has not been provided.
 */

/**
 * Return a `render(what, where)` utility able to deal with provided options.
 * @param {RenderOptions} options
 */
export default (options = {}) => {
  const getPeek = options.getPeek || (s => s.peek());
  const render = createRender({
    document, diff, getPeek,
    plugins: options.plugins || EMPTY,
    effect: (fn => (fn(), noop)),
    getValue: getPeek,
    isSignal: options.isSignal,
    Signal: options.Signal
  });
  return (what, where) => {
    render(what, {
      replaceChildren(...nodes) {
        if (typeof where === 'function') {
          let html = nodes.join('');
          if (/^(<html>|<html\s[^>]+?>)/.test(html))
            html = '<!doctype html>' + html;
          where(html);
        }
        else {
          for (const node of nodes)
            where.write(node.toString());
        }
      }
    });
  };
};
