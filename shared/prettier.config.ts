import type { Config } from "prettier";

const config: Config = {
	useTabs: true,
	arrowParens: "always",
	bracketSpacing: true,
	printWidth: 140,
	proseWrap: "always",
	quoteProps: "consistent",
	semi: true,
	singleQuote: false,
	trailingComma: "all",
	endOfLine: "lf",
	tabWidth: 4,
	plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-packagejson"],
	importOrder: [
		"<BUILTIN_MODULES>",
		"<THIRD_PARTY_MODULES>",
		"^@repo/(.*)$",
		"^@/",
		String.raw`^\.\./`,
		String.raw`^\.(?!.*/index$)(?!^\.$)(?!^\./$)\/.+$`,
		String.raw`^\.(/index)?$`,
	],
	importOrderTypeScriptVersion: "6.0.0",
	importOrderCaseSensitive: false,
	overrides: [
		{
			files: "*.jsonc",
			options: {
				trailingComma: "none",
			},
		},
	],
};

export default config;
