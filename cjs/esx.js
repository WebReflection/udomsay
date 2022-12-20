'use strict';
const {EMPTY} = require('@ungap/esx/constants');
const {Token} = require('@ungap/esx');

const {FX, Signal, Effect, batch} = require('usignal');
(m => Object.keys(m).map(k => k !== 'default' && (exports[k] = m[k])))
(require('usignal'));

const {diff} = require('./diff.js');
exports.diff = diff;

const {
  ATTRIBUTE,
  COMPONENT,
  ELEMENT,
  FRAGMENT,
  INTERPOLATION,
  STATIC
} = Token;

const {isArray} = Array;
const {assign, getPrototypeOf, prototype: {isPrototypeOf}} = Object;
const isSignal = isPrototypeOf.bind(Signal.prototype);

const options = {async: false, equals: true};
const fx = fn => new FX(fn, void 0, options);

let isToken;
const views = new WeakMap;
/**
 * Reveal some `token` content into a `DOM` element.
 * @param {function(...any):Token | Token} what the token to render
 * @param {Element} where the DOM node to render such token
 */
const render = (what, where) => {
  const token = typeof what === 'function' ? what() : what;
  if (!isToken)
    isToken = isPrototypeOf.bind(getPrototypeOf(token));
  let view = views.get(where);
  if (!view || view.token.id !== token.id) {
    if (view) view.fx.stop();
    const [updates, content] = parse(token);
    view = {
      token,
      info: {
        updates,
        content: token.type === FRAGMENT ?
          asChildNodes(content) :
          content
      },
      fx: new Effect(
        init => !!batch(() => callUpdates(view.token, init, view.info)),
        true,
        options
      )
    };
    views.set(where, view);
    where.replaceChildren(content);
  }
  view.token = token;
  view.fx.run();
};
exports.render = render;

const callUpdates = (token, init, {updates, content}) => {
  const after = init ? [] : EMPTY;
  for (let i = 0; i < updates.length; i++) {
    const result = updates[i](token, content);
    if (result)
      after.push(updates[i] = result);
  }
  for (let i = 0; i < after.length; i++)
    after[i](token, content);
};

const tokens = new WeakMap;
const parse = token => {
  let info = tokens.get(token.id);
  if (!info) {
    const updates = [];
    const content = mapToken(token, updates, [], []);
    tokens.set(token.id, info = [updates, content]);
  }
  const [updates, content] = info;
  return [updates.slice(), content.cloneNode(true)];
};

let {document} = globalThis;
/**
 * Update the default document to a different one.
 * @param {Document} doc the Document to use
 */
const useDocument = doc => {
  document = doc;
};
exports.useDocument = useDocument;

const mapToken = (token, updates, a, c) => {
  let callback, content;
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
          callback = handleSignal.bind(value);
          break;
        default: {
          content = document.createTextNode('');
          updates.push(handleContent(c));
          break type;
        }
      }
    }
    case COMPONENT: {
      content = document.createComment('🙊');
      updates.push((callback || handleComponent)(c));
      break;
    }
    case ELEMENT: {
      const {attributes, name} = token;
      const args = [name];
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
        updates.push(handleAttributes(a, c));
      content = document.createElement(...args);
      for (const {name, value} of attrs)
        setAttribute(content, name, value, true);
      addChildren(token, updates, content, c);
      break;
    }
    case FRAGMENT: {
      content = document.createDocumentFragment();
      addChildren(token, updates, content, c);
      break;
    }
  }
  return content;
};

const asChildNodes = ({childNodes}) => ({childNodes: [...childNodes]});
const getChild = ({childNodes}, i) => childNodes[i];
const getToken = ({children}, i) => children[i];

const addChildren = ({children}, updates, content, c) => {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    switch (child.type) {
      case STATIC:
        content.appendChild(document.createTextNode(child.value));
        break;
      default:
        content.appendChild(
          mapToken(children[i], updates, [], c.concat(i))
        );
        break;
    }
  }
};

const handleAttributes = (a, c) => (_, node) => {
  const prev = {};
  node = c.reduce(getChild, node);
  return token => {
    const {attributes} = c.reduce(getToken, token);
    for (const index of a) {
      const {name, value} = attributes[index];
      setProperty(node, name, value, prev);
    }
  };
};

const handleContent = c => (_, node) => {
  node = c.reduce(getChild, node);
  return token => {
    const {value} = c.reduce(getToken, token);
    const data = value == null ? '' : String(value);
    if (data !== node.data)
      node.data = value;
  };
};

