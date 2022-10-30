'use strict';
const {VOID_ELEMENTS} = require('domconstants');
const {escape} = require('./html-escaper.js');

const {
  COMPONENT,
  FRAGMENT,
  NODE,
  OBJECT,
  UDOMSAY,
  empty
} = require('./constants.js');

const {
  Info,
  Interpolation
} = require('./classes.js');

const {
  dontIgnoreKey,
  entries
} = require('./pure-utils.js');

function parseContent(type, args) {
  const info = new Info(type, empty, empty, [], []);
  createDetails.apply(info, args);
  return {ops: info.ops, html: info.html.join('')};
}
exports.parseContent = parseContent

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
