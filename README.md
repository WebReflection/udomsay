# udomsay

<sup><sub>**EXPERIMENTAL** ⚠</sub></sup> <sup><sub>**Social Media Image from [Know Your Meme](https://knowyourmeme.com/memes/you-dont-say--3)**</sub></sup>

A stricter, signals driven, JSX based library.

## What

This library includes, in about *2.7Kb*, logic to parse [a specialized form of JSX](https://github.com/ungap/babel-plugin-transform-esx#readme), or its [template literal based variant](https://github.com/ungap/esx#reade), and through [signals](https://github.com/WebReflection/usignal#readme), with effects automatically enabled through renders.

The goal of this library is:

  * explore if [a better instrumented JSX](https://webreflection.medium.com/jsx-is-inefficient-by-default-but-d1122c992399) can actually help performance and memory consumption
  * avoid the need of *vDOM*, still [diffing](https://github.com/WebReflection/udomdiff#readme) when necessary through *arrays* in interpolations
  * create once and map on the fly (JIT) templates for both nodes, fragments, and components
  * fine-tune operations per each interpolation, such as spread properties VS known static properties, conditional holes or signals and, last but not least, arrays of items

### Current JSX Interpolations Rules

Following the current set of stricter rules around *JSX* usage and how to avoid/prevent issues:

  * a *Component* can not return conditional content: a fragment is fine, and so is any other kind of node with interpolations in it, but `return condition ? <a /> : <b />` within a component is **not supported**, as that is suited for an interpolation hole instead, or a new render, but not really as a *Component* that returned arbitrary content. Use interpolations for that, and consider components as *Custom Elements* with a well defined tag wrapper.
  * if an interpolation contains a *primitive* value (e.g. a string, a number, a boolean or undefined) or a *signal* which value is primitive, every future update of such interpolation will *expect a primitive* value or *signal* carrying a primitive value. Conditional primitives values or signals are fine, but `{condition ? "string" : <Component />}` is **not supported**.
  * if a *signal* is used as interpolation and its value is *primitive*, a *light-effect* is used to update its value on the target text node *only if the signal changes or its value did*. This allows to fine-tune and confine updates per each component or even regular element node, without needing to re-trigger the outer component logic.
  * if a *signal* is used as interpolation and its value is *not primitive*, every future update of such interpolation will *expect a signal*. Conditional signals are fine, but `{condition ? signal : (<Component /> || "string")}` is **not supported**.
  * if an interpolation contains an *array* of items, every future update of such interpolation will *expect an array*. Conditional arrays are fine, but `{condition ? [..items] : (<Component /> || "string")}` is **not supported**.


## How

Given the following `counter.jsx` file:
```jsx
import {
  render,
  signal,
} from 'udomsay';

function Counter({clicks}) {
  return (
    <div>
      <button onclick={() => { clicks.value--; }}>-</button>
      <span>{clicks}</span>
      <button onclick={() => { clicks.value++; }}>+</button>
    </div>
  );
}

render(<Counter clicks={signal(0)} />, document.body);
```

Providing the following `babel.config.json` transformer:
```json
{
  "plugins": [
    ["@ungap/babel-plugin-transform-esx"]
  ]
}
```

The result can be **[tested in CodePen.io](https://codepen.io/WebReflection/pen/vYrYxKY)**.


### TODOs

- [x] run some benchmark and fine-tune performance, specially around *arrays*
- [x] fix all benchmark gotchas!
- [ ] add some TSDoc here and there, at least for the exported API
- [ ] do some code cleanup once previous points are done, trying to shrink further the final *brotli* and *minified* size
