# @medusajs/http-types-generator

The `medusa-http-types` CLI. It generates TypeScript HTTP interfaces from the Zod schemas exported by API route `validators.ts` files, and validates that existing interfaces still match those schemas. In this repo it keeps `packages/core/types/src/http` in sync with `packages/medusa/src/api/{admin,store}/*/validators.ts`.

## Using this package

From the repo root (the `dist` build must exist; the scripts run `node dist/index.js`):

```bash
yarn generate:http-types --domain products --dry-run
yarn generate:http-types --domain products
yarn validate:http-types
yarn validate:http-types --domain products --verbose
```

- `generate`: `--area <admin|store|all>`, `--domain <routeDir>`, `--dry-run`, `--force`, `--verbose`.
- `validate`: `--area`, `--domain`, `--changed-files <comma-separated>`, `--lenient`, `--ci` (exit 1 on failure), `--verbose`.
- Config comes from the nearest `http-types.config.json` found by walking up from the cwd; its directory becomes the project root. The repo's root config points output to `packages/core/types/src/http` and imports `FindParams`/`BaseFilterable` from local `packages/core/types` paths.
- Only exports whose name starts with a `publicPrefixes` entry (default `Admin`, `Store`) are processed. Names matching `Params`/`Filters` go to `queries.ts`; everything else goes to `payloads.ts`.

## Architecture

- `src/commands/generate.ts`, `src/commands/validate.ts`: commander subcommands.
- `src/config/index.ts`: `Config.load()` / `Config.get()` singleton. Defaults are deep-merged with the user config.
- `src/core/`: `program-factory` (TS program from the configured tsconfig), `schema-extractor` (Zod exports), `type-resolver` + `type-emitter` (TS types to interface text), `import-tracker`, `compatibility-checker` (validate).
- `src/mapping/path-mapper.ts`: route dir to domain. It singularizes the last hyphen segment (`sales-channels` becomes `sales-channel`); `ENTITY_NAME_OVERRIDES` handles legacy exceptions (e.g. `addresses` maps to `customer`). Output path: `<outputBase>/<domain>/<area>/{payloads,queries}.ts`.
- `src/mapping/name-classifier.ts`, `name-registry.ts`: output file and interface naming.
- `src/utils/file-merger.ts`: new file is created; existing file is merged (only interfaces not already declared are added) unless `--force` overwrites it.
- `src/utils/index-manager.ts`: updates `{domain}/{area}/index.ts`, `{domain}/index.ts` and `<outputBase>/index.ts` barrels.

## Development

```bash
yarn build                 # tsc --build (required before the generate/validate scripts)
yarn test                  # jest --bail --forceExit over src
../../../node_modules/.bin/jest src/__tests__/path-mapper.spec.ts
```

Tests are in `src/__tests__/`; `src/__tests__/utils/` holds helpers and is excluded from test matching.

## Gotchas

- CI (`.github/workflows/validate-http-types.yml`) runs `validate --ci` on PRs that touch `packages/medusa/src/api/**/validators.ts`, `packages/core/types/src/http/**`, or this package. When you change a validator, update or regenerate the matching HTTP type, or CI fails.
- Without `--force`, `generate` never updates an interface that already exists. To pick up schema changes in existing types, edit them by hand or regenerate with `--force` and review the diff.
- Don't add entries to `ENTITY_NAME_OVERRIDES` for new routes. Name the route directory so automatic singularization yields the right domain.
- An invalid `validatorPathPattern` regex throws at config load. An unparsable config file logs a warning and silently falls back to defaults.
