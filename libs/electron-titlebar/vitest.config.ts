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
    setupFiles: ['./src/__tests__/setup.ts'],
    exclude: [
      ...configDefaults.exclude,
      'src/stories/**',
      'src/**/*.stories.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        ...(configDefaults.coverage.exclude ?? ['node_modules']),
        'src/stories/**',
        'src/**/*.stories.{ts,tsx}',
        'src/**/index.{ts,tsx}',
        'src/main.ts',
        'src/@types/**',
        'src/**/*.d.ts',
        'src/styles/global.ts',
        'src/__tests__/**',
        'src/__mocks__/**',
        'src/**/types.ts',
        'src/**/styles.ts',
      ],
      thresholds: {
        lines: 95,
        functions: 95,
        statements: 95,
        branches: 95,
      },
    }
  }
})
