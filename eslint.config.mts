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
		extends: [...tseslint.configs.recommendedTypeChecked, pluginReact.configs.flat.recommended],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	{
		files: ['**/*.{ts,tsx}'],
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react/jsx-uses-react': 'off',
		},
	},
	prettierConfig,
])
