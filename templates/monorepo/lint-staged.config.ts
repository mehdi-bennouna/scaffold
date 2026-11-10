import { defineConfig } from "lint-staged/config";

export default defineConfig({
	"{apps,packages}/!(*-config)/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}": "pnpm exec eslint --max-warnings 0 --no-warn-ignored",
	"*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,json,md,css,html,yml,yaml}": "pnpm exec prettier --check",
	"*.{ts,tsx,mts,cts}": () => "pnpm typecheck",
});
