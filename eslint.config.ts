import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import base from "./shared/eslint.base.ts";

export default defineConfig([
	globalIgnores(["templates/**", "shared/**"]),
	base,
	{
		languageOptions: { globals: globals.node },
	},
]);
