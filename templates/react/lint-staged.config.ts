import type { Configuration } from "lint-staged";

export default {
	"*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}": ["pnpm exec eslint --max-warnings 0 --no-warn-ignored", "pnpm exec prettier --check"],
	"*.{json,md,css,html,yml,yaml}": "pnpm exec prettier --check",
	"*.{ts,tsx,mts,cts}": () => "pnpm exec tsc -b",
} satisfies Configuration;
