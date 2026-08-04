# API Reference App

Next.js (App Router) site that renders the Medusa **Store** and **Admin** REST API references. Deployed to Cloudflare via OpenNext, served under the `basePath` `/api` (e.g. `https://docs.medusajs.com/api/store`).

## Pipeline: from OAS to public docs

```
packages/medusa/src/api  (API route request/response types = source of truth)
        │  OAS CLI (www/utils, `yarn generate:oas`) + automated "Updated API Reference" job
        ▼
apps/api-reference/specs/{area}/         ← committed spec input for this app
  ├── openapi.yaml            base doc: info, tags (name, description, x-associatedSchema), security
  ├── openapi.full.yaml       fully dereferenced doc (used by the download route)
  ├── paths/*.yaml            one file per endpoint (method → operation)
  ├── components/schemas/     referenced schemas
  └── code_samples/           x-codeSamples
        │  `yarn prep` → scripts/prepare.mjs
        ▼
generated/*.mjs                          ← committed build artifacts
  ├── api-ref-paths.mjs       paths + old-hash→new-path redirects + intro sections  (scripts/generate-specs-manifest.mjs)
  ├── specs-tag-index.mjs     { area: { tagSlug: [pathFile,...] } }                  (lazy-load lookup)
  ├── specs-sitemap-data.mjs  ordered tags + operation ids per area
  └── generated-{store,admin}-sidebar.mjs   full sidebar tree                         (build-scripts → get-api-ref-sidebar-children.ts)
        │  next build / next dev
        ▼
Rendered pages (dynamic SSR) + client hydration
```

