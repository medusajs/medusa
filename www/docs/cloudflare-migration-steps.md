# Cloudflare Migration Steps

This document records all changes made to migrate the Medusa docs site from Vercel to Cloudflare Workers using `@opennextjs/cloudflare`. The migration was done in PR #15388 (commit `4e7034a0a0`) with follow-up fixes on the `docs/migrate-cloudflare` branch.

---

## Architecture

Each of the 7 Next.js apps (`book`, `resources`, `api-reference`, `ui`, `user-guide`, `cloud`, `bloom`) is deployed as its own **Cloudflare Worker** (not Cloudflare Pages) using the `@opennextjs/cloudflare` adapter.

The `book` app continues to act as the central proxy — its `next.config.mjs` rewrites `/resources/*`, `/api/*`, `/ui/*`, `/user-guide/*`, `/cloud/*` to the respective Worker URLs via `NEXT_PUBLIC_*` env vars.

---

## Changes Per App

### 1. `wrangler.jsonc` (added to each app)

Each app got a `wrangler.jsonc` in its root. Key fields:
- `"name"`: the Worker name (e.g. `medusa-docs-book`)
- `"main": ".open-next/worker.js"` — Worker entry point (not `pages_build_output_dir`)
- `"assets.binding": "ASSETS"` — valid in Workers (only reserved in Pages projects)
- `"services"` with `WORKER_SELF_REFERENCE` binding — required by `@opennextjs/cloudflare`
- `"images"` binding
- `"compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"]`
- `"env.production"` with `services` and `images` duplicated (wrangler does not inherit these into environments)

```jsonc
{
  "$schema": "../../node_modules/wrangler/config-schema.json",
  "name": "medusa-docs-book",
  "main": ".open-next/worker.js",
  "compatibility_date": "2024-12-30",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": { "directory": ".open-next/assets", "binding": "ASSETS" },
  "services": [{ "binding": "WORKER_SELF_REFERENCE", "service": "medusa-docs-book" }],
  "images": { "binding": "IMAGES" },
  "vars": {
    "CLOUDFLARE_ENV": "1"
  },
  "env": {
    "production": {
      "services": [{ "binding": "WORKER_SELF_REFERENCE", "service": "medusa-docs-book" }],
      "images": { "binding": "IMAGES" }
    }
  }
}
```

**Additional `vars` per app:**
- `api-reference`: `SPECS_R2_BASE_URL`, `CLOUDFLARE_ENV`
- `resources`: `REFERENCES_R2_BASE_URL`, `CLOUDFLARE_ENV`
- All others: `CLOUDFLARE_ENV`

### 2. `open-next.config.ts` (added to each app)

```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare"
export default defineCloudflareConfig()
```

### 3. `package.json` changes (each app)

Added build/deploy scripts:
```json
{
  "scripts": {
    "build:cloudflare": "opennextjs-cloudflare build",
    "deploy": "opennextjs-cloudflare deploy",
    "preview": "opennextjs-cloudflare preview"
  }
}
```

Added `@opennextjs/cloudflare` as a dev dependency.

**Important**: `deploy` script must NOT include `yarn build:cloudflare &&` — the Cloudflare Worker CI build command runs the build, and the deploy command (`wrangler deploy`) uploads the already-built output. Running build again in deploy causes `next build` to run twice.

### 4. `www/package.json` — monorepo-level build/deploy scripts

Added convenience scripts:
```json
"build:cf:book": "cd apps/book && npx @opennextjs/cloudflare@latest build",
"deploy:cf:book": "cd apps/book && npx @opennextjs/cloudflare@latest build && wrangler deploy"
```

### 5. Cloudflare Worker CI build/deploy commands

For each app, configured in the Cloudflare Worker "Builds" settings:
- **Build command** (run from repo root): `cd ../.. && yarn build:packages && cd apps/<appname> && yarn run build:cloudflare`
- **Deploy command**: `wrangler deploy` (no rebuild — uses already-built `.open-next/worker.js`)
- **Root directory**: `www/apps/<appname>`

`yarn build:packages` compiles workspace packages (`remark-rehype-plugins`, `docs-utils`, etc.) before the app build. Without this, `next.config.mjs` fails to import them.

### 6. Removed `vercel.json` from each app

The `vercel.json` files were deleted. They contained Vercel-specific build config and the Algolia cron for `api-reference`.

Deleted files:
- `www/apps/bloom/vercel.json`
- `www/apps/book/vercel.json`
- `www/apps/api-reference/vercel.json` (also had cron for `/api/algolia`)
- `www/apps/cloud/vercel.json`
- `www/apps/resources/vercel.json`
- `www/apps/ui/vercel.json`
- `www/apps/user-guide/vercel.json`

### 7. Removed `www/ignore-build-script.sh`

This script powered Vercel's `ignoreCommand` to skip builds when unrelated files changed. Not needed on Cloudflare (branch-based preview triggers handle this).

