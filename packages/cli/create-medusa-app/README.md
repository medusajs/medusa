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
  create-medusa-app
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

`create-medusa-app` is the CLI that scaffolds a new Medusa application (backend and admin, with an optional Next.js storefront) or a Medusa plugin project in a single command. Use it to start a new project; run it with `npx` rather than installing it. To work with an existing project, use the `medusa` CLI from [`@medusajs/cli`](https://github.com/medusajs/medusa/tree/develop/packages/cli/medusa-cli) instead.

## At a glance

| | |
| --- | --- |
| Package | `create-medusa-app` |
| Type | CLI |
| Binary | `create-medusa-app` |

## Features

- Clones the [`medusajs/dtc-starter`](https://github.com/medusajs/dtc-starter) project, or [`medusajs/medusa-starter-plugin`](https://github.com/medusajs/medusa-starter-plugin) with `--plugin`.
- Creates a local PostgreSQL database, runs migrations, creates an admin user, and opens the Medusa Admin in the browser.
- Optionally sets up the Next.js storefront alongside the backend.
- Uses the package manager you run it with (npm, yarn, or pnpm), or the one you force with a flag.

## Usage

Requires Node.js v22.22.0 or later, Git, and PostgreSQL (unless you pass `--skip-db` or `--db-url`).

```bash
npx create-medusa-app@latest my-store
```

Create a plugin project instead:

```bash
npx create-medusa-app@latest my-plugin --plugin
```

If you omit `project-name`, the CLI prompts for it.

## Configuration

| Option | Description | Default |
| --- | --- | --- |
| `[project-name]` | Name of the project directory to create. | Prompted |
| `--plugin` | Create a plugin project instead of a Medusa application. | `false` |
| `--repo-url <url>` | Repository to clone instead of the default starter. | `https://github.com/medusajs/dtc-starter` (`https://github.com/medusajs/medusa-starter-plugin` with `--plugin`) |
| `--version <version>` | Version of the Medusa packages to install. | Starter's versions |
| `--seed` | Seed the database with demo data. | `false` |
| `--skip-db` | Skip creating the database, running migrations, and seeding. Also skips opening the browser. | `false` |
| `--db-url <url>` | Use an existing database instead of creating one. Migrations still run. | - |
| `--no-migrations` | Skip migrations, admin user creation, and seeding. Use with a `--db-url` that is already migrated. | Migrations run |
| `--no-browser` | Don't open the browser at the end; only print the success message. | Browser opens |
| `--directory-path <path>` | Directory to create the project in. | Current directory |
| `--with-nextjs-starter` | Install the Next.js storefront without prompting. | Prompted |
| `--use-npm` / `--use-yarn` / `--use-pnpm` | Force a package manager. Mutually exclusive. | Detected from the invoking package manager |
| `--verbose` | Show the logs of the underlying commands. | `false` |

## Resources

- [create-medusa-app reference](https://docs.medusajs.com/resources/create-medusa-app)
- [Installation guide](https://docs.medusajs.com/learn/installation)
- [create-medusa-app troubleshooting](https://docs.medusajs.com/resources/troubleshooting/create-medusa-app-errors)
- [Plugins](https://docs.medusajs.com/learn/fundamentals/plugins)
