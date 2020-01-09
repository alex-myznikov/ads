import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

const aliases = ['', 'lists', 'maps', 'queues', 'searches', 'text-processing', 'trees', 'errors', 'comparators'];

export default aliases.map(alias => ({
  input: `dist/esm/${alias ? alias + '/' : ''}index.js`,
  output: [
    {
      file: `dist/bundles/ads-js${alias ? '-' + alias : ''}.js`,
      format: 'umd',
      name: 'adsjs',
      extend: true,
    },
    {
      file: `dist/bundles/ads-js${alias ? '-' + alias : ''}.min.js`,
      format: 'umd',
      name: 'adsjs',
      extend: true,
      plugins: [terser()],
    },
  ],
  plugins: [resolve()],
}));