### 8. Added `public/_headers` to each app

Adds CORS and cache headers for static assets:
```
/*
  Access-Control-Allow-Origin: *
```

---

## Fixing `fs`-based API Routes

Cloudflare Workers run in V8 isolates — `fs` is unavailable at runtime. All routes that read files from disk were refactored.

### `workerCompatibleFetch` utility

Added `www/packages/docs-utils/src/worker-compatible-fetch.ts`:

```typescript
export async function workerCompatibleFetch<T>({ url, responseTransformer, fallbackAction, useRemote }) {
  const shouldFetch = useRemote || /^https?:\/\//.test(url)
  if (shouldFetch) {
    const res = await fetch(url)
    return await responseTransformer(res)
  }
  return fallbackAction()
}
```

- When `url` starts with `https://` (R2 URL) or `useRemote` is true: fetches via HTTP
- Otherwise: calls `fallbackAction` (local filesystem, for dev only)

### `md-content/[[...slug]]/route.ts` (all apps)

The route serves raw MDX source. Changed to:
- Check `CLOUDFLARE_ENV` to determine if running on Cloudflare
- Use `workerCompatibleFetch` with `useRemote: !!process.env.CLOUDFLARE_ENV`
- On Cloudflare: fetch file from a URL constructed relative to the app's base path
- On local/Vercel: read from filesystem

### `api/references/[...slug]/route.ts` (resources)

Loads reference MDX from `references/` directory:
- On Cloudflare: fetch from R2 using `NEXT_PUBLIC_REFERENCES_R2_BASE_URL` (build-time) and `REFERENCES_R2_BASE_URL` (runtime)
- Plugin options use `basePath: "/www/apps/resources"` (fixed path, not `process.cwd()`)

### `app/schema/route.ts`, `app/download/[area]/route.ts`, `app/base-specs/route.ts` (api-reference)

Fetch OpenAPI spec files:
- Added `utils/get-path-for-env.ts` — uses `/` joining when `SPECS_R2_BASE_URL` is set, `path.join` otherwise
- `SPECS_R2_BASE_URL` runtime var → fetches specs from R2

### `utils/dereference.ts` (api-reference)

`@readme/openapi-parser` uses Node.js `https.get` internally. Overrode its HTTP resolver with a custom `fetchHttpResolver` that uses the global `fetch()` API.

---

## R2 Storage Setup

Three R2 buckets (or path prefixes within one bucket) were set up:

| App | Bucket/prefix | Env var | Content |
|-----|---------------|---------|---------|
| `api-reference` | `docs-api-reference` | `SPECS_R2_BASE_URL` | `specs/` directory (OpenAPI YAML files, ~2300 files, 24MB) |
| `resources` | `docs-resources/references` | `REFERENCES_R2_BASE_URL` | `references/` directory (TypeDoc MDX output) |
| `ui` | `docs-ui/specs` | `UI_SPECS_R2_BASE_URL` | `specs/` directory (component specs) |

### Upload scripts added

- `www/apps/api-reference/scripts/upload-specs-to-r2.mjs`
- `www/apps/resources/scripts/upload-references-to-r2.mjs`
- `www/apps/ui/scripts/upload-specs-to-r2.mjs`

### GitHub Actions workflows added

- `.github/workflows/sync-api-reference-specs-to-r2.yml` — syncs `specs/` to R2 on push
- `.github/workflows/sync-resources-references-to-r2.yml` — syncs `references/` to R2 on push
- `.github/workflows/sync-ui-specs-to-r2.yml` — syncs `specs/` to R2 on push
- `.github/workflows/algolia-api-indexer.yml` — replaces the Vercel cron; runs Algolia indexing on a schedule

---

## `VERCEL_ENV` → `CLOUDFLARE_ENV`

All occurrences of `process.env.VERCEL_ENV === "production"` and `process.env.CF_PAGES === "1"` were replaced with `!!process.env.CLOUDFLARE_ENV`. The `CLOUDFLARE_ENV=1` var is set in each app's `wrangler.jsonc` `vars` block.

Files changed (~24 occurrences across):
- `www/apps/*/next.config.mjs`
- `www/apps/*/app/md-content/[[...slug]]/route.ts`
- `www/apps/*/scripts/prepare.mjs`
- `www/apps/resources/utils/fetch-mdx-content.ts`
- `www/apps/book/utils/fetch-raw-mdx.ts`
- `www/apps/book/utils/get-clean-md-cached.ts`
- `www/packages/docs-utils/src/worker-compatible-fetch.ts`

---

## Environment Variables Reference

### Build-time (set in Cloudflare Worker build settings)

| Variable | Apps | Purpose |
|----------|------|---------|
| `NEXT_PUBLIC_REFERENCES_R2_BASE_URL` | resources | R2 URL for fetching references (inlined by Next.js) |
| `NEXT_PUBLIC_*` (all existing) | all | Inlined by Next.js `next build`; must be present at build time |