const handleAll = asComponent => c => (_, node) => {
  node = c.reduce(getChild, node);
  const {parentNode} = node;
  const component = {};
  let diffed = EMPTY;
  return token => {
    token = c.reduce(getToken, token);
    const prev = component.result;
    const result = asComponent ? token.value(token.properties, ...token.children) : token;
    const init = !prev || (result.id !== prev.id);
    if (init) {
      const [updates, content] = parse(result);
      const isFragment = result.type === FRAGMENT;
      assign(component, {
        result,
        updates,
        content: isFragment ?
          asChildNodes(content) :
          content
      });
      diffed = diff(
        parentNode,
        diffed,
        isFragment ?
          component.content.childNodes :
          [content],
        node
      );
    }
    callUpdates(result, init, component);
  };
};

const handleComponent = handleAll(true);
const handleToken = handleAll(false);

const handleArray = c => (_, node) => {
  node = c.reduce(getChild, node);
  const {parentNode} = node;
  const keys = new Map;
  let diffed = EMPTY;
  return token => {
    const {value} = c.reduce(getToken, token);
    const info = value.map(asArray, keys);
    const after = [];
    const diffing = [];
    const init = diffed === EMPTY;
    for (const [token, details, nodes] of info) {
      after.push([token, details]);
      diffing.push(...nodes);
    }
    if (diffing.length) {
      diffed = diff(parentNode, diffed, diffing, node);
      for (const [token, details] of after)
        callUpdates(token, init, details);
    }
    else if(diffed !== EMPTY) {
      const range = document.createRange();
      range.setStartBefore(diffed[0]);
      range.setEndAfter(diffed[diffed.length - 1]);
      range.deleteContents();
      keys.clear();
      diffed = EMPTY;
    }
  };
};

const properties = new Map;
let considerPlugins = false;

const useProperty = (key, fn) => {
  considerPlugins = true;
  properties.set(key, fn);
};
exports.useProperty = useProperty;

const setAttribute = (node, key, value, set) => {
  if (set)
    node.setAttribute(key, value);
  else
    node[key] = value;
};

const asSignalAttribute = (node, key, value, set) => {
  if (isSignal(value)) {
    fx(() => {
      setAttribute(node, key, value.value, set);
    }).run();
  }
  else
    setAttribute(node, key, value, set);
};

const setProperty = (node, key, value, prev) => {
  if (considerPlugins && properties.has(key))
    properties.get(key)(node, value, prev);
  else if (prev[key] !== value) {
    prev[key] = value;
    switch (key) {
      case 'class':
        key += 'Name';
      case 'className':
      case 'textContent':
        asSignalAttribute(node, key, value, false);
        break;
      case 'ref':
        value.current = node;
        break;
      default:
        if (key.startsWith('on'))
          node[key.toLowerCase()] = value;
        else if (key in node)
          asSignalAttribute(node, key, value, false);
        else {
          if (value == null)
            node.removeAttribute(key);
          else
            asSignalAttribute(node, key, value, true);
        }
        break;
    }
  }
};

function handleSignal(c) {
  const value = this.peek();
  return (_, node) => {
    if (isToken(value)) {
      const copy = c.slice();
      const update = handleAll(value.type === COMPONENT)(copy)(_, node);
      const effect = fx(() => { update(this.value) });
      return () => {
        if (copy.length) {
          copy.splice(0);
          effect.run();
        }
      };
    }
    else {
      const text = document.createTextNode('');
      c.reduce(getChild, node).replaceWith(text);
      fx(() => { text.data = this.value }).run();
      return Function.prototype;
    }
  };
}

const key = ({name}) => name === 'key';
function asArray(token, i) {
  const {value} = token.attributes.find(key) || {value: i};
  let info = this.get(value);
  if (!info) {
    const [updates, content] = parse(token);
    switch (token.type) {
      case ELEMENT:
        info = [token, {updates, content}, [content]];
        break;
      // TODO: components returning components and components
      //       with a conditional return are not supported as Array
      case COMPONENT: {
        const result = token.value(token.properties, ...token.children);
        const [updates, content] = parse(result);
        const isFragment = result.type === FRAGMENT;
        const ctx = isFragment ? asChildNodes(content) : content;
        info = [result, {updates, content: ctx}, isFragment ? ctx.childNodes : [content]];
        break;
      }
      case FRAGMENT:
        const ctx = asChildNodes(content);
        info = [token, {updates, content: ctx}, ctx.childNodes];
        break;
    }
    this.set(value, info);
  }
  return info;
}
