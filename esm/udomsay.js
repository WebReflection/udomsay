/*! (c) Andrea Giammarchi - ISC */

import {VOID_ELEMENTS} from 'domconstants';
import {escape} from 'html-escaper';
import diff from 'udomdiff';

import {
  COMPONENT,
  FRAGMENT,
  NODE,
  OBJECT,
  UDOMSAY,
  all,
  empty
} from './constants.js';

import {
  ComponentStore,
  HoleInfo,
  Info,
  Interpolation,
  KeyedHoleInfo,
  Signal,
  Store
} from './classes.js';

import {
  asValue,
  entries,
  dontIgnoreKey,
  getChild,
  getHole,
  getNode,
  isArray,
  setProperty
} from './pure-utils.js';

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

function createDetails(entry, props) {
  const {type, html} = this;
  const {length} = arguments;
  switch (type) {
    case NODE:
      html.push(`<${entry}`);
      if (props) {
        const {is} = props;
        if (is) html.push(` is="${is}"`);
        if (props instanceof Interpolation)
          this.push(all);
        else {
          const runtime = [];
          for (const [key, value] of entries(props)) {
            if (dontIgnoreKey(key)) {
              if (value instanceof Interpolation)
                runtime.push(key);
              else {
                html.push(
                  ` ${key === 'className' ? 'class' : key}="${escape(value)}"`
                );
              }
            }
          }
          if (runtime.length)
            this.push(runtime);
        }
      }
      if (length === 2)
        html.push(VOID_ELEMENTS.test(entry) ? ' />' : `></${entry}>`);
      else {
        html.push('>');
        mapChildren.apply(this, arguments);
        html.push(`</${entry}>`);
      }
      return 1;
    case COMPONENT:
      html.push(UDOMSAY);
      this.push(empty);
      return 1;
    case FRAGMENT:
      return mapChildren.apply(this, arguments);
  }
  throw new Error(entry);
}

const createUpdates = (container, details, updates) => {
  for (const {child, tree, props, hole} of details) {
    const node = tree.reduce(getNode, container);
    const length = child.length - 1;
    // holes or static components
    if (props === empty) {
      const index = updates.push(hole ?
        // fine-tune the kind of update that's needed in the future
        args => {
          const value = getHole(child, length, args);
          if (typeof value === OBJECT) {
            if (isArray(value)) {
              const {parentNode} = node;
              const stack = [];
              const keys = {};
              let i = 0, nodes = [];
              (updates[index] = (args, hole = getHole(child, length, args)) => {
                const {length} = stack;
                const array = [];
                let useKeys = false;
                for (i = 0; i < hole.length; i++) {
                  const value = hole[i];
                  const {__token, key} = value.args[1];
                  if (!useKeys && key !== void 0)
                    useKeys = true;
                  let info = stack[i] || (stack[i] = new KeyedHoleInfo);
                  if (useKeys && key.value === info.key && __token === info.__token)
                    refresh(info, value);
                  else if (useKeys && keys[key.value])
                    refresh(info = (stack[i] = keys[key.value]), value);
                  else {
                    if (useKeys) {
                      info.key = key.value;
                      keys[key.value] = info;
                    }
                    populateInfo(info, __token, value);
                  }
                  array.push(...info.nodes);
                }
                if (i < length) {
                  const drop = stack.splice(i);
                  // TODO: dispose?
                  if (useKeys) {
                    for (const {key} of drop)
                      delete keys[key];
                  }
                }
                if (i)
                  nodes = diff(parentNode, nodes, array, diffable, node);
                // fast path for all items cleanup
                else {
                  const {length} = nodes;
                  if (length) {
                    const range = document.createRange();
                    range.setStartBefore(nodes[0]);
                    range.setEndAfter(nodes[length - 1]);
                    range.deleteContents();
                    nodes = array;
                  }
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
                    diff(parentNode, nodes, info.nodes, diffable, node);
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
    // attributes
    else {
      updates.push(
        props === all ?
        args => {
          const values = child.reduce(getChild, args)[1].value;
          for (const [key, value] of entries(values)) {
            if (dontIgnoreKey(key))
              setProperty(node, key, value);
          }
        } :
        args => {
          const values = child.reduce(getChild, args)[1];
          for (const key of props)
            setProperty(node, key, values[key].value);
        }
      );
    }
  }
};

const diffable = O => O;

const getNodes = (content, details, updates, isNode) => {
  const node = importNode(content, details, updates);
  return isNode ? [node] : [...node.childNodes];
};

const getTree = (fragment, tree, index) => {
  let newTree;
  if (fragment) {
    const {length} = tree;
    if (length) {
      const sum = tree[length - 1];
      newTree = tree.slice(0, -1).concat(sum + index);
    }
    else
      newTree = empty;
  }
  else
    newTree = tree.concat(index);
  return newTree;
};

const importNode = (content, details, updates) => {
  const container = document.importNode(content, true);
  createUpdates(container, details, updates);
  return container;
};

function mapChildren(_, props) {
  const {fragment, child, tree, html} = this;
  const root = fragment && !props?.__token;
  let index = 0;
  for (let i = 2; i < arguments.length; i++) {
    const arg = arguments[i];
    if (typeof arg === OBJECT) {
      if (arg instanceof Interpolation) {
        html.push(UDOMSAY);
        this.push(empty, true, child.concat(i), getTree(root, tree, index++));
      }
      else {
        const {type, args} = arg;
        index += createDetails.apply(
          this.next(type, i, getTree(root, tree, index)),
          args
        );
      }
    }
    else {
      index++;
      html.push(arg);
    }
  }
  return index;
}

const components = new WeakMap;
const parseComponent = args => {
  const store = new ComponentStore(args);
  let info = components.get(args[0]);
  if (!info) {
    const {type, args: resultArgs} = store.result;
    components.set(args[0], info = parseContent.apply(type, resultArgs));
  }
  return [store, info];
};

function parseContent() {
  const info = new Info(this, empty, empty, [], []);
  createDetails.apply(info, arguments);
  const template = document.createElement('template');
  template.innerHTML = info.html.join('');
  const {content} = template;
  return [
    this == FRAGMENT ? content : content.childNodes[0],
    info.details
  ];
}

const templates = new WeakMap;
const parseNode = (__token, type, args) => {
  let contentDetails = templates.get(__token);
  if (!contentDetails)
    templates.set(__token, contentDetails = parseContent.apply(type, args));
  return contentDetails;
};

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