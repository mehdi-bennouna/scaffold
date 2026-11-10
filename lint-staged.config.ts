import { relative } from "node:path";
import type { Configuration } from "lint-staged";

const rootOnly = (files: ReadonlyArray<string>): Array<string> =>
	files.filter((file) => !/^(templates|shared)[/\\]/.test(relative(import.meta.dirname, file)));

export default {
	"*": () => "node scripts/sync.ts --check",
	"*.ts": (files) => {
		const rootFiles = rootOnly(files);
		return rootFiles.length > 0 ? [`eslint --max-warnings 0 ${rootFiles.join(" ")}`, "tsc -p tsconfig.json"] : [];
	},
	"*.{ts,json,md,yml,yaml}": "prettier --check",
} satisfies Configuration;
