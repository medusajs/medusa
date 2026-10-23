# @medusajs/admin-vite-plugin

Vite plugin that scans the `src/admin` directories of a Medusa app and its plugins and turns them into the `virtual:medusa/*` modules that `@medusajs/dashboard` imports (routes, menu items, widgets, layouts, i18n, custom fields, cell renderers, search entities).

## Using this package

App developers don't configure it: `@medusajs/admin-bundler` adds it with `sources` = every admin source directory. Options (`MedusaVitePluginOptions`):

- `sources?: string[]`: absolute paths to `src/admin` directories.
- `pluginMode?: boolean`: used by `medusa plugin:build`. It writes `src/admin/__admin-extensions__.js` in `buildStart` (re-exporting every generated module as one default `plugin` object) and deletes it in `buildEnd`.

What it picks up, relative to each source:

| Path | Requirement |
| --- | --- |
| `widgets/**` | default export + `export const config = defineWidgetConfig({ zone })` |
| `routes/**/page.{tsx,jsx,ts,js}` (depth >= 1) | default export; optional `config`, `handle`, `loader` |
| `layouts/**` | default export + `config` named export |
| `i18n/index.*` (top level only) | default export; multiple sources are `deepMerge`d |
| `custom-fields/**` | experimental custom-fields config |
| `cell-renderers.tsx`, `search-entities.tsx` or `search-entities.ts` | imported for side effects |

Route path mapping (`routes/helpers.ts`):
- `[id]` becomes `:id`, `[[id]]` becomes `:id?`, `(foo)` becomes `foo?`, `[*]` becomes `*`, `[[*]]` becomes `*?`.
- A folder starting with `@` is a parallel route, added as a child of its parent path with the `@` removed.

## Architecture

- `src/plugin.ts`:
  - `resolveId` / `load` serve the virtual modules.
  - In dev, a watcher computes a content hash per admin subdirectory and reloads only the virtual modules whose hash changed.
- `src/<feature>/`: one folder per extension type, each with `generate-*.ts` (code generation) and `generate-*-hash.ts` (change detection).
- `src/virtual-modules/`: assembles generated code into modules. Each generator takes `pluginMode` and emits `const xModule = ...` instead of `export default` so plugin mode can concatenate them.
- `src/utils.ts`:
  - `crawl` (fdir) skips directories starting with `_`.
  - `getConfigObjectProperties` handles both unbundled (`ExportNamedDeclaration`) and bundled (`VariableDeclarator`) shapes, because plugin output is re-parsed when the host app builds.
- `src/vmod.ts`: virtual and resolved (`\0`-prefixed) ids, built from `@medusajs/admin-shared`.

## Development

```bash
yarn build        # tsup (cjs + esm)
yarn watch
yarn test         # vitest --run
yarn test src/widgets/__tests__/generate-widgets.spec.ts
```

Specs live in `src/<feature>/__tests__/`. They mock the filesystem and compare generated code with `normalizeString` (whitespace-insensitive).

## Gotchas

- All extraction is static (Babel AST). Values computed at runtime (variables, template literals, spreads for `zone`) are ignored with a `logger.warn` and the extension is silently dropped.
- `getParserOptions` enables the `typescript` Babel plugin only for `.tsx`. A `.ts` widget, route, or layout file containing type syntax fails to parse and is skipped.
- Widget ids default to `Widget-<4-char md5>` of the path from `widgets/` onward, so they are stable across machines but change when the file moves. Saved user layouts are keyed by this id.
- Unknown zones pass validation (`isValidInjectionZone` only warns), so custom zones from plugins work without registration here.
- When adding a new extension type, update all of these:
  - the virtual id in `@medusajs/admin-shared`
  - `vmod.ts`
  - `loadConfigs` and `watcherConfigs` in `plugin.ts`
  - `ADMIN_SUBDIRECTORIES` in `utils.ts`
  - `generatePluginEntryModule`
  - the dashboard's `tsup.config.cjs` externals
