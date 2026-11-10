import { defineConfig } from "eslint/config";
import globals from "globals";
import base from "@repo/eslint-config";

export default defineConfig([
	base,
	{
		languageOptions: { globals: globals.node },
	},
]);
