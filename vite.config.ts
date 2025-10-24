import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import path from 'path';

const useClientDirectiveRE = /^(['"])use client\1;\s*/;

const stripUseClientDirective = (): Plugin => ({
  name: 'strip-use-client-directive',
  enforce: 'pre',
  transform(code, id) {
    if (!id.includes('node_modules/framer-motion') && !id.includes('node_modules/motion')) {
      return null;
    }

    if (useClientDirectiveRE.test(code)) {
      return code.replace(useClientDirectiveRE, '');
    }

    return null;
  }
});

export default defineConfig({
  plugins: [stripUseClientDirective()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  esbuild: {
    jsx: 'automatic',
  },
  server: {
    port: 3000,
    open: true,
  },
});
