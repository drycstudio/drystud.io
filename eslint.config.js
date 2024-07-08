import globals from "globals";
import pluginJs from "@eslint/js";
import ts_eslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";


export default [
	{ files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
	{
		ignores: [
			'/*.mjs',
			'**/*.js',
			'/*.js',
			'**/*.d.ts',
			'/*.d.ts',
			'node_modules',
			'build',
			'dist'
		]
	},
	{ languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...ts_eslint.configs.recommended,
	...fixupConfigRules(pluginReactConfig),
];
