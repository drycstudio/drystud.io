import globals from "globals";
import pluginJs from "@eslint/js";
import ts_eslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  {
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  {
    ignores: [
      '/*.mjs',
      '/**/*.js',
      '/*.js',
      '/**/*.d.ts',
      '/*.d.ts',
      '/**/package.json',
      'package.json',
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
  {
    rules: {
      ...pluginJs.configs.rules,
      ...pluginReactConfig.rules,
      "react/react-in-jsx-scope": "off"
    }
  }
];
