import pluginRouter from "@tanstack/eslint-plugin-router";
import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import base from "@repo/eslint-config";

export default defineConfig([
	globalIgnores(["src/routeTree.gen.ts"]),
	base,
	{
		files: ["src/**/*.{ts,tsx}"],
		extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite(), pluginRouter.configs["flat/recommended"]],
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
	},
	{
		// Route files export a `Route` object and keep their components local, a shape this rule always flags.
		files: ["src/routes/**"],
		rules: { "react-refresh/only-export-components": "off" },
	},
	{
		files: ["*.config.ts"],
		languageOptions: { globals: globals.node },
	},
]);
