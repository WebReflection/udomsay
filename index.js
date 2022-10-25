/*! (c) Andrea Giammarchi */

const {is} = Object;

let batches;

/**
 * Execute a callback that will not side-effect until its top-most batch is
 * completed.
 * @param {() => void} callback a function that batches changes to be notified
 *  through signals.
 */
const batch = callback => {
  const prev = batches;
  batches = prev || [];
  try {
    callback();
    if (!prev)
      for (const {value} of batches);
  }
  finally { batches = prev; }
};

/**
 * A signal with a value property also exposed via toJSON, toString and valueOf.
 * When created via computed, the `value` property is **readonly**.
 * @template T
 */
class Signal {
  /** @param {T} value the value carried along the signal. */
  constructor(value) {
    this._ = value;
  }

  /** @returns {T} */
  then() { return this.value }

  /** @returns {T} */
  toJSON() { return this.value }

  /** @returns {T} */
  toString() { return this.value }

  /** @returns {T} */
  valueOf() { return this.value }
}

let computedSignal;
class Computed extends Signal {
  constructor(_, v, o, f) {
    super(_);
    this.f = f;                   // is effect?
    this.$ = true;                // should update ("value for money")
    this.r = new Set;             // related signals
    this.s = new Reactive(v, o);  // signal
  }
  /** @readonly */
  get value() {
    if (this.$) {
      const prev = computedSignal;
      computedSignal = this;
      try { this.s.value = this._(this.s._); }
      finally {
        this.$ = false;
        computedSignal = prev;
      }
    }
    return this.s.value;
  }
}

const defaults = {async: false, equals: true};

/**
 * Returns a read-only Signal that is invoked only when any of the internally
 * used signals, as in within the callback, is unknown or updated.
 * @template T
 * @type {<T>(fn: (v: T) => T, value?: T, options?: { equals?: boolean | ((prev: T, next: T) => boolean) }) => Signal<T>}
 */
const computed = (fn, value, options = defaults) =>
                          new Computed(fn, value, options, false);

let outerEffect;
const noop = () => {};
const dispose = ({s}) => {
  if (typeof s._ === 'function')
    s._ = s._();
};
class Effect extends Computed {
  constructor(_, v, o) {
    super(_, v, o, true);
    this.i = 0;         // index
    this.a = !!o.async; // async
    this.m = true;      // microtask
    this.e = [];        // effects
                        // "I am effects" ^_^;;
  }
  get value() {
    this.a ? this.async() : this.sync();
  }
  async() {
    if (this.m) {
      this.m = false;
      queueMicrotask(() => {
        this.m = true;
        this.sync();
      });
    }
  }
  sync() {
    const prev = outerEffect;
    const {e} = (outerEffect = this);
    this.i = 0;
    dispose(this);
    super.value;
    // if effects are present in loops, these can grow or shrink.
    // when these grow, there's nothing to do, as well as when these are
    // still part of the loop, as the callback gets updated anyway.
    // however, if there were more effects before but none now, those can
    // just stop being referenced and go with the GC.
    if (this.i < e.length)
      for (const effect of e.splice(this.i))
        effect.stop();
    for (const {value} of e);
    outerEffect = prev;
  }
  stop() {
    dispose(this);
    this._ = noop;
    this.r.clear();
    this.s.c.clear();
    for (const effect of this.e.splice(0))
      effect.stop();
  }
}

/**
 * Invokes a function when any of its internal signals or computed values change.
 * 
 * Returns a dispose callback.
 * @template T
 * @type {<T>(fn: (v: T) => T, value?: T, options?: { async?: boolean }) => () => void}
 */
const effect$1 = (callback, value, options = defaults) => {
  let unique;
  if (outerEffect) {
    const {i, e} = outerEffect;
    // bottleneck:
    // there's literally no way to optimize this path *unless* the callback is
    // already a known one. however, latter case is not really common code so
    // the question is: should I optimize this more than this? 'cause I don't
    // think the amount of code needed to understand if a callback is *likely*
    // the same as before makes any sense + correctness would be trashed.
    if (i === e.length || e[i]._ !== callback)
      e[i] = new Effect(callback, value, options);
    unique = e[i];
    outerEffect.i++;
  }
  else
    (unique = new Effect(callback, value, options)).value;
  return () => { unique.stop(); };
};