The spec **structure** (parameters, request/response bodies, schemas, security) is generated from the request/response types of the API routes in `packages/medusa/src/api` — there are **no** `@oas` comments. The one thing you can hand-edit is **descriptions**. Everything else under `specs/`, and all of `generated/`, must be regenerated rather than hand-edited (see [Regenerating](#regenerating)).

## URL structure

Real page paths (no hash anchors). All under `basePath` `/api`:

| Page | Path | Rendered by |
|---|---|---|
| Area intro / index | `/api/{area}` | `app/[area]/page.tsx` |
| Intro section | `/api/{area}/{section}` | `app/[area]/[section]/layout.tsx` |
| Tag | `/api/{area}/{tag}` | `app/[area]/[section]/layout.tsx` |
| Operation | `/api/{area}/{tag}/{operation}` | `app/[area]/[section]/layout.tsx` |
| Tag schema | `/api/{area}/{tag}/schema` | `app/[area]/[section]/layout.tsx` |

`{area}` = `store` | `admin`. Intro sections and tags share the `[section]` segment. **The section content (intro MDX, or the tag with all its operations via `<Tags>`) is rendered by `[section]/layout.tsx`, not the pages.** The layout resolves an intro slug first (`getIntroSection`), otherwise treats it as a tag (`getTagBySlug`). Only tags have a third `[operation]` segment.

Why a layout: navigating between a tag (`/carts`) and its operations (`/carts/get-a-cart`) only swaps the (empty) page segment, so the layout — and the mounted `<Tags>` with its loaded operations — is preserved and the browser just scrolls, instead of remounting/reloading the whole tag. The `[section]/page.tsx` and `[operation]/page.tsx` files render `null` and exist only for the route + `generateMetadata`. Scrolling to the active operation is handled client-side by `Tags/Operation` reacting to the active path.

Routes are `export const dynamic = "force-dynamic"` — they render per request (matching the R2/self-fetch data model), so each URL is a real server-rendered document with its own `generateMetadata`.

## Slug logic (single source of truth)

Slugs are computed **once** by shared helpers in `packages/docs-utils/src/api-ref-paths.ts` and materialized into `generated/api-ref-paths.mjs`. Everything else (site, sidebar, sitemap, redirect map, TSDoc codemod) reads from there — never recompute slugs ad hoc.

- **Intro slug** = `getApiRefIntroSlug(heading)` (= old `getSectionId([heading])`), e.g. `Authentication` → `authentication`.
- **Tag slug** = `getApiRefTagSlug(tag.name)`, e.g. `Gift Cards` → `gift-cards`.
- **Operation slug** = `getApiRefOperationSlug(op)` = slugify of `x-sidebar-summary` → `summary` → `operationId`, e.g. `Get a Cart` → `get-a-cart`, `Add Line Item` → `add-line-item`. De-duplicated **within a tag** (`getApiRefTagOperationSlugs`, `-2`/`-3` suffixes), reserved word `schema` excluded.
- **Path builder** = `getApiRefPath({ area, section, operationSlug? })` → `/store/carts/get-a-cart` (no basePath; `next/link` adds `/api`).

Operation slugs are **summary-derived**, so editing a summary changes the URL. `apiRefRedirects` is regenerated every build to absorb renames; set `x-sidebar-summary` to pin a slug. The generator warns on intro-vs-tag slug collisions.

`utils/api-ref-paths.ts` re-exports the generated `.mjs` with proper types (the raw `.mjs` has non-indexable literal types) — import maps from `@/utils/api-ref-paths`, not the `.mjs` directly.

## Rendering & data flow (hybrid model)

A tag renders the **whole tag** (all operations) on one scrollable page; the operation URL just scrolls to the operation. Pipeline (all reuse the same components):

1. `[section]/layout.tsx` (server) fetches `getBaseSpecs(area)` (`lib/index.ts` → `/base-specs` route, tags + metadata only), wraps content in `BaseSpecsProvider` + `AreaProvider` + `PageTitleProvider`, and renders `<Tags tags={[tag]}/>` (or the intro MDX). It stays mounted across tag↔operation navigation.
2. `<Tags tags={[tag]}/>` → `components/Tags/Section` renders the tag heading and **lazy-loads** its operations via SWR `GET /tag?tagName={slug}&area={area}` (`app/tag/route.ts` → `utils/get-paths-of-tag.ts`).
3. `get-paths-of-tag.ts` reads the tag's `paths/*.yaml` (local fs, or R2 when `SPECS_R2_BASE_URL` is set), dereferences, and **injects `x-path`/`x-slug`** onto each operation from `apiRefPaths` so links/scroll targets match the generated maps.
4. `components/Tags/Paths` → `components/Tags/Operation` renders **all** operations of the tag (no per-operation lazy render).
5. **Deep-link scroll (centralized in `Tags/Section`).** On navigation to a section within the tag (heading, schema, or an operation — keyed on `usePathname`), a single controller in `Tags/Section` scrolls to the target element (found by `id`, offset computed from `getBoundingClientRect` relative to the `#main` scroll container — `offsetTop` undercounts for deeply-nested operations) and **re-anchors** on every content resize (`ResizeObserver` on `#content`) so it stays put while the schema (separate SWR) and code samples (dynamic import) load and shift the layout — critical for large/slow tags like admin `orders`. It aborts on user scroll, with a safety cap.
6. **Scroll-spy + navigation lock (`utils/scroll-spy-lock.ts`).** As you scroll, `Tags/Operation` and `Tags/Section/Schema` use `InView` (a thin active band near the top → one active section) to update the sidebar highlight (`setActivePath`) and the URL (`history.replaceState`). Next syncs history to `usePathname`, so **while the deep-link controller is scrolling it holds a lock** (`lockScrollSpy`) that suppresses all scroll-spy URL updates — otherwise the schema or first operation (whichever is at the top on load) would claim the URL, change the pathname, and abort the deep-link scroll (symptom: "stays on the schema"). Scroll-spy URL updates are tagged (`markScrollSpyNavigation`) so the controller can tell them apart from real navigations (`isScrollSpyNavigation`) and not re-trigger. Active state/highlight is path-based (`SidebarProvider` with `shouldHandlePathChange`, `shouldHandleHashChange=false`).

Intro sections (`store.mdx`/`admin.mdx`) are one compiled MDX component with custom layout JSX, so they are **not** split — the layout renders the full intro MDX and `components/ScrollToSection` scrolls to the heading `id`.

## Sidebar

Fully **pre-generated** at build time (`packages/build-scripts/src/utils/get-api-ref-sidebar-children.ts`, consumed via `generateSplitSidebars`) from `generated/api-ref-paths.mjs`: Introduction + every intro section + every tag (as a category with a `path`) with **all** its operations (method badge via serializable `badge`) and schema link. Always fully visible — no runtime lazy injection. Loaded per area in `providers/sidebar.tsx`.

Sidebar links use real `path`s directly. (There is no `isPathHref` flag anymore — it was a leftover from the old hash-based sidebar and was removed everywhere.)

## Legacy hash redirects & doc links

Old links used hash anchors (`/api/store#carts_getcartsid`). Hashes never reach the server, so `components/HashRedirector` (mounted on `app/[area]/page.tsx`) reads `window.location.hash` on mount and `router.replace`s to the mapped path from `apiRefRedirects`. Unmapped hashes (e.g. in-section h3 anchors) are left to anchor normally on the index page.

- In-content doc links (operation/param `externalDocs`) are resolved area-aware at render by `utils/resolve-doc-url.ts` (`resolveApiRefDocUrl`), reusing `apiRefRedirects`.
- Hand-authored TSDoc/MDX links elsewhere in the repo were migrated by `www/utils/scripts/migrate-api-ref-links.mjs` (re-run with `--write` after regenerating if hashes reappear).

## Routing/util helpers

- `utils/area.ts` — `AREAS`, `isArea`, `getIntroSection`, `getTagBySlug`, `apiRefMetadataBase` (shared by all route pages).
- `utils/get-url.ts` — absolute URL from a page path (used by sitemaps).
- `utils/base-path-url.ts` — prefixes `basePath`.
- Data routes: `app/tag`, `app/schema`, `app/base-specs`, `app/download/[area]` (all read `specs/` from local fs or R2 via `utils/get-path-for-env.ts`).

## Regenerating

```bash
# in this app: rebuild generated/ maps + sidebars from specs/
yarn prep

# refresh the OAS specs themselves (from the API route request/response types in
# packages/medusa/src/api) — heavy, usually CI:
cd ../../utils && yarn generate:oas
```

`generated/` depends on the `docs-utils` and `build-scripts` packages — if you change slug logic or the sidebar generator, rebuild those (`yarn workspace docs-utils build`, `yarn workspace build-scripts build`) before `yarn prep`.

## Dev / test / build

```bash
yarn dev            # needs NEXT_PUBLIC_BASE_URL + NEXT_PUBLIC_BASE_PATH (=/api)
yarn test           # vitest (components/providers/utils)
yarn build          # next build (also lints)
```

## Conventions

- No semicolons, double quotes, 2-space indent (Prettier).
- Files: kebab-case; components live in `components/<Name>/index.tsx`.
- Never hand-edit `generated/` — regenerate. In `specs/`, only descriptions are hand-editable; the rest is generated from the API route request/response types.
