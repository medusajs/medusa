# @medusajs/cli

The `medusa` binary. It is a thin yargs front end: it parses commands and flags, then loads the real implementation from the project's installed `@medusajs/medusa` package (`@medusajs/medusa/commands/<name>`).

## Using this package

Run commands from the root of a Medusa application or plugin (`npx medusa <command>`):

| Command | Notable flags |
| --- | --- |
| `develop` | `-H/--host`, `-p/--port` (default `PORT` env or `9000`), `--types` (default `true`), `--lint`, `--fix` |
| `start` | `-H`, `-p`, `--types` (default `false`), `--cluster [n or %]`, `--workers`, `--servers` |
| `build` | `--admin-only` (outputs `.medusa/admin`), `--lint`, `--fix`, `--quiet` |
| `lint [paths...]` | `--fix`, `--quiet` |
| `db:setup` / `db:create` | `--db <name>`, `--no-interactive`; `db:setup` also takes the `db:migrate` link/search flags |
| `db:migrate` | `--skip-scripts`, `--skip-links`, `--skip-search`, `--execute-all-links`, `--execute-safe-links`, `--execute-all-search`, `--execute-safe-search`, `--concurrency <n>`, `--all-or-nothing` |
| `db:generate <modules...>` / `db:rollback <modules...>` | module names are required |
| `db:sync-links` | `--execute-all`, `--execute-safe`, `--concurrency` |
| `db:migrate:scripts`, `db:migrate:search` | run only migration scripts / search index changes |
| `plugin:build`, `plugin:develop`, `plugin:publish`, `plugin:add <names...>`, `plugin:db:generate` | plugin authoring (local registry flow) |
| `user` | `-e/--email`, `-p/--password`, `-i/--id`, `--invite` (prints an invite token instead of creating the user) |
| `exec [file] [args..]` | runs a script's default export with the container |
| `new [root] [starter]` | legacy scaffolder; clones `medusajs/dtc-starter` by default. Prefer `create-medusa-app` |
| `codemod <name>` | `--dry-run`; available: `replace-zod-imports` (rewrites `zod` imports to `@medusajs/framework/zod`) |
| `telemetry` | `--enable`, `--disable` |
| `mcloud [args..]` | forwards to the `mcloud` CLI, offering to install `@medusajs/mcloud` globally if missing |

Global flags: `--verbose`, `--no-color`, `--json`. `medusa -v` prints both CLI and project `@medusajs/medusa` versions.

Docs: https://docs.medusajs.com/resources/medusa-cli.md, plus per-command pages such as https://docs.medusajs.com/resources/medusa-cli/commands/db.md and https://docs.medusajs.com/resources/medusa-cli/commands/plugin.md.

## Architecture

- `cli.js`: bin entry. Registers `ts-node` + `tsconfig-paths` (warns if unavailable outside `NODE_ENV=production`), loads `.env` via `dotenv`, then requires `dist/index.js`.
- `src/create-cli.ts`: every command definition and flag lives here. Handlers call `getCommandHandler("<path>")`, which resolves `@medusajs/medusa/commands/<path>` from the cwd. Command logic belongs in `packages/medusa/src/commands/` (e.g. `db/migrate.ts`, `plugin/build.ts`), not here.
- `src/commands/new.ts`: the only command implemented in this package.
- `src/codemods/`: codemod registry (`index.ts`); each codemod implements `Codemod` from `types.ts`.
- `src/reporter/`: winston/ora based logger used by `new` and `codemod`.

Adding a command: define it in `create-cli.ts`, implement it as `packages/medusa/src/commands/<path>.ts` with a default export, and make sure `@medusajs/medusa`'s `./commands/*` export (`dist/commands/*.js`) covers the path.

## Development

```bash
yarn build                 # rimraf dist && tsc --build
yarn watch
yarn test                  # jest over src
../../../node_modules/.bin/jest src/codemods/__tests__/replace-zod-imports.test.ts
```

Tests live next to the code in `__tests__/` (`commands/__tests__/new.test.ts`, `codemods/__tests__/`, `reporter/__tests__/`). Tests for the actual command implementations are in `packages/medusa/src/commands/**/__tests__`.

## Gotchas

- Any command other than `new` exits with an error unless `./package.json` lists `@medusajs/medusa` or `@medusajs/cli` in dependencies/devDependencies. The `@medusajs/cli` check exists because plugins (e.g. `@medusajs/draft-order`) can't depend on `@medusajs/medusa`.
- Most handlers default `NODE_ENV` to `development` if unset; `start` defaults it to `production`. `user` and `exec` don't set it.
- Long-running handlers (`develop`, `start`, `build`, `user`, `exec`, `plugin:*`, `mcloud`) call the command without awaiting it and return a never-resolving promise, so the wrapper never calls `process.exit`. The command itself must exit the process when done.
- `--lint` defaults to `true` on `build`/`develop` only when `@medusajs/eslint-plugin` resolves from the project directory.
- yargs runs in `.strict()` mode: unknown flags fail and print a "did you mean" suggestion (`src/did-you-mean.ts`). `mcloud` turns on `unknown-options-as-args` so its flags pass through.
- The `new --v2` flag is a leftover and has no effect on the cloned starter.
