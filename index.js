var freeze = Object.freeze;

var EMPTY = freeze([]);

var noop = () => {};

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

/* (c) Andrea Giammarchi - ISC */
// @see https://github.com/WebReflection/udomdiff
const diff = (a, b, before) => {
  const {parentNode} = before;
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

const {isArray} = Array;
const {entries, getPrototypeOf, prototype: {isPrototypeOf}} = Object;

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
var index = (options = {}) => {
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
        const entry = attributes[index];
        const {type, value} = entry;
        if (type < 2)
          setProperty(node, entry.name, value, prev);
        else {
          for (const [name, v] of entries(value))
            setProperty(node, name, v, prev);
        }
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
      fx = () => { setData(t, getValue(signal)); };
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

export { index as default };