const skip = () => false;
class Reactive extends Signal {
  constructor(_, {equals}) {
    super(_);
    this.c = new Set;                                 // computeds
    this.s = equals === true ? is : (equals || skip); // (don't) skip updates
  }
  peek() { return this._ }
  get value() {
    if (computedSignal) {
      this.c.add(computedSignal);
      computedSignal.r.add(this);
    }
    return this._;
  }
  set value(_) {
    const prev = this._;
    if (!this.s((this._ = _), prev)) {
      if (this.c.size) {
        const effects = [];
        const stack = [this];
        for (const signal of stack) {
          for (const computed of signal.c) {
            if (!computed.$ && computed.r.has(signal)) {
              computed.r.clear();
              computed.$ = true;
              if (computed.f) {
                effects.push(computed);
                const stack = [computed];
                for (const c of stack) {
                  for (const effect of c.e) {
                    effect.r.clear();
                    effect.$ = true;
                    stack.push(effect);
                  }
                }
              }
              else
                stack.push(computed.s);
            }
          }
        }
        for (const effect of effects)
          batches ? batches.push(effect) : effect.value;
      }
    }
  }
}

/**
 * Returns a writable Signal that side-effects whenever its value gets updated.
 * @template T
 * @type {<T>(initialValue: T, options?: { equals?: boolean | ((prev: T, next: T) => boolean) }) => Signal<T>}
 */
const signal = (value, options = defaults) => new Reactive(value, options);

const options = {async: false};

/**
 * Invokes synchronously a function when any of its internal signals or computed values change.
 *
 * Returns a dispose callback.
 * @template T
 * @type {<T>(fn: (v?: T) => T?, value?: T) => () => void 0}
 */
const effect = (fn, value) => effect$1(fn, value, options);

/*! (c) Andrea Giammarchi - ISC */

// Custom
var UID = '-' + Math.random().toFixed(6) + '%';
//                           Edge issue!

var UID_IE = false;

try {
  if (!(function (template, content, tabindex) {
    return content in template && (
      (template.innerHTML = '<p ' + tabindex + '="' + UID + '"></p>'),
      template[content].childNodes[0].getAttribute(tabindex) == UID
    );
  }(document.createElement('template'), 'content', 'tabindex'))) {
    UID = '_dt: ' + UID.slice(1, -1) + ';';
    UID_IE = true;
  }
} catch(meh) {}
var VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

/**
 * Copyright (C) 2017-present by Andrea Giammarchi - @WebReflection
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const {replace} = '';
const ca = /[&<>'"]/g;

const esca = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
};
const pe = m => esca[m];

/**
 * Safely escape HTML entities such as `&`, `<`, `>`, `"`, and `'`.
 * @param {string} es the input to safely escape
 * @returns {string} the escaped input, and it **throws** an error if
 *  the input type is unexpected, except for boolean and numbers,
 *  converted as string.
 */
const escape = es => replace.call(es, ca, pe);

/**
 * ISC License
 *
 * Copyright (c) 2020, Andrea Giammarchi, @WebReflection
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

/**
 * @param {Node} parentNode The container where children live
 * @param {Node[]} a The list of current/live children
 * @param {Node[]} b The list of future children
 * @param {(entry: Node, action: number) => Node} get
 * The callback invoked per each entry related DOM operation.
 * @param {Node} [before] The optional node used as anchor to insert before.
 * @returns {Node[]} The same list of future children.
 */
