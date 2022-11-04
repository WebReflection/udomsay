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
const empty$1 = [];
const noop = () => {};
const dispose = ({s}) => {
  if (typeof s._ === 'function')
    s._ = s._();
};

class FX extends Computed {
  constructor(_, v, o) {
    super(_, v, o, true);
    this.e = empty$1;
  }
  run() {
    this.$ = true;
    this.value;
    return this;
  }
  stop() {
    this._ = noop;
    this.r.clear();
    this.s.c.clear();
  }
}

class Effect extends FX {
  constructor(_, v, o) {
    super(_, v, o);
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
    (outerEffect = this).i = 0;
    dispose(this);
    super.value;
    outerEffect = prev;
  }
  stop() {
    super.stop();
    dispose(this);
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
const effect$2 = (callback, value, options = defaults) => {
  let unique;
  if (outerEffect) {
    const {i, e} = outerEffect;
    const isNew = i === e.length;
    // bottleneck:
    // there's literally no way to optimize this path *unless* the callback is
    // already a known one. however, latter case is not really common code so
    // the question is: should I optimize this more than this? 'cause I don't
    // think the amount of code needed to understand if a callback is *likely*
    // the same as before makes any sense + correctness would be trashed.
    if (isNew || e[i]._ !== callback) {
      if (!isNew) e[i].stop();
      e[i] = new Effect(callback, value, options).run();
    }
    unique = e[i];
    outerEffect.i++;
  }
  else
    unique = new Effect(callback, value, options).run();
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

const options$1 = {async: false};

/**
 * Invokes synchronously a function when any of its internal signals or computed values change.
 *
 * Returns a dispose callback.
 * @template T
 * @type {<T>(fn: (v?: T) => T?, value?: T) => () => void 0}
 */
const effect$1 = (fn, value) => effect$2(fn, value, options$1);

/*! (c) Andrea Giammarchi - ISC */

const COMPONENT = 'function';
const FRAGMENT = 'symbol';
const NODE = 'string';
const OBJECT = 'object';
const UDOMSAY = '<!--🙊-->';

const empty = [];

/*! (c) Andrea Giammarchi - ISC */
const VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

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

const escape = value => value.replace(es, cape);

/*! (c) Andrea Giammarchi - ISC */

const {isArray} = Array;
const {entries} = Object;

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

const options = {async: false, equals: true};
const effect = (fn, light) => {
  const Class = light ? FX : Effect;
  return new Class(fn, void 0, options).run();
};

const getChild = (child, args) => {
  for (let i = 0; i < child.length; i++)
    args = args[child[i]].args;
  return args;
};

const getHole = (child, args) => {
  const length = child.length - 1;
  for (let i = 0; i < length; i++)
    args = args[child[i]].args;
  return args[child[length]].value;
};

const getNode = (tree, node) => {
  for (let i = 0; i < tree.length; i++)
    node = node.childNodes[tree[i]];
  return node;
};

const properties = new Map;
let considerPlugins = false;

const useProperty = (key, fn) => {
  considerPlugins = true;
  properties.set(key, fn);
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
        node[key] = value;
        break;
      case 'ref':
        value.current = node;
        break;
      default:
        if (key.startsWith('on'))
          node[key.toLowerCase()] = value;
        else if (key in node)
          node[key] = value;
        else {
          if (value == null)
            node.removeAttribute(key);
          else
            node.setAttribute(key, value);
        }
        break;
    }
  }
};

/*! (c) Andrea Giammarchi - ISC */
// @see https://github.com/WebReflection/udomdiff
const diff = (parentNode, a, b, before) => {
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
          b[bStart - 1].nextSibling :
          b[bEnd - bStart]) :
        before;
      while (bStart < bEnd)
        parentNode.insertBefore(b[bStart++], node);
    }
    // remove head or tail: fast path
    else if (bEnd === bStart) {
      while (aStart < aEnd) {
        // remove the node only if it's unknown or not live
        if (!map || !map.has(a[aStart]))
          a[aStart].remove();
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
      const node = a[--aEnd].nextSibling;
      parentNode.insertBefore(
        b[bStart++],
        a[aStart++].nextSibling
      );
      parentNode.insertBefore(b[--bEnd], node);
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
            const node = a[aStart];
            while (bStart < index)
              parentNode.insertBefore(b[bStart++], node);
          }
          // if the effort wasn't good enough, fallback to a replace,
          // moving both source and target indexes forward, hoping that some
          // similar node will be found later on, to go back to the fast path
          else {
            parentNode.replaceChild(
              b[bStart++],
              a[aStart++]
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
        a[aStart++].remove();
    }
  }
  return b;
};

