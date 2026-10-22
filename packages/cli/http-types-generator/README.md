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
  @medusajs/http-types-generator
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

`@medusajs/http-types-generator` is a CLI that generates TypeScript HTTP request types (payload and query interfaces) from the Zod schemas in API route `validators.ts` files, and validates that existing HTTP types still match those schemas. The Medusa monorepo uses it to keep `@medusajs/types` HTTP types in sync with the `@medusajs/medusa` API validators; you can also run it in your own project to type custom `/admin` and `/store` routes.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/http-types-generator` |
| Type | Internal tooling |
| Binary | `medusa-http-types` |

## Installation

```bash
npm install --save-dev @medusajs/http-types-generator
```

## Usage

In the Medusa monorepo, run the root workspace scripts. The root `http-types.config.json` already points the tool at the monorepo paths:

```bash
yarn generate:http-types --domain products --dry-run
yarn generate:http-types --domain products
yarn validate:http-types --domain products --verbose
```

In your own project:

```bash
npx medusa-http-types generate --dry-run
npx medusa-http-types validate --ci
```

Only schemas exported from a `validators.ts` file matching `validatorPathPattern` whose names start with a `publicPrefixes` entry are processed. Each schema becomes an interface in `<outputBase>/<domain>/<area>/queries.ts` (names ending in `Params` or `Filters`, and `AdminGet*` / `StoreGet*`) or `payloads.ts` (everything else, such as `Create*` and `Update*` bodies), where `<domain>` is the singular of the route directory (e.g. `products` -> `product`).

## Commands

### `generate`

Generates TypeScript interfaces from Zod schemas. Without `--force`, existing files are kept and only missing interfaces are added.

| Option | Description | Default |
| --- | --- | --- |
| `--area <area>` | Area to process: a key of `validatorGlobs` (`admin`, `store`) or `all`. | `all` |
| `--domain <domain>` | Limit to one route directory (e.g. `products`). | - |
| `--dry-run` | Print what would be generated without writing files. | `false` |
| `--force` | Overwrite existing files instead of merging into them. | `false` |
| `--verbose` | Print each processed schema. | `false` |

### `validate`

Checks that existing HTTP types are structurally compatible with their Zod schemas.

| Option | Description | Default |
| --- | --- | --- |
| `--area <area>` | Area to validate. | `all` |
| `--domain <domain>` | Limit to one route directory. | - |
| `--changed-files <paths>` | Comma-separated list of changed validator files to check. | - |
| `--lenient` | Treat `T \| null \| undefined` as compatible with `T \| undefined`. | `false` |
| `--ci` | Exit with code 1 if any check fails. | `false` |
| `--verbose` | Show passing types in addition to failures. | `false` |

## Configuration

Add an optional `http-types.config.json`. The CLI uses the nearest one found by searching upward from the working directory, treats its directory as the project root, and deep-merges it over the defaults.

```json
{
  "validatorGlobs": {
    "admin": "src/api/admin/*/validators.ts",
    "store": "src/api/store/*/validators.ts"
  },
  "outputBase": "src/types/http"
}
```

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `validatorGlobs` | `Record<string, string>` | Validator file globs keyed by area, relative to the project root. | `{ "admin": "**/api/admin/*/validators.ts", "store": "**/api/store/*/validators.ts" }` |
| `outputBase` | `string` | Output directory for generated files, relative to the project root. | `"src/types/http"` |
| `tsconfig` | `string` | tsconfig file used to resolve the schema types. | `"tsconfig.json"` |
| `importSources.commonRequest` | `string` | Module that exports `FindParams` and `SelectParams`. | `"@medusajs/framework/types"` |
| `importSources.dal` | `string` | Module that exports `BaseFilterable` and `OperatorMap`. | `"@medusajs/framework/types"` |
| `validatorPathPattern` | `string` | Regex (no surrounding `/`) with two capture groups: area and route directory. | `"/api/([^/]+)/([^/]+)/validators\\.ts$"` |
| `publicPrefixes` | `string[]` | Only schemas whose export name starts with one of these are processed. | `["Admin", "Store"]` |
