# Resources app — References architecture

This documents how the API **references** (`/references/...`) are generated and
served. Non-reference pages in this app are ordinary MDX under `app/`; this file
is only about references.

## TL;DR

References are generated from TypeScript source into a **JSON doc-model** (one
`page.json` per page under `references/`), stored in R2, fetched at request
time, and rendered with React components. There is **no MDX** in the references
pipeline anymore — neither as a generated artifact nor at serve time. Internal
links are resolved to their final slugs at generation time, so there is no
runtime link-fixing.

## Data model: `DocPage` / `DocBlock`

Each reference page serializes to a `DocPage`: `{ slug, title, frontmatter, toc,
blocks }`, where `blocks` is an ordered list of typed `DocBlock`s (`markdown`,
`heading`, `typeList`, `codeTabs`, `workflowDiagram`, `note`, `sourceCodeLink`,
`linkList`, `table`, `badges`, `workflowEvents`). Type/link data is structured
JSON; links are already final site URLs.

The contract is defined **twice** (separate yarn workspace roots — keep in sync):

- Generator side: `www/utils/packages/types/lib/index.d.ts` (`DocPage`, `DocBlock`, ...)
- Site side: `www/packages/types/src/references.ts` (reuses `Workflow` + `FrontMatter`)

## Generation (in `www/utils`)

Run from `www/utils/packages/typedoc-generate-references`:
`yarn start generate all --merge` (or `yarn generate:references` from `www/utils`).

Two phases, both TypeDoc:

1. **Generate** — per reference, convert TS source to a TypeDoc reflection JSON
   in `www/utils/generated/typedoc-json-output/<name>.json`. Enriched by the
   converter plugins `typedoc-plugin-custom` (DML, internal-resolve, namespaces,
   events) and `typedoc-plugin-workflows` (workflow/step/hook parsing). These
   are unchanged by the JSON migration.
2. **Merge** — read all reflection JSON back in (`entryPointStrategy: "merge"`)
   and render the doc-model into `www/apps/resources/references/` (`page.json`).

The renderer is the **`json` theme** in
`www/utils/packages/typedoc-plugin-medusa-theme`:

- `src/json-theme.ts` — `JsonTheme extends MarkdownTheme`. It **reuses**
  `MarkdownTheme`'s URL/slug/mapping logic, the registered Handlebars helpers,
  and `reflection-formatter` (the `TypeList` data). It only overrides output
  (`.json`), `render` (returns `JSON.stringify(DocPage)`), and `getRelativeUrl`
  (returns each target's final slug — this is what pre-resolves links).
- `src/utils/build-doc-page.ts` — builds a `DocPage` from a reflection (title,
  frontmatter, prose, TypeList for params/returns/properties, linkList for
  namespaces/modules, DML entities, workflow dispatch).
- `src/utils/build-workflow-blocks.ts` — workflow/step pages (diagram, input,
  output, hooks, emitted events).
- `src/utils/parse-code-tabs.ts` — splits helper-produced MDX fragments into
  structured blocks (`<CodeTabs>`, `<TypeList>`, `:::note`, headings, ...).
- `src/utils/resolve-page-slug.ts` — builds the page-URL -> final-slug map.

**Important:** `MarkdownTheme` and the Handlebars `.hbs` templates still exist in
that package — they are the generation-engine internals `JsonTheme` extends, not
MDX output. Do not delete them.

Merge options: `src/constants/merger-json-options.ts` (theme `json`, `out` =
`references/`, entry `_index.json`); it extends the shared `merger-options.ts`
(the regex-keyed `formatting` map, `allowedProjectDocuments`, etc.).

## Build-time prep (in this app, `yarn prep`)

- `scripts/generate-files-map.mjs` — scans `references/` for `page.json` and
  keys each entry by the DocPage's baked-in `slug` (so slug-overridden pages
  resolve with a direct lookup); also scans `app/` pages. Output:
  `generated/files-map.mjs`.
- `scripts/generate-slug-changes.mjs` — app pages only (references no longer
  need slug-changes; their slug is baked in).

## Serving

- `app/references/[...slug]/page.tsx` — renders `components/ReferenceJSON`
  (client) and reads page metadata from the DocPage.
- `components/ReferenceJSON` — SWR-fetches `/api/references/<slug>` and renders
  it with `ReferenceContent` from `docs-ui`.
- `app/api/references/[...slug]/route.ts` — resolves slug -> `page.json` via
  `files-map`, loads it (R2 binding `REFERENCES_R2_BUCKET` -> public URL ->
  local fs), and returns the DocPage JSON **as-is**. No `serialize()`, no
  link-fixer plugins. Cached (`unstable_cache` + `Cache-Control` +
  OpenNext R2 incremental cache).
- `docs-ui` `ReferenceContent` (`www/packages/docs-ui/src/components/ReferenceContent`)
  maps each `DocBlock` to a component (`TypeList`, `CodeTabs`/`CodeBlock`,
  `WorkflowDiagram`, `Note`, `SourceCodeLink`, `MarkdownContent`, headings,
  linkList, `WorkflowEvents`).

## Markdown output (`md-content`, for LLMs / copy-as-markdown)

`app/md-content/[[...slug]]/route.ts` serves plain Markdown. For `page.json`
files it uses `docPageToMarkdown` (`www/packages/docs-utils/src/doc-page-to-markdown.ts`),
the doc-model analogue of `getCleanMd`; app pages still use `getCleanMd`.

## R2 storage / CI

- Keys: `resources/references/<relPath>/page.json` in bucket `docs-references`,
  read via the `REFERENCES_R2_BUCKET` binding (see `wrangler.jsonc`).
- `scripts/upload-references-to-r2.mjs` — full or selective (`--upload`/`--remove`)
  upload of `references/` `page.json`.
- `.github/workflows/sync-resources-references-to-r2.yml` — syncs changed
  `references/**` `page.json` to R2 on push to `develop`.
- `.github/workflows/generate-public-references.yml` — regenerates references
  and opens the automated PR (commits `references/**`).

## Gotchas

- Links in the doc-model are final site slugs (`/references/...`); `md-content`
  absolutizes them with `NEXT_PUBLIC_BASE_URL`.
- `react-query` reference rendering exists in the theme but is not exercised —
  no reference in the current set produces `UseMutationResult` /
  `UseQueryOptionsWrapper` types.
- Generating the module `*-models` references needs `eslint-plugin-markdown`
  installed in the generation environment (used by the DML/eslint converter
  plugin); the merge step itself does not.
