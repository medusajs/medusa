# @medusajs/http-types-generator

CLI tool that generates and validates TypeScript HTTP types from Zod validator schemas.

## How it works

The tool scans validator files, extracts exported Zod schemas, resolves their TypeScript types, and emits `interface` declarations into output files. It can also check whether existing HTTP type files are structurally compatible with their corresponding Zod schemas.

---

## Usage in the Medusa monorepo

Run from the repo root using the workspace scripts:

```bash
# Generate types for a domain
yarn generate:http-types --domain products --dry-run
yarn generate:http-types --domain products

# Validate all types
yarn validate:http-types

# Validate a single domain
yarn validate:http-types --domain products --verbose
```

The repo root's `http-types.config.json` configures the Medusa-specific paths automatically — no additional setup is needed.

---

## Commands

### `generate`

Generates TypeScript interface files from Zod schemas.

```bash
yarn generate:http-types [options]
```

| Option | Description | Default |
|---|---|---|
| `--area <area>` | Area to process. Must match a key in `validatorGlobs` (`store` or `admin` for monorepo), or `all` for every area. | `all` |
| `--domain <domain>` | Limit to a specific domain (route directory name). | — |
| `--dry-run` | Print what would be generated without writing files. | `false` |
| `--force` | Overwrite existing files instead of merging. | `false` |
| `--verbose` | Print each processed schema. | `false` |

### `validate`

Checks that existing HTTP types are structurally compatible with their Zod schemas.

```bash
yarn validate:http-types [options]
```

| Option | Description | Default |
|---|---|---|
| `--area <area>` | Area to validate. | `all` |
| `--domain <domain>` | Limit to a specific domain. | — |
| `--changed-files <paths>` | Comma-separated list of changed validator files (CI optimisation). | — |
| `--lenient` | Treat `T \| null \| undefined` as compatible with `T \| undefined`. | `false` |
| `--ci` | Exit with code 1 if any failures are found. | `false` |
| `--verbose` | Show passing types in addition to failures. | `false` |

---

## General usage

### Installation

```bash
npm install --save-dev @medusajs/http-types-generator
# or run without installing:
npx @medusajs/http-types-generator generate
```

### Configuration

Place an `http-types.config.json` file in your project root. All fields are optional and are deep-merged over the defaults.

```json
{
  "validatorGlobs": {
    "admin": "src/api/admin/*/validators.ts",
    "store": "src/api/store/*/validators.ts"
  },
  "outputBase": "src/types/http",
  "tsconfig": "tsconfig.json",
  "importSources": {
    "commonRequest": "@medusajs/framework/types",
    "dal": "@medusajs/framework/types"
  },
  "validatorPathPattern": "/api/([^/]+)/([^/]+)/validators\\.ts$",
  "publicPrefixes": ["Admin", "Store"]
}
```

| Field | Description | Default |
|---|---|---|
| `validatorGlobs` | Glob patterns (relative to project root) keyed by area name. | `{ admin: "**/api/admin/*/validators.ts", store: "**/api/store/*/validators.ts" }` |
| `outputBase` | Root directory for generated files, relative to project root. | `"src/types/http"` |
| `tsconfig` | tsconfig filename at the project root used when creating the TypeScript program. | `"tsconfig.json"` |
| `importSources.commonRequest` | Module that exports `FindParams` and `SelectParams`. | `"@medusajs/framework/types"` |
| `importSources.dal` | Module that exports `BaseFilterable` and `OperatorMap`. | `"@medusajs/framework/types"` |
| `validatorPathPattern` | Regex (no surrounding `/`) with two capture groups: `(area, routeDir)`. | `"/api/([^/]+)/([^/]+)/validators\\.ts$"` |
| `publicPrefixes` | Only schemas whose name starts with one of these prefixes are processed. | `["Admin", "Store"]` |

The config file is found by searching upward from the working directory, so it works whether the CLI is invoked from the project root or a subdirectory.

### Validator file conventions

Schemas must be exported from a `validators.ts` file whose path matches `validatorPathPattern`. The pattern must have two capture groups: area and route directory.

```
src/api/admin/products/validators.ts  →  area=admin, routeDir=products
```

Export names must start with one of the `publicPrefixes`. The suffix determines the output file:

- Matches `Params`, `Filters` → `queries.ts`
- Matches `Create`, `Update`, `Batch`, etc. → `payloads.ts`
- Everything else defaults to `payloads.ts`

### Running with npx

```bash
# Generate
npx @medusajs/http-types-generator generate --dry-run
npx @medusajs/http-types-generator generate --domain products

# Validate
npx @medusajs/http-types-generator validate
npx @medusajs/http-types-generator validate --ci
```
