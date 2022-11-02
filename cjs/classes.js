'use strict';
/*! (c) Andrea Giammarchi - ISC */

const {VOID_ELEMENTS} = require('domconstants');
const {effect} = require('usignal');

const {
  COMPONENT,
  FRAGMENT,
  NODE,
  OBJECT,
  UDOMSAY,
  all,
  empty
} = require('./constants.js');

const {escape} = require('./html-escaper.js');

const {
  entries,
  dontIgnoreKey
} = require('./pure-utils.js');

(m => {
  exports.Signal = m.Signal;
})(require('usignal'));

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
exports.Info = Info

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

class Interpolation {
  constructor(value) { this.value = value }
}
exports.Interpolation = Interpolation

class HoleInfo {
  constructor() {
    this.__token = null;
    this.store = null;
    this.nodes = empty;
  }
}
exports.HoleInfo = HoleInfo

class KeyedHoleInfo extends HoleInfo {
  constructor(key) {
    super().key = key;
  }
}
exports.KeyedHoleInfo = KeyedHoleInfo

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
exports.Store = Store

class ComponentStore extends Store {
  constructor(args) {
    super(args);
    this.init = true;
    this.keys = empty;
    this.result = null; // TODO: redundant as set in the sync effect?
    this.dispose = effect(() => {
      const {init, args} = this;
      let [component, props, ...children] = args;
      if (init) {
        this.init = false;
        // map interpolations passed as props to components
        if (props) {
          if (props instanceof Interpolation) {
            this.keys = all;
            props = props.value;
          }
          else {
            let keys = empty;
            for (const [key, value] of entries(props)) {
              if (value instanceof Interpolation) {
                (keys === empty ? (keys = []) : keys).push(key);
                props[key] = value.value;
              }
            }
            this.keys = keys;
          }
        }
      }
      this.result = component(props, ...children);
      if (!init)
        this.update();
    });
  }
  refresh(args) {
    if (args !== this.args) {
      let [component, props, ...children] = (this.args = args);
      const {keys} = this;
      if (keys === all)
        props = props.value;
      else if (keys !== empty) {
        for (const key of keys)
          props[key] = props[key].value;
      }
      this.result = component(props, ...children);
      this.update();
    }
  }
  update() {
    const {updates, result: {args}} = this;
    for (const update of updates)
      update(args);
  }
}
exports.ComponentStore = ComponentStore
