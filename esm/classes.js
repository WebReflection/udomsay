/*! (c) Andrea Giammarchi - ISC */

import {effect} from 'usignal';

import {FRAGMENT, all, empty} from './constants.js';
import {entries, getProps} from './pure-utils.js';

export {Signal} from 'usignal';

export class Info {
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

export class Interpolation {
  constructor(value) { this.value = value }
}

export class HoleInfo {
  constructor() {
    this.__token = null;
    this.store = null;
    this.nodes = empty;
  }
}

export class KeyedHoleInfo extends HoleInfo {
  constructor() {
    super();
    this.key = void 0;
  }
}

export class Store {
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

export class ComponentStore extends Store {
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