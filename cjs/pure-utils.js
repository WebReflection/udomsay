'use strict';
const {all, empty} = require('./constants.js');

const {isArray} = Array;
const {entries} = Object;

exports.isArray = isArray;
exports.entries = entries;

const properties = new Map;

const asValue = (value, isSignal) => {
  const data = isSignal ? value.value : value;
  return data == null ? '' : data;
};
exports.asValue = asValue;

const dontIgnoreKey = key => {
  switch (key) {
    case '__token':
    case 'key':
    case 'is':
      return false;
  }
  return true;
};
exports.dontIgnoreKey = dontIgnoreKey;

const getChild = (args, i) => args[i].args;
exports.getChild = getChild;

const getHole = (child, length, args) => {
  for (let i = 0; i < length; i++)
    ({args} = args[child[i]]);
  return args[child[length]].value;
};
exports.getHole = getHole;

const getNode = ({childNodes}, i) => childNodes[i];
exports.getNode = getNode;

const getProps = (keys, props) => {
  if (keys === all)
    return props.value;
  if (keys !== empty) {
    for (const key of keys)
      props[key] = props[key].value;
  }
  return props;
};
exports.getProps = getProps;

let considerPlugins = false;

const useProperty = (key, fn) => {
  considerPlugins = true;
  properties.set(key, fn);
};
exports.useProperty = useProperty;

const setProperty = (node, key, value) => {
  if (considerPlugins && properties.has(key))
    properties.get(key)(node, value);
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
exports.setProperty = setProperty;
