<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  @medusajs/cli
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/develop/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Medusa is released under the MIT license." />
  </a>
  <a href="https://github.com/medusajs/medusa/blob/develop/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

`@medusajs/cli` provides the `medusa` command used to run, build, and manage a Medusa application or plugin: `medusa develop`, `medusa build`, `medusa db:migrate`, `medusa user`, and more. This package only defines the commands and their flags; apart from `new`, `telemetry`, and `codemod`, each command runs an implementation loaded from the project's installed `@medusajs/medusa` package (`@medusajs/medusa/commands/*`), so it must be run from the root of a project that depends on `@medusajs/medusa` or `@medusajs/cli`. Medusa projects already include it (`@medusajs/framework` declares it as a peer dependency), so you normally run it with `npx medusa <command>` or through the project's `package.json` scripts.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/cli` |
| Type | CLI |
| Binary | `medusa` |

## Installation

Projects created with `create-medusa-app` already include it. To add it to an existing project or plugin:

```bash
npm install --save-dev @medusajs/cli
```

## Usage

From the root of your Medusa project:

```bash
npx medusa develop
npx medusa db:migrate
npx medusa user -e admin@example.com -p supersecret
```

Run `npx medusa --help` or `npx medusa <command> --help` for the full list of options.

## Commands

| Command | Description |
| --- | --- |
| `new [root] [starter]` | Create a new Medusa project from a starter (defaults to `medusajs/dtc-starter`). Prefer `create-medusa-app`. |
| `develop` | Start the development server and restart on file changes. |
| `start` | Start the production server. |
| `build` | Build the application and admin for production. |
| `lint [paths...]` | Lint the project with its ESLint configuration. |
| `user` | Create an admin user or invite. |
| `exec [file] [args..]` | Run the default-exported function of a script file. |
| `db:setup` | Create the database, run migrations, and sync links. |
| `db:create` | Create the database. |
| `db:migrate` | Run pending migrations, migration scripts, and link syncing. |
| `db:migrate:scripts` | Run migration scripts only. |
| `db:migrate:search` | Create and alter the search indexes declared under `search/`. |
| `db:generate [modules...]` | Generate migrations for the given modules. |
| `db:rollback [modules...]` | Roll back the last batch of migrations for the given modules. |
| `db:sync-links` | Sync the database with the module links defined by the application and Medusa core. |
| `plugin:build` | Build a plugin for publishing. |
| `plugin:develop` | Watch a plugin and re-publish it to the local package registry on changes. |
| `plugin:publish` | Publish a plugin to the local package registry. |
| `plugin:add [plugin_names...]` | Install plugins from the local package registry into a project. |
| `plugin:db:generate` | Generate migrations for the modules in a plugin. |
| `codemod <codemod-name>` | Run an automated code transformation, such as `replace-zod-imports`. Supports `--dry-run`. |
| `telemetry` | Enable (`--enable`) or disable (`--disable`) anonymous usage data collection. |
| `mcloud [args..]` | Run Medusa Cloud CLI (`mcloud`) commands. |

## Configuration

### Global options

| Option | Description | Default |
| --- | --- | --- |
| `--verbose` | Turn on verbose output. | `false` |
| `--no-color` | Turn off colored output. | `false` |
| `--json` | Use the JSON logger. | `false` |
| `-v`, `--version` | Show the CLI version and the project's `@medusajs/medusa` version. | - |
| `-h`, `--help` | Show help. | - |

### `develop` and `start`

| Option | Description | Default |
| --- | --- | --- |
| `-H`, `--host` | Host to listen on. | `HOST` env var |
| `-p`, `--port` | Port to listen on. | `PORT` env var, else `9000` |
| `--types` | Generate types for modules inside the `.medusa` directory. | `true` for `develop`, `false` for `start` |
| `--lint` | (`develop` only) Run the linter before starting. Use `--no-lint` to skip. | `true` if `@medusajs/eslint-plugin` is installed |
| `--fix` | (`develop` only) Auto-fix lint issues before starting. | `false` |
| `--cluster` | (`start` only) Run in cluster mode with a number of CPUs or a percentage (e.g. `50%`). | All available CPUs when set without a value |
| `--workers` | (`start` only) Number or percentage of worker processes in cluster mode. | `0` |
| `--servers` | (`start` only) Number or percentage of server processes in cluster mode. | `0` |

### `build`

| Option | Description | Default |
| --- | --- | --- |
| `--admin-only` | Only build the admin, to serve it separately (output in `.medusa/admin`). | `false` |
| `--lint` | Run the linter before building. Use `--no-lint` to skip. | `true` if `@medusajs/eslint-plugin` is installed |
| `--fix` | Auto-fix lint issues before building. | `false` |
| `--quiet` | Report lint errors only. | `false` |

### `db:migrate`

`db:setup` and `db:sync-links` accept the same link options (`db:sync-links` names them `--execute-all` and `--execute-safe`).

| Option | Description | Default |
| --- | --- | --- |
| `--skip-scripts` | Don't run migration scripts. | `false` |
| `--skip-links` | Don't sync links. | `false` |
| `--skip-search` | Don't create or alter search indexes. | `false` |
| `--execute-all-links` / `--execute-safe-links` | Skip prompts and run all (including unsafe) or only safe link sync actions. | Prompts |
| `--execute-all-search` / `--execute-safe-search` | Skip prompts and run all (including unsafe) or only safe search index actions. | Prompts |
| `--concurrency` | Number of migrations to run concurrently. | - |
| `--all-or-nothing` | Fail on the first failed migration and revert the ones already applied. | `false` |

`db:setup` and `db:create` also accept `--db <name>` and `--no-interactive`.

### `user`

| Option | Description | Default |
| --- | --- | --- |
| `-e`, `--email` | User's email. | - |
| `-p`, `--password` | User's password. | - |
| `-i`, `--id` | User's ID. | - |
| `--invite` | Create an invite and print its token instead of creating a user. | `false` |

## Resources

- [Medusa CLI reference](https://docs.medusajs.com/resources/medusa-cli)
- [`db` commands](https://docs.medusajs.com/resources/medusa-cli/commands/db)
- [`plugin` commands](https://docs.medusajs.com/resources/medusa-cli/commands/plugin)
- [`create-medusa-app` reference](https://docs.medusajs.com/resources/create-medusa-app)
