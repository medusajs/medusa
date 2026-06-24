# @medusajs/eslint-plugin

Official ESLint plugin for Medusa projects. Codifies Medusa's framework conventions into automatically-enforced static checks across API routes, modules, workflows, subscribers, scheduled jobs, admin extensions, and module links.

> Status: pre-release. The plugin currently ships with no rules — only the package scaffold and `recommended` / `strict` config shapes. Rules will land incrementally; see `MEDUSA_LINT_RULES_CATALOG.md` at the repo root for the planned set.

## Installation

```bash
npm install -D @medusajs/eslint-plugin eslint
```

`eslint` is a peer dependency — install it in the consuming project.

## Usage (flat config)

```js
// eslint.config.js
import medusa from "@medusajs/eslint-plugin"

export default [...medusa.configs.recommended]
```

## Configs

- `recommended` — default preset for Medusa projects.
- `strict` — extends `recommended` and enables stricter, opt-in heuristics.

## Development

```bash
yarn workspace @medusajs/eslint-plugin build
yarn workspace @medusajs/eslint-plugin test
```
