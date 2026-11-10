#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";
import { cancel, intro, log, note, outro, select, spinner, text } from "@clack/prompts";
import { downloadTemplate } from "giget";

const REPO = "mehdi-bennouna/scaffold";
const DEFAULT_REF = "master";

const TEMPLATES = {
	node: "Node app, runs .ts natively and bundles with tsdown",
	react: "React + Vite web app",
} as const;

type Template = keyof typeof TEMPLATES;

const USAGE = `Usage: pnpm create @mehdi-bennouna/scaffold [directory] [options]

Options:
  -t, --template <name>  ${Object.keys(TEMPLATES).join(" | ")}
      --ref <ref>        branch, tag or commit to take the template from (default: ${DEFAULT_REF})
      --no-git           skip git init
      --no-install       skip pnpm install
  -h, --help             show this help`;

const interactive = process.stdin.isTTY && process.stdout.isTTY;

const isTemplate = (value: string): value is Template => Object.hasOwn(TEMPLATES, value);

const toPackageName = (name: string): string =>
	name
		.toLowerCase()
		.replace(/[^a-z0-9._~-]+/g, "-")
		.replace(/^[._-]+|-+$/g, "") || "app";

async function ask<T extends string>(missing: string, question: () => Promise<T | symbol>): Promise<T> {
	if (!interactive) {
		throw new Error(`Missing ${missing}.\n\n${USAGE}`);
	}

	const answer = await question();

	if (typeof answer === "symbol") {
		cancel("Cancelled.");
		process.exit(0);
	}

	return answer;
}

function run(command: string, args: ReadonlyArray<string>, cwd: string): boolean {
	return spawnSync(command, args, { cwd, stdio: "inherit" }).status === 0;
}

async function main(): Promise<void> {
	const { values, positionals } = parseArgs({
		allowPositionals: true,
		allowNegative: true,
		options: {
			template: { type: "string", short: "t" },
			ref: { type: "string", default: DEFAULT_REF },
			git: { type: "boolean", default: true },
			install: { type: "boolean", default: true },
			help: { type: "boolean", short: "h", default: false },
		},
	});

	if (values.help) {
		console.log(USAGE);
		return;
	}

	intro("create-scaffold");

	const directory =
		positionals[0] ??
		(await ask("project directory", () =>
			text({
				message: "Project directory",
				placeholder: "my-app",
				validate: (value) => (value === undefined || value.trim() === "" ? "Required" : undefined),
			}),
		));

	const template =
		values.template ??
		(await ask("--template", () =>
			select<Template>({
				message: "Template",
				options: Object.entries(TEMPLATES).map(([value, hint]) => ({ value: value as Template, label: value, hint })),
			}),
		));

	if (!isTemplate(template)) {
		throw new Error(`Unknown template "${template}". Available: ${Object.keys(TEMPLATES).join(", ")}.`);
	}

	const targetDir = resolve(directory);

	if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
		throw new Error(`${directory} already exists and is not empty.`);
	}

	const download = spinner();
	download.start(`Downloading the ${template} template`);

	try {
		await downloadTemplate(`gh:${REPO}/templates/${template}#${values.ref}`, { dir: targetDir });
	} catch (error) {
		download.error(`Could not download the ${template} template`);
		throw error;
	}

	download.stop(`Downloaded the ${template} template`);

	const packageJsonPath = join(targetDir, "package.json");
	const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as Record<string, unknown>;
	packageJson["name"] = toPackageName(basename(targetDir));
	writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, "\t")}\n`);

	const workspacePath = join(targetDir, "pnpm-workspace.yaml");
	const releaseAge = "# Skip releases younger than 3 days\nminimumReleaseAge: 4320\n";

	if (!existsSync(workspacePath)) {
		writeFileSync(workspacePath, releaseAge);
	} else if (!readFileSync(workspacePath, "utf8").includes("minimumReleaseAge")) {
		appendFileSync(workspacePath, `\n${releaseAge}`);
	}

	if (values.git && !run("git", ["init", "--quiet"], targetDir)) {
		log.warn("git init failed. Run it yourself before installing, so the git hooks get set up.");
	}

	const installed = values.install && run("pnpm", ["install"], targetDir);

	if (values.install && !installed) {
		log.warn("pnpm install failed.");
	}

	const cdPath = relative(process.cwd(), targetDir) || ".";
	const steps = [`cd ${/\s/.test(cdPath) ? `"${cdPath}"` : cdPath}`, ...(installed ? [] : ["pnpm install"]), "pnpm dev"];
	note(steps.join("\n"), "Next steps");
	outro("Done");
}

try {
	await main();
} catch (error) {
	cancel(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
}
