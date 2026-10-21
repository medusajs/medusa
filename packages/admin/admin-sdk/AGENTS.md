# @medusajs/admin-sdk

Config helpers that Medusa apps and plugins use to declare Admin customizations under `src/admin`. The helpers only tag config objects; `@medusajs/admin-vite-plugin` finds and wires the files by statically parsing them.

## Using this package

Import directly from `@medusajs/admin-sdk`:

- `defineWidgetConfig({ zone, id? })`: widget in `src/admin/widgets/*.tsx`.
- `defineRouteConfig({ label?, icon?, nested?, rank?, translationNs? })`: UI route in `src/admin/routes/**/page.tsx`.
- `defineLayoutConfig({ id, sections })`: custom layout in `src/admin/layouts/`.
- `unstable_defineCustomFieldsConfig`, `unstable_createFormHelper`: experimental custom fields (product model only) in `src/admin/custom-fields/`.
- Types: `WidgetConfig`, `RouteConfig`, `LayoutConfig`.

```tsx
// src/admin/widgets/product-widget.tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { Container, Heading } from "@medusajs/ui"

const ProductWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  return (
    <Container className="divide-y p-0">
      <Heading level="h2">{data.title}</Heading>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details",
})

export default ProductWidget
```

```tsx
// src/admin/routes/brands/page.tsx -> /app/brands
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { TagSolid } from "@medusajs/icons"

const BrandsPage = () => {
  // ...
}

export const config = defineRouteConfig({
  label: "Brands",
  icon: TagSolid,
})

export default BrandsPage
```

Widget zones:
- The full list is `INJECTION_ZONES` in `@medusajs/admin-shared` (`packages/admin/admin-shared/src/extensions/widgets/constants.ts`).
- Current zones are `<entity>.details`, `<entity>.details.side`, `<entity>.list`, plus `login.before`, `login.after`, `topbar`, `search.list`.
- `.before` / `.after` variants of other zones are legacy since v2.17.2. Users now reorder widgets with the layout customizer.
- Plugins can add zones by augmenting `InjectionZoneRegistry` from `@medusajs/admin-shared`.

Route config:
- `nested` puts the sidebar item under one of `/orders`, `/products`, `/inventory`, `/customers`, `/promotions`, `/price-lists`.
- Routes under `src/admin/routes/settings/` appear in Settings.
- Optionally export `handle` (`breadcrumb`, `seo`) and `loader` from the page file.

Docs:
- https://docs.medusajs.com/learn/fundamentals/admin/widgets.md
- https://docs.medusajs.com/learn/fundamentals/admin/ui-routes.md
- https://docs.medusajs.com/learn/fundamentals/admin/constraints.md
- https://docs.medusajs.com/learn/fundamentals/admin/custom-injection-zones.md
- https://docs.medusajs.com/resources/admin-widget-injection-zones.md

## Architecture

- `src/config/utils.ts`: every helper wraps the config with `createConfigHelper`, which adds `$$typeof: Symbol.for("react.memo")` so React Fast Refresh treats the module as component-only and hot-reloads it instead of doing a full reload. Keep this when adding helpers.
- `src/config/types.ts`: public config types; zone, layout, and nested-route types come from `@medusajs/admin-shared`.
- `CustomFieldConfig` and its types are intentionally not re-exported from `src/config/index.ts`.

## Development

```bash
yarn build   # tsup
```

No tests in this package. Extraction behavior is tested in `@medusajs/admin-vite-plugin`.

## Gotchas

- The vite plugin reads config by AST, not at runtime:
  - `config` must be a named export initialized with a call that takes an object literal.
  - `zone` must be a string literal or an array of string literals. Template literals and variables are rejected with a warning and the widget is dropped.
- Widget and route files without a default export are skipped. The docs also require the components to be arrow functions.
- Without `id`, a widget's id is a hash of its path from `widgets/` onward. Renaming or moving the file resets users' saved layout for it. Plugins should set an explicit, prefixed `id`.
- The `unstable_createFormHelper` JSDoc example uses stale keys (`entryPoint`, `form`). The real keys are `model` and `zone` (see `CustomFieldConfig`).
- Directories under `src/admin` whose names start with `_` are not crawled.
