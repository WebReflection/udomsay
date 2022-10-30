/*! (c) Andrea Giammarchi - ISC */

import {
  COMPONENT,
  FRAGMENT,
  NODE,
  OBJECT,
  empty
} from './constants.js';

import {
  ComponentStore,
  HoleInfo,
  Interpolation,
  KeyedHoleInfo,
  Signal,
  Store
} from './classes.js';

import {
  asValue,
  diff,
  entries,
  dontIgnoreKey,
  getChild,
  getHole,
  getNode,
  isArray,
  setProperty
} from './pure-utils.js';

import {parseContent} from './parser.js';

export const Fragment = Symbol();

export function createElement(entry) {
  return {type: typeof entry, args: arguments};
}

export const interpolation = value => new Interpolation(value);

const renders = new WeakMap;
export const render = (what, where) => {
  if (typeof what === COMPONENT) what = what();
  const {type, args} = what;
  const {__token} = args[1];
  let info = renders.get(where);
  if (!info || info.__token !== __token) {
    const [content, details] = parseNode(__token, type, args);
    renders.set(where, info = {__token, updates: []});
    where.replaceChildren(importNode(content, details, info.updates));
  }
  for (const update of info.updates)
    update(args);
};

let {document} = globalThis;
export const useDocument = doc => {
  document = doc;
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const createUpdates = (container, details, updates) => {
  for (const {child, tree, props, hole} of details) {
    const node = tree.reduce(getNode, container);
    // attributes
    if (props) {
      const prev = {};
      updates.push(
        props.length ?
        args => {
          const values = child.reduce(getChild, args)[1];
          for (const key of props)
            setProperty(node, key, values[key].value, prev);
        } :
        args => {
          const values = child.reduce(getChild, args)[1].value;
          for (const [key, value] of entries(values)) {
            if (dontIgnoreKey(key))
              setProperty(node, key, value, prev);
          }
        }
      );
    }
    // holes or static components
    else {
      const length = child.length - 1;
      const index = updates.push(hole ?
        // fine-tune the kind of update that's needed in the future
        args => {
          const value = getHole(child, length, args);
          if (typeof value === OBJECT) {
            if (isArray(value)) {
              const {parentNode} = node;
              let isKeyed = false, keys = null, stack = empty, nodes = empty;
              (updates[index] = (args, hole = getHole(child, length, args)) => {
                const array = [];
                const newStack = [];
                const {length} = stack;
                let i = 0;
                for (; i < hole.length; i++) {
                  const known = i < length;
                  const value = hole[i];
                  const {__token, key} = value.args[1];
                  if (!isKeyed && key !== void 0) {
                    isKeyed = true;
                    keys = {};
                  }
                  let info = known ? stack[i] : null;
                  if (
                    // fast path for same __token at same keyed/index
                    ((known && __token === info.__token) &&
                    (!isKeyed || key.value === info.key)) ||
                    // fast path for known keyed items
                    (isKeyed && (info = keys[key.value]))
                  ) {
                    refresh(info, value);
                  }
                  // start fresh with new item
                  else {
                    if (isKeyed) {
                      info = new KeyedHoleInfo(key.value);
                      keys[key.value] = info;
                    }
                    else
                      info = new HoleInfo;
                    populateInfo(info, __token, value);
                  }
                  newStack.push(info);
                  array.push(...info.nodes);
                }
                if (i) {
                  // TODO: dispose?
                  if (isKeyed) {
                    for (; i < length; i++)
                      delete keys[stack[i].key];
                  }
                  nodes = diff(parentNode, nodes, array, node);
                  stack = newStack;
                }
                // fast path for all items cleanup
                else {
                  const {length} = nodes;
                  if (length) {
                    const range = document.createRange();
                    range.setStartBefore(nodes[0]);
                    range.setEndAfter(nodes[length - 1]);
                    range.deleteContents();
                    nodes = empty;
                    if (isKeyed)
                      keys = {};
                  }
                  stack = empty;
                }
              })(args, value);
            }
            else {
              const isSignal = value instanceof Signal;
              // signal with primitive value
              if (isSignal && (typeof value.value !== OBJECT))
                updates[index] = useDataUpdate(child, length, node, value, true);
              // every other case
              else {
                const {parentNode} = node;
                const info = new HoleInfo;
                (updates[index] = (args, hole = getHole(child, length, args)) => {
                  const value = isSignal ? hole.value : hole;
                  const {__token} = value.args[1];
                  if (__token === info.__token)
                    refresh(info, value);
                  else {
                    const {nodes} = info;
                    populateInfo(info, __token, value);
                    diff(parentNode, nodes, info.nodes, node);
                  }
                })(args, value);
              } 
            }
          }
          // primitive value
          else
            updates[index] = useDataUpdate(child, length, node, value, false);
        } :
        // static component case
        args => {
          const [store, [content, details]] = parseComponent(
            child.reduce(getChild, args)
          );
          node.replaceWith(importNode(content, details, store.updates));
          updates[index] = args => {
            store.refresh(child.reduce(getChild, args));
          };
          store.update();
        }
      ) - 1;
    }
  }
};

const getInfo = (type, {html, ops}) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  const {content} = template;
  return [
    type === FRAGMENT ? content : content.childNodes[0],
    ops
  ];
};

const getNodes = (content, details, updates, isNode) => {
  const node = importNode(content, details, updates);
  return isNode ? [node] : [...node.childNodes];
};

const importNode = (content, details, updates) => {
  const container = document.importNode(content, true);
  createUpdates(container, details, updates);
  return container;
};

const components = new WeakMap;
const parseComponent = args => {
  const store = new ComponentStore(args);
  let info = components.get(args[0]);
  if (!info) {
    const {type, args: resultArgs} = store.result;
    components.set(args[0], info = getInfo(type, parseContent(type, resultArgs)));
  }
  return [store, info];
};

const parseNode = (__token, type, args) => (
  __token.info ||
  (__token.info = getInfo(type, parseContent(type, args)))
);

const populateInfo = (info, __token, value) => {
  info.__token = __token;
  if (value.type === COMPONENT) {
    const [store, [content, details]] = parseComponent(value.args);
    const {result, updates} = (info.store = store);
    info.nodes = getNodes(content, details, updates, result.type !== FRAGMENT);
  }
  else
    setStore(info, __token, value, value.type === NODE);
  info.store.update();
};

const refresh = ({store}, {args}) => {
  store.refresh(args);
};

const setStore = (info, __token, {type, args}, isNode) => {
  const [content, details] = parseNode(__token, type, args);
  const {updates} = (info.store = new Store(args));
  info.nodes = getNodes(content, details, updates, isNode);
};

const useDataUpdate = (child, length, node, value, isSignal) => {
  const text = document.createTextNode(asValue(value, isSignal));
  node.replaceWith(text);
  return args => {
    text.data = asValue(getHole(child, length, args), isSignal);
  };
};
