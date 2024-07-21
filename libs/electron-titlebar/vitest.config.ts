import { resolve } from 'node:path'
import { configDefaults, defineConfig } from 'vitest/config'
import svgLoader from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [svgLoader()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [
      ...configDefaults.exclude,
      'src/stories/**.{ts,tsx}',
      'src/**/*.stories.{ts,tsx}',
      'src/**/index.{ts,tsx}',
    ],
    coverage: {
      exclude: [
        ...(configDefaults.coverage.exclude || ['node_modules']),
        'src/stories/**.{ts,tsx}',
        'src/**/*.stories.{ts,tsx}',
        'src/**/index.{ts,tsx}',
      ]
    }
  }
})