var diff = (parentNode, a, b, get, before) => {
  const bLength = b.length;
  let aEnd = a.length;
  let bEnd = bLength;
  let aStart = 0;
  let bStart = 0;
  let map = null;
  while (aStart < aEnd || bStart < bEnd) {
    // append head, tail, or nodes in between: fast path
    if (aEnd === aStart) {
      // we could be in a situation where the rest of nodes that
      // need to be added are not at the end, and in such case
      // the node to `insertBefore`, if the index is more than 0
      // must be retrieved, otherwise it's gonna be the first item.
      const node = bEnd < bLength ?
        (bStart ?
          (get(b[bStart - 1], -0).nextSibling) :
          get(b[bEnd - bStart], 0)) :
        before;
      while (bStart < bEnd)
        parentNode.insertBefore(get(b[bStart++], 1), node);
    }
    // remove head or tail: fast path
    else if (bEnd === bStart) {
      while (aStart < aEnd) {
        // remove the node only if it's unknown or not live
        if (!map || !map.has(a[aStart]))
          parentNode.removeChild(get(a[aStart], -1));
        aStart++;
      }
    }
    // same node: fast path
    else if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
    }
    // same tail: fast path
    else if (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    // The once here single last swap "fast path" has been removed in v1.1.0
    // https://github.com/WebReflection/udomdiff/blob/single-final-swap/esm/index.js#L69-L85
    // reverse swap: also fast path
    else if (
      a[aStart] === b[bEnd - 1] &&
      b[bStart] === a[aEnd - 1]
    ) {
      // this is a "shrink" operation that could happen in these cases:
      // [1, 2, 3, 4, 5]
      // [1, 4, 3, 2, 5]
      // or asymmetric too
      // [1, 2, 3, 4, 5]
      // [1, 2, 3, 5, 6, 4]
      const node = get(a[--aEnd], -1).nextSibling;
      parentNode.insertBefore(
        get(b[bStart++], 1),
        get(a[aStart++], -1).nextSibling
      );
      parentNode.insertBefore(get(b[--bEnd], 1), node);
      // mark the future index as identical (yeah, it's dirty, but cheap 👍)
      // The main reason to do this, is that when a[aEnd] will be reached,
      // the loop will likely be on the fast path, as identical to b[bEnd].
      // In the best case scenario, the next loop will skip the tail,
      // but in the worst one, this node will be considered as already
      // processed, bailing out pretty quickly from the map index check
      a[aEnd] = b[bEnd];
    }
    // map based fallback, "slow" path
    else {
      // the map requires an O(bEnd - bStart) operation once
      // to store all future nodes indexes for later purposes.
      // In the worst case scenario, this is a full O(N) cost,
      // and such scenario happens at least when all nodes are different,
      // but also if both first and last items of the lists are different
      if (!map) {
        map = new Map;
        let i = bStart;
        while (i < bEnd)
          map.set(b[i], i++);
      }
      // if it's a future node, hence it needs some handling
      if (map.has(a[aStart])) {
        // grab the index of such node, 'cause it might have been processed
        const index = map.get(a[aStart]);
        // if it's not already processed, look on demand for the next LCS
        if (bStart < index && index < bEnd) {
          let i = aStart;
          // counts the amount of nodes that are the same in the future
          let sequence = 1;
          while (++i < aEnd && i < bEnd && map.get(a[i]) === (index + sequence))
            sequence++;
          // effort decision here: if the sequence is longer than replaces
          // needed to reach such sequence, which would brings again this loop
          // to the fast path, prepend the difference before a sequence,
          // and move only the future list index forward, so that aStart
          // and bStart will be aligned again, hence on the fast path.
          // An example considering aStart and bStart are both 0:
          // a: [1, 2, 3, 4]
          // b: [7, 1, 2, 3, 6]
          // this would place 7 before 1 and, from that time on, 1, 2, and 3
          // will be processed at zero cost
          if (sequence > (index - bStart)) {
            const node = get(a[aStart], 0);
            while (bStart < index)
              parentNode.insertBefore(get(b[bStart++], 1), node);
          }
          // if the effort wasn't good enough, fallback to a replace,
          // moving both source and target indexes forward, hoping that some
          // similar node will be found later on, to go back to the fast path
          else {
            parentNode.replaceChild(
              get(b[bStart++], 1),
              get(a[aStart++], -1)
            );
          }
        }
        // otherwise move the source forward, 'cause there's nothing to do
        else
          aStart++;
      }
      // this node has no meaning in the future list, so it's more than safe
      // to remove it, and check the next live node out instead, meaning
      // that only the live list index should be forwarded
      else
        parentNode.removeChild(get(a[aStart++], -1));
    }
  }
  return b;
};

/*! (c) Andrea Giammarchi - ISC */

const COMPONENT = 'function';
const FRAGMENT = 'symbol';
const NODE = 'string';
const OBJECT = 'object';
const UDOMSAY = '<!--🙊-->';

const all = [];
const empty = [];

const {isArray} = Array;
const {entries} = Object;

const properties = new Map;

const asValue = (value, isSignal) => {
  const data = isSignal ? value.value : value;
  return data == null ? '' : data;
};

const dontIgnoreKey = key => {
  switch (key) {
    case '__token':
    case 'key':
    case 'is':
      return false;
  }
  return true;
};

const getChild = (args, i) => args[i].args;

const getHole = (child, length, args) => {
  for (let i = 0; i < length; i++)
    ({args} = args[child[i]]);
  return args[child[length]].value;
};

const getNode = ({childNodes}, i) => childNodes[i];

