import {all, empty} from './constants.js';

const {isArray} = Array;
const {entries} = Object;

export {isArray, entries};

const properties = new Map;

export const asValue = (value, isSignal) => {
  const data = isSignal ? value.value : value;
  return data == null ? '' : data;
};

export const dontIgnoreKey = key => {
  switch (key) {
    case '__token':
    case 'key':
    case 'is':
      return false;
  }
  return true;
};

export const getChild = (args, i) => args[i].args;

export const getHole = (child, length, args) => {
  for (let i = 0; i < length; i++)
    ({args} = args[child[i]]);
  return args[child[length]].value;
};

export const getNode = ({childNodes}, i) => childNodes[i];

export const getProps = (keys, props) => {
  if (keys === all)
    return props.value;
  if (keys !== empty) {
    for (const key of keys)
      props[key] = props[key].value;
  }
  return props;
};

let considerPlugins = false;

export const useProperty = (key, fn) => {
  considerPlugins = true;
  properties.set(key, fn);
};

export const setProperty = (node, key, value, prev) => {
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
