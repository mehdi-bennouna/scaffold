import { defineConfig } from "lint-staged/config";

export default defineConfig({
	"*": () => "pnpm sync:check",
	"{src/**/*,scripts/**/*,*.config}.ts": ["eslint --max-warnings 0", () => "tsc -p tsconfig.json"],
	"*.{ts,json,md,yml,yaml}": "prettier --check",
});
