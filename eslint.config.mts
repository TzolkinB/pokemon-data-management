import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import prettierConfig from 'eslint-config-prettier/flat'

export default defineConfig([
	{
		ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**'],
	},
	{
		files: ['**/*.{ts,mts,cts,tsx}'],
		plugins: { js },
		extends: ['js/recommended', ...tseslint.configs.recommendedTypeChecked, pluginReact.configs.flat.recommended],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	js.configs.recommended,
	{
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react/jsx-uses-react': 'off',
		},
	},
	prettierConfig,
])
