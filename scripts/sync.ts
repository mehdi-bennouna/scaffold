// Copies every file in shared/ into each template, and removes copies of files that were deleted from shared/.
// synced-files.txt records what the last sync copied, so deleted files can be told apart from template-specific ones.
// With --check, only reports drift (used in CI and pre-commit).
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";

const root = join(import.meta.dirname, "..");
const sharedDir = join(root, "shared");
const templatesDir = join(root, "templates");
const manifestPath = join(import.meta.dirname, "synced-files.txt");
const check = process.argv.includes("--check");

// Templates that keep a shared file at another path, or not at all (null).
const destinations: Partial<Record<string, Partial<Record<string, string | null>>>> = {
	monorepo: {
		"eslint.base.ts": join("packages", "eslint-config", "eslint.base.ts"),
		"lint-staged.config.ts": join("packages", "lint-staged-config", "lint-staged.base.ts"),
		"pnpm-workspace.yaml": null,
		"tsconfig.base.json": join("packages", "typescript-config", "tsconfig.base.json"),
	},
};

function targetOf(template: string, file: string): string | undefined {
	const destination = destinations[basename(template)]?.[file];
	return destination === null ? undefined : join(template, destination ?? file);
}

const sharedFiles = readdirSync(sharedDir, { recursive: true, withFileTypes: true })
	.filter((entry) => entry.isFile())
	.map((entry) => relative(sharedDir, join(entry.parentPath, entry.name)))
	.filter((file) => !file.startsWith(join(".husky", "_")))
	.toSorted();

const manifest = sharedFiles.map((file) => `${file}\n`).join("");
const previousManifest = existsSync(manifestPath) ? readFileSync(manifestPath, "utf8") : "";
const removedFiles = previousManifest.split("\n").filter((file) => file !== "" && !sharedFiles.includes(file));

const templates = readdirSync(templatesDir, { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => join(templatesDir, entry.name));

const drifted: Array<string> = [];

for (const template of templates) {
	for (const file of sharedFiles) {
		const source = join(sharedDir, file);
		const target = targetOf(template, file);

		if (target === undefined || (existsSync(target) && readFileSync(source).equals(readFileSync(target)))) {
			continue;
		}

		if (check) {
			drifted.push(relative(root, target));
		} else {
			cpSync(source, target);
			console.log(`synced ${relative(root, target)}`);
		}
	}

	for (const file of removedFiles) {
		const target = targetOf(template, file);

		if (target === undefined || !existsSync(target)) {
			continue;
		}

		if (check) {
			drifted.push(`${relative(root, target)} (deleted from shared/)`);
		} else {
			rmSync(target);
			console.log(`removed ${relative(root, target)}`);
		}
	}
}

if (previousManifest !== manifest) {
	if (check) {
		drifted.push(relative(root, manifestPath));
	} else {
		writeFileSync(manifestPath, manifest);
	}
}

if (drifted.length > 0) {
	console.error(`Out of sync with shared/ (run \`pnpm sync\`):\n${drifted.map((file) => `  ${file}`).join("\n")}`);
	process.exit(1);
}