### Runtime (set in `wrangler.jsonc` `vars` or as Worker secrets)

| Variable | Apps | Purpose |
|----------|------|---------|
| `CLOUDFLARE_ENV` | all | Signals Cloudflare runtime; enables remote fetch paths |
| `SPECS_R2_BASE_URL` | api-reference | Base URL for OpenAPI spec files in R2 |
| `REFERENCES_R2_BASE_URL` | resources | Base URL for references directory in R2 |
| `UI_SPECS_R2_BASE_URL` | ui | Base URL for UI component specs in R2 |
| `LOOPS_API_KEY` | book | Email service (runtime, not build-time) |

---

## `next.config.mjs` Rewrites Changes (book app)

`@opennextjs/cloudflare` requires Next.js rewrites to use named capture groups instead of wildcard `:path*` patterns. The `book` app's internal md-content rewrites were updated to comply.

### Before

```js
// source patterns used a single :path* capture
{ source: "/:path((?!resources|api|...).+)/", destination: "/md-content/:path" }
{ source: "/:path((?!resources|api|...).+)",  destination: "/md-content/:path" }
// index routes excluded sub-apps in the pattern
{ source: "/:path((?!resources|api|...)*)index.html.md" }
{ source: "/:path((?!resources|api|...)*)index.md" }
{ source: "/:path((?!resources|api|...).*).md" }
```

### After

```js
// split into :first + :rest* to satisfy open-next's named-segment requirement
{ source: "/:first((?!resources|api|ui|user-guide|cloud|md-content)[^/]+)/:rest*/", destination: "/md-content/:first/:rest*" }
{ source: "/:first((?!resources|api|ui|user-guide|cloud|md-content)[^/]+)/:rest*",  destination: "/md-content/:first/:rest*" }
// index routes simplified (sub-app exclusion handled by fallback ordering)
{ source: "/index.html.md",       destination: "/md-content" }
{ source: "/index.md",            destination: "/md-content" }
{ source: "/:path*/index.html.md" }
{ source: "/:path*/index.md" }
{ source: "/:path*.md" }
```

### `outputFileTracingRoot` and `outputFileTracingExcludes`

Also added to `book/next.config.mjs` to prevent sibling apps from being traced into the bundle:

```js
outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
outputFileTracingExcludes: {
  "*": [
    "node_modules/@medusajs/icons",
    "../**/.open-next/**",   // exclude Cloudflare build output from other apps
    "../!(book)/.next/**",   // exclude sibling app .next directories
  ],
},
```

---

## remark/rehype Plugin Changes

The link-fixer plugins (`typeListLinkFixerPlugin`, `workflowDiagramLinkFixerPlugin`, `prerequisitesLinkFixerPlugin`, `localLinksRehypePlugin`) were updated to:
- Accept `r2BaseUrl` option — when set, fetches linked MDX files from R2 to read frontmatter slugs
- Accept `basePath` as a fixed string instead of relying on `process.cwd()`
- Use `workerCompatibleFetch` for remote slug resolution
- Fall back to path-based URL generation (no filesystem read) when R2 is unavailable

### `fix-link.ts` changes

- `getFileSlugSync` failures are caught and fall through to path-based URL generation
- Path stripping uses the provided `basePath` string rather than `process.cwd()`

---

## Algolia Route Changes (api-reference)

The `/api/algolia/route.ts` route was **deleted**. It used `JSDOM` (Node.js-only) to crawl rendered HTML for indexing, which cannot run in Cloudflare Workers.

Replacement: a standalone GitHub Actions workflow (`.github/workflows/algolia-api-indexer.yml`) runs the indexing script (`www/apps/api-reference/scripts/index-algolia.mjs`) on a cron schedule (Thursdays at midnight UTC), replacing the Vercel cron trigger.

---

## Cloudflare Worker Preview Branch Control

A script (`www/scripts/cf-set-preview-branch.sh`) was added to restrict preview builds to `docs/*` branches via the Cloudflare Builds API, using env vars:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `WORKER_NAME`

---

## Known Issues / Remaining Work at Time of Revert

1. **`NEXT_PUBLIC_REFERENCES_R2_BASE_URL`** must be set as a build-time env var in Cloudflare Worker build settings (it's inlined by Next.js at build time).
2. **R2 buckets must be pre-populated** before deploying — the sync GitHub Actions workflows handle this on push, but the initial upload must be done manually via `wrangler r2 object put`.
3. **`posthog-node`** produces build-time warnings about `process.exit` and `CompressionStream` in Edge Runtime — these are warnings only and do not affect runtime behavior.
4. **`UI_SPECS_R2_BASE_URL`** is needed as both a build-time var (used in `next.config.mjs`) and a runtime var (used in the md-content route handler).
