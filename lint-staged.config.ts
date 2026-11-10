import { defineConfig } from "lint-staged/config";

export default defineConfig({
	"{src/**/*,scripts/**/*,*.config}.ts": ["eslint --max-warnings 0", () => "pnpm typecheck"],
	"*.{ts,json,md,yml,yaml}": "prettier --check",
});
