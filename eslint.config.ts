import js from "@eslint/js";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { importX } from "eslint-plugin-import-x";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	globalIgnores(["**/dist/**"]),
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
	},
	tseslint.configs.strictTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		files: ["**/*.{js,mjs,cjs}"],
		extends: [tseslint.configs.disableTypeChecked],
	},
	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	{
		languageOptions: { ecmaVersion: "latest" },
		settings: {
			"import-x/resolver-next": [createTypeScriptImportResolver()],
		},
		rules: {
			"import-x/no-duplicates": ["error", { "prefer-inline": true }],
			"import-x/first": "error",
			"import-x/newline-after-import": "error",
			"import-x/no-commonjs": "error",
			"import-x/no-dynamic-require": "warn",
		},
	},
	{
		files: ["**/*.{ts,mts,cts}"],
		rules: {
			"@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
			"@typescript-eslint/no-import-type-side-effects": "error",
			"import-x/named": "off",
			"import-x/namespace": "off",
			"import-x/default": "off",
			"import-x/no-named-as-default-member": "off",
			"import-x/no-unresolved": "off",

			"@typescript-eslint/array-type": ["error", { default: "generic", readonly: "generic" }],
			"@typescript-eslint/consistent-type-definitions": "off",
			"@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "explicit" }],
			"@typescript-eslint/no-empty-object-type": ["error", { allowInterfaces: "with-single-extends" }],
			"@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^_" }],
			"@typescript-eslint/strict-boolean-expressions": [
				"error",
				{
					allowNullableBoolean: true,
					allowNullableString: true,
					allowNumber: false,
				},
			],
			"@typescript-eslint/switch-exhaustiveness-check": "error",
		},
	},
]);
