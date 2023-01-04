'use strict';
const EMPTY = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('@webreflection/empty/array'));
const noop = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('@webreflection/empty/function'));

const {Token} = require('@ungap/esx');
const {diff} = require('./diff.js');

const SVG = 'http://www.w3.org/2000/svg';

const {isArray} = Array;
const {assign, getPrototypeOf, prototype: {isPrototypeOf}} = Object;

const {
  ATTRIBUTE,
  COMPONENT,
  ELEMENT,
  FRAGMENT,
  INTERPOLATION,
  STATIC
} = Token;

// generic utils
const asChildNodes = ({childNodes}) => ({childNodes: [...childNodes]});
const getChild = ({childNodes}, i) => childNodes[i];
const getToken = ({children}, i) => children[i];
const reachChild = (c, {content}) => c.reduce(getChild, content);
const reachToken = (c, token) => c.reduce(getToken, token);

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
 * @prop {function} [Signal] an optional signal constructor used to trap-check
 *  `isSignal(ref)` utility whenever the `isSignal` field has not been provided.
 */

/**
 * Return a `render(what, where)` utility able to deal with provided options.
 * @param {RenderOptions} options
 */
module.exports = (options = {}) => {
  const document = options.document || globalThis.document;
  const plugins = new Map(options.plugins || []);
  const considerPlugins = !!plugins.size;
  const effect = options.effect || (fn => (fn(), noop));
  const getPeek = options.getPeek || (s => s.peek());
  const getValue = options.getValue || (s => s.value);
  const isSignal = options.isSignal || (
    options.Signal ?
      isPrototypeOf.bind(options.Signal.prototype) :
      () => false
  );

  const text = value => document.createTextNode(value);

  class View {
    constructor(token, shouldParse = true) {
      const [updates, content] = shouldParse ? parse(token) : [EMPTY, null];
      const isFragment = shouldParse && token.type === FRAGMENT;
      this.updates = updates;
      this.content = isFragment ? asChildNodes(content) : content;
      this.dispose = noop;
      this.id = token.id;
      this.isFragment = isFragment;
    }
    applyUpdates(token) {
      for (const update of this.updates)
        update.call(this, token);
    }
  }

  const defaultView = new View({id: null}, false);

  /** @type {WeakMap<Element,View>} */
  const views = new WeakMap;
  let isToken;

  /** @type {WeakMap<Token,[function[],Element]>} */
  const tokens = new WeakMap;
  const parse = token => {
    let info = tokens.get(token.id);
    if (!info) {
      const updates = [];
      const content = mapToken(token, updates, [], [], false);
      tokens.set(token.id, info = [updates, content]);
    }
    const [updates, content] = info;
    return [updates.slice(), content.cloneNode(true)];
  };

  const setAttribute = (node, key, value, set) => {
    if (set)
      node.setAttribute(key, value);
    else
      node[key] = value;
  };

  const asAttribute = (node, key, value, prev, set) => {
    if (isSignal(value)) {
      const dispose = '🙊' + key;
      prev[dispose]?.();
      prev[dispose] = effect(() => {
        setAttribute(node, key, getValue(value), set);
      });
    }
    else
      setAttribute(node, key, value, set);
  };

  const setProperty = (node, key, value, prev) => {
    if (considerPlugins && plugins.has(key))
      plugins.get(key)(node, value, prev);
    else if (prev[key] !== value) {
      prev[key] = value;
      switch (key) {
        case 'class':
          key += 'Name';
        case 'className':
        case 'textContent':
          asAttribute(node, key, value, prev, false);
          break;
        case 'ref':
          value.current = node;
          break;
        default:
          if (key.startsWith('on'))
            node[key.toLowerCase()] = value;
          else if (key in node)
            asAttribute(node, key, value, prev, false);
          else {
            if (value == null)
              node.removeAttribute(key);
            else
              asAttribute(node, key, value, prev, true);
          }
          break;
      }
    }
  };

  const handleAttributes = (a, c, i) => function (token) {
    const prev = {};
    const node = reachChild(c, this);
    (this.updates[i] = token => {
      const {attributes} = reachToken(c, token);
      for (const index of a) {
        const {name, value} = attributes[index];
        setProperty(node, name, value, prev);
      }
    })(token);
  };

  const handleComponent = (c, i) => function (token) {
    let diffed = EMPTY, view = defaultView;
    const node = reachChild(c, this);
    const {parentNode} = node;
    (this.updates[i] = token => {
      token = reachToken(c, token);
      const prev = view;
      const current = token.value(token.properties, ...token.children);
      if ((prev === defaultView) || (current.id !== prev.id)) {
        prev.dispose();
        const {isFragment, content} = (view = new View(current));
        view.dispose = effect(() => view.applyUpdates(token));
        diffed = diff(
          parentNode,
          diffed,
          isFragment ?
            content.childNodes :
            [content],
          node
        );
      }
      else
        view.applyUpdates(current);
    })(token);
  };

  const handleContent = (c, i) => function (token) {
    const node = reachChild(c, this);
    (this.updates[i] = token => {
      const {value} = reachToken(c, token);
      const data = value == null ? '' : String(value);
      if (data !== node.data)
        node.data = value;
    })(token);
  };

  const handleSignal = (c, i) => function (token) {
    let dispose = noop, signal;
    const node = reachChild(c, this);
    const {value} = reachToken(c, token);
    if (isToken(getPeek(value))) {

    }
    else {
      const update = value => {
        if (signal !== value) {
          dispose();
          signal = value;
          dispose = effect(() => {
            node.data = signal.value;
          });
        }
      };
      this.updates[i] = token => update(reachToken(c, token).value);
      update(value);
    }
  };

  const addChildren = ({children}, updates, content, c, svg) => {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      switch (child.type) {
        case STATIC:
          content.appendChild(text(child.value));
          break;
        default:
          content.appendChild(
            mapToken(children[i], updates, [], c.concat(i), svg)
          );
          break;
      }
    }
  };

  const mapToken = (token, updates, a, c, svg) => {
    let callback, content;
    const {length} = updates;
    type: switch (token.type) {
      case INTERPOLATION: {
        const {value} = token;
        switch (true) {
          // case isToken(value):
          //   callback = handleToken;
          //   break;
          // case isArray(value):
          //   callback = handleArray;
          //   break;
          case isSignal(value):
            callback = handleSignal;
            break;
          default: {
            content = text('');
            updates.push(handleContent(c, length));
            break type;
          }
        }
      }
      case COMPONENT: {
        content = text('');
        updates.push((callback || handleComponent)(c, length));
        break;
      }
      case ELEMENT: {
        const {attributes, name} = token;
        const args = [svg ? SVG : null, name];
        const attrs = [];
        for (let i = 0; i < attributes.length; i++) {
          const entry = attributes[i];
          if (entry.type === ATTRIBUTE && entry.name === 'is')
            args.push({extends: entry.value});
          else if (entry.type === INTERPOLATION || entry.dynamic)
            a.push(i);
          else
            attrs.push(entry);
        }
        if (a.length)
          updates.push(handleAttributes(a, c, length));
        content = document.createElementNS(...args);
        for (const {name, value} of attrs)
          setAttribute(content, name, value, true);
        addChildren(token, updates, content, c, svg || name === 'svg');
        break;
      }
      case FRAGMENT: {
        content = document.createDocumentFragment();
        addChildren(token, updates, content, c, svg);
        break;
      }
    }
    return content;
  };

  /**
   * Reveal some `token` content into a `DOM` element.
   * @param {() => Token | Token} what the token to render
   * @param {Element} where the DOM node to render such token
   */
  return (what, where) => {
    /** @type {Token} */
    const token = typeof what === 'function' ? what() : what;
    if (!isToken) isToken = isPrototypeOf.bind(getPrototypeOf(token));
    let view = views.get(where) || defaultView;
    if (view.id !== token.id) {
      view.dispose();
      views.set(where, view = new View(token));
      const {isFragment, content} = view;
      view.dispose = effect(() => view.applyUpdates(token));
      where.replaceChildren(...(isFragment ? content.childNodes : [content]));
    }
    else
      view.applyUpdates(token);
  };
};
