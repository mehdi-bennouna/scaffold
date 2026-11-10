import type { Configuration } from "lint-staged";

export default {
	"*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}": ["eslint --max-warnings 0", "prettier --check"],
	"*.{json,md,css,html,yml,yaml}": "prettier --check",
	"*.{ts,tsx,mts,cts}": () => "tsc -b",
} satisfies Configuration;