/*! (c) Andrea Giammarchi - ISC */

class Info {
  constructor(type, child, tree, details, html) {
    this.fragment = type === FRAGMENT;
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
  parse(args) {
    createDetails.apply(this, args);
    return this;
  }
  push(props, hole = false, child = this.child, tree = this.tree) {
    this.details.push({child, tree, props, hole});
  }
}

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
          this.push(empty);
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
      this.push(null);
      return 1;
    case FRAGMENT:
      return mapChildren.apply(this, arguments);
  }
  throw new Error(entry);
}

function mapChildren(_, props) {
  const {fragment, child, tree, html} = this;
  const root = fragment && !props?.__token;
  let index = 0;
  for (let i = 2; i < arguments.length; i++) {
    const arg = arguments[i];
    if (typeof arg === OBJECT) {
      if (arg instanceof Interpolation) {
        html.push(UDOMSAY);
        this.push(null, true, child.concat(i), getTree(root, tree, index++));
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

class Interpolation {
  constructor(value) { this.value = value; }
}

class HoleInfo {
  constructor() {
    this.__token = null;
    this.store = null;
  }
  get nodes() { return this.store.nodes }
}

class KeyedHoleInfo extends HoleInfo {
  constructor(key) {
    super().key = key;
  }
}

class Store {
  constructor(args, updates, nodes) {
    this.args = null;
    this.nodes = nodes;
    this.updates = updates;
    this.refresh(args);
  }
  refresh(args) {
    if (this.args !== args) {
      this.args = args;
      for (const update of this.updates)
        update(this.args);
    }
  }
}

class ComponentStore {
  constructor(args, parseNode, getNodes) {
    this.args = args;
    this.calc = false;
    this.init = true;
    this.keys = null;
    this.effect = effect(
      () => {
        const {args, calc, init, keys} = this;
        let [component, props, ...children] = args;
        if (init) {
          this.init = false;
          // map interpolations passed as props to components
          if (props) {
            if (props instanceof Interpolation) {
              this.keys = empty;
              props = props.value;
            }
            else {
              const runtime = [];
              for (const [key, value] of entries(props)) {
                if (value instanceof Interpolation) {
                  runtime.push(key);
                  props[key] = value.value;
                }
              }
              if (runtime.length)
                this.keys = runtime;
            }
          }
        }
        else if (calc) {
          this.calc = false;
          if (keys === empty)
            props = props.value;
          else if (keys) {
            for (const key of keys)
              props[key] = props[key].value;
          }
        }
        this.result = component(props, ...children);
        if (init) {
          const {type, args} = this.result;
          const [content, details] = parseNode(args[1].__token, type, args);
          this.nodes = getNodes(content, details, this.updates = [], type !== FRAGMENT);
        }
        for (const update of this.updates)
          update(this.result.args);
      },
      false
    );
  }
  refresh(args) {
    if (this.args !== args) {
      this.args = args;
      this.calc = true;
      // TODO: maybe add a run() method instead?
      this.effect.run();
    }
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

let {document} = globalThis;
const useDocument = doc => {
  document = doc;
};

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
            updates[index] = useDataUpdate(child, node, value, false);
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
    const {html, fragment, details} = (
      __token.ops ?
        {
          html: [__token.html],
          fragment: type === FRAGMENT,
          details: __token.ops
        } :
        new Info(type, empty, empty, [], []).parse(args)
    );
    const template = document.createElement('template');
    template.innerHTML = html.join('');
    const {content} = template;
    __token.info = (
      info = [
        fragment ? content : content.childNodes[0],
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
  let prev = isSignal ? value : asValue(value, isSignal);
  const text = document.createTextNode(isSignal ? '' : prev);
  node.replaceWith(text);
  if (isSignal) {
    const fx = effect(
      () => {
        text.data = asValue(prev, isSignal);
      },
      true
    );
    return args => {
      const current = getHole(child, args);
      if (current !== prev) {
        prev = current;
        fx.run();
      }
    };
  }
  return args => {
    const current = asValue(getHole(child, args), isSignal);
    if (current !== prev) {
      prev = current;
      text.data = current;
    }
  };
};

export { Effect, FX, Fragment, Signal, batch, computed, createElement, effect$1 as effect, interpolation, render, signal, useDocument, useProperty };
