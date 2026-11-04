# @medusajs/oas-github-ci

A private, monorepo-only script (`scripts/build-openapi.js`) that drives `medusa-oas` to regenerate the API reference specs in `www/apps/api-reference/specs/{store,admin}`. It isn't published or meant for Medusa applications.

## Architecture

`scripts/build-openapi.js` runs once for `store`, then for `admin`:

1. Optionally archives the current `specs/<type>/openapi.full.yaml` to `specs/versions/<version>/<type>/openapi.full.yaml` (`--archive-version=<version>`).
2. Runs `medusa-oas oas --type=<type> --out-dir=<dir> --local`, which writes `<type>.oas.json` from `www/utils/generated/oas-output`.
3. Runs `medusa-oas docs --src-file=<type>.oas.json --out-dir=<dir>/<type> --clean --split` (adds `--dry-run` in dry-run mode).
4. With `--with-full-file`, runs `docs` again with `--main-file-name=openapi.full.yaml` to emit the dereferenced single-file spec.

Flags: `--dry-run` writes into a temp dir (`RUNNER_TEMP` or the OS tmp dir) instead of `www/apps/api-reference/specs`. `--with-full-file` and `--archive-version=<v>` are described above.

## Development

```bash
yarn openapi:generate --dry-run      # repo root; root script already passes --with-full-file
yarn openapi:generate                # writes www/apps/api-reference/specs
yarn workspace @medusajs/oas-github-ci preview:admin   # Redocly preview of the committed admin spec
yarn workspace @medusajs/oas-github-ci preview:store
```

Prerequisites: build the repo first (`yarn build`; `medusa-oas --local` reads `@medusajs/medusa/dist`), and refresh `www/utils/generated/oas-output` with `yarn generate:oas` in `www/utils` when route types changed. See `www/apps/api-reference/CLAUDE.md` for the full OAS-to-docs pipeline.

## Gotchas

- CI uses it in two places: `.github/workflows/oas-test.yml` runs `yarn openapi:generate --dry-run` on changes to `www/utils/generated/oas-output/**`, and `.github/workflows/generate-public-references.yml` runs it for real, with `--archive-version=$PREV_VERSION` on releases.
- Archiving must happen before `docs --clean` wipes the output directory. The script does this per API type; keep that order if you edit it.
- `--archive-version` is ignored in `--dry-run`, and is skipped with a log line if the current `openapi.full.yaml` doesn't exist.
- `medusa-oas` is invoked through `execa` with `cwd` set to this package, so it resolves from this workspace's `node_modules/.bin`.
- Any error is caught at the top level, logged, and exits with code 1.
