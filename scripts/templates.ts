// Runs a pnpm command in every template, each as its own project, stopping at the first failure.
// Usage: node scripts/templates.ts install --no-frozen-lockfile
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(import.meta.dirname, "..");
const templatesDir = join(root, "templates");
const args = process.argv.slice(2);

const templates = readdirSync(templatesDir, { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => join(templatesDir, entry.name));

for (const template of templates) {
	console.log(`\n> ${relative(root, template)}: pnpm ${args.join(" ")}`);
	const { status } = spawnSync("pnpm", args, { cwd: template, stdio: "inherit" });

	if (status !== 0) {
		process.exit(status ?? 1);
	}
}
