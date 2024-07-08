import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import svgLoader from 'vite-plugin-svgr'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

export default defineConfig({
	plugins: [
		react(),
		libInjectCss(),
		svgLoader(),
		dts()
	],
	resolve: {
		alias: {
			"~": resolve(__dirname, "./src"),
		},
	},
	build: {
		lib: {
			entry: [
				resolve(__dirname, 'src/main.ts'),
				resolve(__dirname, 'src/app/config'),
			],
			formats: ['es', 'cjs'],
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'react/jsx-runtime', resolve(__dirname, 'src/stories')],
			output: {
				// Provide global variables to use in the UMD build
				// Add external deps here
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
					'react/jsx-runtime': 'react/jsx-runtime',
				},
			},
		}
	},
})
