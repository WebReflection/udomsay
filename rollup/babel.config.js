import {nodeResolve} from '@rollup/plugin-node-resolve';

export default {
  input: './esm/esx.js',
  plugins: [
    nodeResolve()
  ],
  output: {
    file: './index.js',
    format: 'module'
  }
};
