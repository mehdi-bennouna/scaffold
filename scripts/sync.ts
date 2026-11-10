// Copies every file in shared/ into each template, and removes copies of files that were deleted from shared/.
// synced-files.txt records what the last sync copied, so deleted files can be told apart from template-specific ones.
// With --check, only reports drift (used in CI and pre-commit).
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

const root = join(import.meta.dirname, "..");
const sharedDir = join(root, "shared");
const templatesDir = join(root, "templates");
const manifestPath = join(import.meta.dirname, "synced-files.txt");

// Templates that keep a shared file at another path, or not at all (null).
const destinations: Record<string, Record<string, string | null>> = {
	monorepo: {
		"eslint.base.ts": join("packages", "eslint-config", "eslint.base.ts"),
		"lint-staged.config.ts": join("packages", "lint-staged-config", "lint-staged.base.ts"),
		"pnpm-workspace.yaml": null,
		"tsconfig.base.json": join("packages", "typescript-config", "tsconfig.base.json"),
	},
};

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

// The content each managed file should have, or null when it should not exist.
const expected = new Map<string, Buffer | null>([[manifestPath, Buffer.from(manifest)]]);

for (const template of templates) {
	const targetOf = (file: string): string | undefined => {
		const destination = destinations[basename(template)]?.[file];
		return destination === null ? undefined : join(template, destination ?? file);
	};

	for (const file of sharedFiles) {
		const target = targetOf(file);

		if (target !== undefined) {
			expected.set(target, readFileSync(join(sharedDir, file)));
		}
	}

	for (const file of removedFiles) {
		const target = targetOf(file);

		if (target !== undefined) {
			expected.set(target, null);
		}
	}
}

const drifted = [...expected].filter(([path, content]) =>
	content === null ? existsSync(path) : !existsSync(path) || !readFileSync(path).equals(content),
);

if (process.argv.includes("--check")) {
	if (drifted.length > 0) {
		const list = drifted.map(([path, content]) => `  ${relative(root, path)}${content === null ? " (deleted from shared/)" : ""}`);
		console.error(`Out of sync with shared/ (run \`pnpm sync\`):\n${list.join("\n")}`);
		process.exit(1);
	}
} else {
	for (const [path, content] of drifted) {
		if (content === null) {
			rmSync(path);
			console.log(`removed ${relative(root, path)}`);
		} else {
			mkdirSync(dirname(path), { recursive: true });
			writeFileSync(path, content);
			console.log(`synced ${relative(root, path)}`);
		}
	}
}
