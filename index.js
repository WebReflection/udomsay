const EMPTY = Object.freeze([]);

/** (c) Andrea Giammarchi - ISC */

class Token {
  static ATTRIBUTE =      1;
  static COMPONENT =      2;
  static ELEMENT =        3;
  static FRAGMENT =       4;
  static INTERPOLATION =  5;
  static STATIC =         6;
  get properties() {
    const {attributes} = this;
    if (attributes.length) {
      const properties = {};
      for (const entry of attributes) {
        if (entry.type < 2)
          properties[entry.name] = entry.value;
        else
          Object.assign(properties, entry.value);
      }
      return properties;
    }
    return null;
  }
}

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
const empty = [];
const noop = () => {};
const dispose = ({s}) => {
  if (typeof s._ === 'function')
    s._ = s._();
};

class FX extends Computed {
  constructor(_, v, o) {
    super(_, v, o, true);
    this.e = empty;
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
const effect$1 = (callback, value, options = defaults) => {
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
const effect = (fn, value) => effect$1(fn, value, options$1);

/* (c) Andrea Giammarchi - ISC */
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
      const effect = fx(() => { update(this.value); });
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
      fx(() => { text.data = this.value; }).run();
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

export { Effect, FX, Signal, batch, computed, diff, effect, render, signal, useDocument, useProperty };
