import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default name => ({
  input: `./esm/dist/${name}.js`,
  plugins: [
    nodeResolve(),
    terser()
  ],
  output: {
    file: `./${name}.js`,
    format: 'module'
  }
});
