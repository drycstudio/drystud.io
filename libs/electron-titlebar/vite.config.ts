import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import svgLoader from 'vite-plugin-svgr';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import rm from 'rollup-plugin-rm'

import packages from './package.json';

const external = ['esbuild', ...Object.keys(packages.dependencies || {}), ...Object.keys(packages.peerDependencies || {})]

export default defineConfig({
  plugins: [react(), libInjectCss(), svgLoader(), dts({ include: ['src'], insertTypesEntry: true })],
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: {
        main: resolve(__dirname, 'src/main.ts'),
        config: resolve(__dirname, 'src/config/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', resolve(__dirname, 'src/stories'), ...external],
      plugins: [rm("dist", "buildStart"), rm("types", "buildEnd")],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
