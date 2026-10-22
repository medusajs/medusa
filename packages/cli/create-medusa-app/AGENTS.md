# create-medusa-app

The `npx create-medusa-app` scaffolder. It clones a starter, creates a PostgreSQL database, writes `.env`, installs dependencies, runs migrations, creates an admin invite, and starts the app.

## Using this package

```bash
npx create-medusa-app@latest my-store
npx create-medusa-app@latest my-plugin --plugin
npx create-medusa-app@latest my-store --db-url postgres://user:pass@localhost:5432/db --no-browser
```

Options (from `src/index.ts`):

- `[project-name]`: prompted if missing. Names containing `.` are rejected (MikroORM path resolution breaks).
- `--plugin`: clone `medusajs/medusa-starter-plugin` and only install dependencies (no DB, no start).
- `--repo-url <url>`: starter to clone (default `https://github.com/medusajs/dtc-starter`, branch `main`, `--depth 1`).
- `--version <version>`: pin every `@medusajs/*` dependency to this version (except `@medusajs/ui`, which is versioned separately).
- `--skip-db`, `--db-url <url>`, `--no-migrations`, `--no-browser`, `--directory-path <path>`.
- `--with-nextjs-starter`: keep and install `apps/storefront`; otherwise you're prompted, and a "no" deletes it.
- `--use-npm` / `--use-yarn` / `--use-pnpm` (mutually exclusive), `--verbose`.

Docs: https://docs.medusajs.com/resources/create-medusa-app.md and https://docs.medusajs.com/learn/installation.md.

## Architecture

- `src/index.ts`: commander definition. `src/commands/create.ts` calls `ProjectCreatorFactory.create()`.
- `src/utils/project-creator/`: `MedusaProjectCreator` (app) and `PluginProjectCreator` (`--plugin`), both extending `BaseProjectCreator` in `creator.ts`.
- `src/utils/prepare-project.ts`: the setup pipeline (env file, install, `db:migrate`, `user -e admin@medusa-test.com --invite`, publishable key injection into the storefront env).
- `src/utils/project-paths.ts`: the starter is a monorepo; the backend is `apps/backend`, the storefront `apps/storefront`.
- `src/utils/package-manager.ts`: detects npm/yarn/pnpm from `npm_config_user_agent`, sets the `packageManager` field, removes other managers' lockfiles, runs `medusa` commands.
- `src/utils/claude-code-plugin.ts`: offers to install the `medusa-dev@medusa` Claude Code plugin when `~/.claude` or `CLAUDE_CODE` exists and the shell is interactive (skipped when `CI=true`).

## Development

ESM package (`"type": "module"`): relative imports in `src` must use `.js` extensions.

```bash
yarn build                 # tsc
yarn dev                   # node --loader ts-node/esm src/index.ts
yarn test                  # jest over src
../../../node_modules/.bin/jest src/utils/__tests__/package-manager.test.ts
```

Unit tests are in `src/utils/__tests__/`. Jest maps `.js` imports back to `.ts` via `moduleNameMapper` in `jest.config.cjs`.

## Gotchas

- `--seed` is parsed and passed into `prepareProject`, but nothing acts on it: no seed command runs.
- The README's default `--repo-url` (`medusa-starter-default`) is out of date; the code clones `dtc-starter`.
- `logMessage({ type: "error" })` calls commander's `program.error()`, which exits the process. Use `warn` for non-fatal messages.
- The Node version check enforces `MIN_SUPPORTED_NODE_VERSION` (`22.22.0`) in `src/utils/node-version.ts`, even though `package.json` `engines` says `>=14.16`. Keep the constant in sync with Medusa's engine requirement.
- Generated `.env` hardcodes `JWT_SECRET=supersecret` / `COOKIE_SECRET=supersecret`, `REDIS_URL=redis://localhost:6379`, CORS values that include `https://docs.medusajs.com`, and a random `AUTH_MFA_ENCRYPTION_KEY`.
- Migrations are verified by checking for the `mikro_orm_migrations` table. If it's missing, the CLI throws with the command output.
- The browser opens `http://localhost:9000/app/invite?token=...` after polling `http://localhost:9000/health`, so the starter must serve on port 9000.
