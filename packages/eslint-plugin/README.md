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
  @medusajs/eslint-plugin
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

`@medusajs/eslint-plugin` is the official ESLint plugin for Medusa projects: it enforces Medusa's conventions for API routes, workflows, modules, data models, subscribers, scheduled jobs, admin extensions, and module links as lint rules. Projects created with Medusa v2.16.0 or later already include it with an `eslint.config.ts` file; add it manually to older projects, plugins, or standalone module packages.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/eslint-plugin` |
| Type | Internal tooling |
| Import from | `@medusajs/eslint-plugin` |
| Entry points | `./configs/recommended`, `./configs/strict` |

## Features

- 74 rules under the `@medusajs/` prefix, such as `@medusajs/no-loops-in-workflow` and `@medusajs/route-file-naming`.
- `recommended` preset: the default for Medusa applications. Its rules don't need type information.
- `strict` preset: extends `recommended` with type-aware and cross-file rules. Requires a `tsconfig.json` that includes the linted files.
- `modules` preset: service, module definition, and data model rules for packages that only provide a module or module provider.
- Flat config only. Supports ESLint `^8.57.0 || ^9.0.0 || ^10.0.0` and TypeScript `>=4.8.0`.

## Installation

```bash
npm install --save-dev @medusajs/eslint-plugin eslint jiti
```

`eslint` is a peer dependency. `jiti` lets ESLint load an `eslint.config.ts` file.

## Usage

```ts
import { defineConfig } from "eslint/config"
import medusa from "@medusajs/eslint-plugin"

export default defineConfig([...medusa.configs.recommended])
```

Lint the project with the Medusa CLI:

```bash
npx medusa lint
```

| Flag | Description | Default |
| --- | --- | --- |
| `[paths...]` | Files or directories to lint. | Whole project |
| `--fix` | Auto-fix issues where possible. | `false` |
| `--quiet` | Report errors only. | `false` |

## Resources

- [Medusa ESLint plugin](https://docs.medusajs.com/resources/lint)
- [Rules reference](https://docs.medusajs.com/resources/lint/rules)
- [`medusa lint` command](https://docs.medusajs.com/resources/medusa-cli/commands/lint)
