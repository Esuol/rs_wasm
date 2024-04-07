import { defineConfig } from 'vite';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  resolve: {
    alias: [{ find: /^~/, replacement: '' }],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
}) as any;
