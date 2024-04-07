import { mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';
import wasm from 'vite-plugin-wasm';
import viteConfigBase from './vite.base.config';

// eslint-disable-next-line import/no-default-export
export default mergeConfig(viteConfigBase, {
  plugins: [dts(), wasm()],
});
