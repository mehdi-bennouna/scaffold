// Runs pnpm commands in every template, each as its own project, stopping at the first failure.
// Usage: node scripts/templates.ts "install --no-frozen-lockfile" typecheck
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(import.meta.dirname, "..");
const templatesDir = join(root, "templates");

const templates = readdirSync(templatesDir, { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => join(templatesDir, entry.name));

for (const command of process.argv.slice(2)) {
	for (const template of templates) {
		console.log(`\n> ${relative(root, template)}: pnpm ${command}`);
		const { status } = spawnSync("pnpm", command.split(" "), { cwd: template, stdio: "inherit" });

		if (status !== 0) {
			process.exit(status ?? 1);
		}
	}
}
