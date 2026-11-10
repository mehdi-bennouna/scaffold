import type { Configuration } from "lint-staged";

export default {
	"*.{js,mjs,cjs,ts,mts,cts,json,md,yml,yaml}": "pnpm exec prettier --check",
} satisfies Configuration;
