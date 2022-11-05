'use strict';
/*! (c) Andrea Giammarchi - ISC */

const {
  COMPONENT,
  NODE,
  OBJECT,
  empty
} = require('./constants.js');

const {
  ComponentStore,
  HoleInfo,
  Info,
  Interpolation,
  KeyedHoleInfo,
  Signal,
  Store
} = require('./classes.js');

const {
  asValue,
  diff,
  entries,
  fx,
  dontIgnoreKey,
  getChild,
  getHole,
  getNode,
  isArray,
  setProperty
} = require('./pure-utils.js');

(m => {
  exports.useProperty = m.useProperty;
})(require('./pure-utils.js'));

const Fragment = Symbol();
exports.Fragment = Fragment;

function createElement(entry) {
  return {type: typeof entry, args: arguments};
}
exports.createElement = createElement

const interpolation = value => new Interpolation(value);
exports.interpolation = interpolation;

const renders = new WeakMap;
const render = (what, where) => {
  if (typeof what === COMPONENT) what = what();
  const {__token} = what.args[1];
  let info = renders.get(where);
  if (!info || info.__token !== __token) {
    info = new HoleInfo;
    populateInfo(info, __token, what);
    where.replaceChildren(...info.nodes);
  }
  else
    refresh(info, what);
};
exports.render = render;

let {document} = globalThis;
const useDocument = doc => {
  document = doc;
};
exports.useDocument = useDocument;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const createUpdates = (container, details, updates) => {
  for (const {child, tree, props, hole} of details) {
    const node = getNode(tree, container);
    // attributes
    if (props) {
      const prev = {};
      updates.push(
        props.length ?
        // static props
        args => {
          const values = getChild(child, args)[1];
          for (const key of props)
            setProperty(node, key, values[key].value, prev);
        } :
        // props as interpolation
        args => {
          const values = getChild(child, args)[1].value;
          for (const [key, value] of entries(values)) {
            if (dontIgnoreKey(key))
              setProperty(node, key, value, prev);
          }
        }
      );
    }
    // holes or static components
    else {
      const index = updates.push(hole ?
        // fine-tune the kind of update that's needed in the future
        args => {
          const value = getHole(child, args);
          if (typeof value === OBJECT) {
            if (isArray(value)) {
              const {parentNode} = node;
              let isKeyed = false, keys = null, stack = empty, nodes = empty;
              (updates[index] = (args, hole = getHole(child, args)) => {
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
              if (isSignal && (typeof value.peek() !== OBJECT))
                updates[index] = useDataUpdate(child, node, value, true);
              // every other case
              else {
                const {parentNode} = node;
                const info = new HoleInfo;
                (updates[index] = (args, hole = getHole(child, args)) => {
                  const value = asValue(hole, isSignal);
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
            updates[index] = useDataUpdate(child, node, asValue(value, false), false);
        } :
        // static component case
        args => {
          const store = createComponentStore(getChild(child, args));
          node.replaceWith(...store.nodes);
          updates[index] = args => {
            store.refresh(getChild(child, args));
          };
        }
      ) - 1;
    }
  }
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

const createComponentStore = args => new ComponentStore(args, parseNode, getNodes);

const parseNode = (__token, type, args) => {
  let {info} = __token;
  if (!info) {
    const {html, fragment, details} =
      new Info(type, empty, empty, [], []).parse(args);
    const template = document.createElement('template');
    template.innerHTML = html.join('');
    const {content} = template;
    __token.info = (
      info = [
        fragment ? content : content.firstChild,
        details
      ]
    );
  }
  return info;
};

const populateInfo = (info, __token, {type, args}) => {
  info.__token = __token;
  if (type === COMPONENT)
    info.store = createComponentStore(args);
  else {
    const updates = [];
    const [content, details] = parseNode(__token, type, args);
    const nodes = getNodes(content, details, updates, type === NODE);
    info.store = new Store(args, updates, nodes);
  }
};

const refresh = ({store}, {args}) => {
  store.refresh(args);
};

const useDataUpdate = (child, node, value, isSignal) => {
  const text = document.createTextNode(isSignal ? '' : value);
  node.replaceWith(text);
  if (isSignal) {
    const atomic = fx(() => {
      text.data = asValue(value, isSignal);
    });
    return args => {
      const current = getHole(child, args);
      if (current !== value) {
        value = current;
        atomic.run();
      }
    };
  }
  return args => {
    const current = asValue(getHole(child, args), isSignal);
    if (current !== value) {
      value = current;
      text.data = current;
    }
  };
};
