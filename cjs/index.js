'use strict';
/*! (c) Andrea Giammarchi - ISC */

const EMPTY = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('@webreflection/empty/array'));
const noop = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('@webreflection/empty/function'));

const {Token} = require('@ungap/esx');
const {diff} = require('./diff.js');

const {isArray} = Array;
const {getPrototypeOf, prototype: {isPrototypeOf}} = Object;

const {
  COMPONENT,
  ELEMENT,
  FRAGMENT,
  INTERPOLATION,
  STATIC
} = Token;

const UDOMSAY = '🙊';

// generic utils
const asChildNodes = ({childNodes}) => ({childNodes: [...childNodes]});
const getChild = ({childNodes}, i) => childNodes[i];
const getToken = ({children}, i) => children[i];
const invoke = ({value, properties, children}) => value(properties, ...children);
const isKey = ({name}) => name === 'key';
const reachChild = (c, {content}) => c.reduce(getChild, content);
const reachToken = (c, token) => c.reduce(getToken, token);
const setData = (node, value) => {
  const data = value == null ? '' : String(value);
  if (data !== node.data)
    node.data = data;
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
 * @prop {function} [diff] an optional function to diff nodes, not available in SSR.
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
  const differ = options.diff || diff;
  const effect = options.effect || (fn => (fn(), noop));
  const getPeek = options.getPeek || (s => s.peek());
  const getValue = options.getValue || (s => s.value);
  const isSignal = options.isSignal || (
    options.Signal ?
      isPrototypeOf.bind(options.Signal.prototype) :
      () => false
  );

  const text = value => document.createTextNode(value);
  const comment = () => document.createComment(UDOMSAY);

  const getComponentView = (view, component) => {
    view.dispose();
    const dispose = effect(() => {
      const token = invoke(component);
      if (token.id !== view.id)
        view = getView(view, token, false);
      else
        view.update(token);
    });
    view.dispose = dispose;
    return view;
  };
  const getNewView = (view, token, createEffect) => {
    view.dispose();
    view = new View(token);
    if (createEffect)
      view.dispose = effect(() => view.update(token));
    else
      view.update(token);
    return view;
  };
  const getView = (view, token, createEffect) => token.type === COMPONENT ?
    getComponentView(view, token) :
    getNewView(view, token, createEffect)
  ;

  class View {
    constructor(token, shouldParse = true) {
      const [updates, content] = shouldParse ? parse(token) : [EMPTY, null];
      this._ = shouldParse && token.type === FRAGMENT;
      this.id = token.id;
      this.updates = updates;
      this.content = content;
      this.dispose = noop;
    }
    get $() {
      const {content, _} = this;
      if (_) {
        this._ = !_;
        return (this.content = asChildNodes(content)).childNodes;
      }
      return [content];
    }
    update(token) {
      for (const update of this.updates)
        update.call(this, token);
    }
  }

  const defaultView = new View({id: null}, false);
  const defaultEntry = {id: null, view: defaultView};

  const views = new WeakMap;
  let isToken;

  const tokens = new WeakMap;
  const parse = token => {
    let info = tokens.get(token.id);
    if (!info) {
      const updates = [];
      const content = mapToken(token, updates, [], EMPTY, false);
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
      const dispose = UDOMSAY + key;
      if (dispose in prev)
        prev[dispose]();
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

  const handleArray = (c, i) => function (token) {
    let diffed = EMPTY, findIndex = true, index = -1;
    const node = reachChild(c, this);
    const keys = new Map;
    (this.updates[i] = token => {
      const {value} = reachToken(c, token);
      const diffing = [];
      for (let i = 0; i < value.length; i++) {
        const token = value[i];
        if (findIndex) {
          findIndex = !findIndex;
          index = token.attributes.findIndex(isKey);
        }
        const key = index < 0 ? i : token.attributes[index].value;
        let {id, view} = keys.get(key) || defaultEntry;
        if (id !== token.id) {
          view = getView(view, token, false);
          keys.set(key, {id: token.id, view});
        }
        else
          view.update(token);
        diffing.push(...view.$);
      }
      if (diffing.length)
        diffed = differ(diffed, diffing, node);
      else if(diffed !== EMPTY) {
        const range = document.createRange();
        range.setStartBefore(diffed[0]);
        range.setEndAfter(diffed[diffed.length - 1]);
        range.deleteContents();
        keys.clear();
        diffed = EMPTY;
        findIndex = true;
      }
    })(token);
  };

  const handleComponent = (c, i) => function (token) {
    let diffed = EMPTY, view = defaultView;
    const node = reachChild(c, this);
    (this.updates[i] = token => {
      view = getComponentView(view, reachToken(c, token));
      diffed = differ(diffed, view.$, node);
    })(token);
  };

  const handleContent = (c, i) => function (token) {
    const node = reachChild(c, this);
    (this.updates[i] = token => {
      setData(node, reachToken(c, token).value);
    })(token);
  };

  const handleSignal = (c, i) => function (token) {
    let dispose = noop, signal, fx;
    const node = reachChild(c, this);
    const {value} = reachToken(c, token);
    const update = value => {
      if (signal !== value) {
        dispose();
        signal = value;
        dispose = effect(fx);
      }
    };
    if (isToken(getPeek(value))) {
      let diffed = EMPTY, view = defaultView;
      fx = () => {
        const token = getValue(signal);
        view = getView(view, token, false);
        diffed = differ(diffed, view.$, node);
      };
    }
    else {
      const t = text('');
      node.replaceWith(t);
      fx = () => { setData(t, getValue(signal)) };
    }
    this.updates[i] = token => update(reachToken(c, token).value);
    update(value);
  };

  const handleToken = (c, i) => function (token) {
    let diffed = EMPTY, view = defaultView, id = null;
    const node = reachChild(c, this);
    (this.updates[i] = token => {
      token = reachToken(c, token).value;
      if (id !== token.id) {
        id = token.id;
        // TODO: should this effect instead?
        view = getView(view, token, false);
        diffed = differ(diffed, view.$, node);
      }
      else if (token.type === COMPONENT)
        view.update(invoke(token));
      else
        view.update(token);
    })(token);
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
          case isToken(value):
            callback = handleToken;
            break;
          case isArray(value):
            callback = handleArray;
            break;
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
        content = comment();
        updates.push((callback || handleComponent)(c, length));
        break;
      }
      case ELEMENT: {
        const {attributes, name} = token;
        const args = [name];
        const attrs = [];
        for (let i = 0; i < attributes.length; i++) {
          const entry = attributes[i];
          if (entry.type === INTERPOLATION || entry.dynamic) {
            if (!isKey(entry))
              a.push(i);
          }
          else {
            if (entry.name === 'is')
              args.push({is: entry.value});
            attrs.push(entry);
          }
        }
        if (a.length)
          updates.push(handleAttributes(a, c, length));
        content = svg || (svg = name === 'svg') ?
          document.createElementNS('http://www.w3.org/2000/svg', ...args) :
          document.createElement(...args);
        for (const {name, value} of attrs)
          setAttribute(content, name, value, true);
        addChildren(token, updates, content, c, svg);
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
    const view = getView(views.get(where) || defaultView, token, true);
    views.set(where, view);
    where.replaceChildren(...view.$);
  };
};
