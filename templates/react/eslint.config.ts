import reactHooks from "eslint-plugin-react-hooks";
import { reactRefresh } from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import globals from "globals";
import base from "./eslint.base.ts";

export default defineConfig([
	base,
	{
		files: ["src/**/*.{ts,tsx}"],
		extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite()],
		languageOptions: { globals: globals.browser },
	},
	{
		files: ["*.config.ts", "eslint.base.ts"],
		languageOptions: { globals: globals.node },
	},
]);
