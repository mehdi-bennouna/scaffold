import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts"],
	platform: "node",
	target: "node24",
	sourcemap: true,
	deps: { alwaysBundle: [/^@repo\//] },
});
