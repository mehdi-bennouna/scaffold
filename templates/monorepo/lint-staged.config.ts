import { defineConfig } from "lint-staged/config";

export default defineConfig({
	"*.{js,mjs,cjs,ts,mts,cts,json,md,yml,yaml}": "pnpm exec prettier --check",
});
