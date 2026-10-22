# @medusajs/dashboard

The Medusa Admin single-page app (React, Vite, React Router, TanStack Query, `@medusajs/ui`). Applications never run it directly: `@medusajs/admin-bundler` mounts it at `admin.path` (default `/app`) and feeds it app and plugin extensions through `virtual:medusa/*` modules.

## Using this package

Widgets and UI routes are declared with `@medusajs/admin-sdk`. This package supplies the building blocks to use inside them (public since v2.21.0):

- `@medusajs/dashboard/components`: `LayoutComposer`, `DataTable`, `DataGrid`, `ActionMenu`, `RouteDrawer`, `RouteFocusModal`, `StackedDrawer`, `StackedFocusModal`, `useRouteModal`, `Form`, `Combobox`, `SectionRow`, `JsonViewSection`, product table cells, ...
- `@medusajs/dashboard/hooks`: TanStack Query hooks per resource (`useProducts`, `useOrder`, `useRegions`, ...) and their query key factories (`productsQueryKeys`, ...), plus `useQueryParams`, `useDate`, `useComboboxData`.
- `@medusajs/dashboard/lib`: `defineCellRenderer`, `defineSearchEntity`, `formatCurrency`, `getStylizedAmount`, address and validation helpers.
- `@medusajs/dashboard` (root): types `Resources` (for i18next type augmentation) and `DashboardPlugin`.

Only what `src/exports/*` re-exports is public. Never deep-import from `src/`.

```tsx
import { useProducts, productsQueryKeys } from "@medusajs/dashboard/hooks"
import { useQueryClient } from "@tanstack/react-query"

const ProductCount = () => {
  const queryClient = useQueryClient()
  const { products, count, isPending } = useProducts({ limit: 10 })

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: productsQueryKeys.lists() })
  // ...
}
```

Expose injection zones on a custom page with `LayoutComposer` (zones are `<prefix>` and `<prefix>.side`):

```tsx
import { LayoutComposer } from "@medusajs/dashboard/components"

<LayoutComposer
  widgetsZonePrefix="brand.details"
  preferredLayoutId="core:two-column"
  data={brand}
  sections={{ main: <GeneralSection brand={brand} /> }}
/>
```

Docs:
- https://docs.medusajs.com/resources/admin-components.md
- https://docs.medusajs.com/resources/admin-components/layouts/layout-composer.md
- https://docs.medusajs.com/resources/admin-components/hooks.md
- https://docs.medusajs.com/learn/fundamentals/admin/custom-injection-zones.md

## Architecture

- `src/app.tsx`: entry. Imports the `virtual:medusa/*` modules; tsup keeps them `external` so `@medusajs/admin-vite-plugin` resolves them when the host app builds.
- `src/dashboard-app/`: `DashboardApp` merges core routes with extension routes, menu items, widgets, custom-field forms/displays, and layouts. `routes/get-route.map.tsx` is the core route table; every page is lazy-loaded.
- `src/routes/<domain>/<domain>-<page>/`: each page's `index.ts` exports `Component`, and optionally `loader`, `Breadcrumb`, `seo`, consumed by `lazy()` in the route map. Create/edit forms are child routes rendered in `RouteDrawer` / `RouteFocusModal` through the parent's `<Outlet />`.
- `src/hooks/api/<resource>.tsx`: one file per resource:
  - `xQueryKeys = queryKeysFactory("x")` (`all`, `lists()`, `list(query)`, `details()`, `detail(id, query)`).
  - Query hooks call `sdk.admin.*` from `src/lib/client` and return `{ ...data, ...rest }`.
  - Mutation hooks invalidate the affected `lists()` / `detail(id)` keys in `onSuccess`, then call `options?.onSuccess?.(...)`.
- Detail-page loaders prefetch with `queryClient.getQueryData(key) ?? queryClient.fetchQuery(...)` using the same key and `fields` as the page's hook, which then receives the result as `initialData`. Keep loader and hook `fields` identical or the cache misses.
- Detail and list pages render `LayoutComposer` with `widgetsZonePrefix` set to the page's injection zone and wrap each core section in `<LayoutComposer.Entry id="...">`.
- `src/lib/client/client.ts`: JS SDK instance built from bundler defines `__BACKEND_URL__`, `__AUTH_TYPE__` (default `"session"`), `__JWT_TOKEN_STORAGE_KEY__`.
- `src/i18n/translations/`: `en.json` is the source of truth; `$schema.json` is generated from it.

## Development

```bash
yarn build          # tsgo typecheck, then tsup
yarn typecheck
yarn lint
yarn test           # vitest --run
yarn test src/lib/__tests__/promotions.spec.ts
yarn dev            # standalone Vite dev server
yarn i18n:schema    # regenerate translations/$schema.json from en.json
yarn i18n:validate de.json
yarn i18n:sync missing
```

- `yarn dev` env vars (in `.env`): `VITE_MEDUSA_BACKEND_URL` (default `http://localhost:9000`), `VITE_MEDUSA_STOREFRONT_URL`, `VITE_MEDUSA_BASE`, and `VITE_MEDUSA_PROJECT`: path to a project's `src/admin` directory whose extensions should be loaded.
- Vitest runs in the `node` environment by default. Component tests need `// @vitest-environment jsdom` on the first line.
- Tests live in `__tests__/` directories or as `*.spec.tsx` beside the source.

## Gotchas

- After adding or removing keys in `en.json`, run `yarn i18n:schema` and commit `$schema.json`; `src/i18n/translations/__tests__/validate-translations.spec.ts` validates every locale against it.
- Add new strings to `en.json` only. Other locales are filled by the daily `.github/workflows/admin-i18n-sync.yml` workflow.
- A new `widgetsZonePrefix` on a core page also needs its zones added to `INJECTION_ZONES` in `@medusajs/admin-shared`. Do not add `.before` / `.after` zones; they are legacy.
- Layout preferences are stored per `widgetsZonePrefix`, keyed by widget id and `LayoutComposer.Entry` id. Renaming an entry id drops users' saved placement for it.
- The `src/exports/*` surface is documented API for extensions. Changing a signature breaks plugins; update the matching page under `www/apps/resources/app/admin-components`.
- A new virtual module must be added to `external` in `tsup.config.cjs` and to `VIRTUAL_MODULES` in `@medusajs/admin-shared`.
- `yarn generate:static` writes `src/lib/currencies.ts`, but the app imports `src/lib/data/currencies.ts`. Move the output before relying on it.
