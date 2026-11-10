# @mehdi-bennouna/create-scaffold

Start a TypeScript project with strict type-checking, linting, formatting and git hooks already set up.

```sh
pnpm create @mehdi-bennouna/scaffold my-app --template react
```

Leave out the directory or the template and you'll be asked for them.

## Templates

| Template   | What it is                                                                                        | Scripts                                                  |
| ---------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `node`     | Node 24 app bundled with tsdown. `dev` rebuilds and restarts the app on every change.             | `dev`, `build`, `start`, `typecheck`, `lint`, `format`   |
| `react`    | React 19 web app on Vite.                                                                         | `dev`, `build`, `preview`, `typecheck`, `lint`, `format` |
| `monorepo` | pnpm workspace run with Turborepo, holding a Node API, a TanStack Start app and a shared library. | `dev`, `build`, `typecheck`, `lint`, `format`            |

In the monorepo, `apps/api` is a Node HTTP server bundled with tsdown and `apps/web` is a TanStack Start app. Both import `packages/utils`,
which needs no build step: each app compiles it from source, and `dev` picks up its changes. The ESLint, TypeScript and lint-staged config
lives in `@repo/*-config` packages that every app and package extends, and the root scripts run each task across all of them.

## What every project gets

- **TypeScript** in its strictest setup: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `erasableSyntaxOnly` and more.
- **ESLint** with typescript-eslint's strict and stylistic type-checked rules and import checks. The React apps add the hooks and
  fast-refresh rules, and the TanStack Start app adds TanStack Router's rules.
- **Prettier**, which also sorts imports and `package.json` keys.
- **Git hooks.** Before each commit, ESLint and Prettier check the staged files and `tsc` typechecks the project. Commit messages must
  follow [Conventional Commits](https://www.conventionalcommits.org).
- **pnpm with Node 24**, both pinned in `devEngines` (pnpm downloads them when needed). pnpm skips package versions published less than 3
  days ago.

## CLI options

| Option                  | Description                                                         |
| ----------------------- | ------------------------------------------------------------------- |
| `-t, --template <name>` | `node`, `react` or `monorepo`                                       |
| `--ref <ref>`           | Branch, tag or commit to take the template from (default: `master`) |
| `--no-git`              | Skip `git init`                                                     |
| `--no-install`          | Skip `pnpm install`                                                 |

The CLI downloads the template from this repo, names the package after the directory, then runs `git init` and `pnpm install`, which also
sets up the git hooks.