const getProps = (keys, props) => {
  if (keys === all)
    return props.value;
  if (keys !== empty) {
    for (const key of keys)
      props[key] = props[key].value;
  }
  return props;
};

let considerPlugins = false;

const useProperty = (key, fn) => {
  considerPlugins = true;
  properties.set(key, fn);
};

const setProperty = (node, key, value) => {
  if (considerPlugins && properties.has(key))
    properties.get(key)(node, key, value);
  else if (key === 'ref')
    value.current = node;
  else {
    if (key === 'class')
      key += 'Name';
    else if (key.startsWith('on'))
      key = key.toLowerCase();
    if (key in node) {
      if (node[key] !== value)
        node[key] = value;
    }
    else {
      if (value == null)
        node.removeAttribute(key);
      else
        node.setAttribute(key, value);
    }
  }
};

/*! (c) Andrea Giammarchi - ISC */

class Info {
  constructor(type, child, tree, details, html) {
    this.fragment = type == FRAGMENT;
    this.type = type;
    this.child = child;
    this.tree = tree;
    this.details = details;
    this.html = html;
  }
  next(type, index, tree) {
    return new Info(
      type,
      this.child.concat(index),
      tree,
      this.details,
      this.html
    );
  }
  push(props, hole = false, child = this.child, tree = this.tree) {
    this.details.push({child, tree, props, hole});
  }
}

class Interpolation {
  constructor(value) { this.value = value; }
}

class HoleInfo {
  constructor() {
    this.__token = null;
    this.store = null;
    this.nodes = empty;
  }
}

class KeyedHoleInfo extends HoleInfo {
  constructor() {
    super();
    this.key = void 0;
  }
}

class Store {
  constructor(args) {
    this.args = args;
    this.updates = [];
  }
  refresh(args) {
    if (args !== this.args) {
      this.args = args;
      this.update();
    }
  }
  update() {
    for (const update of this.updates)
      update(this.args);
  }
}

class ComponentStore extends Store {
  constructor(args) {
    super(args);
    this.init = true;
    this.keys = empty;
    this.result = null; // TODO: redundant as set in the sync effect?
    this.dispose = effect(() => {
      const {init, args} = this;
      const [component, props, ...children] = args;
      if (init) {
        this.init = false;
        // map interpolations passed as props to components
        if (props) {
          if (props instanceof Interpolation)
            this.keys = all;
          else {
            let keys = empty;
            for (const [key, value] of entries(props)) {
              if (value instanceof Interpolation)
                (keys === empty ? (keys = []) : keys).push(key);
            }
            this.keys = keys;
          }
        }
      }
      this.result = component(getProps(this.keys, props), ...children);
      if (!init)
        this.update();
    });
  }
  refresh(args) {
    if (args !== this.args) {
      this.args = args;
      const [component, props, ...children] = args;
      this.result = component(getProps(this.keys, props), ...children);
      this.update();
    }
  }
  update() {
    const {updates, result: {args}} = this;
    for (const update of updates)
      update(args);
  }
}

/*! (c) Andrea Giammarchi - ISC */

const Fragment = Symbol();

function createElement(entry) {
  return {type: typeof entry, args: arguments};
}

const interpolation = value => new Interpolation(value);

const renders = new WeakMap;
const render = (what, where) => {
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

let {document: document$1} = globalThis;
const useDocument = doc => {
  document$1 = doc;
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
                for (i = 0; i < hole.length; i++) {
                  const value = hole[i];
                  const {__token, key} = value.args[1];
                  const hasKey = key !== void 0;
                  let info = stack[i] || (stack[i] = new KeyedHoleInfo);
                  if (hasKey && key === info.key && __token === info.__token)
                    refresh(info, value);
                  else if (hasKey && keys[key])
                    refresh(info = (stack[i] = keys[key]), value);
                  else {
                    if (hasKey) {
                      info.key = key;
                      keys[key] = info;
                    }
                    populateInfo(info, __token, value);
                  }
                  array.push(...info.nodes);
                }
                // TODO: dispose?
                if (i < length) stack.splice(i);
                nodes = diff(parentNode, nodes, array, diffable, node);
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
  const container = document$1.importNode(content, true);
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
  const template = document$1.createElement('template');
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
  const text = document$1.createTextNode(asValue(value, isSignal));
  node.replaceWith(text);
  return args => {
    text.data = asValue(getHole(child, length, args), isSignal);
  };
};

export { Fragment, Signal, batch, computed, createElement, effect, interpolation, render, signal, useDocument, useProperty };
