'use strict';
/*! (c) Andrea Giammarchi - ISC */

const {effect} = require('usignal');

const {FRAGMENT, empty} = require('./constants.js');
const {entries} = require('./pure-utils.js');

const all = [];

(m => {
  exports.Signal = m.Signal;
})(require('usignal'));

class Info {
  constructor(type, child, tree, ops, html) {
    this.fragment = type === FRAGMENT;
    this.type = type;
    this.child = child;
    this.tree = tree;
    this.ops = ops;
    this.html = html;
  }
  next(type, index, tree) {
    return new Info(
      type,
      this.child.concat(index),
      tree,
      this.ops,
      this.html
    );
  }
  push(props, hole = false, child = this.child, tree = this.tree) {
    this.ops.push({child, tree, props, hole});
  }
}
exports.Info = Info

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
