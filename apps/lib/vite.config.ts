import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import svgLoader from 'vite-plugin-svgr';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

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
      external: ['react', 'react-dom', 'react/jsx-runtime', resolve(__dirname, 'src/stories')],
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
